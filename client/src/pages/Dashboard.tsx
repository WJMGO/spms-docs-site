import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Users, FileText, CheckCircle2, Clock, AlertCircle, PenTool } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  // 模拟数据
  const stats = {
    totalAssessments: 156,
    completedAssessments: 98,
    pendingAssessments: 35,
    rejectedAssessments: 23,
    averageScore: 82.5,
    completionRate: 62.8,
  };

  const recentAssessments = [
    {
      id: 1,
      employeeName: "张三",
      department: "技术部",
      period: "2026年3月",
      status: "approved",
      score: 85.5,
      date: "2026-03-30",
    },
    {
      id: 2,
      employeeName: "李四",
      department: "产品部",
      period: "2026年3月",
      status: "submitted",
      score: null,
      date: "2026-03-29",
    },
    {
      id: 3,
      employeeName: "王五",
      department: "技术部",
      period: "2026年3月",
      status: "draft",
      score: null,
      date: "2026-03-28",
    },
    {
      id: 4,
      employeeName: "赵六",
      department: "运营部",
      period: "2026年3月",
      status: "rejected",
      score: 72.0,
      date: "2026-03-27",
    },
  ];

  const departmentStats = [
    { name: "技术部", total: 45, completed: 32, average: 84.2 },
    { name: "产品部", total: 38, completed: 24, average: 81.5 },
    { name: "运营部", total: 35, completed: 22, average: 79.8 },
    { name: "市场部", total: 28, completed: 15, average: 80.3 },
    { name: "人力资源部", total: 10, completed: 5, average: 83.0 },
  ];

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; variant: string; color: string }> = {
      approved: { label: "已批准", variant: "default", color: "bg-green-100 text-green-800" },
      submitted: { label: "已提交", variant: "outline", color: "bg-blue-100 text-blue-800" },
      draft: { label: "草稿", variant: "secondary", color: "bg-gray-100 text-gray-800" },
      rejected: { label: "已拒绝", variant: "destructive", color: "bg-red-100 text-red-800" },
    };

    const statusInfo = statusMap[status] || statusMap.draft;
    return (
      <Badge className={statusInfo.color}>
        {statusInfo.label}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">绩效管理系统</h1>
          <p className="text-muted-foreground">
            SPMS - System Software Performance Management System
          </p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总评分数</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAssessments}</div>
              <p className="text-xs text-muted-foreground">本周期评分总数</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">已完成</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedAssessments}</div>
              <p className="text-xs text-muted-foreground">已批准或提交</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">待处理</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingAssessments}</div>
              <p className="text-xs text-muted-foreground">草稿或待审批</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">平均分</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageScore}</div>
              <p className="text-xs text-muted-foreground">本周期平均评分</p>
            </CardContent>
          </Card>
        </div>

        {/* 标签页 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">概览</TabsTrigger>
            <TabsTrigger value="assessments">最近评分</TabsTrigger>
            <TabsTrigger value="departments">部门统计</TabsTrigger>
          </TabsList>

          {/* 概览标签页 */}
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>评分进度</CardTitle>
                <CardDescription>本周期评分完成情况</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">完成率</span>
                    <span className="text-sm font-bold">{stats.completionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${stats.completionRate}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">已批准</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">{stats.completedAssessments}</div>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium">待处理</span>
                    </div>
                    <div className="text-2xl font-bold text-yellow-600">{stats.pendingAssessments}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>系统功能</CardTitle>
                <CardDescription>已实现的核心功能模块</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">评分管理</h4>
                      <p className="text-xs text-muted-foreground">创建、编辑、提交绩效评分</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <BarChart3 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">数据分析</h4>
                      <p className="text-xs text-muted-foreground">统计、分析、可视化报表</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <Users className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">员工管理</h4>
                      <p className="text-xs text-muted-foreground">员工信息、部门管理</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <TrendingUp className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">趋势分析</h4>
                      <p className="text-xs text-muted-foreground">评分趋势、排名对比</p>
                    </div>
                  </div>

                  <Link href="/performance-registration">
                    <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200 cursor-pointer hover:bg-indigo-100 transition-colors">
                      <PenTool className="h-5 w-5 text-indigo-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">绩效登记</h4>
                        <p className="text-xs text-muted-foreground">填写个人绩效数据</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 最近评分标签页 */}
          <TabsContent value="assessments">
            <Card>
              <CardHeader>
                <CardTitle>最近评分</CardTitle>
                <CardDescription>最近提交的绩效评分记录</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAssessments.map((assessment) => (
                    <div
                      key={assessment.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-medium">{assessment.employeeName}</h4>
                          {getStatusBadge(assessment.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {assessment.department} • {assessment.period}
                        </p>
                      </div>
                      <div className="text-right">
                        {assessment.score ? (
                          <div className="text-2xl font-bold text-blue-600">{assessment.score}</div>
                        ) : (
                          <div className="text-sm text-muted-foreground">待评分</div>
                        )}
                        <p className="text-xs text-muted-foreground">{assessment.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 部门统计标签页 */}
          <TabsContent value="departments">
            <Card>
              <CardHeader>
                <CardTitle>部门统计</CardTitle>
                <CardDescription>各部门的评分情况统计</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentStats.map((dept, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{dept.name}</h4>
                          <p className="text-xs text-muted-foreground">
                            {dept.completed} / {dept.total} 已完成
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">{dept.average}</div>
                          <p className="text-xs text-muted-foreground">平均分</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${(dept.completed / dept.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* 快速操作 */}
        <div className="mt-8 flex gap-4">
          <Button size="lg" className="gap-2">
            <FileText className="h-4 w-4" />
            新建评分
          </Button>
          <Button size="lg" variant="outline" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            查看报表
          </Button>
          <Button size="lg" variant="outline" className="gap-2">
            <Users className="h-4 w-4" />
            管理员工
          </Button>
        </div>
      </div>
    </div>
  );
}
