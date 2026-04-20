/**
 * LLM 服务 - 用于文档解析和数据提取
 * 集成 Manus 内置的 LLM API
 */

import { ParsedDocumentData } from '../shared/document-parser-types';

/**
 * LLM 响应类型
 */
interface LLMResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

/**
 * 调用 LLM 进行文档解析
 * @param documentContent 文档内容（文本或 Base64）
 * @param fileType 文件类型（pdf, image, text 等）
 * @returns 解析后的员工绩效数据
 */
export async function parseDocumentWithLLM(
  documentContent: string,
  fileType: string
): Promise<ParsedDocumentData> {
  try {
    // 构建 LLM 提示词
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(documentContent, fileType);

    // 调用 LLM API
    const response = await callLLM(systemPrompt, userPrompt);

    // 解析 LLM 响应
    const parsedData = parseLLMResponse(response);

    return parsedData;
  } catch (error) {
    console.error('LLM 文档解析失败:', error);
    throw new Error(`文档解析失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

/**
 * 构建系统提示词
 */
function buildSystemPrompt(): string {
  return `你是一个专业的员工绩效数据提取专家。你的任务是从各种格式的文档（PDF、图片、Excel 等）中提取员工绩效评估数据。

你需要提取以下信息：
1. 员工基本信息：姓名、员工 ID、部门、职位
2. 绩效评分（6个维度，满分 150 分）：
   - 日常工作（100分）：员工日常工作表现
   - 工作质量（15分）：代码质量、代码审核等
   - 个人目标（15分）：个人设定的目标完成情况
   - 部门互评（5分）：部门同事的评价
   - 绩效加分（15分）：额外加分项
   - 绩效减分：扣分项
3. 总分和排名
4. 评价和备注
5. 评估者信息和评估日期

返回格式必须是有效的 JSON，包含以下字段（如果找不到某个字段，使用 null）：
{
  "employeeName": "string",
  "employeeId": "string",
  "department": "string",
  "position": "string",
  "dailyWorkScore": number,
  "workQualityScore": number,
  "personalGoalScore": number,
  "departmentReviewScore": number,
  "bonusScore": number,
  "penaltyScore": number,
  "totalScore": number,
  "rank": number,
  "comments": "string",
  "evaluatorName": "string",
  "evaluationDate": "string",
  "extractionConfidence": number
}

重要规则：
- 所有分数必须是数字，不能包含单位或其他字符
- 如果找不到某个字段，设置为 null 而不是 0
- extractionConfidence 是 0-1 之间的数字，表示提取的置信度
- 确保返回的 JSON 是有效的，可以直接解析
- 如果文档中有多个员工，只提取第一个员工的数据`;
}

/**
 * 构建用户提示词
 */
function buildUserPrompt(documentContent: string, fileType: string): string {
  return `请从以下${fileType}文档中提取员工绩效数据：

${documentContent}

请仔细查看文档内容，提取所有可用的员工绩效信息。如果某些信息不清楚或不存在，请设置为 null。
返回有效的 JSON 格式的数据。`;
}

/**
 * 调用 LLM API
 * 使用 Manus 内置的 LLM 服务
 */
async function callLLM(systemPrompt: string, userPrompt: string): Promise<LLMResponse> {
  const apiUrl = process.env.BUILT_IN_FORGE_API_URL;
  const apiKey = process.env.BUILT_IN_FORGE_API_KEY;

  if (!apiUrl || !apiKey) {
    throw new Error('LLM API 配置缺失: BUILT_IN_FORGE_API_URL 或 BUILT_IN_FORGE_API_KEY');
  }

  try {
    const response = await fetch(`${apiUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        temperature: 0.3, // 降低温度以获得更一致的结果
        max_tokens: 2000,
        response_format: {
          type: 'json_object',
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`LLM API 错误: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    return await response.json() as LLMResponse;
  } catch (error) {
    console.error('LLM API 调用失败:', error);
    throw error;
  }
}

/**
 * 解析 LLM 响应
 */
function parseLLMResponse(response: LLMResponse): ParsedDocumentData {
  try {
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('LLM 响应为空');
    }

    // 尝试解析 JSON
    let jsonData;
    try {
      jsonData = JSON.parse(content);
    } catch {
      // 如果直接解析失败，尝试从 markdown 代码块中提取
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonData = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error('无法从 LLM 响应中解析 JSON');
      }
    }

    // 验证并清理数据
    const parsedData: ParsedDocumentData = {
      employeeName: jsonData.employeeName || undefined,
      employeeId: jsonData.employeeId || undefined,
      department: jsonData.department || undefined,
      position: jsonData.position || undefined,
      dailyWorkScore: parseScoreField(jsonData.dailyWorkScore),
      workQualityScore: parseScoreField(jsonData.workQualityScore),
      personalGoalScore: parseScoreField(jsonData.personalGoalScore),
      departmentReviewScore: parseScoreField(jsonData.departmentReviewScore),
      bonusScore: parseScoreField(jsonData.bonusScore),
      penaltyScore: parseScoreField(jsonData.penaltyScore),
      totalScore: parseScoreField(jsonData.totalScore),
      rank: jsonData.rank ? parseInt(String(jsonData.rank), 10) : undefined,
      comments: jsonData.comments || undefined,
      evaluatorName: jsonData.evaluatorName || undefined,
      evaluationDate: jsonData.evaluationDate || undefined,
      extractionConfidence: jsonData.extractionConfidence || 0.8,
    };

    return parsedData;
  } catch (error) {
    console.error('解析 LLM 响应失败:', error);
    throw new Error(`LLM 响应解析失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

/**
 * 解析分数字段
 * 处理可能的字符串、数字、范围等格式
 */
function parseScoreField(value: unknown): number | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    // 移除单位和空格
    const cleaned = value.replace(/[^\d.-]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? undefined : parsed;
  }

  return undefined;
}

/**
 * 验证解析的数据
 */
export function validateParsedData(data: ParsedDocumentData): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 检查必需字段
  if (!data.employeeName) {
    warnings.push('缺少员工姓名');
  }

  if (!data.department) {
    warnings.push('缺少部门信息');
  }

  // 检查分数范围
  const scores = [
    { name: '日常工作', value: data.dailyWorkScore, max: 100 },
    { name: '工作质量', value: data.workQualityScore, max: 15 },
    { name: '个人目标', value: data.personalGoalScore, max: 15 },
    { name: '部门互评', value: data.departmentReviewScore, max: 5 },
    { name: '绩效加分', value: data.bonusScore, max: 15 },
  ];

  for (const score of scores) {
    if (score.value !== undefined) {
      if (score.value < 0) {
        errors.push(`${score.name}分数不能为负数: ${score.value}`);
      }
      if (score.value > score.max) {
        warnings.push(`${score.name}分数超过最大值 ${score.max}: ${score.value}`);
      }
    }
  }

  // 检查总分
  if (data.totalScore !== undefined) {
    if (data.totalScore < 0 || data.totalScore > 150) {
      warnings.push(`总分超出预期范围 (0-150): ${data.totalScore}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
