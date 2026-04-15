/**
 * 评分周期数据模型和 Mock 数据
 */

export interface AssessmentPeriod {
  id: string;
  name: string;
  month: string;
  year: number;
  startDate: string;
  endDate: string;
  status: 'open' | 'closed' | 'published';
  isCurrentPeriod: boolean;
}

export interface PeriodPerformanceData {
  periodId: string;
  forecastScore: number;
  scoreChange: number;
  objectives: ObjectiveItem[];
  qualityMetrics: QualityMetric[];
  bonusItems: PerformanceItem[];
  penaltyItems: PerformanceItem[];
}

export interface ObjectiveItem {
  id: string;
  type: 'KPI' | 'Task';
  objective: string;
  keyResult: string;
  dueDate: string;
  status: 'completed' | 'in-progress' | 'pending';
  score: number;
}

export interface QualityMetric {
  name: string;
  icon: string;
  value: number;
  label: string;
  code: string;
}

export interface PerformanceItem {
  id: string;
  name: string;
  description: string;
  score: number;
  type: 'bonus' | 'penalty';
}

// Mock 评分周期数据
export const ASSESSMENT_PERIODS: AssessmentPeriod[] = [
  {
    id: 'period_2024_01',
    name: '1月',
    month: '01',
    year: 2024,
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    status: 'published',
    isCurrentPeriod: false,
  },
  {
    id: 'period_2024_02',
    name: '2月',
    month: '02',
    year: 2024,
    startDate: '2024-02-01',
    endDate: '2024-02-29',
    status: 'published',
    isCurrentPeriod: false,
  },
  {
    id: 'period_2024_03',
    name: '3月',
    month: '03',
    year: 2024,
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    status: 'published',
    isCurrentPeriod: false,
  },
  {
    id: 'period_2024_04',
    name: '4月',
    month: '04',
    year: 2024,
    startDate: '2024-04-01',
    endDate: '2024-04-30',
    status: 'published',
    isCurrentPeriod: false,
  },
  {
    id: 'period_2024_05',
    name: '5月',
    month: '05',
    year: 2024,
    startDate: '2024-05-01',
    endDate: '2024-05-31',
    status: 'published',
    isCurrentPeriod: false,
  },
  {
    id: 'period_2024_06',
    name: '6月',
    month: '06',
    year: 2024,
    startDate: '2024-06-01',
    endDate: '2024-06-30',
    status: 'published',
    isCurrentPeriod: false,
  },
  {
    id: 'period_2024_07',
    name: '7月',
    month: '07',
    year: 2024,
    startDate: '2024-07-01',
    endDate: '2024-07-31',
    status: 'published',
    isCurrentPeriod: false,
  },
  {
    id: 'period_2024_08',
    name: '8月',
    month: '08',
    year: 2024,
    startDate: '2024-08-01',
    endDate: '2024-08-31',
    status: 'published',
    isCurrentPeriod: false,
  },
  {
    id: 'period_2024_09',
    name: '9月',
    month: '09',
    year: 2024,
    startDate: '2024-09-01',
    endDate: '2024-09-30',
    status: 'published',
    isCurrentPeriod: false,
  },
  {
    id: 'period_2024_10',
    name: '10月',
    month: '10',
    year: 2024,
    startDate: '2024-10-01',
    endDate: '2024-10-31',
    status: 'published',
    isCurrentPeriod: false,
  },
  {
    id: 'period_2024_11',
    name: '11月',
    month: '11',
    year: 2024,
    startDate: '2024-11-01',
    endDate: '2024-11-30',
    status: 'published',
    isCurrentPeriod: false,
  },
  {
    id: 'period_2024_12',
    name: '12月',
    month: '12',
    year: 2024,
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    status: 'open',
    isCurrentPeriod: true,
  },
];

