import { useState } from 'react';
import { ChevronDown, ChevronUp, Edit2, X, Check } from 'lucide-react';
import PerformanceLayout from '@/components/PerformanceLayout';
import { trpc } from '@/trpc';

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

interface EditingRule extends PerformanceRule {
  isEditing?: boolean;
}

interface EditingBonusRule extends BonusRule {
  isEditing?: boolean;
}

interface EditingPenaltyRule extends PenaltyRule {
  isEditing?: boolean;
}

interface EditingGradeRule extends GradeRule {
  isEditing?: boolean;
}

interface ValidationErrors {
  [key: string]: string;
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

function PerformanceRulesContent() {
  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set(['1']));
  const [rules, setRules] = useState<EditingRule[]>(mockRules.map(r => ({ ...r, isEditing: false })));
  const [bonusRules, setBonusRules] = useState<EditingBonusRule[]>(mockBonusRules.map(r => ({ ...r, isEditing: false })));
  const [penaltyRules, setPenaltyRules] = useState<EditingPenaltyRule[]>(mockPenaltyRules.map(r => ({ ...r, isEditing: false })));
  const [gradeRules, setGradeRules] = useState<EditingGradeRule[]>(mockGradeRules.map(r => ({ ...r, isEditing: false })));
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [successMessage, setSuccessMessage] = useState<string>('');
  
  // tRPC mutations
  const updateRuleMutation = trpc.performanceRules.updateRule.useMutation();
  const updateBonusRuleMutation = trpc.performanceRules.updateBonusRule.useMutation();
  const updatePenaltyRuleMutation = trpc.performanceRules.updatePenaltyRule.useMutation();

  const toggleExpanded = (ruleId: string) => {
    const newExpanded = new Set(expandedRules);
    if (newExpanded.has(ruleId)) {
      newExpanded.delete(ruleId);
    } else {
      newExpanded.add(ruleId);
    }
    setExpandedRules(newExpanded);
  };

