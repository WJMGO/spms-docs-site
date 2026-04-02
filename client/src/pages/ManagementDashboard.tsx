import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, Download, Lock } from 'lucide-react';
// import { trpc } from '@/lib/trpc';
// 临时使用 mock 数据，后续集成真实 API

interface EmployeeRanking {
  id: string;
  employeeId: string;
  employeeName: string;
  employeePosition: string;
  departmentId: string;
  departmentName: string;
  totalScore: number;
  status: string;
  rank: number;
  level: string;
}

interface DistributionStats {
  excellent: { count: number; percentage: number };
  good: { count: number; percentage: number };
  fair: { count: number; percentage: number };
  pass: { count: number; percentage: number };
  fail: { count: number; percentage: number };
}

export default function ManagementDashboard() {
  const [periodId, setPeriodId] = useState('current');
  const [departmentId, setDepartmentId] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<'score_desc' | 'score_asc' | 'name' | 'rank'>('score_desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingScore, setEditingScore] = useState<number | null | string>(null);

  // Mock 数据（后续替换为真实 API）
  const rankingData: EmployeeRanking[] = [
    { id: '1', employeeId: 'emp-1', employeeName: '张三', employeePosition: 'posId-1', departmentId: 'dept-1', departmentName: '技术部', totalScore: 95.5, status: 'approved', rank: 1, level: '优秀' },
    { id: '2', employeeId: 'emp-2', employeeName: '李四', employeePosition: 'posId-2', departmentId: 'dept-1', departmentName: '技术部', totalScore: 92.3, status: 'approved', rank: 2, level: '优秀' },
    { id: '3', employeeId: 'emp-3', employeeName: '王五', employeePosition: 'posId-3', departmentId: 'dept-2', departmentName: '产品部', totalScore: 88.7, status: 'approved', rank: 3, level: '良好' },
  ];
  const rankingLoading = false;

  const distributionData = {
    distribution: {
      excellent: { count: 6, percentage: 18 },
      good: { count: 14, percentage: 44 },
      fair: { count: 8, percentage: 25 },
      pass: { count: 3, percentage: 9 },
      fail: { count: 1, percentage: 3 },
    },
  };

  const departmentComparison = [
    {
      departmentId: 'dept-1',
      departmentName: '技术部',
      total: 12,
      averageScore: 85.5,
      distribution: { excellent: 4, good: 5, fair: 2, pass: 1, fail: 0 },
    },
    {
      departmentId: 'dept-2',
      departmentName: '产品部',
      total: 10,
      averageScore: 82.3,
      distribution: { excellent: 2, good: 5, fair: 2, pass: 1, fail: 0 },
    },
  ];

  const periodStats = {
    stats: {
      total: 32,
      completed: 28,
      pending: 4,
      averageScore: 83.5,
      draft: 2,
      submitted: 18,
      approved: 10,
      rejected: 2,
    },
  };

  // 过滤和搜索员工
  const filteredRanking = useMemo(() => {
    if (!rankingData) return [];
    return rankingData.filter((item: EmployeeRanking) =>
      item.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [rankingData, searchQuery]);

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

  return (
    <div className="space-y-6 p-6">
      {/* 标题 */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">管理层绩效处理仪表板</h1>
        <p className="text-muted-foreground mt-2">月底绩效数据处理、调整排名以及部门间排序穿插</p>
      </div>

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
                  <SelectItem value="dept-1">技术部</SelectItem>
                  <SelectItem value="dept-2">产品部</SelectItem>
                  <SelectItem value="dept-3">运营部</SelectItem>
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
                  {filteredRanking.map((item: EmployeeRanking, index: number) => (
                    <tr key={item.id} className="border-b border-border hover:bg-muted/50">
                      <td className="py-3 px-4 text-sm font-medium">{item.rank}</td>
                      <td className="py-3 px-4 text-sm">{item.employeeName}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{item.employeePosition}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{item.departmentName}</td>
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
                    onBlur={() => setEditingId(null)}
                    autoFocus
                    className="w-16"
                  />
                        ) : (
                          item.totalScore
                        )}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <Badge className={getLevelColor(item.level)}>{item.level}</Badge>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <Button variant="ghost" size="sm">
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
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          导出排序表
        </Button>
        <Button className="gap-2">
          <Lock className="w-4 h-4" />
          定版发布
        </Button>
      </div>
    </div>
  );
}