// Mock 各月份的绩效数据
export const PERIOD_PERFORMANCE_DATA: Record<string, PeriodPerformanceData> = {
  period_2024_01: {
    periodId: 'period_2024_01',
    forecastScore: 88.5,
    scoreChange: -1.2,
    objectives: [
      {
        id: '1',
        type: 'KPI',
        objective: '关键指标 (KPI)',
        keyResult: '微服务架构优化',
        dueDate: '01-25',
        status: 'completed',
        score: 42.0,
      },
      {
        id: '2',
        type: 'Task',
        objective: '关键要项 (Task)',
        keyResult: '性能测试框架建设',
        dueDate: '01-20',
        status: 'completed',
        score: 28.0,
      },
    ],
    qualityMetrics: [
      { name: 'CODE REVIEW', code: '代码走查', icon: '🔍', value: 18, label: '代码走查次数' },
      { name: 'AUDIT', code: '审计', icon: '📋', value: 10, label: '代码审核通过' },
      { name: 'BUG DEFLECTION', code: 'Bug打回率', icon: '🐛', value: 2, label: 'Bug打回打回' },
      { name: 'DESIGN', code: '设计', icon: '🏗️', value: 6, label: '设计评审参与' },
    ],
    bonusItems: [
      {
        id: 'b1',
        name: '技术分享',
        description: '主讲《微服务架构设计》技术分享',
        score: 5.0,
        type: 'bonus',
      },
    ],
    penaltyItems: [
      {
        id: 'p1',
        name: '技术失误',
        description: '无',
        score: 0.0,
        type: 'penalty',
      },
      {
        id: 'p2',
        name: '管理失误',
        description: '无',
        score: 0.0,
        type: 'penalty',
      },
      {
        id: 'p3',
        name: '质量异常',
        description: '无',
        score: 0.0,
        type: 'penalty',
      },
    ],
  },
  period_2024_02: {
    periodId: 'period_2024_02',
    forecastScore: 91.2,
    scoreChange: 2.7,
    objectives: [
      {
        id: '1',
        type: 'KPI',
        objective: '关键指标 (KPI)',
        keyResult: '容器化部署完成',
        dueDate: '02-28',
        status: 'completed',
        score: 44.0,
      },
      {
        id: '2',
        type: 'Task',
        objective: '关键要项 (Task)',
        keyResult: 'CI/CD 流程优化',
        dueDate: '02-25',
        status: 'completed',
        score: 31.0,
      },
    ],
    qualityMetrics: [
      { name: 'CODE REVIEW', code: '代码走查', icon: '🔍', value: 22, label: '代码走查次数' },
      { name: 'AUDIT', code: '审计', icon: '📋', value: 11, label: '代码审核通过' },
      { name: 'BUG DEFLECTION', code: 'Bug打回率', icon: '🐛', value: 2, label: 'Bug打回打回' },
      { name: 'DESIGN', code: '设计', icon: '🏗️', value: 7, label: '设计评审参与' },
    ],
    bonusItems: [
      {
        id: 'b1',
        name: '培养新人',
        description: '指导新入职员工，完成入职培训',
        score: 4.0,
        type: 'bonus',
      },
      {
        id: 'b2',
        name: '技术分享',
        description: '主讲《容器化最佳实践》技术分享',
        score: 6.0,
        type: 'bonus',
      },
    ],
    penaltyItems: [
      {
        id: 'p1',
        name: '技术失误',
        description: '无',
        score: 0.0,
        type: 'penalty',
      },
      {
        id: 'p2',
        name: '管理失误',
        description: '无',
        score: 0.0,
        type: 'penalty',
      },
      {
        id: 'p3',
        name: '质量异常',
        description: '无',
        score: 0.0,
        type: 'penalty',
      },
    ],
  },
  period_2024_12: {
    periodId: 'period_2024_12',
    forecastScore: 95.8,
    scoreChange: 2.4,
    objectives: [
      {
        id: '1',
        type: 'KPI',
        objective: '关键指标 (KPI)',
        keyResult: '云原生架构迁移',
        dueDate: '12-20',
        status: 'completed',
        score: 45.0,
      },
      {
        id: '2',
        type: 'Task',
        objective: '关键要项 (Task)',
        keyResult: '安全审计优化',
        dueDate: '12-15',
        status: 'completed',
        score: 30.0,
      },
    ],
    qualityMetrics: [
      { name: 'CODE REVIEW', code: '代码走查', icon: '🔍', value: 24, label: '代码走查次数' },
      { name: 'AUDIT', code: '审计', icon: '📋', value: 12, label: '代码审核通过' },
      { name: 'BUG DEFLECTION', code: 'Bug打回率', icon: '🐛', value: 3, label: 'Bug打回打回' },
      { name: 'DESIGN', code: '设计', icon: '🏗️', value: 8, label: '设计评审参与' },
    ],
    bonusItems: [
      {
        id: 'b1',
        name: '培养新人',
        description: '担任新人师傅，指导入职新人，并在月度用用期间进行',
        score: 5.0,
        type: 'bonus',
      },
      {
        id: 'b2',
        name: '技术分享',
        description: '主讲《云原生安全架构》部门内技术分享，参与人数50+，评评率98%。',
        score: 8.0,
        type: 'bonus',
      },
    ],
    penaltyItems: [
      {
        id: 'p1',
        name: '技术失误',
        description: '无',
        score: 0.0,
        type: 'penalty',
      },
      {
        id: 'p2',
        name: '管理失误',
        description: '参与权限记录（1次）',
        score: -0.5,
        type: 'penalty',
      },
      {
        id: 'p3',
        name: '质量异常',
        description: '无',
        score: 0.0,
        type: 'penalty',
      },
    ],
  },
};

