/**
 * LLM 服务单元测试
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateParsedData } from './llm-service';
import { ParsedDocumentData } from '../shared/document-parser-types';

describe('LLM Service', () => {
  describe('validateParsedData', () => {
    it('应该验证有效的解析数据', () => {
      const validData: ParsedDocumentData = {
        employeeName: '张三',
        employeeId: 'EMP001',
        department: '技术部',
        position: '工程师',
        dailyWorkScore: 95,
        workQualityScore: 14,
        personalGoalScore: 15,
        departmentReviewScore: 5,
        bonusScore: 10,
        penaltyScore: 0,
        totalScore: 139,
        rank: 1,
        comments: '表现优秀',
        evaluatorName: '李四',
        evaluationDate: '2024-01-15',
        extractionConfidence: 0.95,
      };

      const result = validateParsedData(validData);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });

    it('应该检测负数分数', () => {
      const invalidData: ParsedDocumentData = {
        employeeName: '张三',
        dailyWorkScore: -10,
      };

      const result = validateParsedData(invalidData);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('不能为负数');
    });

    it('应该检测超过最大值的分数', () => {
      const invalidData: ParsedDocumentData = {
        employeeName: '张三',
        dailyWorkScore: 150, // 超过最大值 100
      };

      const result = validateParsedData(invalidData);

      expect(result.valid).toBe(true); // 不是错误，只是警告
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    it('应该检测超出范围的总分', () => {
      const invalidData: ParsedDocumentData = {
        employeeName: '张三',
        totalScore: 200, // 超过最大值 150
      };

      const result = validateParsedData(invalidData);

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('超出预期范围');
    });

    it('应该警告缺少员工姓名', () => {
      const incompleteData: ParsedDocumentData = {
        employeeId: 'EMP001',
        department: '技术部',
      };

      const result = validateParsedData(incompleteData);

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some(w => w.includes('员工姓名'))).toBe(true);
    });

    it('应该警告缺少部门信息', () => {
      const incompleteData: ParsedDocumentData = {
        employeeName: '张三',
        employeeId: 'EMP001',
      };

      const result = validateParsedData(incompleteData);

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some(w => w.includes('部门'))).toBe(true);
    });

    it('应该处理所有分数都为 undefined 的情况', () => {
      const minimalData: ParsedDocumentData = {
        employeeName: '张三',
        department: '技术部',
      };

      const result = validateParsedData(minimalData);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('应该检测多个错误', () => {
      const multiErrorData: ParsedDocumentData = {
        employeeName: '张三',
        dailyWorkScore: -50,
        workQualityScore: -10,
      };

      const result = validateParsedData(multiErrorData);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
    });

    it('应该处理边界值', () => {
      const boundaryData: ParsedDocumentData = {
        employeeName: '张三',
        dailyWorkScore: 0,
        workQualityScore: 0,
        personalGoalScore: 0,
        departmentReviewScore: 0,
        bonusScore: 0,
        penaltyScore: 0,
        totalScore: 0,
      };

      const result = validateParsedData(boundaryData);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('应该处理最大值边界', () => {
      const maxBoundaryData: ParsedDocumentData = {
        employeeName: '张三',
        dailyWorkScore: 100,
        workQualityScore: 15,
        personalGoalScore: 15,
        departmentReviewScore: 5,
        bonusScore: 15,
        penaltyScore: 0,
        totalScore: 150,
      };

      const result = validateParsedData(maxBoundaryData);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
