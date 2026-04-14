import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Download, Filter, RefreshCw } from 'lucide-react';
import { PermissionGuard } from '@/components/PermissionGuard';

interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resourceType: string;
  resourceId: string;
  resourceName: string;
  changes: Record<string, any>;
  result: 'success' | 'failure';
  errorMessage?: string;
  createdAt: Date;
}

// Mock 数据 - 后续替换为真实 API
const MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: '1',
    userId: 'user1',
    userName: '张三',
    action: 'update_score',
    resourceType: 'assessment',
    resourceId: 'assess1',
    resourceName: '李四 - 2026年Q1绩效评分',
    changes: {
      dailyWorkScore: { old: 80, new: 85 },
      workQualityScore: { old: 10, new: 12 },
    },
    result: 'success',
    createdAt: new Date('2026-04-14T10:30:00'),
  },
  {
    id: '2',
    userId: 'user2',
    userName: '王五',
    action: 'publish_final',
    resourceType: 'period',
    resourceId: 'period1',
    resourceName: '2026年Q1绩效评分周期',
    changes: {
      status: { old: 'in_progress', new: 'published' },
    },
    result: 'success',
    createdAt: new Date('2026-04-14T09:15:00'),
  },
  {
    id: '3',
    userId: 'user1',
    userName: '张三',
    action: 'update_ranking',
    resourceType: 'assessment',
    resourceId: 'assess2',
    resourceName: '赵六 - 2026年Q1绩效评分',
    changes: {
      rank: { old: 5, new: 3 },
    },
    result: 'success',
    createdAt: new Date('2026-04-14T08:45:00'),
  },
  {
    id: '4',
    userId: 'user3',
    userName: '孙七',
    action: 'save_work_quality_score',
    resourceType: 'assessment',
    resourceId: 'assess3',
    resourceName: '周八 - 2026年Q1绩效评分',
    changes: {
      codeReviewScore: { old: 0, new: 2 },
      bugReturnRate: { old: 0, new: 1 },
    },
    result: 'success',
    createdAt: new Date('2026-04-13T16:20:00'),
  },
  {
    id: '5',
    userId: 'user4',
    userName: '吴九',
    action: 'update_score',
    resourceType: 'assessment',
    resourceId: 'assess4',
    resourceName: '郑十 - 2026年Q1绩效评分',
    changes: {
      bonusScore: { old: 0, new: 5 },
    },
    result: 'failure',
    errorMessage: '权限不足，无法修改该评分',
    createdAt: new Date('2026-04-13T14:10:00'),
  },
];

const ACTION_LABELS: Record<string, string> = {
  update_score: '编辑分数',
  update_ranking: '更新排名',
  publish_final: '定版发布',
  save_work_quality_score: '保存工作质量分数',
  save_personal_goal_score: '保存个人目标分数',
  save_department_review_score: '保存部门互评分数',
  save_bonus_score: '保存绩效加分',
  save_penalty_score: '保存绩效减分',
  batch_update: '批量调整',
  assign_role: '分配角色',
  change_permission: '修改权限',
};

