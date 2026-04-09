import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Download,
  FileText,
  Eye,
  MoreHorizontal,
  Calendar,
  Filter,
  CheckCircle,
  Clock
} from "lucide-react";

interface Report {
  id: string;
  name: string;
  type: string;
  department: string;
  period: string;
  status: "已完成" | "生成中" | "失败";
  generatedAt: string;
  format: "Excel" | "PDF" | "CSV";
  size: string;
  downloadUrl: string;
}

interface ReportListProps {
  reports: Report[];
  isLoading: boolean;
  onExport: (report: Report) => void;
}

export function ReportList({ reports, isLoading, onExport }: ReportListProps) {
  const [sortField, setSortField] = useState<"generatedAt" | "name">("generatedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const sortedReports = [...reports].sort((a, b) => {
    if (sortField === "generatedAt") {
      const dateA = new Date(a.generatedAt);
      const dateB = new Date(b.generatedAt);
      return sortDirection === "desc" ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime();
    } else {
      return sortDirection === "desc"
        ? b.name.localeCompare(a.name)
        : a.name.localeCompare(b.name);
    }
  });

  const handleSort = (field: "generatedAt" | "name") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "已完成":
        return <Badge variant="default" className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          {status}
        </Badge>;
      case "生成中":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1 animate-spin" />
          {status}
        </Badge>;
      case "失败":
        return <Badge variant="destructive">失败</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "Excel":
        return "📊";
      case "PDF":
        return "📄";
      case "CSV":
        return "📋";
      default:
        return "📄";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p>加载报表列表...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedReports.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-1">暂无报表</h3>
            <p className="text-muted-foreground text-sm">
              当前没有生成的报表，请先创建报表
            </p>
            <Button className="mt-4">
              创建新报表
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* 报表统计 */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {reports.filter(r => r.status === "已完成").length}
              </div>
              <div className="text-muted-foreground">已完成</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {reports.filter(r => r.status === "生成中").length}
              </div>
              <div className="text-muted-foreground">生成中</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {reports.filter(r => r.status === "失败").length}
              </div>
              <div className="text-muted-foreground">失败</div>
            </div>
          </div>

          {/* 报表表格 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">报表列表 ({sortedReports.length})</CardTitle>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  筛选
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort("name")}
                      >
                        报表名称 {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead>类型</TableHead>
                      <TableHead>部门</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>格式</TableHead>
                      <TableHead
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSort("generatedAt")}
                      >
                        生成时间 {sortField === "generatedAt" && (sortDirection === "asc" ? "↑" : "↓")}
                      </TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <span>{getFormatIcon(report.format)}</span>
                            <span className="max-w-[200px] truncate">{report.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{report.type}</TableCell>
                        <TableCell>{report.department}</TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{report.format}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(report.generatedAt).toLocaleString("zh-CN")}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {report.status === "已完成" && (
                                <>
                                  <DropdownMenuItem onClick={() => onExport(report)}>
                                    <Download className="mr-2 h-4 w-4" />
                                    下载报表
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" />
                                    预览报表
                                  </DropdownMenuItem>
                                </>
                              )}
                              <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" />
                                查看详情
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                重新生成
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}