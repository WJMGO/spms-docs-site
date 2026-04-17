import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Edit, Download, Plus } from "lucide-react";

export default function PerformanceRules() {
  const [expandedRules, setExpandedRules] = useState<string[]>([]);

  const toggleRule = (ruleId: string) => {
    setExpandedRules((prev) =>
      prev.includes(ruleId) ? prev.filter((id) => id !== ruleId) : [...prev, ruleId]
    );
  };

  // 绩效评分规则
  const performanceRules = [
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
        {
          level: "一般（70-79分）",
          description: "工作完成度一般，基本完成工作任务",
          examples: ["基本完成工作任务", "工作质量一般", "偶有迟到"],
        },
        {
          level: "及格（60-69分）",
          description: "工作完成度不理想，需要改进",
          examples: ["工作任务完成不及时", "工作质量不稳定", "需要督促"],
        },
        {
          level: "不及格（<60分）",
          description: "工作完成度差，存在严重问题",
          examples: ["工作任务未完成", "工作质量差", "经常迟到缺勤"],
        },
      ],
    },
    {
      id: "work-quality",
      title: "工作质量（30%）",
      weight: 30,
      description: "评估员工工作成果的质量和专业水平",
      criteria: [
        {
          level: "优秀（90-100分）",
          description: "工作成果质量优秀，专业水平高",
          examples: ["工作成果获得认可", "专业能力强", "创新意识强"],
        },
        {
          level: "良好（80-89分）",
          description: "工作成果质量良好，专业水平较高",
          examples: ["工作成果质量好", "专业能力较强", "有一定创新"],
        },
        {
          level: "一般（70-79分）",
          description: "工作成果质量一般，专业水平中等",
          examples: ["工作成果质量一般", "专业能力一般", "按要求完成"],
        },
        {
          level: "及格（60-69分）",
          description: "工作成果质量一般，需要改进",
          examples: ["工作成果有缺陷", "专业能力不足", "需要指导"],
        },
        {
          level: "不及格（<60分）",
          description: "工作成果质量差，专业能力不足",
          examples: ["工作成果质量差", "专业能力不足", "需要重做"],
        },
      ],
    },
    {
      id: "personal-goal",
      title: "个人目标完成度（20%）",
      weight: 20,
      description: "评估员工个人设定目标的完成情况",
      criteria: [
        {
          level: "优秀（90-100分）",
          description: "目标完成度超过100%",
          examples: ["完成目标110%以上", "超额完成目标", "创造额外价值"],
        },
        {
          level: "良好（80-89分）",
          description: "目标完成度90-100%",
          examples: ["完成目标90-100%", "目标完成良好", "有超额部分"],
        },
        {
          level: "一般（70-79分）",
          description: "目标完成度80-89%",
          examples: ["完成目标80-89%", "基本完成目标", "略有不足"],
        },
        {
          level: "及格（60-69分）",
          description: "目标完成度70-79%",
          examples: ["完成目标70-79%", "目标完成不足", "需要改进"],
        },
        {
          level: "不及格（<60分）",
          description: "目标完成度低于70%",
          examples: ["完成目标<70%", "目标完成度差", "严重不足"],
        },
      ],
    },
    {
      id: "department-review",
      title: "部门互评（10%）",
      weight: 10,
      description: "由部门同事进行的互相评价",
      criteria: [
        {
          level: "优秀（90-100分）",
          description: "获得同事高度认可",
          examples: ["团队合作好", "沟通能力强", "受欢迎"],
        },
        {
          level: "良好（80-89分）",
          description: "获得同事认可",
          examples: ["团队合作较好", "沟通能力较强", "关系融洽"],
        },
        {
          level: "一般（70-79分）",
          description: "获得同事一般认可",
          examples: ["团队合作一般", "沟通能力一般", "关系一般"],
        },
        {
          level: "及格（60-69分）",
          description: "获得同事有限认可",
          examples: ["团队合作不足", "沟通能力不足", "有冲突"],
        },
        {
          level: "不及格（<60分）",
          description: "获得同事低评价",
          examples: ["团队合作差", "沟通能力差", "关系紧张"],
        },
      ],
    },
  ];

  // 绩效加减分规则
  const bonusRules = [
    {
      id: "bonus",
      title: "绩效加分规则",
      type: "bonus",
      items: [
        { criteria: "获得公司表彰", points: "5-10分" },
        { criteria: "完成重点项目", points: "3-5分" },
        { criteria: "获得客户好评", points: "2-3分" },
        { criteria: "创新建议被采纳", points: "1-2分" },
        { criteria: "参加培训并通过", points: "1分" },
      ],
    },
    {
      id: "penalty",
      title: "绩效减分规则",
      type: "penalty",
      items: [
        { criteria: "严重迟到缺勤", points: "-5分" },
        { criteria: "工作失误导致损失", points: "-3-5分" },
        { criteria: "客户投诉", points: "-2-3分" },
        { criteria: "违反公司规定", points: "-1-2分" },
        { criteria: "安全事故", points: "-5-10分" },
      ],
    },
  ];

  // 等级划分规则
  const gradeRules = [
    { grade: "优秀", range: "90-100分", percentage: "15%", benefits: "年终奖励、晋升优先" },
    { grade: "良好", range: "80-89分", percentage: "35%", benefits: "年终奖励、培训机会" },
    { grade: "一般", range: "70-79分", percentage: "35%", benefits: "基本年终奖励" },
    { grade: "及格", range: "60-69分", percentage: "12%", benefits: "无额外奖励" },
    { grade: "不及格", range: "<60分", percentage: "3%", benefits: "可能面临调岗或解聘" },
  ];

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
        <Button variant="outline" className="gap-2">
          <Edit size={18} />
          编辑规则
        </Button>
        <Button variant="outline" className="gap-2">
          <Plus size={18} />
          新增规则
        </Button>
      </div>

      {/* 评分维度规则 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">评分维度规则</h2>
        <div className="grid gap-4">
          {performanceRules.map((rule) => (
            <Card key={rule.id} className="bg-white border-0 shadow-sm overflow-hidden">
              <button
                onClick={() => toggleRule(rule.id)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-1 text-left">
                    <h3 className="text-lg font-semibold text-slate-900">{rule.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{rule.description}</p>
                  </div>
                  <Badge variant="secondary" className="ml-4">
                    权重：{rule.weight}%
                  </Badge>
                </div>
                {expandedRules.includes(rule.id) ? (
                  <ChevronUp size={20} className="text-slate-600" />
                ) : (
                  <ChevronDown size={20} className="text-slate-600" />
                )}
              </button>

              {expandedRules.includes(rule.id) && (
                <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
                  <div className="space-y-4">
                    {rule.criteria.map((criterion, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-900 mb-2">{criterion.level}</h4>
                        <p className="text-sm text-slate-600 mb-2">{criterion.description}</p>
                        <div className="flex flex-wrap gap-2">
                          {criterion.examples.map((example, exIdx) => (
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
          {bonusRules.map((bonusRule) => (
            <Card key={bonusRule.id} className="bg-white border-0 shadow-sm p-6">
              <h3
                className={`text-lg font-semibold mb-4 ${
                  bonusRule.type === "bonus" ? "text-green-900" : "text-red-900"
                }`}
              >
                {bonusRule.title}
              </h3>
              <div className="space-y-3">
                {bonusRule.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <span className="text-sm text-slate-700">{item.criteria}</span>
                    <Badge
                      variant={bonusRule.type === "bonus" ? "default" : "destructive"}
                      className="ml-2"
                    >
                      {item.points}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          ))}
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
                {gradeRules.map((rule, idx) => (
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
        </ul>
      </div>
    </div>
  );
}
