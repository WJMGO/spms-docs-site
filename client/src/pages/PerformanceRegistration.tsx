import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, TrendingUp, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

interface ObjectiveItem {
  id: string;
  type: "KPI" | "Task";
  objective: string;
  keyResult: string;
  dueDate: string;
  status: "completed" | "in-progress" | "pending";
  score: number;
}

interface QualityMetric {
  name: string;
  icon: string;
  value: number;
  label: string;
  code: string;
}

interface PerformanceItem {
  id: string;
  name: string;
  description: string;
  score: number;
  type: "bonus" | "penalty";
}

export default function PerformanceRegistration() {
  const [objectives, setObjectives] = useState<ObjectiveItem[]>([
    {
      id: "1",
      type: "KPI",
      objective: "关键指标 (KPI)",
      keyResult: "云原生架构迁移",
      dueDate: "12-20",
      status: "completed",
      score: 45.0,
    },
    {
      id: "2",
      type: "Task",
      objective: "关键要项 (Task)",
      keyResult: "安全审计优化",
      dueDate: "12-15",
      status: "completed",
      score: 30.0,
    },
  ]);

  const [qualityMetrics] = useState<QualityMetric[]>([
    { name: "CODE REVIEW", code: "代码走查", icon: "🔍", value: 24, label: "代码走查次数" },
    { name: "AUDIT", code: "审计", icon: "📋", value: 12, label: "代码审核通过" },
    { name: "BUG DEFLECTION", code: "Bug打回率", icon: "🐛", value: 3, label: "Bug打回打回" },
    { name: "DESIGN", code: "设计", icon: "🏗️", value: 8, label: "设计评审参与" },
  ]);

  const [bonusItems, setBonusItems] = useState<PerformanceItem[]>([
    {
      id: "b1",
      name: "培养新人",
      description: "担任新人师傅，指导入职新人，并在月度用用期间进行",
      score: 5.0,
      type: "bonus",
    },
    {
      id: "b2",
      name: "技术分享",
      description: "主讲《云原生安全架构》部门内技术分享，参与人数50+，评评率98%。",
      score: 8.0,
      type: "bonus",
    },
  ]);

  const [penaltyItems, setPenaltyItems] = useState<PerformanceItem[]>([
    {
      id: "p1",
      name: "技术失误",
      description: "无",
      score: 0.0,
      type: "penalty",
    },
    {
      id: "p2",
      name: "管理失误",
      description: "参与权限记录（1次）",
      score: -0.5,
      type: "penalty",
    },
    {
      id: "p3",
      name: "质量异常",
      description: "无",
      score: 0.0,
      type: "penalty",
    },
  ]);

  const [forecastScore] = useState(95.8);
  const [scoreChange] = useState(2.4);

  const objectiveScore = objectives.reduce((sum, obj) => sum + obj.score, 0);
  const bonusScore = bonusItems.reduce((sum, item) => sum + item.score, 0);
  const penaltyScore = penaltyItems.reduce((sum, item) => sum + item.score, 0);
  const totalScore = objectiveScore + bonusScore + penaltyScore;

  const handleAddBonus = () => {
    const newBonus: PerformanceItem = {
      id: `b${Date.now()}`,
      name: "新增加分项",
      description: "",
      score: 0,
      type: "bonus",
    };
    setBonusItems([...bonusItems, newBonus]);
  };

  const handleDeleteBonus = (id: string) => {
    setBonusItems(bonusItems.filter((item) => item.id !== id));
  };

  const handleDeletePenalty = (id: string) => {
    setPenaltyItems(penaltyItems.filter((item) => item.id !== id));
  };

  const handleSave = () => {
    toast.success("绩效数据已保存");
  };

  const handleSubmit = () => {
    toast.success("绩效数据已提交");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 顶部信息区 */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">12月绩效登记</h1>
              <div className="flex items-center gap-2 text-slate-600">
                <span>📅</span>
                <span>考核周期: 11月26日 - 12月25日</span>
              </div>
            </div>
          </div>

          {/* 预测分数卡 */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">当预测总分 (Forecast Score)</p>
                <p className="text-5xl font-bold">95.8</p>
              </div>
              <div className="flex items-center gap-2 bg-white bg-opacity-20 rounded-lg px-3 py-2">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-semibold">高于上月 2.4%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 个人月度目标 */}
        <Card className="mb-8 border-0 shadow-sm">
          <CardHeader className="bg-slate-100 border-b-0 pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">个人月度目标</CardTitle>
              <span className="text-xs text-slate-500">更新于2小时前</span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200">
                    <th className="px-6 py-3 text-left text-sm font-medium text-slate-700">考核维度</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-slate-700">月度目标</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-slate-700">关键结果 (KRS)</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-slate-700">截止日期</th>
                    <th className="px-6 py-3 text-center text-sm font-medium text-slate-700">完成状态</th>
                    <th className="px-6 py-3 text-right text-sm font-medium text-slate-700">直评分数</th>
                  </tr>
                </thead>
                <tbody>
                  {objectives.map((obj, idx) => (
                    <tr
                      key={obj.id}
                      className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}
                    >
                      <td className="px-6 py-4 text-sm text-slate-900 font-medium">{obj.type}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{obj.objective}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{obj.keyResult}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{obj.dueDate}</td>
                      <td className="px-6 py-4 text-center">
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 rounded-full">
                          已完成
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-blue-600">
                        {obj.score.toFixed(1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* 工作质量数据 */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">工作质量数据</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {qualityMetrics.map((metric, idx) => (
              <Card key={idx} className="border-0 shadow-sm border-l-4 border-l-blue-600">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">{metric.icon}</div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        {metric.name}
                      </p>
                      <p className="text-3xl font-bold text-slate-900">{metric.value}</p>
                      <p className="text-xs text-slate-600 mt-1">{metric.label}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 绩效加分项 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">绩效加分项</h2>
            <Button
              onClick={handleAddBonus}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              新增加分项
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bonusItems.map((item) => (
              <Card key={item.id} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-1">{item.name}</h3>
                      <p className="text-sm text-slate-600">{item.description}</p>
                    </div>
                    <Button
                      onClick={() => handleDeleteBonus(item.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-green-600">+{item.score.toFixed(1)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 绩效扣分项 */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4">绩效扣分项</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {penaltyItems.map((item) => (
              <Card key={item.id} className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-1">{item.name}</h3>
                      <p className="text-sm text-slate-600">{item.description}</p>
                    </div>
                    <Button
                      onClick={() => handleDeletePenalty(item.id)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="text-right">
                    <span className={`text-2xl font-bold ${item.score < 0 ? "text-red-600" : "text-slate-600"}`}>
                      {item.score > 0 ? "+" : ""}{item.score.toFixed(1)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* 总分汇总 */}
        <Card className="mb-8 border-0 shadow-sm bg-blue-50">
          <CardContent className="p-6">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-slate-600 mb-1">目标完成分</p>
                <p className="text-2xl font-bold text-slate-900">{objectiveScore.toFixed(1)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">加分项总计</p>
                <p className="text-2xl font-bold text-green-600">+{bonusScore.toFixed(1)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">扣分项总计</p>
                <p className="text-2xl font-bold text-red-600">{penaltyScore.toFixed(1)}</p>
              </div>
              <div className="border-l border-slate-300 pl-4">
                <p className="text-sm text-slate-600 mb-1">最终得分</p>
                <p className="text-3xl font-bold text-blue-600">{totalScore.toFixed(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 进度条和操作按钮 */}
        <div className="flex items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">资料完整度: 75%</span>
              <span className="text-xs text-slate-500 cursor-pointer hover:text-slate-700">取消修改</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: "75%" }}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              variant="outline"
              className="gap-2"
            >
              <Save className="w-4 h-4" />
              保存
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
            >
              提交并转管理交 →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
