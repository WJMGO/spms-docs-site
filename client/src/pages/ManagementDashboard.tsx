import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { PermissionGuard, PermissionButton, PermissionDenied } from '@/components/PermissionGuard';
import { Permission } from '@shared/permissions';

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
  // TODO: 从 useAuth 或 trpc 获取用户权限
  const userPermissions: Permission[] = [];
  const [periodId, setPeriodId] = useState('current');
  const [departmentId, setDepartmentId] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<'score_desc' | 'score_asc' | 'name' | 'rank'>('score_desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingScore, setEditingScore] = useState<number | null | string>(null);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  // 临时使用 Mock 数据（后续集成真实 API）
  const mockRankingData: EmployeeRanking[] = [
    {
      id: '1',
      employeeId: 'emp-1',
      employee: {
        name: '张三',
        position: { name: '高级工程师' },
        department: { name: '平台设计一部' },
      },
      totalScore: 125.5,
      status: 'approved',
      rank: 1,
      level: '优秀',
    },
    {
      id: '2',
      employeeId: 'emp-2',
      employee: {
        name: '李四',
        position: { name: '工程师' },
        department: { name: '平台设计一部' },
      },
      totalScore: 122.3,
      status: 'approved',
      rank: 2,
      level: '优秀',
    },
    {
      id: '3',
      employeeId: 'emp-3',
      employee: {
        name: '王五',
        position: { name: '产品经理' },
        department: { name: '平台设计二部' },
      },
      totalScore: 118.7,
      status: 'approved',
      rank: 3,
      level: '良好',
    },
    {
      id: '4',
      employeeId: 'emp-4',
      employee: {
        name: '赵六',
        position: { name: '设计师' },
        department: { name: '基础架构部' },
      },
      totalScore: 115.2,
      status: 'approved',
      rank: 4,
      level: '良好',
    },
  ];

  const rankingData = mockRankingData;
  const rankingLoading = false;

  const mockDistributionData = {
    distribution: {
      excellent: { count: 12, percentage: 30 },
      good: { count: 18, percentage: 45 },
      fair: { count: 8, percentage: 20 },
      pass: { count: 2, percentage: 5 },
      fail: { count: 0, percentage: 0 },
    },
  };

  const distributionData = mockDistributionData;

  const mockDepartmentComparison = [
    {
      departmentId: 'dept-1',
      departmentName: '平台设计一部',
      total: 15,
      averageScore: 120.5,
      distribution: { excellent: 6, good: 7, fair: 2, pass: 0, fail: 0 },
    },
    {
      departmentId: 'dept-2',
      departmentName: '平台设计二部',
      total: 12,
      averageScore: 118.3,
      distribution: { excellent: 4, good: 6, fair: 2, pass: 0, fail: 0 },
    },
    {
      departmentId: 'dept-3',
      departmentName: '基础架构部',
      total: 13,
      averageScore: 115.8,
      distribution: { excellent: 2, good: 5, fair: 4, pass: 2, fail: 0 },
    },
  ];

  const departmentComparison = mockDepartmentComparison;

  const mockPeriodStats = {
    stats: {
      total: 40,
      completed: 38,
      pending: 2,
      averageScore: 118.5,
      draft: 1,
      submitted: 15,
      approved: 22,
      rejected: 2,
    },
  };

  const periodStats = mockPeriodStats;

  // 过滤和搜索员工
  const filteredRanking = useMemo(() => {
    if (!rankingData) return [];
    let filtered = rankingData;

    if (departmentId) {
      filtered = filtered.filter((item: EmployeeRanking) => item.employee?.department?.name === departmentId);
    }

    if (searchQuery) {
      filtered = filtered.filter((item: EmployeeRanking) =>
        item.employee?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 排序
    let sorted = [...filtered];
    switch (sortBy) {
      case 'score_desc':
        sorted.sort((a: EmployeeRanking, b: EmployeeRanking) => b.totalScore - a.totalScore);
        break;
      case 'score_asc':
        sorted.sort((a: EmployeeRanking, b: EmployeeRanking) => a.totalScore - b.totalScore);
        break;
      case 'name':
        sorted.sort((a: EmployeeRanking, b: EmployeeRanking) =>
          (a.employee?.name || '').localeCompare(b.employee?.name || '')
        );
        break;
      case 'rank':
        sorted.sort((a: EmployeeRanking, b: EmployeeRanking) => a.rank - b.rank);
        break;
    }

    return sorted.map((item: EmployeeRanking, index: number) => ({
      ...item,
      rank: index + 1,
    }));
  }, [rankingData, searchQuery, departmentId, sortBy]);

  // 获取绩效等级的颜色
  const getLevelColor = (level: string) => {
    switch (level) {
      case '优秀':
        return 'bg-green-100 text-green-800';
      case '良好':
        return 'bg-blue-100 text-blue-800';
      case '一般':
        return 'bg-yellow-100 text-yellow-800';
      case '及格':
        return 'bg-orange-100 text-orange-800';
      case '不及格':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 获取分布条的颜色
  const getDistributionColor = (level: string) => {
    switch (level) {
      case 'excellent':
        return 'bg-green-500';
      case 'good':
        return 'bg-blue-500';
      case 'fair':
        return 'bg-yellow-500';
      case 'pass':
        return 'bg-orange-500';
      case 'fail':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getLevelLabel = (key: string) => {
    const labels: Record<string, string> = {
      excellent: '优秀 (90-100)',
      good: '良好 (80-89)',
      fair: '一般 (70-79)',
      pass: '及格 (60-69)',
      fail: '不及格 (<60)',
    };
    return labels[key] || key;
  };

  // 处理分数编辑
  const handleScoreSave = async (item: EmployeeRanking) => {
    if (editingScore === null || editingScore === '') {
      setEditingId(null);
      return;
    }

    const newScore = parseFloat(editingScore as string);
    if (isNaN(newScore) || newScore < 0 || newScore > 150) {
      setSaveMessage({ type: 'error', text: '分数必须在 0-150 之间' });
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    try {
      // TODO: 调用 API 保存分数
      setSaveMessage({ type: 'success', text: `已保存 ${item.employee?.name} 的分数` });
      setEditingId(null);
      setEditingScore(null);
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage({ type: 'error', text: '保存失败，请重试' });
      setTimeout(() => setSaveMessage(null), 3000);
    }
  };

  // 处理定版发布
  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // TODO: 调用 API 发布定版
      setSaveMessage({ type: 'success', text: '绩效已定版发布' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage({ type: 'error', text: '发布失败，请重试' });
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsPublishing(false);
    }
  };

  // 检查权限
  const canViewDashboard = userPermissions.includes(Permission.DASHBOARD_VIEW);
  const canEditScore = userPermissions.includes(Permission.DASHBOARD_EDIT_SCORE);
  const canPublish = userPermissions.includes(Permission.DASHBOARD_PUBLISH);

  if (!canViewDashboard) {
    return (
      <div className="container mx-auto py-8">
        <PermissionDenied
          message="您没有权限访问管理层仪表板"
          requiredPermission={Permission.DASHBOARD_VIEW}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* 标题 */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">管理层绩效处理仪表板</h1>
        <p className="text-muted-foreground mt-2">查看、编辑和发布员工绩效评分</p>
      </div>

      {/* 消息提示 */}
      {saveMessage && (
        <div
          className={`p-4 rounded-lg flex items-center gap-2 ${
            saveMessage.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {saveMessage.type === 'success' ? (
            <CheckCircle2 size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          {saveMessage.text}
        </div>
      )}

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">总人数</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{periodStats.stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">已完成</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{periodStats.stats.completed}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">待处理</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{periodStats.stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">平均分</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{periodStats.stats.averageScore.toFixed(1)}</div>
          </CardContent>
        </Card>
      </div>

      {/* 绩效分布 */}
      <Card>
        <CardHeader>
          <CardTitle>绩效等级分布</CardTitle>
          <CardDescription>本周期员工绩效等级分布情况</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(distributionData.distribution).map(([key, data]: any) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{getLevelLabel(key)}</span>
                  <span className="font-medium">{data.count} 人 ({data.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getDistributionColor(key)}`}
                    style={{ width: `${data.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 员工排序表 */}
      <Card>
        <CardHeader>
          <CardTitle>员工绩效排序</CardTitle>
          <CardDescription>查看和编辑员工绩效分数</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 筛选和搜索 */}
          <div className="flex gap-4 flex-wrap">
            <Input
              placeholder="搜索员工名称..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 min-w-[200px]"
            />
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="排序方式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="score_desc">分数从高到低</SelectItem>
                <SelectItem value="score_asc">分数从低到高</SelectItem>
                <SelectItem value="name">按名字排序</SelectItem>
                <SelectItem value="rank">按排名排序</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 员工列表 */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2 px-2">排名</th>
                  <th className="text-left py-2 px-2">员工名称</th>
                  <th className="text-left py-2 px-2">部门</th>
                  <th className="text-left py-2 px-2">岗位</th>
                  <th className="text-left py-2 px-2">分数</th>
                  <th className="text-left py-2 px-2">等级</th>
                  <th className="text-left py-2 px-2">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredRanking.map((item: EmployeeRanking) => (
                  <tr key={item.id} className="border-b hover:bg-muted/50">
                    <td className="py-2 px-2 font-bold">{item.rank}</td>
                    <td className="py-2 px-2">{item.employee?.name}</td>
                    <td className="py-2 px-2">{item.employee?.department?.name}</td>
                    <td className="py-2 px-2">{item.employee?.position?.name}</td>
                    <td className="py-2 px-2">
                      {editingId === item.id ? (
                        <Input
                          type="number"
                          min="0"
                          max="150"
                          value={editingScore || ''}
                          onChange={(e) => setEditingScore(e.target.value)}
                          className="w-20"
                          autoFocus
                        />
                      ) : (
                        <span className="font-medium">{item.totalScore}</span>
                      )}
                    </td>
                    <td className="py-2 px-2">
                      <Badge className={getLevelColor(item.level)}>{item.level}</Badge>
                    </td>
                    <td className="py-2 px-2">
                      <PermissionGuard
                        permission={Permission.DASHBOARD_EDIT_SCORE}
                        userPermissions={userPermissions}
                        fallback={<span className="text-muted-foreground text-xs">无权限</span>}
                      >
                        {editingId === item.id ? (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleScoreSave(item)}
                            >
                              保存
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingId(null);
                                setEditingScore(null);
                              }}
                            >
                              取消
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingId(item.id);
                              setEditingScore(item.totalScore);
                            }}
                          >
                            编辑
                          </Button>
                        )}
                      </PermissionGuard>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 部门对比 */}
      <Card>
        <CardHeader>
          <CardTitle>部门对比</CardTitle>
          <CardDescription>各部门平均分和人数对比</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {departmentComparison.map((dept: any) => (
              <Card key={dept.departmentId} className="bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{dept.departmentName}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="text-sm text-muted-foreground">平均分</span>
                    <div className="text-2xl font-bold">{dept.averageScore.toFixed(1)}</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">人数</span>
                    <div className="text-xl font-semibold">{dept.total} 人</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 操作按钮 */}
      <div className="flex gap-4">
        <PermissionGuard
          permission={Permission.DASHBOARD_PUBLISH}
          userPermissions={userPermissions}
          fallback={
            <Button disabled className="gap-2">
              <Lock size={16} />
              定版发布（无权限）
            </Button>
          }
        >
          <Button
            onClick={handlePublish}
            disabled={isPublishing}
            className="gap-2"
          >
            <CheckCircle2 size={16} />
            {isPublishing ? '发布中...' : '定版发布'}
          </Button>
        </PermissionGuard>

        <PermissionGuard
          permission={Permission.ANALYTICS_EXPORT}
          userPermissions={userPermissions}
          fallback={
            <Button variant="outline" disabled className="gap-2">
              <Download size={16} />
              导出数据（无权限）
            </Button>
          }
        >
          <Button variant="outline" className="gap-2">
            <Download size={16} />
            导出数据
          </Button>
        </PermissionGuard>
      </div>
    </div>
  );
}
