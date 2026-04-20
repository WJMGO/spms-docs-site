/**
 * 扩展 LLM 服务单元测试 - 工作质量详情提取
 */

import { describe, it, expect, vi } from 'vitest';
import { validateWorkQualityDetails, mergeWorkQualityDetails } from './llm-service-extended';
import { WorkQualityDetails, ParsedDocumentData } from '../shared/document-parser-types';

describe('LLM Service Extended - Work Quality Details', () => {
  describe('validateWorkQualityDetails', () => {
    it('应该验证有效的工作质量详情数据', () => {
      const validDetails: WorkQualityDetails = {
        codeReviewCount: 10,
        codeReviewScore: 85,
        codeAuditCount: 5,
        codeAuditScore: 90,
        bugReturnRate: 15,
        bugReturnRateScore: 80,
        personalBugCount: 8,
        personalBugScore: 75,
        overdueProblemsAchieved: true,
        overdueProblemsScore: 100,
        designReviewCount: 3,
        designReviewScore: 88,
        totalScore: 85,
      };

      const result = validateWorkQualityDetails(validDetails);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('应该检测超出范围的数值', () => {
      const invalidDetails: WorkQualityDetails = {
        codeReviewScore: 150, // 超过最大值 100
        bugReturnRate: 120, // 超过最大值 100
      };

      const result = validateWorkQualityDetails(invalidDetails);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('应该检测负数值', () => {
      const invalidDetails: WorkQualityDetails = {
        codeReviewCount: -5,
        personalBugCount: -10,
      };

      const result = validateWorkQualityDetails(invalidDetails);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('应该警告缺失标记的字段', () => {
      const detailsWithMissing: WorkQualityDetails = {
        codeReviewCount: 10,
        codeReviewMissing: true,
        codeAuditMissing: true,
      };

      const result = validateWorkQualityDetails(detailsWithMissing);

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('缺失');
    });

    it('应该处理空对象', () => {
      const emptyDetails: WorkQualityDetails = {};

      const result = validateWorkQualityDetails(emptyDetails);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('应该验证边界值', () => {
      const boundaryDetails: WorkQualityDetails = {
        codeReviewCount: 0,
        codeReviewScore: 0,
        bugReturnRate: 0,
        totalScore: 0,
      };

      const result = validateWorkQualityDetails(boundaryDetails);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('应该验证最大值边界', () => {
      const maxBoundaryDetails: WorkQualityDetails = {
        codeReviewCount: 1000,
        codeReviewScore: 100,
        bugReturnRate: 100,
        totalScore: 100,
      };

      const result = validateWorkQualityDetails(maxBoundaryDetails);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('应该检测多个错误', () => {
      const multiErrorDetails: WorkQualityDetails = {
        codeReviewScore: 150,
        bugReturnRate: 120,
        personalBugCount: -5,
        totalScore: 200,
      };

      const result = validateWorkQualityDetails(multiErrorDetails);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('mergeWorkQualityDetails', () => {
    it('应该正确合并工作质量详情到解析数据', () => {
      const parsedData: ParsedDocumentData = {
        employeeName: '张三',
        employeeId: 'EMP001',
        department: '技术部',
        totalScore: 90,
      };

      const workQualityDetails: WorkQualityDetails = {
        codeReviewCount: 10,
        codeReviewScore: 85,
        totalScore: 85,
      };

      const result = mergeWorkQualityDetails(parsedData, workQualityDetails);

      expect(result.employeeName).toBe('张三');
      expect(result.workQualityDetails).toEqual(workQualityDetails);
      expect(result.totalScore).toBe(90); // 原始值保留
    });

    it('应该处理空的工作质量详情', () => {
      const parsedData: ParsedDocumentData = {
        employeeName: '张三',
      };

      const workQualityDetails: WorkQualityDetails = {};

      const result = mergeWorkQualityDetails(parsedData, workQualityDetails);

      expect(result.employeeName).toBe('张三');
      expect(result.workQualityDetails).toEqual({});
    });

    it('应该覆盖现有的工作质量详情', () => {
      const parsedData: ParsedDocumentData = {
        employeeName: '张三',
        workQualityDetails: {
          codeReviewCount: 5,
        },
      };

      const newWorkQualityDetails: WorkQualityDetails = {
        codeReviewCount: 10,
        codeReviewScore: 85,
      };

      const result = mergeWorkQualityDetails(parsedData, newWorkQualityDetails);

      expect(result.workQualityDetails?.codeReviewCount).toBe(10);
      expect(result.workQualityDetails?.codeReviewScore).toBe(85);
    });

    it('应该保留其他解析数据字段', () => {
      const parsedData: ParsedDocumentData = {
        employeeName: '张三',
        employeeId: 'EMP001',
        department: '技术部',
        position: '工程师',
        dailyWorkScore: 95,
        comments: '表现优秀',
        extractionConfidence: 0.9,
      };

      const workQualityDetails: WorkQualityDetails = {
        codeReviewCount: 10,
      };

      const result = mergeWorkQualityDetails(parsedData, workQualityDetails);

      expect(result.employeeName).toBe('张三');
      expect(result.employeeId).toBe('EMP001');
      expect(result.department).toBe('技术部');
      expect(result.position).toBe('工程师');
      expect(result.dailyWorkScore).toBe(95);
      expect(result.comments).toBe('表现优秀');
      expect(result.extractionConfidence).toBe(0.9);
      expect(result.workQualityDetails).toEqual(workQualityDetails);
    });
  });

  describe('Work Quality Details - Missing Fields Handling', () => {
    it('应该标记缺失的字段', () => {
      const detailsWithMissing: WorkQualityDetails = {
        codeReviewCount: 10,
        codeReviewMissing: true,
        codeAuditMissing: true,
        bugReturnRate: 15,
        bugReturnRateMissing: false,
      };

      const missingCount = Object.entries(detailsWithMissing).filter(
        ([key, value]) => key.endsWith('Missing') && value === true
      ).length;

      expect(missingCount).toBe(2);
    });

    it('应该处理所有字段都缺失的情况', () => {
      const allMissing: WorkQualityDetails = {
        codeReviewMissing: true,
        codeAuditMissing: true,
        bugReturnRateMissing: true,
        personalBugMissing: true,
        overdueProblemsMissing: true,
        designReviewMissing: true,
      };

      const result = validateWorkQualityDetails(allMissing);

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.valid).toBe(true); // 缺失不是错误，只是警告
    });

    it('应该处理部分字段缺失的情况', () => {
      const partialMissing: WorkQualityDetails = {
        codeReviewCount: 10,
        codeReviewScore: 85,
        codeAuditMissing: true,
        bugReturnRate: 15,
        bugReturnRateScore: 80,
      };

      const result = validateWorkQualityDetails(partialMissing);

      expect(result.valid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });

  describe('Work Quality Details - Score Calculation', () => {
    it('应该验证总分是否合理', () => {
      const details: WorkQualityDetails = {
        codeReviewScore: 85,
        codeAuditScore: 90,
        bugReturnRateScore: 80,
        personalBugScore: 75,
        overdueProblemsScore: 100,
        designReviewScore: 88,
        totalScore: 85, // 平均值
      };

      const result = validateWorkQualityDetails(details);

      expect(result.valid).toBe(true);
    });

    it('应该处理零分的情况', () => {
      const details: WorkQualityDetails = {
        codeReviewScore: 0,
        codeAuditScore: 0,
        totalScore: 0,
      };

      const result = validateWorkQualityDetails(details);

      expect(result.valid).toBe(true);
    });

    it('应该处理满分的情况', () => {
      const details: WorkQualityDetails = {
        codeReviewScore: 100,
        codeAuditScore: 100,
        bugReturnRateScore: 100,
        personalBugScore: 100,
        overdueProblemsScore: 100,
        designReviewScore: 100,
        totalScore: 100,
      };

      const result = validateWorkQualityDetails(details);

      expect(result.valid).toBe(true);
    });
  });
});
