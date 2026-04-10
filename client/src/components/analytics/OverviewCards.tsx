import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Users,
  Building,
  Target,
  Award,
  AlertTriangle,
  Plus,
  Minus
} from "lucide-react";

interface OverviewCardsProps {
  companyStats: any;
  departmentStats: any;
  isLoading: boolean;
}

export function OverviewCards({ companyStats, departmentStats, isLoading }: OverviewCardsProps) {
  // Mock data for development
  const mockCompanyStats = {
    totalEmployees: 156,
    avgScore: 87.5,
    excellentRate: 23.4,
    improvementRate: 12.8,
    totalAssessments: 624,
    completionRate: 95.2,
  };

  const mockDepartmentStats = {
    bestDepartment: { name: "技术部", score: 92.3 },
    worstDepartment: { name: "市场部", score: 78.9 },
    avgDepartmentScore: 85.6,
    topPerformers: 45,
    needsImprovement: 23,
  };

  const stats = { company: mockCompanyStats, department: mockDepartmentStats };

  const StatCard = ({ title, value, subtitle, icon: Icon, trend, trendValue, color }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color || "text-muted-foreground"}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center justify-between mt-1">
          <p className="text-xs text-muted-foreground">{subtitle}</p>
          {trend && (
            <div className={`flex items-center gap-1 text-xs ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
              {trend === "up" ? <Plus className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
              {trendValue}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Company Overview Cards */}
      <div>
        <h3 className="text-lg font-semibold mb-4">公司绩效概览</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="员工总数"
            value={stats.company.totalEmployees}
            subtitle="在职员工"
            icon={Users}
            trend="up"
            trendValue="5.2%"
          />
          <StatCard
            title="平均得分"
            value={stats.company.avgScore}
            subtitle="百分制"
            icon={Target}
            trend="up"
            trendValue="2.3%"
          />
          <StatCard
            title="优秀率"
            value={`${stats.company.excellentRate}%`}
            subtitle="优秀员工占比"
            icon={Award}
            trend="up"
            trendValue="3.1%"
          />
          <StatCard
            title="完成率"
            value={`${stats.company.completionRate}%`}
            subtitle="评估完成率"
            icon={CheckCircle}
          />
        </div>
      </div>

      {/* Department Overview Cards */}
      <div>
        <h3 className="text-lg font-semibold mb-4">部门绩效对比</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="最高评分部门"
            value={stats.department.bestDepartment.score}
            subtitle={stats.department.bestDepartment.name}
            icon={TrendingUp}
            color="text-green-600"
          />
          <StatCard
            title="平均部门得分"
            value={stats.department.avgDepartmentScore}
            subtitle="所有部门平均"
            icon={Building}
          />
          <StatCard
            title="优秀员工"
            value={stats.department.topPerformers}
            subtitle="表现突出"
            icon={Award}
            trend="up"
            trendValue="8.7%"
          />
          <StatCard
            title="待提升"
            value={stats.department.needsImprovement}
            subtitle="需要改进"
            icon={AlertTriangle}
            trend="down"
            trendValue="2.1%"
          />
        </div>
      </div>

      {/* Performance Indicators */}
      <div>
        <h3 className="text-lg font-semibold mb-4">关键绩效指标</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">评估进度</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stats.company.totalAssessments}</div>
                <Badge variant="outline">总数</Badge>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                已完成 {stats.company.totalAssessments * stats.company.completionRate / 100} 项
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">环比增长</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-green-600">+{stats.company.improvementRate}%</div>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                相比上期提升
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">部门差异</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {stats.department.bestDepartment.score - stats.department.worstDepartment.score}
                </div>
                <Badge variant="outline">分差</Badge>
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                最高与最低相差
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CheckCircle() {
  return <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>;
}