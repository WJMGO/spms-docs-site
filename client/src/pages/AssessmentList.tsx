import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, Plus, Eye, Edit2 } from 'lucide-react';

/**
 * 绩效评分列表页面
 * 显示所有评分记录，支持筛选、搜索、创建新评分
 */
export default function AssessmentList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [periodFilter, setPeriodFilter] = useState<string>('all');

  // 模拟数据 - 实际应该从 API 获取
  const assessments = [
    {
      id: 'assess-1',
      employeeName: '张三',
      departmentName: '技术部',
      periodName: '2026年3月',
      status: 'submitted',
      totalScore: '85.5',
      submittedAt: '2026-03-30',
    },
    {
      id: 'assess-2',
      employeeName: '李四',
      departmentName: '产品部',
      periodName: '2026年3月',
      status: 'approved',
      totalScore: '92.0',
      submittedAt: '2026-03-28',
    },
    {
      id: 'assess-3',
      employeeName: '王五',
      departmentName: '技术部',
      periodName: '2026年3月',
      status: 'draft',
      totalScore: null,
      submittedAt: null,
    },
  ];

  const periods = [
    { id: 'period-1', name: '2026年1月' },
    { id: 'period-2', name: '2026年2月' },
    { id: 'period-3', name: '2026年3月' },
  ];

  const assessmentsLoading = false;
  const periodsLoading = false;

  // 过滤和搜索评分
  const filteredAssessments = useMemo(() => {
    return assessments.filter((assessment: any) => {
      // 状态筛选
      if (statusFilter !== 'all' && assessment.status !== statusFilter) {
        return false;
      }

      // 周期筛选
      if (periodFilter !== 'all' && assessment.periodName !== periods.find((p) => p.id === periodFilter)?.name) {
        return false;
      }

      // 搜索筛选（按员工名称或评分ID）
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          assessment.employeeName?.toLowerCase().includes(searchLower) ||
          assessment.id?.toLowerCase().includes(searchLower) ||
          assessment.departmentName?.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [assessments, statusFilter, periodFilter, searchTerm]);

  // 获取状态徽章颜色
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      draft: { variant: 'secondary', label: '草稿' },
      submitted: { variant: 'outline', label: '已提交' },
      approved: { variant: 'default', label: '已批准' },
      rejected: { variant: 'destructive', label: '已拒绝' },
    };

    const config = statusMap[status] || { variant: 'secondary', label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // 处理创建新评分
  const handleCreateAssessment = () => {
    window.location.href = '/assessment/create';
  };

  // 处理查看评分详情
  const handleViewAssessment = (assessmentId: string) => {
    window.location.href = `/assessment/${assessmentId}`;
  };

  // 处理编辑评分
  const handleEditAssessment = (assessmentId: string) => {
    window.location.href = `/assessment/${assessmentId}/edit`;
  };

  if (assessmentsLoading || periodsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">绩效评分</h1>
          <p className="text-muted-foreground mt-2">查看和管理所有绩效评分记录</p>
        </div>
        <Button onClick={handleCreateAssessment} className="gap-2">
          <Plus className="w-4 h-4" />
          新建评分
        </Button>
      </div>

      {/* 筛选和搜索栏 */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 搜索框 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="搜索员工名称或评分ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* 状态筛选 */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="筛选状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="draft">草稿</SelectItem>
                <SelectItem value="submitted">已提交</SelectItem>
                <SelectItem value="approved">已批准</SelectItem>
                <SelectItem value="rejected">已拒绝</SelectItem>
              </SelectContent>
            </Select>

            {/* 周期筛选 */}
            <Select value={periodFilter} onValueChange={setPeriodFilter}>
              <SelectTrigger>
                <SelectValue placeholder="筛选周期" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部周期</SelectItem>
                {periods?.map((period: any) => (
                  <SelectItem key={period.id} value={period.id}>
                    {period.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 评分列表 */}
      <div className="space-y-4">
        {filteredAssessments.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-muted-foreground">暂无评分记录</p>
            </CardContent>
          </Card>
        ) : (
          filteredAssessments.map((assessment: any) => (
            <Card key={assessment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  {/* 左侧信息 */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{assessment.employeeName}</h3>
                      {getStatusBadge(assessment.status)}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">部门</p>
                        <p className="font-medium">{assessment.departmentName}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">周期</p>
                        <p className="font-medium">{assessment.periodName}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">总分</p>
                        <p className="font-medium text-lg">
                          {assessment.totalScore ? parseFloat(assessment.totalScore).toFixed(2) : '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">提交时间</p>
                        <p className="font-medium">
                          {assessment.submittedAt ? new Date(assessment.submittedAt).toLocaleDateString() : '-'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 右侧操作按钮 */}
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewAssessment(assessment.id)}
                      className="gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      查看
                    </Button>
                    {(assessment.status === 'draft' || assessment.status === 'rejected') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditAssessment(assessment.id)}
                        className="gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        编辑
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 统计信息 */}
      <Card>
        <CardHeader>
          <CardTitle>统计信息</CardTitle>
          <CardDescription>当前筛选条件下的统计数据</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">总数</p>
              <p className="text-2xl font-bold">{filteredAssessments.length}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">已批准</p>
              <p className="text-2xl font-bold text-green-600">
                {filteredAssessments.filter((a: any) => a.status === 'approved').length}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">已提交</p>
              <p className="text-2xl font-bold text-blue-600">
                {filteredAssessments.filter((a: any) => a.status === 'submitted').length}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">草稿</p>
              <p className="text-2xl font-bold text-gray-600">
                {filteredAssessments.filter((a: any) => a.status === 'draft').length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
