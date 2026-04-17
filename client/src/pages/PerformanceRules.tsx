import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronUp, Edit, Download, Plus, Save, X } from "lucide-react";
import { trpc } from "@/trpc";
// import { useAuth } from "@/_core/hooks/useAuth";

export default function PerformanceRules() {
  // const { user } = useAuth();
  const user = null; // 临时使用 null，后续可以集成真实的 useAuth
  const [expandedRules, setExpandedRules] = useState<string[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<string | null>(null);

  // 获取规则数据
  const { data: rulesData, isLoading: rulesLoading } = trpc.performanceRules.getRules.useQuery();
  const { data: bonusRulesData, isLoading: bonusLoading } = trpc.performanceRules.getBonusRules.useQuery();
  const { data: penaltyRulesData, isLoading: penaltyLoading } = trpc.performanceRules.getPenaltyRules.useQuery();
  const { data: gradeRulesData, isLoading: gradeLoading } = trpc.performanceRules.getGradeRules.useQuery();

  // 编辑规则的 mutation
  const updateRuleMutation = trpc.performanceRules.updateRule.useMutation({
    onSuccess: () => {
      console.log("规则已更新");
      setEditingRuleId(null);
    },
    onError: (error: any) => {
      console.error("更新失败:", error);
    },
  });

  const updateBonusRuleMutation = trpc.performanceRules.updateBonusRule.useMutation({
    onSuccess: () => {
      console.log("加分规则已更新");
    },
    onError: (error: any) => {
      console.error("更新失败:", error);
    },
  });

  const updatePenaltyRuleMutation = trpc.performanceRules.updatePenaltyRule.useMutation({
    onSuccess: () => {
      console.log("减分规则已更新");
    },
    onError: (error: any) => {
      console.error("更新失败:", error);
    },
  });

  const updateGradeRuleMutation = trpc.performanceRules.updateGradeRule.useMutation({
    onSuccess: () => {
      console.log("等级规则已更新");
    },
    onError: (error: any) => {
      console.error("更新失败:", error);
    },
  });

  // 检查是否有编辑权限
  const canEdit = false; // 临时禁用编辑，后续集成权限检查

  const toggleRule = (ruleId: string) => {
    setExpandedRules((prev) =>
      prev.includes(ruleId) ? prev.filter((id) => id !== ruleId) : [...prev, ruleId]
    );
  };

  // 使用 Mock 数据作为备份
  const performanceRules = rulesData || [
    {
      id: "daily-work",
      title: "日常工作表现（40%）",
      weight: 40,
      description: "评估员工日常工作的完成情况和工作态度",
      criteria: [
        {
          level: "优秀（90-100分）",
          description: "工作完成度高，主动承担工作，工作态度积极",
          examples: ["按时完成所有工作任务", "主动承担额外工作", "工作质量高"],
        },
        {
          level: "良好（80-89分）",
          description: "工作完成度较好，工作态度良好",
          examples: ["按时完成工作任务", "工作质量较好", "配合度高"],
        },
      ],
    },
  ];

  const bonusRules = bonusRulesData || [
    {
      id: "bonus",
      title: "绩效加分规则",
      type: "bonus",
      items: [
        { criteria: "获得公司表彰", points: "5-10分" },
        { criteria: "完成重点项目", points: "3-5分" },
      ],
    },
  ];

  const penaltyRules = penaltyRulesData || [
    {
      id: "penalty",
      title: "绩效减分规则",
      type: "penalty",
      items: [
        { criteria: "严重迟到缺勤", points: "-5分" },
        { criteria: "工作失误导致损失", points: "-3-5分" },
      ],
    },
  ];

  const gradeRules = gradeRulesData || [
    { grade: "优秀", range: "90-100分", percentage: "15%", benefits: "年终奖励、晋升优先" },
    { grade: "良好", range: "80-89分", percentage: "35%", benefits: "年终奖励、培训机会" },
  ];

  const handleRuleUpdate = (ruleId: string, updatedData: any) => {
    updateRuleMutation.mutate({
      ruleId,
      ...updatedData,
    });
  };

  if (rulesLoading || bonusLoading || penaltyLoading || gradeLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="text-center">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">绩效评分规则</h1>
        <p className="text-slate-600">
          本页面详细说明了 SPMS 系统的绩效评分标准和规则，用于指导员工绩效评估工作
        </p>
      </div>

      {/* 快速操作 */}
      <div className="flex gap-4 mb-8">
        <Button variant="default" className="gap-2">
          <Download size={18} />
          下载规则文档
        </Button>
        {canEdit && (
          <>
            <Button
              variant={editMode ? "destructive" : "outline"}
              className="gap-2"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? (
                <>
                  <X size={18} />
                  取消编辑
                </>
              ) : (
                <>
                  <Edit size={18} />
                  编辑规则
                </>
              )}
            </Button>
            <Button variant="outline" className="gap-2">
              <Plus size={18} />
              新增规则
            </Button>
          </>
        )}
        {!canEdit && (
          <div className="text-sm text-slate-600 flex items-center">
            仅 Admin 和 HR 可以编辑规则
          </div>
        )}
      </div>

      {/* 编辑模式提示 */}
      {editMode && canEdit && (
        <div className="mb-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ✏️ 现在处于编辑模式，您可以修改规则内容。修改后点击保存按钮确认更改。
          </p>
        </div>
      )}

      {/* 评分维度规则 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">评分维度规则</h2>
        <div className="grid gap-4">
          {performanceRules.map((rule: any) => (
            <Card key={rule.id} className="bg-white border-0 shadow-sm overflow-hidden">
              <button
                onClick={() => toggleRule(rule.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-1 text-left">
                    {editMode && editingRuleId === rule.id ? (
                      <div className="space-y-3">
                        <Input
                          defaultValue={rule.title}
                          placeholder="规则标题"
                          className="text-lg font-semibold"
                        />
                        <Textarea
                          defaultValue={rule.description}
                          placeholder="规则描述"
                          className="text-sm"
                        />
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            defaultValue={rule.weight}
                            placeholder="权重 (%)"
                            className="w-24"
                          />
                          <Button
                            size="sm"
                            className="gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRuleUpdate(rule.id, {
                                title: rule.title,
                                weight: rule.weight,
                                description: rule.description,
                              });
                              setEditingRuleId(null);
                            }}
                          >
                            <Save size={16} />
                            保存
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingRuleId(null);
                            }}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-lg font-semibold text-slate-900">{rule.title}</h3>
                        <p className="text-sm text-slate-600 mt-1">{rule.description}</p>
                      </>
                    )}
                  </div>
                  <Badge variant="secondary" className="ml-4">
                    权重：{rule.weight}%
                  </Badge>
                </div>
                {!editMode && (
                  <>
                    {expandedRules.includes(rule.id) ? (
                      <ChevronUp size={20} className="text-slate-600" />
                    ) : (
                      <ChevronDown size={20} className="text-slate-600" />
                    )}
                  </>
                )}
              </button>

              {expandedRules.includes(rule.id) && !editMode && (
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
                  <div className="space-y-4">
                    {rule.criteria?.map((criterion: any, idx: number) => (
                      <div key={idx} className="bg-white p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900 mb-2">{criterion.level}</h4>
                        <p className="text-sm text-slate-600 mb-2">{criterion.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {criterion.examples?.map((example: string, exIdx: number) => (
                            <Badge key={exIdx} variant="outline" className="text-xs">
                              {example}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* 加减分规则 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">加减分规则</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* 加分规则 */}
          <Card className="bg-white border-0 shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4 text-green-900">绩效加分规则</h3>
            <div className="space-y-3">
              {bonusRules[0]?.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-700">{item.criteria}</span>
                  <Badge variant="default" className="ml-2">
                    {item.points}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* 减分规则 */}
          <Card className="bg-white border-0 shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4 text-red-900">绩效减分规则</h3>
            <div className="space-y-3">
              {penaltyRules[0]?.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-700">{item.criteria}</span>
                  <Badge variant="destructive" className="ml-2">
                    {item.points}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* 等级划分规则 */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">等级划分规则</h2>
        <Card className="bg-white border-0 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    等级
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    分数范围
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    占比
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                    对应待遇
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {gradeRules.map((rule: any, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <Badge
                        variant={
                          rule.grade === "优秀"
                            ? "default"
                            : rule.grade === "不及格"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {rule.grade}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900 font-medium">{rule.range}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{rule.percentage}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{rule.benefits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* 说明文本 */}
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">说明</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• 绩效评分总分为100分，由四个维度组成</li>
          <li>• 加减分规则可根据实际情况灵活应用，最终分数不超过100分</li>
          <li>• 等级划分比例为参考值，具体比例由公司根据实际情况调整</li>
          <li>• 所有绩效评分规则由人力资源部门负责解释和更新</li>
          {canEdit && <li>• 您有权限编辑这些规则，请谨慎操作</li>}
        </ul>
      </div>
    </div>
  );
}
