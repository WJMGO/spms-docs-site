import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, RefreshCw, Lock } from 'lucide-react';
import { PermissionGuard, PermissionDenied } from '@/components/PermissionGuard';
import { Permission } from '@shared/permissions';

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
  // TODO: 从 useAuth 或 trpc 获取用户权限
  const userPermissions: Permission[] = [];

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

  // 检查权限
  const canViewAnalytics = userPermissions.includes(Permission.ANALYTICS_VIEW);
  const canExportData = userPermissions.includes(Permission.ANALYTICS_EXPORT);

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

  if (!canViewAnalytics) {
    return (
      <div className="container mx-auto py-8">
        <PermissionDenied
          message="您没有权限访问数据分析报表"
          requiredPermission={Permission.ANALYTICS_VIEW}
        />
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
    <div className="container mx-auto py-8 space-y-6">
      {/* 标题 */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">数据分析和报表</h1>
        <p className="text-muted-foreground mt-2">查看绩效数据统计、分析和趋势</p>
      </div>

      {/* 筛选和操作 */}
      <Card>
        <CardHeader>
          <CardTitle>筛选条件</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">评分周期</label>
              <Select value={periodId} onValueChange={setPeriodId}>
                <SelectTrigger>
                  <SelectValue placeholder="选择周期" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">当前周期</SelectItem>
                  <SelectItem value="previous">上一周期</SelectItem>
                  <SelectItem value="all">全部周期</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">部门</label>
              <Select value={departmentId} onValueChange={setDepartmentId}>
                <SelectTrigger>
                  <SelectValue placeholder="选择部门" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">全部部门</SelectItem>
                  <SelectItem value="dept-1">平台设计一部</SelectItem>
                  <SelectItem value="dept-2">平台设计二部</SelectItem>
                  <SelectItem value="dept-3">基础架构部</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">导出格式</label>
              <Select value={exportType} onValueChange={(value: any) => setExportType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="选择格式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">汇总报表</SelectItem>
                  <SelectItem value="detailed">详细报表</SelectItem>
                  <SelectItem value="department">部门报表</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4">
            <Button variant="outline" onClick={refetchStats} className="gap-2">
              <RefreshCw size={16} />
              刷新数据
            </Button>

            <PermissionGuard
              permission={Permission.ANALYTICS_EXPORT}
              userPermissions={userPermissions}
              fallback={
                <Button disabled className="gap-2">
                  <Lock size={16} />
                  导出数据（无权限）
                </Button>
              }
            >
              <Button onClick={handleExportCSV} className="gap-2">
                <Download size={16} />
                导出数据
              </Button>
            </PermissionGuard>
          </div>
        </CardContent>
      </Card>

      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">总人数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{statsData.totalCount}</div>
            <p className="text-xs text-muted-foreground mt-1">本周期评分人数</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">平均总分</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{statsData.averageScores.total.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground mt-1">全体员工平均分</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">优秀人数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{statsData.gradeDistribution.excellent}</div>
            <p className="text-xs text-muted-foreground mt-1">占比 {((statsData.gradeDistribution.excellent / statsData.totalCount) * 100).toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>

      {/* 图表选项卡 */}
      <Tabs defaultValue="dimensions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dimensions">维度分析</TabsTrigger>
          <TabsTrigger value="grades">等级分布</TabsTrigger>
          <TabsTrigger value="benchmark">部门对标</TabsTrigger>
        </TabsList>

        {/* 维度分析 */}
        <TabsContent value="dimensions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>六维度平均分对比</CardTitle>
              <CardDescription>各个评分维度的平均分统计</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
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

          {/* 维度详情 */}
          <Card>
            <CardHeader>
              <CardTitle>维度详情</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">日常工作</span>
                    <span className="font-medium">{statsData.averageScores.dailyWork}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-blue-500"
                      style={{ width: `${(statsData.averageScores.dailyWork / 100) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">工作质量</span>
                    <span className="font-medium">{statsData.averageScores.workQuality}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-green-500"
                      style={{ width: `${(statsData.averageScores.workQuality / 100) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">个人目标</span>
                    <span className="font-medium">{statsData.averageScores.personalGoal}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-yellow-500"
                      style={{ width: `${(statsData.averageScores.personalGoal / 100) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">部门互评</span>
                    <span className="font-medium">{statsData.averageScores.departmentReview}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-orange-500"
                      style={{ width: `${(statsData.averageScores.departmentReview / 100) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 等级分布 */}
        <TabsContent value="grades" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>绩效等级分布</CardTitle>
              <CardDescription>员工绩效等级分布情况</CardDescription>
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
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {gradeChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 等级统计 */}
          <Card>
            <CardHeader>
              <CardTitle>等级统计</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: '优秀', value: statsData.gradeDistribution.excellent, color: 'bg-green-500' },
                  { label: '良好', value: statsData.gradeDistribution.good, color: 'bg-blue-500' },
                  { label: '一般', value: statsData.gradeDistribution.fair, color: 'bg-yellow-500' },
                  { label: '及格', value: statsData.gradeDistribution.pass, color: 'bg-orange-500' },
                  { label: '不及格', value: statsData.gradeDistribution.fail, color: 'bg-red-500' },
                ].map((grade) => (
                  <div key={grade.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{grade.label}</span>
                      <span className="font-medium">{grade.value} 人 ({((grade.value / statsData.totalCount) * 100).toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${grade.color}`}
                        style={{ width: `${(grade.value / statsData.totalCount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 部门对标 */}
        <TabsContent value="benchmark" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>部门平均分对比</CardTitle>
              <CardDescription>各部门的平均分对标</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="averageScore" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 部门详情 */}
          <Card>
            <CardHeader>
              <CardTitle>部门详情</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {benchmarkData.departments.map((dept: any) => (
                  <Card key={dept.departmentId} className="bg-muted/50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{dept.departmentName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{dept.averageScore.toFixed(1)}</div>
                      <p className="text-xs text-muted-foreground mt-1">平均分</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
