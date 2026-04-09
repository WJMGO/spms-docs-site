import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from "recharts";
import {
  PieChart as PieChartIcon,
  BarChart3,
  Radar,
  Target,
  TrendingUp,
  Users,
  Award
} from "lucide-react";

interface DimensionChartsProps {
  dimensionData: any;
  isLoading: boolean;
}

// Mock data for development
const mockDimensionData = [
  {
    name: "工作质量",
    value: 92,
    avgScore: 87,
    rank: 1,
    trend: "up",
    color: "#3b82f6"
  },
  {
    name: "个人目标",
    value: 88,
    avgScore: 85,
    rank: 2,
    trend: "up",
    color: "#10b981"
  },
  {
    name: "部门协作",
    value: 85,
    avgScore: 82,
    rank: 3,
    trend: "stable",
    color: "#f59e0b"
  },
  {
    name: "创新改进",
    value: 82,
    avgScore: 80,
    rank: 4,
    trend: "down",
    color: "#ef4444"
  },
  {
    name: "能力提升",
    value: 80,
    avgScore: 78,
    rank: 5,
    trend: "stable",
    color: "#8b5cf6"
  },
  {
    name: "责任担当",
    value: 78,
    avgScore: 75,
    rank: 6,
    trend: "up",
    color: "#ec4899"
  }
];

const departmentComparison = [
  {
    department: "技术部",
    工作质量: 94,
    个人目标: 90,
    部门协作: 87,
    创新改进: 88,
    能力提升: 85,
    责任担当: 82
  },
  {
    department: "销售部",
    工作质量: 88,
    个人目标: 92,
    部门协作: 85,
    创新改进: 80,
    能力提升: 88,
    责任担当: 90
  },
  {
    department: "市场部",
    工作质量: 85,
    个人目标: 86,
    部门协作: 88,
    创新改进: 85,
    能力提升: 82,
    责任担当: 78
  }
];

const trendData = [
  { month: "1月", 工作质量: 85, 个人目标: 82, 部门协作: 80 },
  { month: "2月", 工作质量: 87, 个人目标: 84, 部门协作: 82 },
  { month: "3月", 工作质量: 89, 个人目标: 85, 部门协作: 84 },
  { month: "4月", 工作质量: 90, 个人目标: 86, 部门协作: 85 },
  { month: "5月", 工作质量: 91, 个人目标: 87, 部门协作: 86 },
  { month: "6月", 工作质量: 92, 个人目标: 88, 部门协作: 87 }
];

export function DimensionCharts({ dimensionData, isLoading }: DimensionChartsProps) {
  // Use mock data for development
  const data = isLoading ? [] : mockDimensionData;
  const deptData = isLoading ? [] : departmentComparison;
  const trendChartData = isLoading ? [] : trendData;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-3 w-3 text-green-600" />;
      case "down":
        return <TrendingUp className="h-3 w-3 text-red-600 transform rotate-180" />;
      default:
        return <div className="h-3 w-3 bg-gray-400 rounded-full"></div>;
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}%`}
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
      {/* 维度得分排名 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                六维度得分排名
              </CardTitle>
              <CardDescription>
                各绩效维度的平均得分及排名情况
              </CardDescription>
            </div>
            <Badge variant="outline">
              更新时间: 2024-12-31
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.map((dimension, index) => (
              <div key={dimension.name} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index < 3 ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-600"
                    }`}>
                      {dimension.rank}
                    </div>
                    <div>
                      <div className="font-medium">{dimension.name}</div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        平均: {dimension.avgScore}%
                        {getTrendIcon(dimension.trend)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold" style={{ color: dimension.color }}>
                      {dimension.value}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      较平均 {dimension.value > dimension.avgScore ? "+" : ""}{dimension.value - dimension.avgScore}%
                    </div>
                  </div>
                  <div className="w-24">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${dimension.value}%`, backgroundColor: dimension.color }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 图表展示 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 雷达图 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radar className="h-5 w-5" />
              维度能力雷达图
            </CardTitle>
            <CardDescription>
              直观展示各维度能力分布
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis domain={[0, 100]} />
                <Radar
                  name="得分"
                  dataKey="value"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.2}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 柱状图 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              维度得分对比
            </CardTitle>
            <CardDescription>
              各维度得分与平均值对比
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="#3b82f6" name="当前得分" />
                <Bar dataKey="avgScore" fill="#e5e7eb" name="平均得分" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 饼图 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5" />
              维度分布
            </CardTitle>
            <CardDescription>
              各维度得分占比分布
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 部门对比图 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              部门维度对比
            </CardTitle>
            <CardDescription>
              各部门在不同维度上的表现
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deptData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="department" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="工作质量" stackId="a" fill="#3b82f6" />
                <Bar dataKey="个人目标" stackId="a" fill="#10b981" />
                <Bar dataKey="部门协作" stackId="a" fill="#f59e0b" />
                <Bar dataKey="创新改进" stackId="a" fill="#ef4444" />
                <Bar dataKey="能力提升" stackId="a" fill="#8b5cf6" />
                <Bar dataKey="责任担当" stackId="a" fill="#ec4899" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 趋势图 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            维度得分趋势
          </CardTitle>
          <CardDescription>
            核心维度得分月度变化趋势
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trendChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="工作质量" fill="#3b82f6" />
              <Bar dataKey="个人目标" fill="#10b981" />
              <Bar dataKey="部门协作" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}