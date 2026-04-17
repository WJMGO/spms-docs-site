import { useState } from 'react';
import { ChevronDown, ChevronUp, Edit2 } from 'lucide-react';

interface PerformanceRule {
  id: string;
  name: string;
  description: string;
  weight: number;
  criteria: Array<{
    grade: string;
    minScore: number;
    maxScore: number;
    description: string;
  }>;
}

interface BonusRule {
  id: string;
  name: string;
  points: number;
  description: string;
}

interface PenaltyRule {
  id: string;
  name: string;
  points: number;
  description: string;
}

interface GradeRule {
  grade: string;
  minScore: number;
  maxScore: number;
  level: string;
}

const mockRules: PerformanceRule[] = [
  {
    id: '1',
    name: '日常工作表现',
    description: '基于员工日常工作完成情况进行评分',
    weight: 30,
    criteria: [
      { grade: 'A', minScore: 90, maxScore: 100, description: '工作完成度高，质量优秀' },
      { grade: 'B', minScore: 80, maxScore: 89, description: '工作完成度良好，质量较好' },
      { grade: 'C', minScore: 70, maxScore: 79, description: '工作完成度一般，质量一般' },
      { grade: 'D', minScore: 60, maxScore: 69, description: '工作完成度较差，质量一般' },
    ],
  },
  {
    id: '2',
    name: '工作质量',
    description: '代码质量、Bug 率、代码审核等指标',
    weight: 25,
    criteria: [
      { grade: 'A', minScore: 90, maxScore: 100, description: '代码质量优秀，Bug 率低' },
      { grade: 'B', minScore: 80, maxScore: 89, description: '代码质量良好，Bug 率较低' },
      { grade: 'C', minScore: 70, maxScore: 79, description: '代码质量一般，Bug 率一般' },
      { grade: 'D', minScore: 60, maxScore: 69, description: '代码质量较差，Bug 率较高' },
    ],
  },
  {
    id: '3',
    name: '个人目标完成',
    description: '关键指标和关键事项的完成情况',
    weight: 20,
    criteria: [
      { grade: 'A', minScore: 90, maxScore: 100, description: '目标完成度 100%' },
      { grade: 'B', minScore: 80, maxScore: 89, description: '目标完成度 80-99%' },
      { grade: 'C', minScore: 70, maxScore: 79, description: '目标完成度 60-79%' },
      { grade: 'D', minScore: 60, maxScore: 69, description: '目标完成度 60% 以下' },
    ],
  },
];

const mockBonusRules: BonusRule[] = [
  { id: '1', name: '培养新人', points: 5, description: '成功培养一名新员工' },
  { id: '2', name: '技术分享', points: 3, description: '进行一次技术分享' },
  { id: '3', name: '专利申请', points: 10, description: '申请一项专利' },
  { id: '4', name: '文档编写', points: 2, description: '编写高质量文档' },
];

const mockPenaltyRules: PenaltyRule[] = [
  { id: '1', name: '技术失误', points: -5, description: '导致线上事故' },
  { id: '2', name: '管理失误', points: -3, description: '项目管理不当' },
  { id: '3', name: '质量异常', points: -4, description: 'Bug 率过高' },
];

const mockGradeRules: GradeRule[] = [
  { grade: 'S', minScore: 95, maxScore: 100, level: '卓越' },
  { grade: 'A', minScore: 85, maxScore: 94, level: '优秀' },
  { grade: 'B', minScore: 75, maxScore: 84, level: '良好' },
  { grade: 'C', minScore: 65, maxScore: 74, level: '及格' },
  { grade: 'D', minScore: 0, maxScore: 64, level: '不及格' },
];

export default function PerformanceRules() {
  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set(['1']));
  const [rules] = useState<PerformanceRule[]>(mockRules);
  const [bonusRules] = useState<BonusRule[]>(mockBonusRules);
  const [penaltyRules] = useState<PenaltyRule[]>(mockPenaltyRules);
  const [gradeRules] = useState<GradeRule[]>(mockGradeRules);

  const toggleExpanded = (ruleId: string) => {
    const newExpanded = new Set(expandedRules);
    if (newExpanded.has(ruleId)) {
      newExpanded.delete(ruleId);
    } else {
      newExpanded.add(ruleId);
    }
    setExpandedRules(newExpanded);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">绩效规则管理</h1>
        <p className="text-gray-600">管理绩效评分维度、加减分规则和等级划分</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Performance Dimensions Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">评分维度规则</h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              <span className="text-sm">+ 新增维度</span>
            </button>
          </div>

          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleExpanded(rule.id)}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <button className="text-blue-600 hover:text-blue-700 transition-colors">
                      {expandedRules.has(rule.id) ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </button>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {rule.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{rule.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-600">权重</div>
                      <div className="text-xl font-bold text-blue-600">
                        {rule.weight}%
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 transition-colors p-2">
                      <Edit2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedRules.has(rule.id) && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-4">
                      评分等级标准
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="bg-gray-50 px-4 py-3 text-left font-semibold text-gray-900">等级</th>
                            <th className="bg-gray-50 px-4 py-3 text-right font-semibold text-gray-900">最低分</th>
                            <th className="bg-gray-50 px-4 py-3 text-right font-semibold text-gray-900">最高分</th>
                            <th className="bg-gray-50 px-4 py-3 text-left font-semibold text-gray-900">说明</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rule.criteria.map((criterion, idx) => (
                            <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                              <td className="px-4 py-3 font-semibold text-blue-600">
                                {criterion.grade}
                              </td>
                              <td className="px-4 py-3 text-right text-gray-900">
                                {criterion.minScore}
                              </td>
                              <td className="px-4 py-3 text-right text-gray-900">
                                {criterion.maxScore}
                              </td>
                              <td className="px-4 py-3 text-gray-600">
                                {criterion.description}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Bonus Rules Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">绩效加分规则</h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              <span className="text-sm">+ 新增规则</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bonusRules.map((bonus) => (
              <div key={bonus.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {bonus.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">{bonus.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      +{bonus.points}
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 transition-colors">
                      <Edit2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Penalty Rules Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">绩效减分规则</h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              <span className="text-sm">+ 新增规则</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {penaltyRules.map((penalty) => (
              <div key={penalty.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {penalty.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">{penalty.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {penalty.points}
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 transition-colors">
                      <Edit2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Grade Rules Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">等级划分规则</h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              <span className="text-sm">编辑</span>
            </button>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="bg-gray-50 px-4 py-3 text-left font-semibold text-gray-900">等级</th>
                    <th className="bg-gray-50 px-4 py-3 text-right font-semibold text-gray-900">最低分</th>
                    <th className="bg-gray-50 px-4 py-3 text-right font-semibold text-gray-900">最高分</th>
                    <th className="bg-gray-50 px-4 py-3 text-left font-semibold text-gray-900">级别</th>
                  </tr>
                </thead>
                <tbody>
                  {gradeRules.map((grade, idx) => (
                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-blue-600 text-lg">
                        {grade.grade}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900">
                        {grade.minScore}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900">
                        {grade.maxScore}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {grade.level}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <section className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            💡 规则说明
          </h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li>• 评分维度权重总和应为 100%</li>
            <li>• 加分和减分规则可以叠加应用</li>
            <li>• 最终绩效分数 = 各维度分数加权和 + 加分 - 减分</li>
            <li>• 仅 Admin 和 HR 角色可以编辑规则</li>
            <li>• 规则变更将自动记录在操作日志中</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
