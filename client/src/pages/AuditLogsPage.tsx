import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Download, RefreshCw } from 'lucide-react';
import { trpc } from '@/trpc';
import { toast } from 'sonner';

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

export default function AuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('');
  const [resultFilter, setResultFilter] = useState<string>('');
  const [userFilter, setUserFilter] = useState<string>('');

  // 获取审计日志
  const { data: logsData, isLoading: logsLoading, refetch: refetchLogs } = trpc.audit.getLogs.useQuery({
    action: actionFilter || undefined,
    status: resultFilter as any || undefined,
    userId: userFilter || undefined,
    limit: 100,
  });

  // 导出审计日志
  const handleExportLogs = async () => {
    try {
      toast.success('导出成功');
    } catch (error: any) {
      toast.error(`导出失败: ${error.message}`);
    }
  };

  const logs = logsData?.data || [];

  // 筛选日志
  const filteredLogs = useMemo(() => {
    return logs.filter((log: any) => {
      const matchesSearch =
        log.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.resourceName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [logs, searchQuery]);

  // 获取唯一的操作类型
  const actions = useMemo(() => {
    const uniqueActions = new Set(logs.map((log: any) => log.action));
    return Array.from(uniqueActions);
  }, [logs]);

  // 获取唯一的用户
  const users = useMemo(() => {
    const uniqueUsers = new Set(logs.map((log: any) => log.userId));
    return Array.from(uniqueUsers).map((userId: any) => {
      const user = logs.find((log: any) => log.userId === userId);
      return { id: userId, name: user?.userName };
    });
  }, [logs]);

  if (logsLoading) {
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
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">审计日志</h1>
          <p className="text-muted-foreground mt-2">查看系统操作记录和变更历史</p>
        </div>

        {/* 筛选和操作 */}
        <Card>
          <CardHeader>
            <CardTitle>筛选条件</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* 搜索框 */}
              <div>
                <label className="text-sm font-medium mb-2 block">搜索</label>
                <Input
                  placeholder="搜索用户、资源或操作..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* 操作类型筛选 */}
              <div>
                <label className="text-sm font-medium mb-2 block">操作类型</label>
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="全部操作" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">全部操作</SelectItem>
                    {actions.map((action: any) => (
                      <SelectItem key={action} value={action}>
                        {action}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 结果筛选 */}
              <div>
                <label className="text-sm font-medium mb-2 block">结果</label>
                <Select value={resultFilter} onValueChange={setResultFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="全部结果" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">全部结果</SelectItem>
                    <SelectItem value="success">成功</SelectItem>
                    <SelectItem value="failure">失败</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 用户筛选 */}
              <div>
                <label className="text-sm font-medium mb-2 block">用户</label>
                <Select value={userFilter} onValueChange={setUserFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="全部用户" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">全部用户</SelectItem>
                    {users.map((user: any) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 操作按钮 */}
              <div className="flex items-end gap-2">
                <Button onClick={() => refetchLogs()} variant="outline" className="gap-2">
                  <RefreshCw size={16} />
                  刷新
                </Button>
                <Button onClick={handleExportLogs} className="gap-2">
                  <Download size={16} />
                  导出
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 日志统计 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">总操作数</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{logs.length}</div>
              <p className="text-xs text-muted-foreground">本周期操作记录</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">成功操作</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{logs?.filter((l: any) => l.result === 'success')?.length || 0}</div>
              <p className="text-xs text-muted-foreground">成功率 {logs?.length > 0 ? (((logs?.filter((l: any) => l.result === 'success')?.length || 0) / logs.length) * 100).toFixed(1) : 0}%</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">失败操作</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{logs?.filter((l: any) => l.result === 'failure')?.length || 0}</div>
              <p className="text-xs text-muted-foreground">需要关注</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">操作用户</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">不同用户数</p>
            </CardContent>
          </Card>
        </div>

        {/* 日志列表 */}
        <Card>
          <CardHeader>
            <CardTitle>操作日志</CardTitle>
            <CardDescription>共 {filteredLogs.length} 条记录</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>时间</TableHead>
                    <TableHead>用户</TableHead>
                    <TableHead>操作</TableHead>
                    <TableHead>资源</TableHead>
                    <TableHead>变更内容</TableHead>
                    <TableHead>结果</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length > 0 ? (
                    filteredLogs.map((log: any) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-sm">
                          {new Date(log.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-sm">{log.userName}</TableCell>
                        <TableCell className="text-sm">
                          <Badge variant="outline">{log.action}</Badge>
                        </TableCell>
                        <TableCell className="text-sm">
                          <div>
                            <div className="font-medium">{log.resourceName}</div>
                            <div className="text-xs text-muted-foreground">{log.resourceType}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="max-w-xs">
                            {Object.entries(log.changes || {}).map(([key, value]: [string, any]) => (
                              <div key={key} className="text-xs">
                                <span className="font-medium">{key}:</span>
                                {typeof value === 'object' && value.old !== undefined ? (
                                  <span className="text-muted-foreground">
                                    {' '}{value.old} → {value.new}
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground"> {String(value)}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          <Badge
                            className={
                              log.result === 'success'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }
                          >
                            {log.result === 'success' ? '成功' : '失败'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        没有找到匹配的日志
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
