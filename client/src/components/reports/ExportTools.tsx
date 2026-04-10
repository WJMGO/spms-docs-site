import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  FileSpreadsheet,
  FileText,
  Database,
  Globe,
  BarChart3,
  PieChart,
  LineChart,
  Table,
  Calendar,
  Users,
  Building,
  Filter,
  CheckCircle
} from "lucide-react";

interface ExportToolsProps {
  onExport: (type: string, params: any) => Promise<void>;
  isLoading: boolean;
}

export function ExportTools({ onExport, isLoading }: ExportToolsProps) {
  const [selectedExportType, setSelectedExportType] = useState<string>("");
  const [selectedDataType, setSelectedDataType] = useState<string>("");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [includeMetadata, setIncludeMetadata] = useState<boolean>(true);
  const [format, setFormat] = useState<string>("excel");

  const exportTypes = [
    { value: "full", label: "完整数据导出", icon: Database, description: "导出所有绩效数据的完整数据集" },
    { value: "summary", label: "统计摘要导出", icon: BarChart3, description: "导出各类统计指标和汇总数据" },
    { value: "dimension", label: "维度分析导出", icon: PieChart, description: "导出六个维度的详细分析数据" },
    { value: "trend", label: "趋势数据导出", icon: LineChart, description: "导出时间序列和趋势分析数据" },
    { value: "ranking", label: "排名数据导出", icon: Users, description: "导出员工排名和对比数据" },
    { value: "custom", label: "自定义导出", icon: FileSpreadsheet, description: "根据自定义条件导出数据" },
  ];

  const dataTypes = [
    { value: "assessments", label: "绩效评估数据", description: "所有员工的绩效评估记录" },
    { value: "dimensions", label: "维度评分数据", description: "六个维度的详细评分数据" },
    { value: "departments", label: "部门汇总数据", description: "部门的绩效汇总统计" },
    { value: "employees", label: "员工个人信息", description: "员工的基本信息和关联数据" },
    { value: "periods", label: "考核周期数据", description: "考核周期的配置和历史记录" },
    { value: "all", label: "全部数据", description: "包含所有类型的数据" },
  ];

  const periods = [
    { value: "current-month", label: "本月" },
    { value: "last-month", label: "上月" },
    { value: "current-quarter", label: "本季度" },
    { value: "last-quarter", label: "上季度" },
    { value: "current-year", label: "本年度" },
    { value: "last-year", label: "上年度" },
    { value: "custom", label: "自定义时间范围" },
  ];

  const departments = [
    { value: "all", label: "全公司" },
    { value: "tech", label: "技术部" },
    { value: "sales", label: "销售部" },
    { value: "marketing", label: "市场部" },
    { value: "hr", label: "人力资源部" },
    { value: "finance", label: "财务部" },
  ];

  const handleDepartmentChange = (value: string, checked: boolean) => {
    if (checked) {
      setSelectedDepartments([...selectedDepartments, value]);
    } else {
      setSelectedDepartments(selectedDepartments.filter(dept => dept !== value));
    }
  };

  const handleExport = async () => {
    if (!selectedExportType || !selectedDataType || !selectedPeriod || selectedDepartments.length === 0) {
      alert("请填写所有必填项");
      return;
    }

    const params = {
      type: selectedExportType,
      dataType: selectedDataType,
      period: selectedPeriod,
      departments: selectedDepartments,
      includeMetadata,
      format,
    };

    try {
      await onExport(format, params);
    } catch (error) {
      console.error("导出失败:", error);
    }
  };

  const selectedExport = exportTypes.find(type => type.value === selectedExportType);
  const selectedData = dataTypes.find(type => type.value === selectedDataType);

  return (
    <div className="space-y-6">
      {/* 快速导出选项 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            快速导出
          </CardTitle>
          <CardDescription>
            选择预设的数据导出模板
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exportTypes.map((type) => {
              const Icon = type.icon;
              return (
                <div
                  key={type.value}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedExportType === type.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedExportType(type.value)}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <div className="font-medium">{type.label}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">{type.description}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 高级导出设置 */}
      {selectedExport && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              导出设置
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 数据类型选择 */}
            <div>
              <Label>数据类型 *</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                {dataTypes.map((type) => (
                  <div
                    key={type.value}
                    className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                      selectedDataType === type.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedDataType(type.value)}
                  >
                    <div className="font-medium text-sm">{type.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">{type.description}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 时间范围和部门选择 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>时间范围 *</Label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择时间范围" />
                  </SelectTrigger>
                  <SelectContent>
                    {periods.map((period) => (
                      <SelectItem key={period.value} value={period.value}>
                        {period.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>选择部门 *</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {departments.map((dept) => (
                    <div key={dept.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={dept.value}
                        checked={selectedDepartments.includes(dept.value)}
                        onCheckedChange={(checked) => handleDepartmentChange(dept.value, checked as boolean)}
                      />
                      <label htmlFor={dept.value} className="text-sm">
                        {dept.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 输出格式选项 */}
            <div>
              <Label>输出格式</Label>
              <div className="flex gap-2 mt-2">
                <Button
                  variant={format === "excel" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFormat("excel")}
                >
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Excel
                </Button>
                <Button
                  variant={format === "csv" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFormat("csv")}
                >
                  <Database className="w-4 h-4 mr-2" />
                  CSV
                </Button>
                <Button
                  variant={format === "pdf" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFormat("pdf")}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  PDF
                </Button>
              </div>
            </div>

            {/* 高级选项 */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">包含元数据</div>
                <div className="text-sm text-muted-foreground">
                  包含导出时间、用户信息等元数据
                </div>
              </div>
              <Checkbox
                checked={includeMetadata}
                onCheckedChange={(checked) => setIncludeMetadata(checked === true)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* 导出预览 */}
      {selectedExport && selectedData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              导出预览
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">导出类型：</span>
                <Badge variant="outline">{selectedExport.label}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">数据类型：</span>
                <Badge variant="outline">{selectedData.label}</Badge>
              </div>
              {selectedPeriod && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">时间范围：</span>
                  <span>{periods.find(p => p.value === selectedPeriod)?.label}</span>
                </div>
              )}
              {selectedDepartments.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">部门：</span>
                  {selectedDepartments.map(dept => (
                    <Badge key={dept} variant="outline" className="ml-1">
                      {departments.find(d => d.value === dept)?.label}
                    </Badge>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">格式：</span>
                <span className="font-medium">{format.toUpperCase()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 执行导出 */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" disabled={isLoading}>
          保存配置
        </Button>
        <Button
          onClick={handleExport}
          disabled={isLoading || !selectedExportType || !selectedDataType || !selectedPeriod || selectedDepartments.length === 0}
        >
          {isLoading ? "导出中..." : "开始导出"}
          {!isLoading && <Download className="ml-2 h-4 w-4" />}
        </Button>
      </div>

      {/* 导出历史 */}
      <Card>
        <CardHeader>
          <CardTitle>最近导出</CardTitle>
          <CardDescription>
            查看最近的导出记录
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { id: "1", name: "2024年12月绩效数据", type: "Excel", size: "2.3 MB", time: "2小时前" },
              { id: "2", name: "技术部季度对比分析", type: "PDF", size: "1.5 MB", time: "1天前" },
              { id: "3", name: "员工排名数据", type: "CSV", size: "856 KB", time: "3天前" },
            ].map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.type} • {item.size} • {item.time}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  重新下载
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}