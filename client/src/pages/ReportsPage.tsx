import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Download,
  FileText,
  Filter,
  RefreshCw,
  Search,
  BarChart3,
  PieChart,
  TrendingUp,
  Users
} from "lucide-react";
import { trpc } from "../trpc";
import { ReportList } from "../components/reports/ReportList";
import { ReportGenerator } from "../components/reports/ReportGenerator";
import { ExportTools } from "../components/reports/ExportTools";

// Mock data for development
const mockReports = [
  {
    id: "1",
    name: "2024年度绩效总览报表",
    type: "年度报表",
    department: "全公司",
    period: "2024-01-01至2024-12-31",
    status: "已完成",
    generatedAt: "2024-12-31 23:59:00",
    format: "Excel",
    size: "2.5 MB",
    downloadUrl: "#",
  },
  {
    id: "2",
    name: "Q4部门绩效对比报表",
    type: "季度报表",
    department: "技术部",
    period: "2024-10-01至2024-12-31",
    status: "已完成",
    generatedAt: "2024-12-31 18:00:00",
    format: "PDF",
    size: "1.2 MB",
    downloadUrl: "#",
  },
  {
    id: "3",
    name: "员工个人绩效明细报表",
    type: "个人报表",
    department: "市场部",
    period: "2024-11-01至2024-11-30",
    status: "生成中",
    generatedAt: "2024-12-01 10:30:00",
    format: "Excel",
    size: "0",
    downloadUrl: "#",
  },
];

const mockStats = {
  totalReports: 156,
  monthlyGenerated: 12,
  pendingReports: 3,
  popularTypes: [
    { type: "月度报表", count: 45 },
    { type: "季度报表", count: 32 },
    { type: "年度报表", count: 12 },
    { type: "自定义报表", count: 67 },
  ],
};

export default function ReportsPage() {
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [reportType, setReportType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState("list");

  // Mock API calls for development
  // const { data: reports = mockReports, isLoading: isLoadingReports } = trpc.reports.stats.useQuery();
  // const { data: stats = mockStats } = trpc.reports.stats.useQuery();
  const reports = mockReports;
  const stats = mockStats;
  const isLoadingReports = false;

  const handleGenerateReport = async (params: Record<string, unknown>) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log("生成报表参数:", params);
      // 实际调用: await trpc.reports.generateReport.mutateAsync(params);
    } catch (error) {
      console.error("生成报表失败:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async (type: string, params: any) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      console.log("导出类型:", type, "参数:", params);
      // 实际调用: await trpc.reports.exportData.mutateAsync({ type, ...params });
    } catch (error) {
      console.error("导出失败:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredReports = reports.filter((report: any) => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === "all" || report.department === selectedDepartment;
    const matchesType = reportType === "all" || report.type === reportType;
    return matchesSearch && matchesDepartment && matchesType;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">报表中心</h1>
          <p className="text-muted-foreground">管理和生成各类绩效报表</p>
        </div>
        <Button className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          快速生成报表
        </Button>
      </div>

      {/* 统计概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">报表总数</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReports}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.monthlyGenerated} 本月新增
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">进行中</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingReports}</div>
            <p className="text-xs text-muted-foreground">等待生成</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">本月生成</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.monthlyGenerated}</div>
            <p className="text-xs text-muted-foreground">12个报表</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">热门类型</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">自定义报表</div>
            <p className="text-xs text-muted-foreground">{stats.popularTypes[3].count} 个</p>
          </CardContent>
        </Card>
      </div>

      {/* Tab 导航 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">报表列表</TabsTrigger>
          <TabsTrigger value="generator">报表生成器</TabsTrigger>
          <TabsTrigger value="export">数据导出</TabsTrigger>
        </TabsList>

        {/* 报表列表 */}
        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>已生成的报表</CardTitle>
                  <CardDescription>
                    查看和管理已生成的所有报表
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    刷新
                  </Button>
                </div>
              </div>

              {/* 筛选器 */}
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="搜索报表名称..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="选择部门" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部部门</SelectItem>
                    <SelectItem value="技术部">技术部</SelectItem>
                    <SelectItem value="市场部">市场部</SelectItem>
                    <SelectItem value="销售部">销售部</SelectItem>
                    <SelectItem value="人力资源部">人力资源部</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="报表类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部类型</SelectItem>
                    <SelectItem value="月度报表">月度报表</SelectItem>
                    <SelectItem value="季度报表">季度报表</SelectItem>
                    <SelectItem value="年度报表">年度报表</SelectItem>
                    <SelectItem value="自定义报表">自定义报表</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>

            <CardContent>
              <ReportList
                reports={filteredReports as any}
                isLoading={isLoadingReports}
                onExport={(report: any) => handleExport(report.format.toLowerCase(), { reportId: report.id })}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* 报表生成器 */}
        <TabsContent value="generator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>报表生成器</CardTitle>
              <CardDescription>
                自定义生成各类绩效报表
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReportGenerator
                onGenerate={handleGenerateReport}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* 数据导出 */}
        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>数据导出工具</CardTitle>
              <CardDescription>
                导出各类绩效数据用于进一步分析
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ExportTools
                onExport={handleExport}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}