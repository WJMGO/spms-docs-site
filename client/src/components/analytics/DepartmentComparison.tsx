import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  LineChart,
  Line,
  ComposedChart,
  Area,
  AreaChart,
  ScatterPlot,
  Scatter
} from "recharts";
import {
  Building,
  TrendingUp,
  Award,
  AlertTriangle,
  Target,
  Users,
  BarChart3,
  PieChart,
  LineChart as LineChartIcon,
  Activity
} from "lucide-react";

interface DepartmentComparisonProps {
  departmentComparison: any;
  isLoading: boolean;
}

// Mock data for development
const mockDepartments = ["技术部", "销售部", "市场部", "人力资源部", "财务部"];
const mockPeriods = ["2024-Q1", "2024-Q2", "2024-Q3", "2024-Q4"];

const dimensionComparisonData = [
  {
    department: "技术部",
    工作质量: 94,
    个人目标: 90,
    部门协作: 87,
    创新改进: 88,
    能力提升: 85,
    责任担当: 82,
    总分: 88.7
  },
  {
    department: "销售部",
    工作质量: 88,
    个人目标: 92,
    部门协作: 85,
    创新改进: 80,
    能力提升: 88,
    责任担当: 90,
    总分: 87.2
  },
  {
    department: "市场部",
    工作质量: 85,
    个人目标: 86,
    部门协作: 88,
    创新改进: 85,
    能力提升: 82,
    责任担当: 78,
    总分: 84.0
  },
  {
    department: "人力资源部",
    工作质量: 87,
    个人目标: 89,
    部门协作: 92,
    创新改进: 86,
    能力提升: 84,
    责任担当: 88,
    总分: 87.7
  },
  {
    department: "财务部",
    工作质量: 90,
    个人目标: 85,
    部门协作: 86,
    创新改进: 82,
    能力提升: 87,
    责任担当: 91,
    总分: 86.8
  }
];

const trendComparisonData = [
  {
    period: "2024-Q1",
    技术部: 85.2,
    销售部: 84.5,
    市场部: 82.3,
    人力资源部: 84.8,
    财务部: 85.0
  },
  {
    period: "2024-Q2",
    技术部: 86.5,
    销售部: 85.2,
    市场部: 83.1,
    人力资源部: 85.5,
    财务部: 85.8
  },
  {
    period: "2024-Q3",
    技术部: 87.8,
    销售部: 86.3,
    市场部: 83.5,
    人力资源部: 86.7,
    财务部: 86.2
  },
  {
    period: "2024-Q4",
    技术部: 88.7,
    销售部: 87.2,
    市场部: 84.0,
    人力资源部: 87.7,
    财务部: 86.8
  }
];

const performanceDistribution = [
  {
    department: "技术部",
    优秀: 45,
    良好: 30,
    合格: 15,
    待改进: 5
  },
  {
    department: "销售部",
    优秀: 35,
    良好: 40,
    合格: 20,
    待改进: 5
  },
  {
    department: "市场部",
    优秀: 25,
    良好: 35,
    合格: 30,
    待改进: 10
  },
  {
    department: "人力资源部",
    优秀: 30,
    良好: 45,
    合格: 20,
    待改进: 5
  },
  {
    department: "财务部",
    优秀: 40,
    良好: 35,
    合格: 20,
    待改进: 5
  }
];

const employeeCountByDept = [
  { department: "技术部", employees: 45, avgScore: 88.7 },
  { department: "销售部", employees: 38, avgScore: 87.2 },
  { department: "市场部", employees: 32, avgScore: 84.0 },
  { department: "人力资源部", employees: 28, avgScore: 87.7 },
  { department: "财务部", employees: 25, avgScore: 86.8 }
];

