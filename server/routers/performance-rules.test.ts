/**
 * 绩效规则 API 单元测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TRPCError } from '@trpc/server';
import * as dbRules from '../db-performance-rules';

// Mock 数据库函数
vi.mock('../db-performance-rules', () => ({
  getActivePerformanceRules: vi.fn(),
  getPerformanceRuleById: vi.fn(),
  createPerformanceRule: vi.fn(),
  updatePerformanceRule: vi.fn(),
  deletePerformanceRule: vi.fn(),
  addRuleCriteria: vi.fn(),
  updateRuleCriteria: vi.fn(),
  deleteRuleCriteria: vi.fn(),
  getActiveBonusRules: vi.fn(),
  createBonusRule: vi.fn(),
  updateBonusRule: vi.fn(),
  deleteBonusRule: vi.fn(),
  getActivePenaltyRules: vi.fn(),
  createPenaltyRule: vi.fn(),
  updatePenaltyRule: vi.fn(),
  deletePenaltyRule: vi.fn(),
  getGradeRules: vi.fn(),
  createGradeRule: vi.fn(),
  updateGradeRule: vi.fn(),
  deleteGradeRule: vi.fn(),
  recordRuleVersion: vi.fn(),
  getRuleVersionHistory: vi.fn(),
}));

describe('Performance Rules API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('绩效维度规则', () => {
    it('应该获取所有活跃的绩效规则', async () => {
      const mockRules = [
        {
          id: 'rule-1',
          title: '日常工作表现',
          weight: 40,
          description: '评估员工日常工作',
          isActive: true,
          createdBy: 'user-1',
          createdAt: new Date(),
          updatedBy: null,
          updatedAt: new Date(),
        },
      ];

      vi.mocked(dbRules.getActivePerformanceRules).mockResolvedValue(mockRules as any);

      const result = await dbRules.getActivePerformanceRules();
      expect(result).toEqual(mockRules);
      expect(dbRules.getActivePerformanceRules).toHaveBeenCalled();
    });

    it('应该创建新的绩效规则', async () => {
      const ruleData = {
        title: '工作质量',
        weight: 30,
        description: '评估工作质量',
        createdBy: 'user-1',
      };

      vi.mocked(dbRules.createPerformanceRule).mockResolvedValue('rule-id-123');

      const result = await dbRules.createPerformanceRule(ruleData);
      expect(result).toBe('rule-id-123');
      expect(dbRules.createPerformanceRule).toHaveBeenCalledWith(ruleData);
    });

    it('应该更新绩效规则', async () => {
      const updateData = {
        title: '更新的标题',
        weight: 35,
        updatedBy: 'user-1',
      };

      vi.mocked(dbRules.updatePerformanceRule).mockResolvedValue(undefined);

      await dbRules.updatePerformanceRule('rule-1', updateData);
      expect(dbRules.updatePerformanceRule).toHaveBeenCalledWith('rule-1', updateData);
    });

    it('应该删除绩效规则', async () => {
      vi.mocked(dbRules.deletePerformanceRule).mockResolvedValue(undefined);

      await dbRules.deletePerformanceRule('rule-1');
      expect(dbRules.deletePerformanceRule).toHaveBeenCalledWith('rule-1');
    });
  });

  describe('加分规则', () => {
    it('应该获取所有活跃的加分规则', async () => {
      const mockBonusRules = [
        {
          id: 'bonus-1',
          criteria: '获得公司表彰',
          minPoints: 5,
          maxPoints: 10,
          description: '表彰加分',
          isActive: true,
          sortOrder: 0,
          createdBy: 'user-1',
          createdAt: new Date(),
          updatedBy: null,
          updatedAt: new Date(),
        },
      ];

      vi.mocked(dbRules.getActiveBonusRules).mockResolvedValue(mockBonusRules as any);

      const result = await dbRules.getActiveBonusRules();
      expect(result).toEqual(mockBonusRules);
      expect(dbRules.getActiveBonusRules).toHaveBeenCalled();
    });

    it('应该创建新的加分规则', async () => {
      const bonusData = {
        criteria: '完成重点项目',
        minPoints: 3,
        maxPoints: 5,
        description: '项目完成加分',
        createdBy: 'user-1',
      };

      vi.mocked(dbRules.createBonusRule).mockResolvedValue('bonus-id-123');

      const result = await dbRules.createBonusRule(bonusData);
      expect(result).toBe('bonus-id-123');
      expect(dbRules.createBonusRule).toHaveBeenCalledWith(bonusData);
    });

    it('应该更新加分规则', async () => {
      const updateData = {
        criteria: '更新的加分条件',
        minPoints: 2,
        maxPoints: 4,
        updatedBy: 'user-1',
      };

      vi.mocked(dbRules.updateBonusRule).mockResolvedValue(undefined);

      await dbRules.updateBonusRule('bonus-1', updateData);
      expect(dbRules.updateBonusRule).toHaveBeenCalledWith('bonus-1', updateData);
    });

    it('应该删除加分规则', async () => {
      vi.mocked(dbRules.deleteBonusRule).mockResolvedValue(undefined);

      await dbRules.deleteBonusRule('bonus-1');
      expect(dbRules.deleteBonusRule).toHaveBeenCalledWith('bonus-1');
    });
  });

  describe('减分规则', () => {
    it('应该获取所有活跃的减分规则', async () => {
      const mockPenaltyRules = [
        {
          id: 'penalty-1',
          criteria: '严重迟到缺勤',
          minPoints: -5,
          maxPoints: -1,
          description: '迟到缺勤减分',
          isActive: true,
          sortOrder: 0,
          createdBy: 'user-1',
          createdAt: new Date(),
          updatedBy: null,
          updatedAt: new Date(),
        },
      ];

      vi.mocked(dbRules.getActivePenaltyRules).mockResolvedValue(mockPenaltyRules as any);

      const result = await dbRules.getActivePenaltyRules();
      expect(result).toEqual(mockPenaltyRules);
      expect(dbRules.getActivePenaltyRules).toHaveBeenCalled();
    });

    it('应该创建新的减分规则', async () => {
      const penaltyData = {
        criteria: '工作失误导致损失',
        minPoints: -5,
        maxPoints: -3,
        description: '工作失误减分',
        createdBy: 'user-1',
      };

      vi.mocked(dbRules.createPenaltyRule).mockResolvedValue('penalty-id-123');

      const result = await dbRules.createPenaltyRule(penaltyData);
      expect(result).toBe('penalty-id-123');
      expect(dbRules.createPenaltyRule).toHaveBeenCalledWith(penaltyData);
    });

    it('应该更新减分规则', async () => {
      const updateData = {
        criteria: '更新的减分条件',
        minPoints: -3,
        maxPoints: -1,
        updatedBy: 'user-1',
      };

      vi.mocked(dbRules.updatePenaltyRule).mockResolvedValue(undefined);

      await dbRules.updatePenaltyRule('penalty-1', updateData);
      expect(dbRules.updatePenaltyRule).toHaveBeenCalledWith('penalty-1', updateData);
    });

    it('应该删除减分规则', async () => {
      vi.mocked(dbRules.deletePenaltyRule).mockResolvedValue(undefined);

      await dbRules.deletePenaltyRule('penalty-1');
      expect(dbRules.deletePenaltyRule).toHaveBeenCalledWith('penalty-1');
    });
  });

  describe('等级划分规则', () => {
    it('应该获取所有等级划分规则', async () => {
      const mockGradeRules = [
        {
          id: 'grade-1',
          grade: '优秀',
          minScore: '90',
          maxScore: '100',
          percentage: '15',
          benefits: '年终奖励、晋升优先',
          description: '优秀等级',
          sortOrder: 0,
          createdBy: 'user-1',
          createdAt: new Date(),
          updatedBy: null,
          updatedAt: new Date(),
        },
      ];

      vi.mocked(dbRules.getGradeRules).mockResolvedValue(mockGradeRules as any);

      const result = await dbRules.getGradeRules();
      expect(result).toEqual(mockGradeRules);
      expect(dbRules.getGradeRules).toHaveBeenCalled();
    });

    it('应该创建新的等级划分规则', async () => {
      const gradeData = {
        grade: '良好',
        minScore: 80,
        maxScore: 89,
        percentage: 35,
        benefits: '年终奖励、培训机会',
        description: '良好等级',
        createdBy: 'user-1',
      };

      vi.mocked(dbRules.createGradeRule).mockResolvedValue('grade-id-123');

      const result = await dbRules.createGradeRule(gradeData);
      expect(result).toBe('grade-id-123');
      expect(dbRules.createGradeRule).toHaveBeenCalledWith(gradeData);
    });

    it('应该更新等级划分规则', async () => {
      const updateData = {
        grade: '更新的等级',
        minScore: 75,
        maxScore: 85,
        updatedBy: 'user-1',
      };

      vi.mocked(dbRules.updateGradeRule).mockResolvedValue(undefined);

      await dbRules.updateGradeRule('grade-1', updateData);
      expect(dbRules.updateGradeRule).toHaveBeenCalledWith('grade-1', updateData);
    });

    it('应该删除等级划分规则', async () => {
      vi.mocked(dbRules.deleteGradeRule).mockResolvedValue(undefined);

      await dbRules.deleteGradeRule('grade-1');
      expect(dbRules.deleteGradeRule).toHaveBeenCalledWith('grade-1');
    });
  });

  describe('规则版本管理', () => {
    it('应该记录规则版本', async () => {
      const versionData = {
        ruleType: 'dimension' as const,
        versionNumber: 1,
        content: { id: 'rule-1', title: '日常工作表现' },
        changeDescription: '创建新规则',
        createdBy: 'user-1',
      };

      vi.mocked(dbRules.recordRuleVersion).mockResolvedValue('version-id-123');

      const result = await dbRules.recordRuleVersion(versionData);
      expect(result).toBe('version-id-123');
      expect(dbRules.recordRuleVersion).toHaveBeenCalledWith(versionData);
    });

    it('应该获取规则版本历史', async () => {
      const mockVersions = [
        {
          id: 'version-1',
          ruleType: 'dimension',
          versionNumber: 1,
          content: { id: 'rule-1', title: '日常工作表现' },
          changeDescription: '创建新规则',
          createdBy: 'user-1',
          createdAt: new Date(),
        },
      ];

      vi.mocked(dbRules.getRuleVersionHistory).mockResolvedValue(mockVersions as any);

      const result = await dbRules.getRuleVersionHistory('dimension');
      expect(result).toEqual(mockVersions);
      expect(dbRules.getRuleVersionHistory).toHaveBeenCalledWith('dimension');
    });
  });

  describe('评分等级标准', () => {
    it('应该为规则添加评分等级标准', async () => {
      const criteriaData = {
        ruleId: 'rule-1',
        level: '优秀（90-100分）',
        scoreRange: '90-100',
        description: '工作完成度高',
        examples: ['按时完成', '质量高'],
      };

      vi.mocked(dbRules.addRuleCriteria).mockResolvedValue('criteria-id-123');

      const result = await dbRules.addRuleCriteria(criteriaData);
      expect(result).toBe('criteria-id-123');
      expect(dbRules.addRuleCriteria).toHaveBeenCalledWith(criteriaData);
    });

    it('应该更新评分等级标准', async () => {
      const updateData = {
        level: '更新的等级',
        description: '更新的描述',
      };

      vi.mocked(dbRules.updateRuleCriteria).mockResolvedValue(undefined);

      await dbRules.updateRuleCriteria('criteria-1', updateData);
      expect(dbRules.updateRuleCriteria).toHaveBeenCalledWith('criteria-1', updateData);
    });

    it('应该删除评分等级标准', async () => {
      vi.mocked(dbRules.deleteRuleCriteria).mockResolvedValue(undefined);

      await dbRules.deleteRuleCriteria('criteria-1');
      expect(dbRules.deleteRuleCriteria).toHaveBeenCalledWith('criteria-1');
    });
  });
});
