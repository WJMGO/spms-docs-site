import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, RefreshCw } from 'lucide-react';
import { PermissionDenied } from '@/components/PermissionGuard';
import { Permission } from '@shared/permissions';
import { trpc } from '@/trpc';
import { toast } from 'sonner';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AnalyticsReport() {
  const [periodId, setPeriodId] = useState<string>('current');
  const [departmentId, setDepartmentId] = useState<string>('');
  const [exportType, setExportType] = useState<'summary' | 'detailed' | 'department'>('detailed');

  // 获取统计数据
  const { data: statsData, isLoading: statsLoading, refetch: refetchStats } = trpc.analytics.dimensionStats.getAll.useQuery({
    periodId: periodId === 'current' ? undefined : periodId,
    departmentId: departmentId || undefined,
  });

  // 获取部门对标数据
  const { data: benchmarkData } = trpc.analytics.departmentBenchmark.getComparison.useQuery({
    periodId: periodId === 'current' ? undefined : periodId,
  });

  // 导出数据
  const { data: exportData } = trpc.analytics.export.toCSV.useQuery({
    periodId: periodId === 'current' ? undefined : periodId,
    departmentId: departmentId || undefined,
    type: exportType as any,
  });

  const handleExportCSV = async () => {
    try {
      if (!exportData) {
        toast.error('数据加载中...');
        return;
      }

      const data = exportData;

      // 创建 CSV 文件并下载
      const csv = typeof data === 'string' ? data : (data as any).data;
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `analytics_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('导出成功');
    } catch (error: any) {
      toast.error(`导出失败: ${error.message}`);
    }
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

  // 准备图表数据
  const dimensionChartData = statsData?.averageScores
    ? [
        { name: '日常工作', value: statsData.averageScores.dailyWork || 0 },
        { name: '工作质量', value: statsData.averageScores.workQuality || 0 },
        { name: '个人目标', value: statsData.averageScores.personalGoal || 0 },
        { name: '部门互评', value: statsData.averageScores.departmentReview || 0 },
        { name: '绩效加分', value: statsData.averageScores.bonus || 0 },
        { name: '绩效减分', value: statsData.averageScores.penalty || 0 },
      ]
    : [];

  const gradeChartData = statsData?.gradeDistribution
    ? [
        { name: '优秀', value: statsData.gradeDistribution.excellent || 0 },
        { name: '良好', value: statsData.gradeDistribution.good || 0 },
        { name: '一般', value: statsData.gradeDistribution.fair || 0 },
        { name: '及格', value: statsData.gradeDistribution.pass || 0 },
        { name: '不及格', value: statsData.gradeDistribution.fail || 0 },
      ]
    : [];

  const departmentChartData = benchmarkData?.departments
    ? benchmarkData.departments.map((d: any) => ({
        name: d.departmentName,
        averageScore: d.averageScore || 0,
      }))
    : [];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* 周期选择 */}
              <div>
                <label className="text-sm font-medium mb-2 block">评分周期</label>
                <Select value={periodId} onValueChange={setPeriodId}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择周期" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">当前周期</SelectItem>
                    <SelectItem value="2026-q1">2026年Q1</SelectItem>
                    <SelectItem value="2026-q2">2026年Q2</SelectItem>
                    <SelectItem value="all">全部周期</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 部门选择 */}
              <div>
                <label className="text-sm font-medium mb-2 block">部门</label>
                <Select value={departmentId} onValueChange={setDepartmentId}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择部门" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">全部部门</SelectItem>
                    <SelectItem value="dept1">平台设计一部</SelectItem>
                    <SelectItem value="dept2">平台设计二部</SelectItem>
                    <SelectItem value="dept3">基础架构部</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 导出类型 */}
              <div>
                <label className="text-sm font-medium mb-2 block">导出类型</label>
                <Select value={exportType} onValueChange={(value) => setExportType(value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择导出类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summary">汇总报表</SelectItem>
                    <SelectItem value="detailed">详细报表</SelectItem>
                    <SelectItem value="department">部门报表</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 操作按钮 */}
              <div className="flex items-end gap-2">
                <Button onClick={() => refetchStats()} variant="outline" className="gap-2">
                  <RefreshCw size={16} />
                  刷新
                </Button>
                <Button onClick={handleExportCSV} className="gap-2">
                  <Download size={16} />
                  导出
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 统计概览 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">总人数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsData?.totalCount || 0}</div>
              <p className="text-xs text-muted-foreground">本周期参评人数</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">平均总分</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsData?.averageScores?.total?.toFixed(1) || '0'}</div>
              <p className="text-xs text-muted-foreground">全部员工平均分</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">优秀人数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsData?.gradeDistribution?.excellent || 0}</div>
              <p className="text-xs text-muted-foreground">优秀等级人数</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">部门数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{benchmarkData?.totalDepartments || 0}</div>
              <p className="text-xs text-muted-foreground">参评部门总数</p>
            </CardContent>
          </Card>
        </div>

        {/* 数据分析 */}
        <Tabs defaultValue="dimensions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="dimensions">维度分析</TabsTrigger>
            <TabsTrigger value="distribution">等级分布</TabsTrigger>
            <TabsTrigger value="benchmark">部门对标</TabsTrigger>
          </TabsList>

          {/* 维度分析 */}
          <TabsContent value="dimensions">
            <Card>
              <CardHeader>
                <CardTitle>各维度平均分</CardTitle>
                <CardDescription>6个评分维度的平均分统计</CardDescription>
              </CardHeader>
              <CardContent>
                {dimensionChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={dimensionChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-96 flex items-center justify-center text-muted-foreground">
                    暂无数据
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 等级分布 */}
          <TabsContent value="distribution">
            <Card>
              <CardHeader>
                <CardTitle>等级分布</CardTitle>
                <CardDescription>员工绩效等级分布情况</CardDescription>
              </CardHeader>
              <CardContent>
                {gradeChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={gradeChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={120}
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
                ) : (
                  <div className="h-96 flex items-center justify-center text-muted-foreground">
                    暂无数据
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* 部门对标 */}
          <TabsContent value="benchmark">
            <Card>
              <CardHeader>
                <CardTitle>部门对标</CardTitle>
                <CardDescription>各部门平均分对比</CardDescription>
              </CardHeader>
              <CardContent>
                {departmentChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={departmentChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="averageScore" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-96 flex items-center justify-center text-muted-foreground">
                    暂无数据
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 详细数据表 */}
        <Card>
          <CardHeader>
            <CardTitle>详细数据</CardTitle>
            <CardDescription>各维度详细数据统计</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium">维度</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">平均分</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">最高分</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">最低分</th>
                  </tr>
                </thead>
                <tbody>
                  {statsData?.averageScores ? (
                    [
                      { name: '日常工作', value: statsData.averageScores.dailyWork },
                      { name: '工作质量', value: statsData.averageScores.workQuality },
                      { name: '个人目标', value: statsData.averageScores.personalGoal },
                      { name: '部门互评', value: statsData.averageScores.departmentReview },
                      { name: '绩效加分', value: statsData.averageScores.bonus },
                      { name: '绩效减分', value: statsData.averageScores.penalty },
                    ].map((item) => (
                      <tr key={item.name} className="border-t hover:bg-muted/50">
                        <td className="px-4 py-2 text-sm">{item.name}</td>
                        <td className="px-4 py-2 text-sm font-medium">{item.value?.toFixed(2) || '0'}</td>
                        <td className="px-4 py-2 text-sm">-</td>
                        <td className="px-4 py-2 text-sm">-</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                        暂无数据
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
