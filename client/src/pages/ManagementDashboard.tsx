import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

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
      // 这里应该调用真实 API
      // await trpc.management.updateScore.mutate({
      //   assessmentId: item.id,
      //   totalScore: newScore,
      // });

      setSaveMessage({ type: 'success', text: `${item.employee?.name} 的分数已更新为 ${newScore}` });
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
      // 这里应该调用真实 API
      // await trpc.management.publishFinal.mutate({
      //   periodId: periodId,
      // });

      setSaveMessage({ type: 'success', text: '已定版发布，所有评分已锁定' });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage({ type: 'error', text: '定版发布失败，请重试' });
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsPublishing(false);
    }
  };

  // 处理导出
  const handleExport = () => {
    const csvContent = [
      ['排名', '姓名', '职位', '部门', '总分', '等级'],
      ...filteredRanking.map((item: EmployeeRanking) => [
        item.rank,
        item.employee?.name,
        item.employee?.position?.name,
        item.employee?.department?.name,
        item.totalScore,
        item.level,
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const element = document.createElement('a');
    const file = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    element.href = URL.createObjectURL(file);
    element.download = `performance-ranking-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6 p-6">
      {/* 标题 */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">管理层绩效处理仪表板</h1>
        <p className="text-muted-foreground mt-2">月底绩效数据处理、调整排名以及部门间排序穿插</p>
      </div>

      {/* 消息提示 */}
      {saveMessage && (
        <div
          className={`p-4 rounded-lg flex items-center gap-2 ${
            saveMessage.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {saveMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{saveMessage.text}</span>
        </div>
      )}

      {/* 快速筛选 */}
      <Card>
        <CardHeader>
          <CardTitle>快速筛选</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground">评分周期</label>
              <Select value={periodId} onValueChange={setPeriodId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">当前周期</SelectItem>
                  <SelectItem value="2026-03">2026年3月</SelectItem>
                  <SelectItem value="2026-02">2026年2月</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">部门筛选</label>
              <Select value={departmentId || 'all'} onValueChange={(v) => setDepartmentId(v === 'all' ? undefined : v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部部门</SelectItem>
                  <SelectItem value="平台设计一部">平台设计一部</SelectItem>
                  <SelectItem value="平台设计二部">平台设计二部</SelectItem>
                  <SelectItem value="基础架构部">基础架构部</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">排序方式</label>
              <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="score_desc">分数从高到低</SelectItem>
                  <SelectItem value="score_asc">分数从低到高</SelectItem>
                  <SelectItem value="name">按名字排序</SelectItem>
                  <SelectItem value="rank">按排名排序</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">搜索员工</label>
              <Input
                placeholder="输入员工名字..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 周期统计信息 */}
      {periodStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">总评分数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{periodStats.stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">本周期所有评分</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">已完成</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{periodStats.stats.completed}</div>
              <p className="text-xs text-muted-foreground mt-1">已提交或已批准</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">待处理</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{periodStats.stats.pending}</div>
              <p className="text-xs text-muted-foreground mt-1">草稿或待审批</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">平均分</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{periodStats.stats.averageScore}</div>
              <p className="text-xs text-muted-foreground mt-1">本周期平均分数</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 绩效分布统计 */}
      {distributionData && (
        <Card>
          <CardHeader>
            <CardTitle>绩效分布统计</CardTitle>
            <CardDescription>本周期员工绩效等级分布情况</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(distributionData.distribution).map(([key, value]: [string, any]) => (
              <div key={key}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">{getLevelLabel(key)}</span>
                  <span className="text-sm text-muted-foreground">
                    {value.count} 人 ({value.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getDistributionColor(key)}`}
                    style={{ width: `${value.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* 员工排序表 */}
      <Card>
        <CardHeader>
          <CardTitle>员工排序表</CardTitle>
          <CardDescription>点击分数可编辑，支持拖拽调整排名</CardDescription>
        </CardHeader>
        <CardContent>
          {rankingLoading ? (
            <div className="text-center py-8 text-muted-foreground">加载中...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-sm">排名</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">姓名</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">职位</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">部门</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">总分</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">等级</th>
                    <th className="text-left py-3 px-4 font-semibold text-sm">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRanking.map((item: EmployeeRanking) => (
                    <tr key={item.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 text-sm font-medium">{item.rank}</td>
                      <td className="py-3 px-4 text-sm">{item.employee?.name}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{item.employee?.position?.name}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{item.employee?.department?.name}</td>
                      <td
                        className="py-3 px-4 text-sm font-semibold cursor-pointer hover:bg-blue-50 rounded"
                        onClick={() => {
                          setEditingId(item.id);
                          setEditingScore(item.totalScore);
                        }}
                      >
                        {editingId === item.id ? (
                          <Input
                            type="number"
                            value={editingScore || ''}
                            onChange={(e) => setEditingScore(e.target.value ? parseFloat(e.target.value) : null)}
                            onBlur={() => handleScoreSave(item)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleScoreSave(item);
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                            autoFocus
                            className="w-20"
                          />
                        ) : (
                          item.totalScore
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <Badge className={getLevelColor(item.level)}>{item.level}</Badge>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingId(item.id);
                            setEditingScore(item.totalScore);
                          }}
                        >
                          编辑
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 部门对比 */}
      {departmentComparison && (
        <Card>
          <CardHeader>
            <CardTitle>部门对比</CardTitle>
            <CardDescription>各部门的绩效统计对比</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {departmentComparison.map((dept: any) => (
                <div key={dept.departmentId} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-foreground">{dept.departmentName}</h3>
                    <span className="text-sm text-muted-foreground">
                      {dept.total} 人 | 平均分: {dept.averageScore}
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {Object.entries(dept.distribution).map(([key, count]: [string, any]) => (
                      <div key={key} className="text-center">
                        <div className={`rounded p-2 text-white text-sm font-semibold ${getDistributionColor(key)}`}>
                          {count}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{getLevelLabel(key).split(' ')[0]}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 快速操作 */}
      <div className="flex gap-3 justify-end">
        <Button variant="outline" className="gap-2" onClick={handleExport}>
          <Download className="w-4 h-4" />
          导出排序表
        </Button>
        <Button className="gap-2" onClick={handlePublish} disabled={isPublishing}>
          <Lock className="w-4 h-4" />
          {isPublishing ? '发布中...' : '定版发布'}
        </Button>
      </div>
    </div>
  );
}
