import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, RefreshCw } from 'lucide-react';

// 临时注释：使用 Mock 数据，直到 trpc 配置完成
const mockStats = {
  totalCount: 50,
  averageScores: {
    dailyWork: 85,
    workQuality: 82,
    personalGoal: 80,
    departmentReview: 78,
    bonus: 5,
    penalty: 2,
    total: 120,
  },
  gradeDistribution: {
    excellent: 10,
    good: 20,
    fair: 15,
    pass: 5,
    fail: 0,
  },
  topEmployees: [],
  bottomEmployees: [],
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AnalyticsReport() {
  const [periodId, setPeriodId] = useState<string>('');
  const [departmentId, setDepartmentId] = useState<string>('');
  const [exportType, setExportType] = useState<'summary' | 'detailed' | 'department'>('detailed');

  // 临时使用 Mock 数据
  const statsData = mockStats;
  const statsLoading = false;
  const refetchStats = () => {};

  const benchmarkData = {
    totalDepartments: 3,
    departments: [
      { departmentName: '平台设计一部', averageScore: 125 },
      { departmentName: '平台设计二部', averageScore: 120 },
      { departmentName: '基础架构部', averageScore: 118 },
    ],
  };

  const csvData = null;

  const handleExportCSV = () => {
    alert('导出功能已准备就绪，待后端 API 完全集成');
  };

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载数据中...</p>
        </div>
      </div>
    );
  }

  // 注意：当前使用 Mock 数据演示，实际应使用上面的 trpc 查询

  const dimensionChartData = statsData?.averageScores
    ? [
        { name: '日常工作', value: statsData.averageScores.dailyWork },
        { name: '工作质量', value: statsData.averageScores.workQuality },
        { name: '个人目标', value: statsData.averageScores.personalGoal },
        { name: '部门互评', value: statsData.averageScores.departmentReview },
        { name: '绩效加分', value: statsData.averageScores.bonus },
        { name: '绩效减分', value: statsData.averageScores.penalty },
      ]
    : [];

  const gradeChartData = statsData?.gradeDistribution
    ? [
        { name: '优秀', value: statsData.gradeDistribution.excellent },
        { name: '良好', value: statsData.gradeDistribution.good },
        { name: '一般', value: statsData.gradeDistribution.fair },
        { name: '及格', value: statsData.gradeDistribution.pass },
        { name: '不及格', value: statsData.gradeDistribution.fail },
      ]
    : [];

  const departmentChartData = benchmarkData?.departments
    ? benchmarkData.departments.map((d: any) => ({
        name: d.departmentName,
        averageScore: d.averageScore,
      }))
    : [];

  return (
    <div className="flex-1 space-y-6 p-6 bg-background">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">数据分析与报表</h1>
          <p className="text-muted-foreground mt-2">基于六维度评分的统计分析和部门对标</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetchStats()} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          刷新
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">评分周期</label>
          <Select value={periodId} onValueChange={setPeriodId}>
            <SelectTrigger>
              <SelectValue placeholder="选择周期" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">全部周期</SelectItem>
              <SelectItem value="2024-q1">2024 Q1</SelectItem>
              <SelectItem value="2024-q2">2024 Q2</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">部门筛选</label>
          <Select value={departmentId} onValueChange={setDepartmentId}>
            <SelectTrigger>
              <SelectValue placeholder="选择部门" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">全部部门</SelectItem>
              <SelectItem value="dept-1">平台设计一部</SelectItem>
              <SelectItem value="dept-2">平台设计二部</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">导出格式</label>
          <Select value={exportType} onValueChange={(val: any) => setExportType(val)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="summary">汇总版</SelectItem>
              <SelectItem value="detailed">详细版</SelectItem>
              <SelectItem value="department">部门版</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">总人数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData?.totalCount || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">已批准的评分</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">平均总分</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData?.averageScores.total.toFixed(1) || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">满分 150 分</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">优秀率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsData?.totalCount
                ? ((statsData.gradeDistribution.excellent / statsData.totalCount) * 100).toFixed(1)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground mt-1">评分 ≥ 90 分</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">及格率</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsData?.totalCount
                ? (
                    ((statsData.gradeDistribution.excellent +
                      statsData.gradeDistribution.good +
                      statsData.gradeDistribution.fair +
                      statsData.gradeDistribution.pass) /
                      statsData.totalCount) *
                    100
                  ).toFixed(1)
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground mt-1">评分 ≥ 60 分</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="dimension" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dimension">六维度分析</TabsTrigger>
          <TabsTrigger value="grade">等级分布</TabsTrigger>
          <TabsTrigger value="department">部门对标</TabsTrigger>
        </TabsList>

        <TabsContent value="dimension">
          <Card>
            <CardHeader>
              <CardTitle>六维度平均分对比</CardTitle>
              <CardDescription>各维度的平均得分情况</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={dimensionChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grade">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>等级分布（饼图）</CardTitle>
                <CardDescription>各等级的人数分布</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={gradeChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {gradeChartData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>等级统计</CardTitle>
                <CardDescription>各等级的详细数据</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gradeChartData.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{item.value}</div>
                        <div className="text-xs text-muted-foreground">
                          {statsData?.totalCount
                            ? ((item.value / statsData.totalCount) * 100).toFixed(1)
                            : 0}
                          %
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="department">
          <Card>
            <CardHeader>
              <CardTitle>部门平均分对比</CardTitle>
              <CardDescription>各部门的平均绩效评分</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={departmentChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="averageScore" fill="#10b981" name="平均分" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>排名前 10</CardTitle>
            <CardDescription>评分最高的员工</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {statsData?.topEmployees.map((emp: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 rounded hover:bg-muted">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      {emp.rank}
                    </div>
                    <div className="text-sm font-medium">{emp.employeeName}</div>
                  </div>
                  <div className="text-sm font-bold text-primary">{emp.totalScore.toFixed(1)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>排名后 10</CardTitle>
            <CardDescription>评分最低的员工</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {statsData?.bottomEmployees.map((emp: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-2 rounded hover:bg-muted">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-xs font-bold">
                      {emp.rank}
                    </div>
                    <div className="text-sm font-medium">{emp.employeeName}</div>
                  </div>
                  <div className="text-sm font-bold text-destructive">{emp.totalScore.toFixed(1)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>数据导出</CardTitle>
          <CardDescription>将报表数据导出为 CSV 或 JSON 格式</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button onClick={handleExportCSV} className="gap-2">
            <Download className="w-4 h-4" />
            导出为 CSV
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
