import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, TrendingUp, Trash2, Save } from "lucide-react";
import { toast } from "sonner";
import PeriodSelector from "@/components/PeriodSelector";
import {
  AssessmentPeriod,
  ASSESSMENT_PERIODS,
  getPerformanceDataForPeriod,
  ObjectiveItem,
  QualityMetric,
  PerformanceItem,
} from "../../../shared/assessment-periods";

export default function PerformanceRegistration() {
  // 获取当前周期（12月）
  const currentPeriod = ASSESSMENT_PERIODS.find((p) => p.isCurrentPeriod) || ASSESSMENT_PERIODS[11];
  const [selectedPeriod, setSelectedPeriod] = useState<AssessmentPeriod>(currentPeriod);

  const [forecastScore, setForecastScore] = useState(95.8);
  const [scoreChange, setScoreChange] = useState(2.4);
  const [objectives, setObjectives] = useState<ObjectiveItem[]>([]);
  const [qualityMetrics, setQualityMetrics] = useState<QualityMetric[]>([]);
  const [bonusItems, setBonusItems] = useState<PerformanceItem[]>([]);
  const [penaltyItems, setPenaltyItems] = useState<PerformanceItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 当周期改变时，加载对应的数据
  useEffect(() => {
    setIsLoading(true);
    // 模拟异步加载数据
    setTimeout(() => {
      const periodData = getPerformanceDataForPeriod(selectedPeriod.id);
      setForecastScore(periodData.forecastScore);
      setScoreChange(periodData.scoreChange);
      setObjectives(periodData.objectives);
      setQualityMetrics(periodData.qualityMetrics);
      setBonusItems(periodData.bonusItems);
      setPenaltyItems(periodData.penaltyItems);
      setIsLoading(false);
    }, 300);
  }, [selectedPeriod]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">加载绩效数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 周期选择器 */}
        <PeriodSelector
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />

        {/* 预测分数卡 */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white shadow-lg mb-8">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm opacity-90 mb-1">当前预测总分 (Forecast Score)</p>
              <p className="text-5xl font-bold">{forecastScore}</p>
            </div>
            <div className="flex items-center gap-2 bg-white bg-opacity-20 rounded-lg px-3 py-2">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-semibold">高于上月 {scoreChange}%</span>
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
                        <Badge
                          className={`rounded-full ${
                            obj.status === "completed"
                              ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                              : obj.status === "in-progress"
                              ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {obj.status === "completed"
                            ? "已完成"
                            : obj.status === "in-progress"
                            ? "进行中"
                            : "待定"}
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
                    <span
                      className={`text-2xl font-bold ${
                        item.score < 0 ? "text-red-600" : "text-slate-600"
                      }`}
                    >
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
