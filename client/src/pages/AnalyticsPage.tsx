import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Download, TrendingUp, BarChart3, Users, FileText } from 'lucide-react';

// 临时使用Mock数据，后续替换为真实API调用
const mockCompanyStats = {
  totalAssessments: 156,
  approvedAssessments: 98,
  averageScore: 82.5,
  maxScore: 125,
  minScore: 65,
  scoreDistribution: {
    excellent: 30,
    good: 45,
    fair: 20,
    poor: 5,
  },
  statusDistribution: {
    draft: 35,
    submitted: 23,
    approved: 98,
    rejected: 0,
  },
};

const mockDimensionDistribution = {
  dailyWork: { excellent: 25, good: 40, fair: 30, pass: 5, fail: 0 },
  workQuality: { excellent: 35, good: 45, fair: 15, pass: 5, fail: 0 },
  personalGoal: { excellent: 30, good: 35, fair: 25, pass: 10, fail: 0 },
  departmentReview: { excellent: 20, good: 40, fair: 30, pass: 10, fail: 0 },
  bonus: { excellent: 40, good: 35, fair: 20, pass: 5, fail: 0 },
  penalty: { excellent: 90, good: 5, fair: 3, pass: 2, fail: 0 },
};

const mockDepartmentComparison = [
  {
    departmentName: '平台设计一部',
    totalEmployees: 25,
    totalAssessments: 23,
    averageScore: 118.5,
    dimensions: {
      dailyWork: 95.2,
      workQuality: 12.5,
      personalGoal: 12.8,
      departmentReview: 4.2,
      bonus: 12.3,
      penalty: -1.5,
    },
  },
  {
    departmentName: '平台设计二部',
    totalEmployees: 20,
    totalAssessments: 19,
    averageScore: 115.3,
    dimensions: {
      dailyWork: 92.8,
      workQuality: 11.5,
      personalGoal: 11.2,
      departmentReview: 3.8,
      bonus: 11.5,
      penalty: -2.5,
    },
  },
  {
    departmentName: '基础架构部',
    totalEmployees: 18,
    totalAssessments: 17,
    averageScore: 112.7,
    dimensions: {
      dailyWork: 90.5,
      workQuality: 10.8,
      personalGoal: 10.5,
      departmentReview: 3.5,
      bonus: 10.8,
      penalty: -3.2,
    },
  },
];

const mockTrendData = [
  { periodName: '2025年12月', averageScore: 115.2, totalAssessments: 45, approvedAssessments: 42 },
  { periodName: '2026年1月', averageScore: 117.8, totalAssessments: 48, approvedAssessments: 46 },
  { periodName: '2026年2月', averageScore: 118.5, totalAssessments: 52, approvedAssessments: 50 },
  { periodName: '2026年3月', averageScore: 119.3, totalAssessments: 58, approvedAssessments: 56 },
];

