/**
 * 文档解析路由
 * 处理文档上传、解析和结果确认
 */

import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';
import { parseDocumentWithLLM, validateParsedData } from '../llm-service';
import {
  DocumentParseRequest,
  DocumentParseResponse,
  ParseResultConfirmRequest,
  ParseResultConfirmResponse,
  BatchDocumentParseRequest,
  BatchDocumentParseResponse,
} from '../../shared/document-parser-types';
import { getDb, performanceAssessments, employees } from '../db';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

/**
 * 文档解析路由
 */
export const documentParserRouter = router({
  /**
   * 解析单个文档
   * 接收 Base64 编码的文件内容，使用 LLM 提取数据
   */
  parseDocument: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileContent: z.string(), // Base64 编码
        mimeType: z.string(),
        periodId: z.string().optional(),
        templateId: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }): Promise<DocumentParseResponse> => {
      try {
        // 验证文件类型
        const supportedTypes = [
          'application/pdf',
          'image/jpeg',
          'image/png',
          'image/jpg',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/msword',
          'application/vnd.ms-excel',
        ];

        if (!supportedTypes.includes(input.mimeType)) {
          return {
            success: false,
            error: `不支持的文件类型: ${input.mimeType}`,
          };
        }

        // 确定文件类型
        const fileType = getFileType(input.mimeType);

        // 解码 Base64 内容
        let documentContent: string;
        try {
          const buffer = Buffer.from(input.fileContent, 'base64');
          documentContent = buffer.toString('utf-8');
        } catch (error) {
          // 如果无法解码为文本，使用原始 Base64 内容
          documentContent = input.fileContent;
        }

        // 调用 LLM 进行解析
        const parsedData = await parseDocumentWithLLM(documentContent, fileType);

        // 验证解析的数据
        const validation = validateParsedData(parsedData);

        // 返回结果
        const response: DocumentParseResponse = {
          success: validation.valid,
          data: parsedData,
          warnings: validation.warnings.length > 0 ? validation.warnings : undefined,
        };

        if (!validation.valid) {
          response.error = validation.errors.join('; ');
        }

        return response;
      } catch (error) {
        console.error('文档解析错误:', error);
        return {
          success: false,
          error: `文档解析失败: ${error instanceof Error ? error.message : '未知错误'}`,
        };
      }
    }),

  /**
   * 确认并保存解析结果
   * 将解析的数据保存到数据库
   */
  confirmParseResult: protectedProcedure
    .input(
      z.object({
        parsedData: z.object({
          employeeName: z.string().optional(),
          employeeId: z.string().optional(),
          department: z.string().optional(),
          position: z.string().optional(),
          dailyWorkScore: z.number().optional(),
          workQualityScore: z.number().optional(),
          personalGoalScore: z.number().optional(),
          departmentReviewScore: z.number().optional(),
          bonusScore: z.number().optional(),
          penaltyScore: z.number().optional(),
          totalScore: z.number().optional(),
          rank: z.number().optional(),
          comments: z.string().optional(),
          evaluatorName: z.string().optional(),
          evaluationDate: z.string().optional(),
        }),
        employeeId: z.string(),
        periodId: z.string(),
        templateId: z.string(),
        adjustments: z.record(z.string(), z.any()).optional(),
      })
    )
    .mutation(async ({ input, ctx }): Promise<ParseResultConfirmResponse> => {
      try {
        const db = await getDb();

        // 验证员工存在
        const employee = await db.query.employees.findFirst({
          where: eq(employees.id, input.employeeId),
        });

        if (!employee) {
          return {
            success: false,
            error: '员工不存在',
          };
        }

        // 检查是否已存在该周期的评分
        const existingAssessment = await db.query.performanceAssessments.findFirst({
          where: (table: any) =>
            eq(table.employeeId, input.employeeId) &&
            eq(table.periodId, input.periodId) &&
            eq(table.templateId, input.templateId),
        });

        // 合并用户调整
        const finalData = {
          ...input.parsedData,
          ...input.adjustments,
        };

        // 计算总分（如果未提供）
        let totalScore = finalData.totalScore;
        if (!totalScore) {
          const scores = [
            finalData.dailyWorkScore || 0,
            finalData.workQualityScore || 0,
            finalData.personalGoalScore || 0,
            finalData.departmentReviewScore || 0,
            finalData.bonusScore || 0,
          ];
          totalScore = scores.reduce((a, b) => a + b, 0);
          if (finalData.penaltyScore) {
            totalScore -= finalData.penaltyScore;
          }
        }

        // 创建或更新评分记录
        const assessmentId = existingAssessment?.id || uuidv4();

        if (existingAssessment) {
          // 更新现有记录
          await db
            .update(performanceAssessments)
            .set({
              dailyWorkScore: finalData.dailyWorkScore as any,
              workQualityScore: finalData.workQualityScore as any,
              personalGoalScore: finalData.personalGoalScore as any,
              departmentReviewScore: finalData.departmentReviewScore as any,
              bonusScore: finalData.bonusScore as any,
              penaltyScore: finalData.penaltyScore as any,
              totalScore: totalScore as any,
              rank: finalData.rank,
              comments: finalData.comments,
              updatedAt: new Date(),
            })
            .where(eq(performanceAssessments.id, assessmentId));
        } else {
          // 创建新记录
          await db.insert(performanceAssessments).values({
            id: assessmentId,
            employeeId: input.employeeId,
            periodId: input.periodId,
            templateId: input.templateId,
            evaluatorId: ctx.user.id,
            status: 'draft',
            dailyWorkScore: finalData.dailyWorkScore,
            workQualityScore: finalData.workQualityScore,
            personalGoalScore: finalData.personalGoalScore,
            departmentReviewScore: finalData.departmentReviewScore,
            bonusScore: finalData.bonusScore,
            penaltyScore: finalData.penaltyScore,
            totalScore: totalScore,
            rank: finalData.rank,
            comments: finalData.comments,
          });
        }

        return {
          success: true,
          assessmentId: assessmentId,
          message: '评分记录已保存',
        };
      } catch (error) {
        console.error('保存解析结果错误:', error);
        return {
          success: false,
          error: `保存失败: ${error instanceof Error ? error.message : '未知错误'}`,
        };
      }
    }),

  /**
   * 批量解析文档
   */
  parseBatchDocuments: protectedProcedure
    .input(
      z.object({
        documents: z.array(
          z.object({
            fileName: z.string(),
            fileContent: z.string(),
            mimeType: z.string(),
          })
        ),
        periodId: z.string().optional(),
        templateId: z.string().optional(),
      })
    )
    .mutation(async ({ input }): Promise<BatchDocumentParseResponse> => {
      const results: DocumentParseResponse[] = [];

      for (const doc of input.documents) {
        try {
          const fileType = getFileType(doc.mimeType);
          let documentContent: string;

          try {
            const buffer = Buffer.from(doc.fileContent, 'base64');
            documentContent = buffer.toString('utf-8');
          } catch {
            documentContent = doc.fileContent;
          }

          const parsedData = await parseDocumentWithLLM(documentContent, fileType);
          const validation = validateParsedData(parsedData);

          results.push({
            success: validation.valid,
            data: parsedData,
            warnings: validation.warnings.length > 0 ? validation.warnings : undefined,
            error: !validation.valid ? validation.errors.join('; ') : undefined,
          });
        } catch (error) {
          results.push({
            success: false,
            error: `${doc.fileName}: ${error instanceof Error ? error.message : '未知错误'}`,
          });
        }
      }

      return {
        success: results.every((r) => r.success),
        results,
        successCount: results.filter((r) => r.success).length,
        failureCount: results.filter((r) => !r.success).length,
      };
    }),

  /**
   * 获取解析历史
   */
  getParseHistory: protectedProcedure
    .input(
      z.object({
        employeeId: z.string().optional(),
        periodId: z.string().optional(),
        limit: z.number().default(10),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input }) => {
      try {
        const db = await getDb();

        const query = db.query.performanceAssessments.findMany({
          limit: input.limit,
          offset: input.offset,
        });

        return await query;
      } catch (error) {
        console.error('获取解析历史错误:', error);
        return [];
      }
    }),
});

/**
 * 根据 MIME 类型确定文件类型
 */
function getFileType(mimeType: string): string {
  if (mimeType.includes('pdf')) {
    return 'PDF';
  }
  if (mimeType.includes('image')) {
    return '图片';
  }
  if (mimeType.includes('word') || mimeType.includes('wordprocessingml')) {
    return 'Word 文档';
  }
  if (mimeType.includes('excel') || mimeType.includes('spreadsheetml')) {
    return 'Excel 表格';
  }
  return '文档';
}
