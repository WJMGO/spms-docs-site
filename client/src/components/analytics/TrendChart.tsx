import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  Scatter,
  ScatterChart,
  ReferenceLine
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Target,
  Award,
  AlertTriangle,
  BarChart3,
  Activity,
  Download
} from "lucide-react";

interface TrendChartProps {
  trendData: any;
  isLoading: boolean;
}

// Mock data for development
const mockPeriods = ["月度", "季度", "年度"];
const mockMetrics = ["总体得分", "工作质量", "个人目标", "部门协作", "创新改进", "能力提升", "责任担当"];

const monthlyTrendData = [
  {
    month: "1月",
    总体得分: 84.5,
    工作质量: 85,
    个人目标: 82,
    部门协作: 80,
    创新改进: 83,
    能力提升: 81,
    责任担当: 85
  },
  {
    month: "2月",
    总体得分: 85.2,
    工作质量: 86,
    个人目标: 83,
    部门协作: 81,
    创新改进: 84,
    能力提升: 82,
    责任担当: 86
  },
  {
    month: "3月",
    总体得分: 86.1,
    工作质量: 87,
    个人目标: 84,
    部门协作: 82,
    创新改进: 85,
    能力提升: 83,
    责任担当: 87
  },
  {
    month: "4月",
    总体得分: 86.8,
    工作质量: 88,
    个人目标: 85,
    部门协作: 83,
    创新改进: 86,
    能力提升: 84,
    责任担当: 88
  },
  {
    month: "5月",
    总体得分: 87.5,
    工作质量: 89,
    个人目标: 86,
    部门协作: 84,
    创新改进: 87,
    能力提升: 85,
    责任担当: 89
  },
  {
    month: "6月",
    总体得分: 88.2,
    工作质量: 90,
    个人目标: 87,
    部门协作: 85,
    创新改进: 88,
    能力提升: 86,
    责任担当: 90
  }
];

const quarterlyTrendData = [
  {
    quarter: "2024-Q1",
    总体得分: 85.3,
    工作质量: 86.0,
    个人目标: 83.0,
    部门协作: 81.0,
    创新改进: 84.0,
    能力提升: 82.0,
    责任担当: 86.0
  },
  {
    quarter: "2024-Q2",
    总体得分: 86.8,
    工作质量: 88.0,
    个人目标: 85.0,
    部门协作: 83.0,
    创新改进: 86.0,
    能力提升: 84.0,
    责任担当: 88.0
  },
  {
    quarter: "2024-Q3",
    总体得分: 87.6,
    工作质量: 89.0,
    个人目标: 86.0,
    部门协作: 84.0,
    创新改进: 87.0,
    能力提升: 85.0,
    责任担当: 89.0
  },
  {
    quarter: "2024-Q4",
    总体得分: 88.5,
    工作质量: 90.0,
    个人目标: 87.0,
    部门协作: 85.0,
    创新改进: 88.0,
    能力提升: 86.0,
    责任担当: 90.0
  }
];

const departmentTrendData = [
  {
    month: "1月",
    技术部: 85.2,
    销售部: 84.5,
    市场部: 82.3,
    人力资源部: 84.8,
    财务部: 85.0
  },
  {
    month: "2月",
    技术部: 85.8,
    销售部: 84.8,
    市场部: 82.8,
    人力资源部: 85.2,
    财务部: 85.3
  },
  {
    month: "3月",
    技术部: 86.5,
    销售部: 85.2,
    市场部: 83.2,
    人力资源部: 85.8,
    财务部: 85.8
  },
  {
    month: "4月",
    技术部: 87.2,
    销售部: 86.0,
    市场部: 83.8,
    人力资源部: 86.2,
    财务部: 86.2
  },
  {
    month: "5月",
    技术部: 87.8,
    销售部: 86.8,
    市场部: 84.2,
    人力资源部: 86.8,
    财务部: 86.5
  },
  {
    month: "6月",
    技术部: 88.5,
    销售部: 87.2,
    市场部: 84.8,
    人力资源部: 87.2,
    财务部: 87.0
  }
];

const performanceComparison = [
  {
    period: "当前",
    target: 90,
    actual: 88.2,
    gap: -1.8,
    status: "below"
  },
  {
    period: "上月",
    target: 90,
    actual: 87.5,
    gap: -2.5,
    status: "below"
  },
  {
    period: "去年同期",
    target: 85,
    actual: 84.5,
    gap: -0.5,
    status: "below"
  }
];

