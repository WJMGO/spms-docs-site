import React, { useState, useRef } from 'react';
import { Upload, AlertCircle, CheckCircle2, X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { trpc } from '@/trpc';
import { toast } from 'sonner';

interface ParsedEmployee {
  name: string;
  email: string;
  departmentId: string;
  role?: 'admin' | 'user';
  errors?: string[];
}

interface ParseResult {
  success: boolean;
  data: ParsedEmployee[];
  summary: {
    total: number;
    valid: number;
    invalid: number;
  };
  errors: string[];
  warnings: string[];
}

export default function EmployeeBatchImport() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const parseFileMutation = trpc.employees.parseFile.useMutation();
  const importBatchMutation = trpc.employees.importBatch.useMutation();

  // 处理文件选择
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      toast.error('文件格式错误，请上传 CSV 或 Excel 文件');
      return;
    }

    setSelectedFile(file);
    await parseFile(file);
  };

  // 解析文件
  const parseFile = async (file: File): Promise<void> => {
    try {
      setIsLoading(true);
      const fileContent = await file.text();

      const result = await parseFileMutation.mutateAsync({
        fileContent,
        filename: file.name,
      });

      setParseResult(result);
      
      // 默认选中所有行
      const validIds = result.data.map((_, idx) => idx.toString());
      setSelectedRows(new Set(validIds));

      if (result.summary.invalid > 0) {
        toast.warning(`部分数据验证失败：有效数据 ${result.summary.valid} 条，无效数据 ${result.summary.invalid} 条`);
      }
    } catch (error) {
      toast.error(`文件解析失败：${error instanceof Error ? error.message : '未知错误'}`);
      setParseResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理行选择
  const toggleRowSelection = (id: string): void => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRows(newSelected);
  };

  // 全选/取消全选
  const toggleAllRows = (): void => {
    if (selectedRows.size === parseResult?.data.length) {
      setSelectedRows(new Set());
    } else {
      const validIds = parseResult?.data.map((_, idx) => idx.toString()) || [];
      setSelectedRows(new Set(validIds));
    }
  };

  // 执行批量导入
  const handleImport = async (): Promise<void> => {
    if (!parseResult || selectedRows.size === 0) {
      toast.error('请选择要导入的员工');
      return;
    }

      try {
      setIsLoading(true);
      const selectedEmployees = parseResult.data.filter((_, idx) => selectedRows.has(idx.toString()));

      await importBatchMutation.mutateAsync({
        employees: selectedEmployees.map(emp => ({
          name: emp.name,
          email: emp.email,
          departmentId: emp.departmentId,
          role: emp.role || 'user',
        })),
      });

      toast.success(`成功导入 ${selectedEmployees.length} 名员工`);

      // 重置状态
      setIsOpen(false);
      setSelectedFile(null);
      setParseResult(null);
      setSelectedRows(new Set());
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      toast.error(`导入失败：${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 下载模板
  const downloadTemplate = (): void => {
    const template = 'name,email,department,position\n示例员工,example@company.com,技术部,工程师';
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'employee_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="gap-2"
      >
        <Upload size={16} />
        批量导入
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>批量导入员工</DialogTitle>
            <DialogDescription>
              上传 CSV 或 Excel 文件来批量导入员工信息
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* 文件上传区域 */}
            {!parseResult && (
              <div className="space-y-4">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-accent transition-colors"
                >
                  <Upload className="mx-auto mb-2 text-muted-foreground" size={32} />
                  <p className="font-medium">点击选择文件或拖拽上传</p>
                  <p className="text-sm text-muted-foreground">支持 CSV 和 Excel 格式</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadTemplate}
                  >
                    <Download size={16} className="mr-2" />
                    下载模板
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    CSV 文件需要包含以下列：name（姓名）、email（邮箱）、departmentId（部门ID）
                  </p>
                </div>


              </div>
            )}

            {/* 解析结果 */}
            {parseResult && (
              <div className="space-y-4">
                {/* 统计信息 */}
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">总数</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{parseResult.summary.total}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-green-600">有效</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">{parseResult.summary.valid}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-red-600">无效</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">{parseResult.summary.invalid}</div>
                    </CardContent>
                  </Card>
                </div>

                {/* 错误信息 */}
                {parseResult.errors.length > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="font-medium mb-2">文件解析错误：</div>
                      <ul className="list-disc list-inside space-y-1">
                        {parseResult.errors.map((error, idx) => (
                          <li key={idx} className="text-sm">{error}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {/* 数据预览表格 */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                    <h3 className="font-medium">数据预览</h3>
                    {parseResult.data.length > 0 && (
                      <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <Checkbox
                          checked={selectedRows.size === parseResult.data.length}
                          onCheckedChange={toggleAllRows}
                        />
                        全选所有数据
                      </label>
                    )}
                  </div>

                  <div className="border rounded-lg overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted">
                          <th className="px-4 py-2 text-left w-12">
                            <Checkbox
                              checked={selectedRows.size === parseResult.data.length}
                              onCheckedChange={toggleAllRows}
                            />
                          </th>
                          <th className="px-4 py-2 text-left">姓名</th>
                          <th className="px-4 py-2 text-left">邮箱</th>
                          <th className="px-4 py-2 text-left">部门ID</th>
                          <th className="px-4 py-2 text-left">角色</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parseResult.data.map((emp, idx) => (
                          <tr
                            key={idx}
                            className={`border-b ${emp.errors && emp.errors.length > 0 ? 'bg-red-50' : ''}`}
                          >
                            <td className="px-4 py-2">
                              <Checkbox
                                checked={selectedRows.has(idx.toString())}
                                onCheckedChange={() => toggleRowSelection(idx.toString())}
                              />
                            </td>
                            <td className="px-4 py-2">{emp.name}</td>
                            <td className="px-4 py-2">{emp.email}</td>
                            <td className="px-4 py-2">{emp.departmentId}</td>
                            <td className="px-4 py-2">{emp.role || 'user'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setParseResult(null);
                      setSelectedFile(null);
                      setSelectedRows(new Set());
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    disabled={isLoading}
                  >
                    重新选择
                  </Button>
                  <Button
                    onClick={handleImport}
                    disabled={selectedRows.size === 0 || isLoading}
                    className="gap-2"
                  >
                    {isLoading ? '导入中...' : `导入 ${selectedRows.size} 条数据`}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
