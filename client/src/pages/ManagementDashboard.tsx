import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { PermissionGuard, PermissionButton, PermissionDenied } from '@/components/PermissionGuard';
import { Permission } from '@shared/permissions';
import { trpc } from '@/trpc';
import { toast } from 'sonner';

interface EmployeeRanking {
  id: string;
  employeeId: string;
  employee?: {
    name: string;
    position?: {
      name: string;
    };
    department?: {
      name: string;
    };
  };
  totalScore: number;
  status: string;
  rank: number;
  level: string;
}

export default function ManagementDashboard() {
  const [periodId, setPeriodId] = useState('current');
  const [departmentId, setDepartmentId] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<'score_desc' | 'score_asc' | 'name' | 'rank'>('score_desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingScore, setEditingScore] = useState<number | null | string>(null);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // 获取排序数据
  const { data: rankingResponse, isLoading: rankingLoading, refetch: refetchRanking } = trpc.dashboard.getEmployeeRanking.useQuery({
    periodId: periodId === 'current' ? 'current' : periodId,
    departmentId,
    sortBy: sortBy as any,
  });

  const rankingData = Array.isArray(rankingResponse) ? rankingResponse : rankingResponse?.data || [];

  // 获取分布统计
  const { data: distributionResponse } = trpc.dashboard.getDistributionStats.useQuery({
    periodId: periodId === 'current' ? 'current' : periodId,
    departmentId,
  });

  const distributionData = distributionResponse || {
    distribution: {
      excellent: { count: 0, percentage: 0 },
      good: { count: 0, percentage: 0 },
      fair: { count: 0, percentage: 0 },
      pass: { count: 0, percentage: 0 },
      fail: { count: 0, percentage: 0 },
    },
  };

  // 获取部门对比
  const { data: departmentComparisonResponse } = trpc.dashboard.getDepartmentComparison.useQuery({
    periodId: periodId === 'current' ? 'current' : periodId,
  });

  const departmentComparison = Array.isArray(departmentComparisonResponse) ? departmentComparisonResponse : (departmentComparisonResponse as any)?.data || [];

  // 更新分数
  const handleUpdateScore = async (assessmentId: string, totalScore: number) => {
    try {
      // TODO: 实现更新分数 API
      toast.success('分数已更新');
      setEditingId(null);
      setEditingScore(null);
      refetchRanking();
    } catch (error: any) {
      toast.error(`更新失败: ${error.message}`);
    }
  };



  // 定版周期
  const handleLockPeriod = async () => {
    try {
      setIsPublishing(true);
      // TODO: 实现定版周期 API
      toast.success('周期已定版');
      setIsPublishing(false);
      refetchRanking();
    } catch (error: any) {
      toast.error(`定版失败: ${error.message}`);
      setIsPublishing(false);
    }
  };

  // 导出排序表
  const handleExportRanking = async () => {
    try {
      // 一个简单的导出实现，实际应用中应用真实 API
      const csv = filteredRanking.map((item: any) => [
        item.rank || 0,
        item.employee?.name || '',
        item.employee?.department?.name || '',
        item.employee?.position?.name || '',
        item.totalScore || 0,
        item.level || '',
        item.status || '',
      ]).map((row: any[]) => row.map((cell: any) => `"${String(cell).replace(/"/g, '""')}"`).join(','));
      
      const headers = ['\u6392名', '\u59d3名', '\u90e8门', '\u804c\u4f4d', '\u603b\u5206', '\u7b49\u7ea7', '\u72b6\u6001'];
      const csvContent = [headers.join(','), ...csv].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `ranking_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('导出成功');
    } catch (error: any) {
      toast.error(`导出失败: ${error.message}`);
    }
  };

  // 筛选数据
  const filteredRanking = useMemo(() => {
    let filtered = rankingData;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((item: any) =>
        item.employee?.name?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [rankingData, searchQuery]);

  const handleSaveScore = (id: string) => {
    if (editingScore === null || editingScore === '') return;
    handleUpdateScore(id, Number(editingScore));
  };

  const handlePublish = () => {
    if (!periodId) return;
    handleLockPeriod();
  };



  if (rankingLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">管理层仪表板</h1>
          <p className="text-muted-foreground mt-2">绩效评分管理和排序调整</p>
        </div>

        {/* 快速筛选 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>快速筛选</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* 周期选择 */}
              <Select value={periodId} onValueChange={setPeriodId}>
                <SelectTrigger>
                  <SelectValue placeholder="选择周期" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">当前周期</SelectItem>
                  <SelectItem value="2026-q1">2026年Q1</SelectItem>
                  <SelectItem value="2026-q2">2026年Q2</SelectItem>
                </SelectContent>
              </Select>

              {/* 部门筛选 */}
              <Select value={departmentId || ''} onValueChange={(value) => setDepartmentId(value || undefined)}>
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

              {/* 排序方式 */}
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="排序方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score_desc">分数 (高→低)</SelectItem>
                  <SelectItem value="score_asc">分数 (低→高)</SelectItem>
                  <SelectItem value="name">姓名 (A→Z)</SelectItem>
                  <SelectItem value="rank">排名</SelectItem>
                </SelectContent>
              </Select>

              {/* 搜索框 */}
              <div className="relative">
                <Input
                  placeholder="搜索员工名称..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">优秀</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{distributionData.distribution?.excellent?.count || 0}</div>
              <p className="text-xs text-muted-foreground">{distributionData.distribution?.excellent?.percentage || 0}%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">良好</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{distributionData.distribution?.good?.count || 0}</div>
              <p className="text-xs text-muted-foreground">{distributionData.distribution?.good?.percentage || 0}%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">中等</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{distributionData.distribution?.fair?.count || 0}</div>
              <p className="text-xs text-muted-foreground">{distributionData.distribution?.fair?.percentage || 0}%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">及格</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{distributionData.distribution?.pass?.count || 0}</div>
              <p className="text-xs text-muted-foreground">{distributionData.distribution?.pass?.percentage || 0}%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">不及格</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{distributionData.distribution?.fail?.count || 0}</div>
              <p className="text-xs text-muted-foreground">{distributionData.distribution?.fail?.percentage || 0}%</p>
            </CardContent>
          </Card>
        </div>

        {/* 排序表 */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>员工排序表</CardTitle>
                <CardDescription>共 {filteredRanking.length} 名员工</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleExportRanking} className="gap-2">
                  <Download size={16} />
                  导出
                </Button>
                <PermissionButton
                  permission={Permission.DASHBOARD_PUBLISH}
                  userPermissions={[]}
                >
                  <Button onClick={handlePublish} disabled={isPublishing} className="gap-2">
                    <CheckCircle2 size={16} />
                    定版发布
                  </Button>
                </PermissionButton>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="border rounded-lg overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium">排名</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">姓名</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">部门</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">职位</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">总分</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">等级</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">状态</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRanking.length > 0 ? (
                    filteredRanking.map((item: any, index: number) => (
                      <tr key={item.id} className="border-t hover:bg-muted/50">
                        <td className="px-4 py-2 text-sm font-medium">{item.rank || index + 1}</td>
                        <td className="px-4 py-2 text-sm">{item.employee?.name || '-'}</td>
                        <td className="px-4 py-2 text-sm">{item.employee?.department?.name || '-'}</td>
                        <td className="px-4 py-2 text-sm">{item.employee?.position?.name || '-'}</td>
                        <td className="px-4 py-2 text-sm">
                          {editingId === item.id ? (
                            <div className="flex gap-2">
                              <Input
                                type="number"
                                value={editingScore || ''}
                                onChange={(e) => setEditingScore(e.target.value)}
                                className="w-20"
                              />
                              <Button
                                size="sm"
                                onClick={() => handleSaveScore(item.id)}
                              >
                                保存
                              </Button>
                            </div>
                          ) : (
                            <span
                              className="cursor-pointer hover:text-primary"
                              onClick={() => {
                                setEditingId(item.id);
                                setEditingScore(item.totalScore);
                              }}
                            >
                              {item.totalScore}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          <Badge className={
                            item.level === '优秀' ? 'bg-green-100 text-green-800' :
                            item.level === '良好' ? 'bg-blue-100 text-blue-800' :
                            item.level === '中等' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {item.level}
                          </Badge>
                        </td>
                        <td className="px-4 py-2 text-sm">
                          <Badge className={
                            item.status === 'approved' ? 'bg-green-100 text-green-800' :
                            item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {item.status === 'approved' ? '已批准' :
                             item.status === 'pending' ? '待处理' : '已拒绝'}
                          </Badge>
                        </td>
                        <td className="px-4 py-2 text-sm">
                          <PermissionButton
                            permission={Permission.DASHBOARD_EDIT_SCORE}
                            userPermissions={[]}
                          >
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                // 编辑分数
                                setEditingId(item.id);
                                setEditingScore(item.totalScore);
                              }}
                            >
                              编辑
                            </Button>
                          </PermissionButton>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                        没有找到匹配的数据
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* 部门对比 */}
        <Card>
          <CardHeader>
            <CardTitle>部门对比</CardTitle>
            <CardDescription>各部门绩效统计对比</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="border rounded-lg overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium">部门</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">总人数</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">平均分</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">优秀</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">良好</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">中等</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">及格</th>
                    <th className="px-4 py-2 text-left text-sm font-medium">不及格</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentComparison.length > 0 ? (
                    departmentComparison.map((dept: any) => (
                      <tr key={dept.departmentId} className="border-t hover:bg-muted/50">
                        <td className="px-4 py-2 text-sm font-medium">{dept.departmentName}</td>
                        <td className="px-4 py-2 text-sm">{dept.total}</td>
                        <td className="px-4 py-2 text-sm font-medium">{dept.averageScore?.toFixed(1) || '-'}</td>
                        <td className="px-4 py-2 text-sm">{dept.distribution?.excellent || 0}</td>
                        <td className="px-4 py-2 text-sm">{dept.distribution?.good || 0}</td>
                        <td className="px-4 py-2 text-sm">{dept.distribution?.fair || 0}</td>
                        <td className="px-4 py-2 text-sm">{dept.distribution?.pass || 0}</td>
                        <td className="px-4 py-2 text-sm">{dept.distribution?.fail || 0}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                        没有找到部门数据
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