export function TrendChart({ trendData, isLoading }: TrendChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("monthly");
  const [selectedMetrics, setSelectedMetrics] = useState(["总体得分", "工作质量", "个人目标"]);
  const [compareMode, setCompareMode] = useState(false);

  // Use mock data for development
  const monthlyData = isLoading ? [] : monthlyTrendData;
  const quarterlyData = isLoading ? [] : quarterlyTrendData;
  const deptTrendData = isLoading ? [] : departmentTrendData;
  const comparisonData = isLoading ? [] : performanceComparison;

  const currentData = selectedPeriod === "monthly" ? monthlyData : quarterlyData;

  const getTrendIcon = (current: number, previous: number) => {
    const diff = current - previous;
    if (diff > 0) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    } else if (diff < 0) {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    } else {
      return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardContent className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 趋势概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <span>本月得分</span>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">88.2</div>
            <div className="text-xs text-muted-foreground">
              较上月 +0.7 分
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">目标达成率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.0%</div>
            <div className="text-xs text-muted-foreground">
              较目标差 1.8 分
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">最佳维度</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">工作质量</div>
            <div className="text-xs text-muted-foreground">
              90 分
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">待改进维度</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">创新改进</div>
            <div className="text-xs text-muted-foreground">
              88 分
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 时间选择和维度选择 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>趋势分析</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                导出趋势
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">时间范围：</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">月度</SelectItem>
                  <SelectItem value="quarterly">季度</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">对比模式：</label>
              <Button
                variant={compareMode ? "default" : "outline"}
                size="sm"
                onClick={() => setCompareMode(!compareMode)}
              >
                部门对比
              </Button>
            </div>
          </div>

          {/* 维度选择 */}
          <div className="flex flex-wrap gap-2 mt-4">
            {mockMetrics.map((metric) => (
              <Button
                key={metric}
                variant={selectedMetrics.includes(metric) ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  if (selectedMetrics.includes(metric)) {
                    setSelectedMetrics(selectedMetrics.filter(m => m !== metric));
                  } else {
                    setSelectedMetrics([...selectedMetrics, metric]);
                  }
                }}
              >
                {metric}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 主要趋势图 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            {selectedPeriod === "monthly" ? "月度趋势" : "季度趋势"}
          </CardTitle>
          <CardDescription>
            各维度得分变化趋势
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={selectedPeriod === "monthly" ? "month" : "quarter"} />
              <YAxis domain={[80, 95]} />
              <Tooltip content={<CustomTooltip />} />
              {selectedMetrics.map((metric, index) => (
                <Line
                  key={metric}
                  type="monotone"
                  dataKey={metric}
                  stroke={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#6366f1"][index]}
                  strokeWidth={2}
                  name={metric}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 部门对比趋势 */}
      {compareMode && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              部门对比趋势
            </CardTitle>
            <CardDescription>
              各部门月度得分变化对比
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={deptTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[80, 90]} />
                <Tooltip />
                {["技术部", "销售部", "市场部", "人力资源部", "财务部"].map((dept, index) => (
                  <Area
                    key={dept}
                    type="monotone"
                    dataKey={dept}
                    stackId="1"
                    stroke={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][index]}
                    fill={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][index]}
                    fillOpacity={0.6}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* 目标达成情况 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            目标达成分析
          </CardTitle>
          <CardDescription>
            当前表现与目标的对比情况
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {comparisonData.map((item, index) => (
              <div key={item.period} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    item.status === "below" ? "bg-red-500" : "bg-green-500"
                  }`}></div>
                  <div>
                    <div className="font-medium">{item.period}</div>
                    <div className="text-sm text-muted-foreground">目标: {item.target} | 实际: {item.actual}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={item.gap >= 0 ? "default" : "destructive"}>
                    {item.gap >= 0 ? "+" : ""}{item.gap}
                  </Badge>
                  {getTrendIcon(item.actual, index > 0 ? comparisonData[index - 1].actual : item.actual)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 预测分析 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            趋势预测
          </CardTitle>
          <CardDescription>
            基于历史数据的未来趋势预测
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[80, 95]} />
              <Tooltip />
              <Bar dataKey="总体得分" fill="#3b82f6" name="实际得分" />
              <Line
                type="monotone"
                dataKey="预测"
                stroke="#ef4444"
                strokeDasharray="5 5"
                name="预测趋势"
                dot={{ r: 4 }}
              />
              <ReferenceLine y={90} stroke="#10b981" strokeDasharray="3 3" name="目标线" />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}