const RESOURCE_TYPE_LABELS: Record<string, string> = {
  assessment: '绩效评分',
  period: '评分周期',
  user: '用户',
  role: '角色',
  permission: '权限',
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>(MOCK_AUDIT_LOGS);
  const [searchText, setSearchText] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [resultFilter, setResultFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('all');

  // 筛选逻辑
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // 搜索文本筛选
      if (searchText && !log.userName.includes(searchText) && !log.resourceName.includes(searchText)) {
        return false;
      }

      // 操作类型筛选
      if (actionFilter !== 'all' && log.action !== actionFilter) {
        return false;
      }

      // 结果筛选
      if (resultFilter !== 'all' && log.result !== resultFilter) {
        return false;
      }

      // 日期范围筛选
      if (dateRange !== 'all') {
        const logDate = new Date(log.createdAt);
        const now = new Date();
        const diffTime = now.getTime() - logDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (dateRange === 'today' && diffDays > 1) return false;
        if (dateRange === 'week' && diffDays > 7) return false;
        if (dateRange === 'month' && diffDays > 30) return false;
      }

      return true;
    });
  }, [logs, searchText, actionFilter, resultFilter, dateRange]);

  // 导出功能
  const handleExport = (format: 'csv' | 'excel') => {
    if (format === 'csv') {
      const headers = ['操作人', '操作类型', '资源类型', '资源名称', '结果', '操作时间'];
      const rows = filteredLogs.map((log) => [
        log.userName,
        ACTION_LABELS[log.action] || log.action,
        RESOURCE_TYPE_LABELS[log.resourceType] || log.resourceType,
        log.resourceName,
        log.result === 'success' ? '成功' : '失败',
        new Date(log.createdAt).toLocaleString('zh-CN'),
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `audit-logs-${new Date().getTime()}.csv`);
      link.click();
    }
  };

  // 刷新数据
  const handleRefresh = () => {
    // 这里应该调用真实的 API 来刷新数据
    console.log('刷新审计日志数据');
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">操作审计日志</h1>
          <p className="text-muted-foreground">查看和管理系统中的所有操作记录</p>
        </div>

        {/* 筛选区域 */}
        <Card className="mb-6 p-6">
          <div className="space-y-4">
            {/* 搜索和快速操作 */}
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium text-foreground mb-2 block">搜索</label>
                <Input
                  placeholder="搜索操作人或资源名称..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleRefresh}
                title="刷新数据"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => handleExport('csv')}
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                导出 CSV
              </Button>
            </div>

            {/* 高级筛选 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">操作类型</label>
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部操作</SelectItem>
                    {Object.entries(ACTION_LABELS).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">操作结果</label>
                <Select value={resultFilter} onValueChange={setResultFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部结果</SelectItem>
                    <SelectItem value="success">成功</SelectItem>
                    <SelectItem value="failure">失败</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">时间范围</label>
                <Select value={dateRange} onValueChange={(v: any) => setDateRange(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">今天</SelectItem>
                    <SelectItem value="week">最近 7 天</SelectItem>
                    <SelectItem value="month">最近 30 天</SelectItem>
                    <SelectItem value="all">全部时间</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </Card>

        {/* 统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">总操作数</div>
            <div className="text-2xl font-bold text-foreground">{filteredLogs.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">成功操作</div>
            <div className="text-2xl font-bold text-green-600">
              {filteredLogs.filter((l) => l.result === 'success').length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">失败操作</div>
            <div className="text-2xl font-bold text-red-600">
              {filteredLogs.filter((l) => l.result === 'failure').length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground mb-1">成功率</div>
            <div className="text-2xl font-bold text-foreground">
              {filteredLogs.length > 0
                ? ((filteredLogs.filter((l) => l.result === 'success').length / filteredLogs.length) * 100).toFixed(1)
                : 0}
              %
            </div>
          </Card>
        </div>

        {/* 日志表格 */}
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>操作人</TableHead>
                  <TableHead>操作类型</TableHead>
                  <TableHead>资源类型</TableHead>
                  <TableHead>资源名称</TableHead>
                  <TableHead>结果</TableHead>
                  <TableHead>操作时间</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.userName}</TableCell>
                      <TableCell>{ACTION_LABELS[log.action] || log.action}</TableCell>
                      <TableCell>{RESOURCE_TYPE_LABELS[log.resourceType] || log.resourceType}</TableCell>
                      <TableCell className="max-w-xs truncate">{log.resourceName}</TableCell>
                      <TableCell>
                        <Badge variant={log.result === 'success' ? 'default' : 'destructive'}>
                          {log.result === 'success' ? '成功' : '失败'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(log.createdAt).toLocaleString('zh-CN')}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // 显示详情
                            console.log('查看详情:', log);
                          }}
                        >
                          详情
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      没有找到匹配的审计日志
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}
