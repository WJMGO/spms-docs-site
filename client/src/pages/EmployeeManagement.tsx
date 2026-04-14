import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit2, Trash2, Download } from 'lucide-react';
import EmployeeBatchImport from '@/components/EmployeeBatchImport';
import { trpc } from '@/trpc';
import { toast } from 'sonner';

interface Employee {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  departmentId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Department {
  id: string;
  name: string;
}

export default function EmployeeManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'createdAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newEmployeeData, setNewEmployeeData] = useState({
    name: '',
    email: '',
    departmentId: '',
    role: 'user' as const,
  });

  // 获取员工列表
  const { data: employeeList, isLoading: employeesLoading, refetch: refetchEmployees } = trpc.employees.list.useQuery({
    page: 1,
    pageSize: 100,
    search: searchQuery,
    departmentId: selectedDepartment || undefined,
    role: (selectedRole as 'admin' | 'user') || undefined,
    sortBy: sortBy as any,
    sortOrder: sortOrder as any,
  });

  const employees = employeeList?.data || [];
  const departments: Department[] = [
    { id: 'dept1', name: '平台设计一部' },
    { id: 'dept2', name: '平台设计二部' },
    { id: 'dept3', name: '基础架构部' },
  ];

  // 创建员工
  const createMutation = trpc.employees.create.useMutation({
    onSuccess: () => {
      toast.success('员工创建成功');
      setIsCreateDialogOpen(false);
      setNewEmployeeData({ name: '', email: '', departmentId: '', role: 'user' });
      refetchEmployees();
    },
    onError: (error) => {
      toast.error(`创建失败: ${error.message}`);
    },
  });

  // 更新员工
  const updateMutation = trpc.employees.update.useMutation({
    onSuccess: () => {
      toast.success('员工更新成功');
      setIsEditDialogOpen(false);
      setEditingEmployee(null);
      refetchEmployees();
    },
    onError: (error) => {
      toast.error(`更新失败: ${error.message}`);
    },
  });

  // 删除员工
  const deleteMutation = trpc.employees.delete.useMutation({
    onSuccess: () => {
      toast.success('员工删除成功');
      refetchEmployees();
    },
    onError: (error) => {
      toast.error(`删除失败: ${error.message}`);
    },
  });

  // 导出员工
  const { data: exportData } = trpc.employees.export.useQuery({
    format: 'csv',
    departmentId: selectedDepartment || undefined,
  });

  const handleExportClick = () => {
    if (!exportData) {
      toast.error('数据加载中...');
      return;
    }
    
    try {
      // 创建 CSV 文件并下载
      const csv = typeof exportData === 'string' ? exportData : (exportData as any).data;
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `employees_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('导出成功');
    } catch (error: any) {
      toast.error(`导出失败: ${error.message}`);
    }
  };

  // 筛选和排序逻辑
  // 筛选员工（客户端过滤）
  const filteredEmployees = useMemo(() => {
    let filtered = employees;

    // 排序
    filtered.sort((a, b) => {
      let aVal: any = a[sortBy];
      let bVal: any = b[sortBy];

      if (sortBy === 'createdAt') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [employees, sortBy, sortOrder]);

  const handleCreateEmployee = () => {
    if (!newEmployeeData.name || !newEmployeeData.email || !newEmployeeData.departmentId) {
      toast.error('请填写所有必填字段');
      return;
    }
    createMutation.mutate(newEmployeeData);
  };

  const handleUpdateEmployee = () => {
    if (!editingEmployee) return;
    updateMutation.mutate({
      id: editingEmployee.id,
      name: editingEmployee.name,
      email: editingEmployee.email,
      departmentId: editingEmployee.departmentId,
      role: editingEmployee.role,
    });
  };

  const handleDeleteEmployee = (id: string) => {
    if (confirm('确定要删除该员工吗？')) {
      deleteMutation.mutate({ id });
    }
  };



  const getDepartmentName = (deptId: string) => {
    return departments.find((d) => d.id === deptId)?.name || '-';
  };

  const getRoleBadge = (role: string) => {
    return role === 'admin' ? (
      <Badge className="bg-red-100 text-red-800">管理员</Badge>
    ) : (
      <Badge className="bg-blue-100 text-blue-800">普通员工</Badge>
    );
  };

  if (employeesLoading) {
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
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">员工管理</h1>
          <p className="text-muted-foreground mt-2">管理系统中的所有员工信息</p>
        </div>

        {/* 操作栏 */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>员工列表</CardTitle>
                <CardDescription>共 {filteredEmployees.length} 名员工</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="gap-2"
                >
                  <Plus size={16} />
                  新增员工
                </Button>
                <Button variant="outline" onClick={handleExportClick} className="gap-2">
                  <Download size={16} />
                  导出
                </Button>
                <EmployeeBatchImport />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* 搜索和筛选 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {/* 搜索框 */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input
                  placeholder="搜索员工名称或邮箱..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* 部门筛选 */}
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="选择部门" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">全部部门</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* 角色筛选 */}
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="选择角色" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">全部角色</SelectItem>
                  <SelectItem value="admin">管理员</SelectItem>
                  <SelectItem value="user">普通员工</SelectItem>
                </SelectContent>
              </Select>

              {/* 排序 */}
              <Select value={`${sortBy}_${sortOrder}`} onValueChange={(value) => {
                const [by, order] = value.split('_');
                setSortBy(by as any);
                setSortOrder(order as any);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="排序方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name_asc">名称 (升序)</SelectItem>
                  <SelectItem value="name_desc">名称 (降序)</SelectItem>
                  <SelectItem value="email_asc">邮箱 (升序)</SelectItem>
                  <SelectItem value="email_desc">邮箱 (降序)</SelectItem>
                  <SelectItem value="createdAt_desc">创建时间 (最新)</SelectItem>
                  <SelectItem value="createdAt_asc">创建时间 (最早)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 员工表格 */}
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>姓名</TableHead>
                    <TableHead>邮箱</TableHead>
                    <TableHead>部门</TableHead>
                    <TableHead>角色</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((emp) => (
                      <TableRow key={emp.id}>
                        <TableCell className="font-medium">{emp.name}</TableCell>
                        <TableCell>{emp.email}</TableCell>
                        <TableCell>{getDepartmentName(emp.departmentId)}</TableCell>
                        <TableCell>{getRoleBadge(emp.role)}</TableCell>
                        <TableCell>{new Date(emp.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingEmployee({
                                  ...emp,
                                  role: emp.role as 'admin' | 'user',
                                  createdAt: new Date(emp.createdAt),
                                  updatedAt: new Date(emp.updatedAt),
                                });
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit2 size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteEmployee(emp.id)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        没有找到匹配的员工
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 创建员工对话框 */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新增员工</DialogTitle>
            <DialogDescription>填写员工信息</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">姓名</label>
              <Input
                value={newEmployeeData.name}
                onChange={(e) => setNewEmployeeData({ ...newEmployeeData, name: e.target.value })}
                placeholder="输入员工姓名"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">邮箱</label>
              <Input
                type="email"
                value={newEmployeeData.email}
                onChange={(e) => setNewEmployeeData({ ...newEmployeeData, email: e.target.value })}
                placeholder="输入员工邮箱"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">部门</label>
              <Select value={newEmployeeData.departmentId} onValueChange={(value) => setNewEmployeeData({ ...newEmployeeData, departmentId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="选择部门" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">角色</label>
              <Select value={newEmployeeData.role} onValueChange={(value) => setNewEmployeeData({ ...newEmployeeData, role: value as any })}>
                <SelectTrigger>
                  <SelectValue placeholder="选择角色" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">普通员工</SelectItem>
                  <SelectItem value="admin">管理员</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                取消
              </Button>
              <Button onClick={handleCreateEmployee} disabled={createMutation.isPending}>
                {createMutation.isPending ? '创建中...' : '创建'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 编辑员工对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑员工</DialogTitle>
            <DialogDescription>修改员工信息</DialogDescription>
          </DialogHeader>
          {editingEmployee && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">姓名</label>
                <Input
                  value={editingEmployee.name}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, name: e.target.value })}
                  placeholder="输入员工姓名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">邮箱</label>
                <Input
                  type="email"
                  value={editingEmployee.email}
                  onChange={(e) => setEditingEmployee({ ...editingEmployee, email: e.target.value })}
                  placeholder="输入员工邮箱"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">部门</label>
                <Select value={editingEmployee.departmentId} onValueChange={(value) => setEditingEmployee({ ...editingEmployee, departmentId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择部门" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">角色</label>
                <Select value={editingEmployee.role} onValueChange={(value) => setEditingEmployee({ ...editingEmployee, role: value as any })}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择角色" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">普通员工</SelectItem>
                    <SelectItem value="admin">管理员</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  取消
                </Button>
                <Button onClick={handleUpdateEmployee} disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? '保存中...' : '保存'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
