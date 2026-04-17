import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getDb } from '../db';
import { performanceDimensionsRouter } from './performance-dimensions';
import { assessmentPeriods, performanceAssessments, employees, departments } from '../../drizzle/schema';
import { v4 as uuidv4 } from 'uuid';

describe('Performance Dimensions Router', () => {
  let db: any;
  let testPeriodId: string;
  let testEmployeeId: string;
  let testDepartmentId: string;

  beforeAll(async () => {
    db = await getDb();

    // 创建测试部门
    testDepartmentId = uuidv4();
    await db.insert(departments).values({
      id: testDepartmentId,
      name: '测试部门',
      status: 'active',
      level: 0,
    });

    // 创建测试员工
    testEmployeeId = uuidv4();
    await db.insert(employees).values({
      id: testEmployeeId,
      name: '测试员工',
      departmentId: testDepartmentId,
      status: 'active',
    });

    // 创建测试周期
    testPeriodId = uuidv4();
    await db.insert(assessmentPeriods).values({
      id: testPeriodId,
      name: '2024年4月',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-04-30'),
      status: 'active',
    });

    // 创建测试评分记录
    await db.insert(performanceAssessments).values({
      id: uuidv4(),
      periodId: testPeriodId,
      employeeId: testEmployeeId,
      dailyWorkScore: 90,
      workQualityScore: 85,
      personalGoalScore: 88,
      departmentReviewScore: 92,
      bonusScore: 2,
      penaltyScore: 0,
      totalScore: 89.5,
      status: 'submitted',
    });
  });

  afterAll(async () => {
    // 清理测试数据
    await db.delete(performanceAssessments).where(true);
    await db.delete(assessmentPeriods).where(true);
    await db.delete(employees).where(true);
    await db.delete(departments).where(true);
  });

  describe('Monthly Performance', () => {
    it('should get monthly data', async () => {
      const caller = performanceDimensionsRouter.createCaller({
        user: { id: 'test-user', role: 'admin' },
      });

      const result = await caller.monthly.getMonthlyData({
        periodId: testPeriodId,
      });

      expect(result).toBeDefined();
      expect(result.month).toBeDefined();
      expect(result.totalEmployees).toBeGreaterThan(0);
      expect(result.averageScore).toBeGreaterThan(0);
      expect(result.completionRate).toBeGreaterThanOrEqual(0);
      expect(result.topPerformers).toBeInstanceOf(Array);
      expect(result.departmentStats).toBeInstanceOf(Array);
      expect(result.scoreDistribution).toBeInstanceOf(Array);
    });

    it('should handle missing period gracefully', async () => {
      const caller = performanceDimensionsRouter.createCaller({
        user: { id: 'test-user', role: 'admin' },
      });

      const result = await caller.monthly.getMonthlyData({
        periodId: 'non-existent-id',
      });

      expect(result.month).toBe('暂无数据');
      expect(result.totalEmployees).toBe(0);
      expect(result.averageScore).toBe(0);
    });
  });

  describe('Historical Monthly Performance', () => {
    it('should get trend data', async () => {
      const caller = performanceDimensionsRouter.createCaller({
        user: { id: 'test-user', role: 'admin' },
      });

      const result = await caller.historicalMonthly.getTrendData({
        months: 12,
      });

      expect(result).toBeDefined();
      expect(result.highestScore).toBeGreaterThanOrEqual(0);
      expect(result.lowestScore).toBeGreaterThanOrEqual(0);
      expect(result.averageGrowth).toBeDefined();
      expect(result.completionRate).toBeGreaterThanOrEqual(0);
      expect(result.trendData).toBeInstanceOf(Array);
    });

    it('should get department comparison', async () => {
      const caller = performanceDimensionsRouter.createCaller({
        user: { id: 'test-user', role: 'admin' },
      });

      const result = await caller.historicalMonthly.getDepartmentComparison({
        months: 12,
      });

      expect(result).toBeInstanceOf(Array);
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('month');
      }
    });

    it('should get monthly stats', async () => {
      const caller = performanceDimensionsRouter.createCaller({
        user: { id: 'test-user', role: 'admin' },
      });

      const result = await caller.historicalMonthly.getMonthlyStats({
        months: 12,
      });

      expect(result).toBeInstanceOf(Array);
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('month');
        expect(result[0]).toHaveProperty('averageScore');
        expect(result[0]).toHaveProperty('highestScore');
        expect(result[0]).toHaveProperty('lowestScore');
      }
    });
  });

  describe('Historical Quarterly Performance', () => {
    it('should get quarterly data', async () => {
      const caller = performanceDimensionsRouter.createCaller({
        user: { id: 'test-user', role: 'admin' },
      });

      const result = await caller.historicalQuarterly.getQuarterlyData({
        quarters: 4,
      });

      expect(result).toBeInstanceOf(Array);
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('quarter');
        expect(result[0]).toHaveProperty('score');
        expect(result[0]).toHaveProperty('completionRate');
      }
    });

    it('should get quarterly trend', async () => {
      const caller = performanceDimensionsRouter.createCaller({
        user: { id: 'test-user', role: 'admin' },
      });

      const result = await caller.historicalQuarterly.getQuarterlyTrend({
        quarters: 4,
      });

      expect(result).toBeInstanceOf(Array);
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('quarter');
        expect(result[0]).toHaveProperty('averageScore');
        expect(result[0]).toHaveProperty('completionRate');
      }
    });

    it('should get department comparison for quarters', async () => {
      const caller = performanceDimensionsRouter.createCaller({
        user: { id: 'test-user', role: 'admin' },
      });

      const result = await caller.historicalQuarterly.getDepartmentComparison({
        quarters: 4,
      });

      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('Annual Performance', () => {
    it('should get annual data', async () => {
      const caller = performanceDimensionsRouter.createCaller({
        user: { id: 'test-user', role: 'admin' },
      });

      const result = await caller.annual.getAnnualData({
        year: 2024,
      });

      expect(result).toBeDefined();
      expect(result.year).toBe(2024);
      expect(result.averageScore).toBeGreaterThanOrEqual(0);
      expect(result.completionRate).toBeGreaterThanOrEqual(0);
      expect(result.totalEmployees).toBeGreaterThanOrEqual(0);
      expect(result.monthlyTrend).toBeInstanceOf(Array);
      expect(result.departmentComparison).toBeInstanceOf(Array);
    });

    it('should handle different years', async () => {
      const caller = performanceDimensionsRouter.createCaller({
        user: { id: 'test-user', role: 'admin' },
      });

      const result2023 = await caller.annual.getAnnualData({
        year: 2023,
      });

      expect(result2023.year).toBe(2023);
    });
  });

  describe('Data Validation', () => {
    it('should return valid score ranges', async () => {
      const caller = performanceDimensionsRouter.createCaller({
        user: { id: 'test-user', role: 'admin' },
      });

      const result = await caller.monthly.getMonthlyData({
        periodId: testPeriodId,
      });

      // 验证平均分在合理范围内
      if (result.averageScore > 0) {
        expect(result.averageScore).toBeGreaterThanOrEqual(0);
        expect(result.averageScore).toBeLessThanOrEqual(100);
      }

      // 验证完成率在合理范围内
      expect(result.completionRate).toBeGreaterThanOrEqual(0);
      expect(result.completionRate).toBeLessThanOrEqual(100);

      // 验证分数分布总和为100%
      const totalPercentage = result.scoreDistribution.reduce(
        (sum: number, item: any) => sum + item.percentage,
        0
      );
      if (result.totalEmployees > 0) {
        expect(totalPercentage).toBeCloseTo(100, 1);
      }
    });
  });
});