export function DepartmentComparison({ departmentComparison, isLoading }: DepartmentComparisonProps) {
  // Use mock data for development
  const dimensionData = isLoading ? [] : dimensionComparisonData;
  const trendData = isLoading ? [] : trendComparisonData;
  const distributionData = isLoading ? [] : performanceDistribution;
  const employeeData = isLoading ? [] : employeeCountByDept;

  const getPerformanceColor = (level: string) => {
    switch (level) {
      case "优秀":
        return "#10b981";
      case "良好":
        return "#3b82f6";
      case "合格":
        return "#f59e0b";
      case "待改进":
        return "#ef4444";
      default:
        return "#6b7280";
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
      {/* 部门概览卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {dimensionData.map((dept) => (
          <Card key={dept.department}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                {dept.department}
                {dept.总分 >= 87 ? (
                  <Award className="h-4 w-4 text-yellow-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dept.总分}</div>
              <div className="text-xs text-muted-foreground">平均分</div>
              <div className="mt-2 space-y-1">
                {Object.entries(dept)
                  .filter(([key]) => key !== "department" && key !== "总分")
                  .sort(([,a], [,b]) => (b as number) - (a as number))
                  .slice(0, 2)
                  .map(([key, value]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{key}</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 维度对比雷达图 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            部门维度雷达图
          </CardTitle>
          <CardDescription>
            各部门在不同维度上的能力对比
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={dimensionData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="department" />
              <PolarRadiusAxis domain={[0, 100]} />
              {dimensionData[0] && Object.keys(dimensionData[0])
                .filter(key => key !== "department" && key !== "总分")
                .map((key, index) => (
                  <Radar
                    key={key}
                    name={key}
                    dataKey={key}
                    stroke={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][index]}
                    fill={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][index]}
                    fillOpacity={0.1}
                  />
                ))}
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 柱状图对比 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            部门总分对比
          </CardTitle>
          <CardDescription>
            各部门平均得分及员工数量对比
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={employeeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Bar yAxisId="left" dataKey="avgScore" fill="#3b82f6" name="平均得分" />
              <Line yAxisId="right" type="monotone" dataKey="employees" stroke="#ef4444" name="员工数" />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 趋势对比 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            季度趋势对比
          </CardTitle>
          <CardDescription>
            各部门季度得分变化趋势
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis domain={[80, 95]} />
              <Tooltip />
              {mockDepartments.map((dept, index) => (
                <Line
                  key={dept}
                  type="monotone"
                  dataKey={dept}
                  stroke={["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][index]}
                  strokeWidth={2}
                  name={dept}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 绩效分布 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            绩效等级分布
          </CardTitle>
          <CardDescription>
            各部门绩效等级分布情况
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {distributionData.map((dept) => (
              <div key={dept.department}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{dept.department}</span>
                  <span className="text-sm text-muted-foreground">
                    {dept.优秀 + dept.良好 + dept.合格 + dept.待改进} 人
                  </span>
                </div>
                <div className="flex gap-1">
                  {["优秀", "良好", "合格", "待改进"].map((level) => (
                    <div
                      key={level}
                      className="flex-1 h-6 rounded"
                      style={{
                        backgroundColor: getPerformanceColor(level),
                        width: `${(dept[level as keyof typeof dept] / (dept.优秀 + dept.良好 + dept.合格 + dept.待改进)) * 100}%`,
                        minWidth: "20px"
                      }}
                    >
                      <div className="h-full flex items-center justify-center text-xs text-white font-medium">
                        {dept[level as keyof typeof dept]}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                  {["优秀", "良好", "合格", "待改进"].map((level) => (
                    <span key={level}>{level}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 详细数据表格 */}
      <Card>
        <CardHeader>
          <CardTitle>详细对比数据</CardTitle>
          <CardDescription>
            各部门详细评分数据
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">部门</th>
                  <th className="text-center p-3">总分</th>
                  <th className="text-center p-3">工作质量</th>
                  <th className="text-center p-3">个人目标</th>
                  <th className="text-center p-3">部门协作</th>
                  <th className="text-center p-3">创新改进</th>
                  <th className="text-center p-3">能力提升</th>
                  <th className="text-center p-3">责任担当</th>
                </tr>
              </thead>
              <tbody>
                {dimensionData.map((dept) => (
                  <tr key={dept.department} className="border-b">
                    <td className="p-3 font-medium">{dept.department}</td>
                    <td className="p-3 text-center font-bold">{dept.总分}</td>
                    <td className="p-3 text-center">{dept.工作质量}</td>
                    <td className="p-3 text-center">{dept.个人目标}</td>
                    <td className="p-3 text-center">{dept.部门协作}</td>
                    <td className="p-3 text-center">{dept.创新改进}</td>
                    <td className="p-3 text-center">{dept.能力提升}</td>
                    <td className="p-3 text-center">{dept.责任担当}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}