// 为其他月份填充默认数据
export function getPerformanceDataForPeriod(periodId: string): PeriodPerformanceData {
  if (PERIOD_PERFORMANCE_DATA[periodId]) {
    return PERIOD_PERFORMANCE_DATA[periodId];
  }

  // 返回默认数据
  return {
    periodId,
    forecastScore: 90.0,
    scoreChange: 0,
    objectives: [
      {
        id: '1',
        type: 'KPI',
        objective: '关键指标 (KPI)',
        keyResult: '待定',
        dueDate: '待定',
        status: 'pending',
        score: 40.0,
      },
      {
        id: '2',
        type: 'Task',
        objective: '关键要项 (Task)',
        keyResult: '待定',
        dueDate: '待定',
        status: 'pending',
        score: 30.0,
      },
    ],
    qualityMetrics: [
      { name: 'CODE REVIEW', code: '代码走查', icon: '🔍', value: 20, label: '代码走查次数' },
      { name: 'AUDIT', code: '审计', icon: '📋', value: 10, label: '代码审核通过' },
      { name: 'BUG DEFLECTION', code: 'Bug打回率', icon: '🐛', value: 2, label: 'Bug打回打回' },
      { name: 'DESIGN', code: '设计', icon: '🏗️', value: 7, label: '设计评审参与' },
    ],
    bonusItems: [],
    penaltyItems: [
      {
        id: 'p1',
        name: '技术失误',
        description: '无',
        score: 0.0,
        type: 'penalty',
      },
      {
        id: 'p2',
        name: '管理失误',
        description: '无',
        score: 0.0,
        type: 'penalty',
      },
      {
        id: 'p3',
        name: '质量异常',
        description: '无',
        score: 0.0,
        type: 'penalty',
      },
    ],
  };
}


/**
 * 复制上月的绩效数据到当前月
 * @param currentPeriodId 当前周期 ID
 * @returns 复制后的绩效数据，如果是第一个月则返回 null
 */
export function copyPreviousPeriodData(currentPeriodId: string): PeriodPerformanceData | null {
  const currentIndex = ASSESSMENT_PERIODS.findIndex((p) => p.id === currentPeriodId);

  // 如果是第一个月，无法复制
  if (currentIndex <= 0) {
    return null;
  }

  const previousPeriod = ASSESSMENT_PERIODS[currentIndex - 1];
  const previousData = getPerformanceDataForPeriod(previousPeriod.id);

  // 复制数据，生成新的 ID
  return {
    periodId: currentPeriodId,
    forecastScore: previousData.forecastScore,
    scoreChange: 0, // 重置环比变化
    objectives: previousData.objectives.map((obj) => ({
      ...obj,
      id: `obj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending' as const, // 重置状态为待定
    })),
    qualityMetrics: previousData.qualityMetrics.map((metric) => ({
      ...metric,
      value: 0, // 重置数值为 0
    })),
    bonusItems: previousData.bonusItems.map((item) => ({
      ...item,
      id: `b_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    })),
    penaltyItems: previousData.penaltyItems.map((item) => ({
      ...item,
      id: `p_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    })),
  };
}

/**
 * 获取上月的周期信息
 * @param currentPeriodId 当前周期 ID
 * @returns 上月的周期信息，如果是第一个月则返回 null
 */
export function getPreviousPeriod(currentPeriodId: string): AssessmentPeriod | null {
  const currentIndex = ASSESSMENT_PERIODS.findIndex((p) => p.id === currentPeriodId);

  if (currentIndex <= 0) {
    return null;
  }

  return ASSESSMENT_PERIODS[currentIndex - 1];
}