const mockEmployeeRanking = [
  {
    id: '1',
    rank: 1,
    employeeName: '张三',
    departmentName: '平台设计一部',
    positionName: '高级工程师',
    totalScore: 125.5,
    level: '优秀',
  },
  {
    id: '2',
    rank: 2,
    employeeName: '李四',
    departmentName: '平台设计一部',
    positionName: '工程师',
    totalScore: 122.3,
    level: '优秀',
  },
  {
    id: '3',
    rank: 3,
    employeeName: '王五',
    departmentName: '平台设计二部',
    positionName: '产品经理',
    totalScore: 118.7,
    level: '良好',
  },
  {
    id: '4',
    rank: 4,
    employeeName: '赵六',
    departmentName: '基础架构部',
    positionName: '设计师',
    totalScore: 115.2,
    level: '良好',
  },
  {
    id: '5',
    rank: 5,
    employeeName: '钱七',
    departmentName: '平台设计二部',
    positionName: '工程师',
    totalScore: 112.8,
    level: '良好',
  },
];

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [periodId, setPeriodId] = useState('current');
  const [departmentId, setDepartmentId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

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

  // 处理刷新数据
  const handleRefresh = () => {
    setIsLoading(true);
    // 这里应该调用真实的API
    setTimeout(() => setIsLoading(false), 1000);
  };

  // 处理导出
  const handleExport = (type: string) => {
    console.log(`Export ${type}`);
    // 这里应该实现导出功能
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground">数据分析</h1>
            <p className="text-muted-foreground mt-2">绩效数据的多维度分析和可视化展示</p>
          </div>
          <div className="flex gap-2">
            <Select value={periodId} onValueChange={setPeriodId}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="选择周期" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">当前周期</SelectItem>
                <SelectItem value="2026-03">2026年3月</SelectItem>
                <SelectItem value="2026-02">2026年2月</SelectItem>
                <SelectItem value="2026-01">2026年1月</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              刷新
            </Button>
            <Button variant="outline" onClick={() => handleExport('all')}>
              <Download className="w-4 h-4 mr-2" />
              导出全部
            </Button>
          </div>
        </div>

        {/* 快速筛选 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              快速筛选
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">部门</label>
                <Select value={departmentId} onValueChange={setDepartmentId}>
                  <SelectTrigger>
                    <SelectValue placeholder="全部部门" />
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
                <label className="text-sm font-medium mb-2 block">评分状态</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部状态</SelectItem>
                    <SelectItem value="approved">已批准</SelectItem>
                    <SelectItem value="submitted">已提交</SelectItem>
                    <SelectItem value="draft">草稿</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">绩效等级</label>
                <Select defaultValue="all">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部等级</SelectItem>
                    <SelectItem value="excellent">优秀</SelectItem>
                    <SelectItem value="good">良好</SelectItem>
                    <SelectItem value="fair">一般</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button className="w-full">应用筛选</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 标签页内容 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">数据概览</TabsTrigger>
            <TabsTrigger value="dimensions">维度分析</TabsTrigger>
            <TabsTrigger value="employees">员工排行</TabsTrigger>
            <TabsTrigger value="trends">趋势分析</TabsTrigger>
          </TabsList>

          {/* 数据概览 */}
          <TabsContent value="overview" className="space-y-6">
            {/* 统计卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">总评分数</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockCompanyStats.totalAssessments}</div>
                  <p className="text-xs text-muted-foreground">本周期评分总数</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">平均分</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mockCompanyStats.averageScore}</div>
                  <p className="text-xs text-muted-foreground">
                    最高分: {mockCompanyStats.maxScore} | 最低分: {mockCompanyStats.minScore}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">完成率</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {((mockCompanyStats.approvedAssessments / mockCompanyStats.totalAssessments) * 100).toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    已完成 {mockCompanyStats.approvedAssessments}/{mockCompanyStats.totalAssessments}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">优秀率</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(mockCompanyStats.scoreDistribution.excellent / mockCompanyStats.totalAssessments * 100).toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    优秀人数: {mockCompanyStats.scoreDistribution.excellent}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* 分数分布和状态分布 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>分数分布</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(mockCompanyStats.scoreDistribution).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{getLevelLabel(key)}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-muted rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getDistributionColor(key)}`}
                              style={{ width: `${(value / mockCompanyStats.totalAssessments) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-12 text-right">{value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>状态分布</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(mockCompanyStats.statusDistribution).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">{key}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-muted rounded-full h-2">
                            <div
                              className="h-2 rounded-full bg-blue-500"
                              style={{ width: `${(value / mockCompanyStats.totalAssessments) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-12 text-right">{value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 部门对比 */}
            <Card>
              <CardHeader>
                <CardTitle>部门对比</CardTitle>
                <CardDescription>各部门绩效评分对比</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDepartmentComparison.map((dept, index) => (
                    <div key={dept.departmentName} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold">{dept.departmentName}</h3>
                        <Badge className="text-lg">
                          {dept.averageScore} 分
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">日常工作</p>
                          <p className="font-medium">{dept.dimensions.dailyWork}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">工作质量</p>
                          <p className="font-medium">{dept.dimensions.workQuality}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">个人目标</p>
                          <p className="font-medium">{dept.dimensions.personalGoal}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">部门互评</p>
                          <p className="font-medium">{dept.dimensions.departmentReview}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">绩效加分</p>
                          <p className="font-medium">{dept.dimensions.bonus}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">绩效减分</p>
                          <p className="font-medium text-red-600">{dept.dimensions.penalty}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 维度分析 */}
          <TabsContent value="dimensions" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Object.entries(mockDimensionDistribution).map(([dimension, data]) => (
                <Card key={dimension}>
                  <CardHeader>
                    <CardTitle className="capitalize">{dimension === 'dailyWork' ? '日常工作' :
                                                    dimension === 'workQuality' ? '工作质量' :
                                                    dimension === 'personalGoal' ? '个人目标' :
                                                    dimension === 'departmentReview' ? '部门互评' :
                                                    dimension === 'bonus' ? '绩效加分' : '绩效减分'}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(data).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-sm">{getLevelLabel(key)}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-muted rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${getDistributionColor(key)}`}
                                style={{ width: `${(value / Math.max(...Object.values(data))) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm w-8 text-right">{value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 员工排行 */}
          <TabsContent value="employees" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>员工排名</CardTitle>
                <CardDescription>按绩效评分排名的员工列表</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-semibold text-sm">排名</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm">姓名</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm">部门</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm">职位</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm">总分</th>
                        <th className="text-left py-3 px-4 font-semibold text-sm">等级</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockEmployeeRanking.map((employee) => (
                        <tr key={employee.id} className="border-b border-border hover:bg-muted/50">
                          <td className="py-3 px-4 text-sm font-medium">{employee.rank}</td>
                          <td className="py-3 px-4 text-sm">{employee.employeeName}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{employee.departmentName}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{employee.positionName}</td>
                          <td className="py-3 px-4 text-sm font-semibold">{employee.totalScore}</td>
                          <td className="py-3 px-4">
                            <Badge className={getLevelColor(employee.level)}>{employee.level}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 趋势分析 */}
          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>趋势分析</CardTitle>
                <CardDescription>绩效评分的历史趋势变化</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTrendData.map((data, index) => (
                    <div key={data.periodName} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{data.periodName}</h3>
                        <p className="text-sm text-muted-foreground">
                          完成率: {((data.approvedAssessments / data.totalAssessments) * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{data.averageScore}</div>
                        <p className="text-sm text-muted-foreground">平均分</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}