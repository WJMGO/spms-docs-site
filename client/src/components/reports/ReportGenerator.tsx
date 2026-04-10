import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Calendar,
  Users,
  Building,
  Target,
  Download,
  Settings,
  Eye,
  Plus
} from "lucide-react";

interface ReportGeneratorProps {
  onGenerate: (params: any) => Promise<void>;
  isLoading: boolean;
}

const reportTypes = [
  { value: "monthly", label: "月度绩效报表", description: "生成指定月份的部门和个人绩效报表" },
  { value: "quarterly", label: "季度绩效报表", description: "生成指定季度的综合绩效分析报表" },
  { value: "annual", label: "年度绩效报表", description: "生成全年度的绩效总结和发展建议" },
  { value: "custom", label: "自定义报表", description: "根据特定需求生成定制化报表" },
  { value: "comparison", label: "对比分析报表", description: "不同时间段或部门间的对比分析" },
  { value: "trend", label: "趋势分析报表", description: "绩效数据的变化趋势和预测分析" },
];

export function ReportGenerator({ onGenerate, isLoading }: ReportGeneratorProps) {
  const [selectedType, setSelectedType] = useState<string>("");
  const [reportName, setReportName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [includeCharts, setIncludeCharts] = useState<boolean>(true);
  const [includeDetails, setIncludeDetails] = useState<boolean>(true);
  const [format, setFormat] = useState<string>("excel");

  const departments = [
    { value: "all", label: "全公司" },
    { value: "tech", label: "技术部" },
    { value: "sales", label: "销售部" },
    { value: "marketing", label: "市场部" },
    { value: "hr", label: "人力资源部" },
    { value: "finance", label: "财务部" },
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

  const handleDepartmentChange = (value: string, checked: boolean) => {
    if (checked) {
      setSelectedDepartments([...selectedDepartments, value]);
    } else {
      setSelectedDepartments(selectedDepartments.filter(dept => dept !== value));
    }
  };

  const handleGenerate = async () => {
    if (!selectedType || !reportName || !selectedPeriod || selectedDepartments.length === 0) {
      alert("请填写所有必填项");
      return;
    }

    const params = {
      type: selectedType,
      name: reportName,
      description,
      departments: selectedDepartments,
      period: selectedPeriod,
      includeCharts,
      includeDetails,
      format,
    };

    try {
      await onGenerate(params);
      // 重置表单
      setReportName("");
      setDescription("");
      setSelectedDepartments([]);
      setSelectedPeriod("");
    } catch (error) {
      console.error("生成失败:", error);
    }
  };

  const selectedReportType = reportTypes.find(type => type.value === selectedType);

  return (
    <div className="space-y-6">
      {/* 报表类型选择 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            选择报表类型
          </CardTitle>
          <CardDescription>
            选择您需要生成的报表类型
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTypes.map((type) => (
              <div
                key={type.value}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedType === type.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => setSelectedType(type.value)}
              >
                <div className="font-medium mb-1">{type.label}</div>
                <div className="text-sm text-muted-foreground">{type.description}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 基本信息设置 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            基本信息
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="reportName">报表名称 *</Label>
            <Input
              id="reportName"
              placeholder="请输入报表名称"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="description">报表描述</Label>
            <Textarea
              id="description"
              placeholder="请输入报表的详细描述（可选）"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div>
            <Label>输出格式</Label>
            <div className="flex gap-2 mt-2">
              <Button
                variant={format === "excel" ? "default" : "outline"}
                size="sm"
                onClick={() => setFormat("excel")}
              >
                Excel
              </Button>
              <Button
                variant={format === "pdf" ? "default" : "outline"}
                size="sm"
                onClick={() => setFormat("pdf")}
              >
                PDF
              </Button>
              <Button
                variant={format === "csv" ? "default" : "outline"}
                size="sm"
                onClick={() => setFormat("csv")}
              >
                CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 数据范围选择 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            数据范围
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
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
        </CardContent>
      </Card>

      {/* 高级选项 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            高级选项
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">包含图表</div>
              <div className="text-sm text-muted-foreground">在报表中包含可视化图表</div>
            </div>
            <Checkbox
              checked={includeCharts}
              onCheckedChange={(checked) => setIncludeCharts(checked === true)}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">包含详细数据</div>
              <div className="text-sm text-muted-foreground">包含原始评分数据</div>
            </div>
            <Checkbox
              checked={includeDetails}
              onCheckedChange={(checked) => setIncludeDetails(checked === true)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 预览和生成 */}
      {selectedReportType && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              报表预览
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <span className="text-muted-foreground">报表类型：</span>
                <Badge variant="outline">{selectedReportType.label}</Badge>
              </div>
              <div>
                <span className="text-muted-foreground">报表描述：</span>
                <p className="text-sm mt-1">{selectedReportType.description}</p>
              </div>
              {reportName && (
                <div>
                  <span className="text-muted-foreground">报表名称：</span>
                  <p className="font-medium">{reportName}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 生成按钮 */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" disabled={isLoading}>
          保存模板
        </Button>
        <Button
          onClick={handleGenerate}
          disabled={isLoading || !selectedType || !reportName || !selectedPeriod || selectedDepartments.length === 0}
        >
          {isLoading ? "生成中..." : "生成报表"}
          {!isLoading && <Download className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}