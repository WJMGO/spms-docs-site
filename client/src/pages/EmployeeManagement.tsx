import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, Edit2, Trash2, Download, Upload } from 'lucide-react';
import EmployeeBatchImport from '@/components/EmployeeBatchImport';

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
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 'emp1',
      name: '张三',
      email: 'zhangsan@example.com',
      role: 'user',
      departmentId: 'dept1',
      createdAt: new Date('2026-01-01'),
      updatedAt: new Date('2026-01-01'),
    },
    {
      id: 'emp2',
      name: '李四',
      email: 'lisi@example.com',
      role: 'user',
      departmentId: 'dept1',
      createdAt: new Date('2026-01-02'),
      updatedAt: new Date('2026-01-02'),
    },
    {
      id: 'emp3',
      name: '王五',
      email: 'wangwu@example.com',
      role: 'admin',
      departmentId: 'dept2',
      createdAt: new Date('2026-01-03'),
      updatedAt: new Date('2026-01-03'),
    },
  ]);

  const departments: Department[] = [
    { id: 'dept1', name: '平台设计一部' },
    { id: 'dept2', name: '平台设计二部' },
    { id: 'dept3', name: '基础架构部' },
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'createdAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // 筛选和排序逻辑
  const filteredEmployees = useMemo(() => {
    let filtered = employees;

    // 搜索过滤
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (emp) =>
          emp.name.toLowerCase().includes(query) ||
          emp.email.toLowerCase().includes(query)
      );
    }

    // 部门过滤
    if (selectedDepartment) {
      filtered = filtered.filter((emp) => emp.departmentId === selectedDepartment);
    }

    // 角色过滤
    if (selectedRole) {
      filtered = filtered.filter((emp) => emp.role === selectedRole);
    }

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
  }, [employees, searchQuery, selectedDepartment, selectedRole, sortBy, sortOrder]);

  const handleCreateEmployee = (formData: any) => {
    const newEmployee: Employee = {
      id: `emp_${Date.now()}`,
      ...formData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setEmployees([...employees, newEmployee]);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateEmployee = (formData: any) => {
    if (editingEmployee) {
      setEmployees(
        employees.map((emp) =>
          emp.id === editingEmployee.id
            ? { ...emp, ...formData, updatedAt: new Date() }
            : emp
        )
      );
      setIsEditDialogOpen(false);
      setEditingEmployee(null);
    }
  };

  const handleDeleteEmployee = (id: string) => {
    if (confirm('确定要删除该员工吗？')) {
      setEmployees(employees.filter((emp) => emp.id !== id));
    }
  };

  const handleExport = () => {
    const csv = [
      ['ID', '姓名', '邮箱', '部门', '角色', '创建时间'].join(','),
      ...filteredEmployees.map((emp) =>
        [
          emp.id,
          emp.name,
          emp.email,
          departments.find((d) => d.id === emp.departmentId)?.name || '',
          emp.role,
          emp.createdAt.toISOString(),
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employees_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
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
                <Button variant="outline" onClick={handleExport} className="gap-2">
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
              <Select value={`${sortBy}_${sortOrder}`} onValueChange={(val) => {
                const [by, order] = val.split('_');
                setSortBy(by as 'name' | 'email' | 'createdAt');
                setSortOrder(order as 'asc' | 'desc');
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="排序方式" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name_asc">姓名 (升序)</SelectItem>
                  <SelectItem value="name_desc">姓名 (降序)</SelectItem>
                  <SelectItem value="email_asc">邮箱 (升序)</SelectItem>
                  <SelectItem value="email_desc">邮箱 (降序)</SelectItem>
                  <SelectItem value="createdAt_desc">最新创建</SelectItem>
                  <SelectItem value="createdAt_asc">最早创建</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 员工表格 */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted">
                    <TableHead>姓名</TableHead>
                    <TableHead>邮箱</TableHead>
                    <TableHead>部门</TableHead>
                    <TableHead>角色</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        没有找到匹配的员工
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredEmployees.map((employee) => (
                      <TableRow key={employee.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{employee.name}</TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell>{getDepartmentName(employee.departmentId)}</TableCell>
                        <TableCell>{getRoleBadge(employee.role)}</TableCell>
                        <TableCell>{employee.createdAt.toLocaleDateString('zh-CN')}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingEmployee(employee);
                                setIsEditDialogOpen(true);
                              }}
                            >
                              <Edit2 size={16} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteEmployee(employee.id)}
                            >
                              <Trash2 size={16} className="text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* 创建员工对话框 */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>新增员工</DialogTitle>
              <DialogDescription>填写员工信息并保存</DialogDescription>
            </DialogHeader>
            <EmployeeForm
              departments={departments}
              onSubmit={handleCreateEmployee}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* 编辑员工对话框 */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>编辑员工</DialogTitle>
              <DialogDescription>修改员工信息并保存</DialogDescription>
            </DialogHeader>
            {editingEmployee && (
              <EmployeeForm
                departments={departments}
                initialData={editingEmployee}
                onSubmit={handleUpdateEmployee}
                onCancel={() => {
                  setIsEditDialogOpen(false);
                  setEditingEmployee(null);
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

// 员工表单组件
function EmployeeForm({
  departments,
  initialData,
  onSubmit,
  onCancel,
}: {
  departments: Department[];
  initialData?: Employee;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    departmentId: initialData?.departmentId || '',
    role: initialData?.role || 'user',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.departmentId) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">姓名</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="请输入员工姓名"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">邮箱</label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="请输入员工邮箱"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">部门</label>
        <Select value={formData.departmentId} onValueChange={(val) => setFormData({ ...formData, departmentId: val })}>
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
        <Select value={formData.role} onValueChange={(val) => setFormData({ ...formData, role: val as 'admin' | 'user' })}>
          <SelectTrigger>
            <SelectValue placeholder="选择角色" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">普通员工</SelectItem>
            <SelectItem value="admin">管理员</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2 justify-end pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button type="submit">保存</Button>
      </div>
    </form>
  );
}