  // 验证规则
  const validateRule = (rule: EditingRule): boolean => {
    const errors: ValidationErrors = {};
    
    if (!rule.name || rule.name.trim() === '') {
      errors[`rule_${rule.id}_name`] = '规则名称不能为空';
    }
    
    if (rule.weight < 0 || rule.weight > 100 || !Number.isInteger(rule.weight)) {
      errors[`rule_${rule.id}_weight`] = '权重必须是 0-100 的整数';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateBonusRule = (rule: EditingBonusRule): boolean => {
    const errors: ValidationErrors = {};
    
    if (!rule.name || rule.name.trim() === '') {
      errors[`bonus_${rule.id}_name`] = '规则名称不能为空';
    }
    
    if (!Number.isInteger(rule.points) || rule.points <= 0) {
      errors[`bonus_${rule.id}_points`] = '加分点数必须是正整数';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePenaltyRule = (rule: EditingPenaltyRule): boolean => {
    const errors: ValidationErrors = {};
    
    if (!rule.name || rule.name.trim() === '') {
      errors[`penalty_${rule.id}_name`] = '规则名称不能为空';
    }
    
    if (!Number.isInteger(rule.points) || rule.points >= 0) {
      errors[`penalty_${rule.id}_points`] = '减分点数必须是负整数';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 编辑规则
  const startEditRule = (ruleId: string) => {
    setRules(rules.map(r => r.id === ruleId ? { ...r, isEditing: true } : r));
  };

  const cancelEditRule = (ruleId: string) => {
    setRules(rules.map(r => r.id === ruleId ? { ...r, isEditing: false } : r));
    setValidationErrors({});
  };

  const saveRule = async (rule: EditingRule) => {
    if (!validateRule(rule)) return;
    
    try {
      // 调用 tRPC API 保存到数据库
      await updateRuleMutation.mutateAsync({
        ruleId: rule.id,
        title: rule.name,
        description: rule.description,
        weight: rule.weight,
      });
      
      setRules(rules.map(r => r.id === rule.id ? { ...rule, isEditing: false } : r));
      setSuccessMessage('规则已保存');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setValidationErrors({ [`rule_${rule.id}_save`]: '保存失败，请重试' });
    }
  };

  const updateRuleField = (ruleId: string, field: string, value: any) => {
    setRules(rules.map(r => r.id === ruleId ? { ...r, [field]: value } : r));
  };

  // 编辑加分规则
  const startEditBonusRule = (ruleId: string) => {
    setBonusRules(bonusRules.map(r => r.id === ruleId ? { ...r, isEditing: true } : r));
  };

  const cancelEditBonusRule = (ruleId: string) => {
    setBonusRules(bonusRules.map(r => r.id === ruleId ? { ...r, isEditing: false } : r));
    setValidationErrors({});
  };

  const saveBonusRule = async (rule: EditingBonusRule) => {
    if (!validateBonusRule(rule)) return;
    
    try {
      // 调用 tRPC API 保存到数据库
      await updateBonusRuleMutation.mutateAsync({
        ruleId: rule.id,
        criteria: rule.name,
        minPoints: rule.points,
        description: rule.description,
      });
      
      setBonusRules(bonusRules.map(r => r.id === rule.id ? { ...rule, isEditing: false } : r));
      setSuccessMessage('规则已保存');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setValidationErrors({ [`bonus_${rule.id}_save`]: '保存失败，请重试' });
    }
  };

  const updateBonusRuleField = (ruleId: string, field: string, value: any) => {
    setBonusRules(bonusRules.map(r => r.id === ruleId ? { ...r, [field]: value } : r));
  };

  // 编辑减分规则
  const startEditPenaltyRule = (ruleId: string) => {
    setPenaltyRules(penaltyRules.map(r => r.id === ruleId ? { ...r, isEditing: true } : r));
  };

  const cancelEditPenaltyRule = (ruleId: string) => {
    setPenaltyRules(penaltyRules.map(r => r.id === ruleId ? { ...r, isEditing: false } : r));
    setValidationErrors({});
  };

  const savePenaltyRule = async (rule: EditingPenaltyRule) => {
    if (!validatePenaltyRule(rule)) return;
    
    try {
      // 调用 tRPC API 保存到数据库
      await updatePenaltyRuleMutation.mutateAsync({
        ruleId: rule.id,
        criteria: rule.name,
        minPoints: rule.points,
        description: rule.description,
      });
      
      setPenaltyRules(penaltyRules.map(r => r.id === rule.id ? { ...rule, isEditing: false } : r));
      setSuccessMessage('规则已保存');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      setValidationErrors({ [`penalty_${rule.id}_save`]: '保存失败，请重试' });
    }
  };

  const updatePenaltyRuleField = (ruleId: string, field: string, value: any) => {
    setPenaltyRules(penaltyRules.map(r => r.id === ruleId ? { ...r, [field]: value } : r));
  };

  return (
    <div className="bg-slate-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">绩效规则管理</h1>
        <p className="text-gray-600">管理绩效评分维度、加减分规则和等级划分</p>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mx-6 mt-4">
          <p className="text-green-700">{successMessage}</p>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Performance Dimensions Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">评分维度规则</h2>
          </div>

          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                {!rule.isEditing ? (
                  <>
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
                        <button
                          className="text-blue-600 hover:text-blue-700 transition-colors p-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditRule(rule.id);
                          }}
                        >
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
                  </>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        规则名称
                      </label>
                      <input
                        type="text"
                        value={rule.name}
                        onChange={(e) => updateRuleField(rule.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {validationErrors[`rule_${rule.id}_name`] && (
                        <p className="text-red-600 text-sm mt-1">{validationErrors[`rule_${rule.id}_name`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        描述
                      </label>
                      <textarea
                        value={rule.description}
                        onChange={(e) => updateRuleField(rule.id, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={2}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        权重 (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={rule.weight}
                        onChange={(e) => updateRuleField(rule.id, 'weight', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {validationErrors[`rule_${rule.id}_weight`] && (
                        <p className="text-red-600 text-sm mt-1">{validationErrors[`rule_${rule.id}_weight`]}</p>
                      )}
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => saveRule(rule)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Check size={18} />
                        保存
                      </button>
                      <button
                        onClick={() => cancelEditRule(rule.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        <X size={18} />
                        取消
                      </button>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bonusRules.map((bonus) => (
              <div key={bonus.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                {!bonus.isEditing ? (
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
                      <button
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                        onClick={() => startEditBonusRule(bonus.id)}
                      >
                        <Edit2 size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        规则名称
                      </label>
                      <input
                        type="text"
                        value={bonus.name}
                        onChange={(e) => updateBonusRuleField(bonus.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {validationErrors[`bonus_${bonus.id}_name`] && (
                        <p className="text-red-600 text-sm mt-1">{validationErrors[`bonus_${bonus.id}_name`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        加分点数
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={bonus.points}
                        onChange={(e) => updateBonusRuleField(bonus.id, 'points', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {validationErrors[`bonus_${bonus.id}_points`] && (
                        <p className="text-red-600 text-sm mt-1">{validationErrors[`bonus_${bonus.id}_points`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        描述
                      </label>
                      <textarea
                        value={bonus.description}
                        onChange={(e) => updateBonusRuleField(bonus.id, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={2}
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => saveBonusRule(bonus)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Check size={18} />
                        保存
                      </button>
                      <button
                        onClick={() => cancelEditBonusRule(bonus.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        <X size={18} />
                        取消
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Penalty Rules Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">绩效减分规则</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {penaltyRules.map((penalty) => (
              <div key={penalty.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                {!penalty.isEditing ? (
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
                      <button
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                        onClick={() => startEditPenaltyRule(penalty.id)}
                      >
                        <Edit2 size={18} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        规则名称
                      </label>
                      <input
                        type="text"
                        value={penalty.name}
                        onChange={(e) => updatePenaltyRuleField(penalty.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {validationErrors[`penalty_${penalty.id}_name`] && (
                        <p className="text-red-600 text-sm mt-1">{validationErrors[`penalty_${penalty.id}_name`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        减分点数
                      </label>
                      <input
                        type="number"
                        max="-1"
                        value={penalty.points}
                        onChange={(e) => updatePenaltyRuleField(penalty.id, 'points', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {validationErrors[`penalty_${penalty.id}_points`] && (
                        <p className="text-red-600 text-sm mt-1">{validationErrors[`penalty_${penalty.id}_points`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        描述
                      </label>
                      <textarea
                        value={penalty.description}
                        onChange={(e) => updatePenaltyRuleField(penalty.id, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={2}
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => savePenaltyRule(penalty)}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Check size={18} />
                        保存
                      </button>
                      <button
                        onClick={() => cancelEditPenaltyRule(penalty.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition-colors"
                      >
                        <X size={18} />
                        取消
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Grade Rules Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">等级划分规则</h2>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="bg-gray-50 px-4 py-3 text-left font-semibold text-gray-900">等级</th>
                    <th className="bg-gray-50 px-4 py-3 text-right font-semibold text-gray-900">最低分</th>
                    <th className="bg-gray-50 px-4 py-3 text-right font-semibold text-gray-900">最高分</th>
                    <th className="bg-gray-50 px-4 py-3 text-left font-semibold text-gray-900">等级名称</th>
                  </tr>
                </thead>
                <tbody>
                  {gradeRules.map((gradeRule, idx) => (
                    <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-blue-600">
                        {gradeRule.grade}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900">
                        {gradeRule.minScore}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-900">
                        {gradeRule.maxScore}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {gradeRule.level}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Rules Description */}
        <section className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">规则说明</h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• 权重总和应为 100%（日常工作表现 30% + 工作质量 25% + 个人目标完成 20% + 其他 25%）</li>
            <li>• 评分等级标准用于评分时的参考</li>
            <li>• 加分规则和减分规则用于调整最终绩效分数</li>
            <li>• 等级划分规则用于将最终分数转换为等级</li>
            <li>• 仅 Admin 和 HR 角色可以编辑规则</li>
            <li>• 规则变更将自动记录在操作日志中</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default function PerformanceRules() {
  return (
    <PerformanceLayout activeNav="rules">
      <PerformanceRulesContent />
    </PerformanceLayout>
  );
}
