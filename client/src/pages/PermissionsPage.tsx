import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { trpc } from '@/trpc';
import { toast } from 'sonner';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export default function PermissionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDescription, setNewRoleDescription] = useState('');

  // 使用 Mock 数据，待后集成真实 API
  const mockRoles = [
    {
      id: 'role1',
      name: '超级管理员',
      description: '拥有系统所有权限',
      permissions: ['user:view', 'user:create', 'user:update', 'user:delete', 'permission:manage'],
      userCount: 2,
    },
    {
      id: 'role2',
      name: '部门经理',
      description: '可以管理部门内的绩效评分',
      permissions: ['assessment:view', 'assessment:update', 'dashboard:view', 'analytics:view'],
      userCount: 5,
    },
    {
      id: 'role3',
      name: '评分员',
      description: '可以填写和提交绩效评分',
      permissions: ['assessment:view', 'assessment:create', 'assessment:update'],
      userCount: 20,
    },
  ];

  const mockPermissions = [
    { id: 'user:view', name: '查看用户', description: '可以查看用户列表', category: '用户管理' },
    { id: 'user:create', name: '创建用户', description: '可以创建新用户', category: '用户管理' },
    { id: 'user:update', name: '更新用户', description: '可以更新用户信息', category: '用户管理' },
    { id: 'user:delete', name: '删除用户', description: '可以删除用户', category: '用户管理' },
    { id: 'permission:manage', name: '管理权限', description: '可以管理权限配置', category: '权限管理' },
    { id: 'assessment:view', name: '查看评分', description: '可以查看评分信息', category: '评分管理' },
    { id: 'assessment:create', name: '创建评分', description: '可以创建新评分', category: '评分管理' },
    { id: 'assessment:update', name: '更新评分', description: '可以更新评分信息', category: '评分管理' },
    { id: 'dashboard:view', name: '查看仪表板', description: '可以查看管理仪表板', category: '仪表板' },
    { id: 'analytics:view', name: '查看报表', description: '可以查看数据报表', category: '报表' },
  ];

  const rolesData = mockRoles;
  const rolesLoading = false;
  const refetchRoles = () => {};
  const permissionsData = mockPermissions;
  const permissionsLoading = false;

  // TODO: 实现角色管理 API
  const handleCreateRole = async () => {
    try {
      toast.success('角色已创建');
      setNewRoleName('');
      setNewRoleDescription('');
      setSelectedPermissions([]);
    } catch (error: any) {
      toast.error(`创建失败: ${error.message}`);
    }
  };

  const handleUpdateRole = async (roleId: string) => {
    try {
      toast.success('角色已更新');
      setEditingRoleId(null);
      setSelectedPermissions([]);
    } catch (error: any) {
      toast.error(`更新失败: ${error.message}`);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      if (confirm('确定要删除此角色吗？')) {
        toast.success('角色已删除');
      }
    } catch (error: any) {
      toast.error(`删除失败: ${error.message}`);
    }
  };

  const roles = rolesData || [];
  const permissions = permissionsData || [];

  // 筛选角色
  const filteredRoles = roles.filter((role: any) =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 按类别分组权限
  const permissionsByCategory = permissions.reduce((acc: any, perm: any) => {
    if (!acc[perm.category]) {
      acc[perm.category] = [];
    }
    acc[perm.category].push(perm);
    return acc;
  }, {});



  const handleEditRole = (role: any) => {
    setEditingRoleId(role.id);
    setSelectedPermissions(role.permissions || []);
  };

  if (rolesLoading || permissionsLoading) {
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
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 页面标题 */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">权限管理</h1>
          <p className="text-muted-foreground mt-2">管理系统角色和权限</p>
        </div>

        {/* 操作栏 */}
        <div className="flex gap-4 items-center">
          <Input
            placeholder="搜索角色..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={16} />
                新建角色
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>新建角色</DialogTitle>
                <DialogDescription>创建一个新的系统角色并配置权限</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* 角色基本信息 */}
                <div>
                  <label className="text-sm font-medium mb-2 block">角色名称</label>
                  <Input
                    placeholder="输入角色名称"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">角色描述</label>
                  <Input
                    placeholder="输入角色描述"
                    value={newRoleDescription}
                    onChange={(e) => setNewRoleDescription(e.target.value)}
                  />
                </div>

                {/* 权限选择 */}
                <div>
                  <label className="text-sm font-medium mb-3 block">权限配置</label>
                  <div className="space-y-4 max-h-96 overflow-y-auto border rounded-lg p-4">
                    {Object.entries(permissionsByCategory).map(([category, perms]: [string, any]) => (
                      <div key={category}>
                        <h4 className="font-medium text-sm mb-2 text-foreground">{category}</h4>
                        <div className="space-y-2 ml-4">
                          {perms.map((perm: any) => (
                            <div key={perm.id} className="flex items-center gap-2">
                              <Checkbox
                                id={perm.id}
                                checked={selectedPermissions.includes(perm.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedPermissions([...selectedPermissions, perm.id]);
                                  } else {
                                    setSelectedPermissions(
                                      selectedPermissions.filter((p) => p !== perm.id)
                                    );
                                  }
                                }}
                              />
                              <label htmlFor={perm.id} className="text-sm cursor-pointer">
                                {perm.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-2 justify-end pt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setNewRoleName('');
                      setNewRoleDescription('');
                      setSelectedPermissions([]);
                    }}
                  >
                    取消
                  </Button>
                  <Button onClick={handleCreateRole}>
                    创建角色
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* 角色列表 */}
        <Card>
          <CardHeader>
            <CardTitle>角色列表</CardTitle>
            <CardDescription>共 {filteredRoles.length} 个角色</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>角色名称</TableHead>
                    <TableHead>描述</TableHead>
                    <TableHead>权限数</TableHead>
                    <TableHead>用户数</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRoles.length > 0 ? (
                    filteredRoles.map((role: any) => (
                      <TableRow key={role.id}>
                        <TableCell className="font-medium">{role.name}</TableCell>
                        <TableCell className="text-muted-foreground">{role.description}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{role.permissions?.length || 0}</Badge>
                        </TableCell>
                        <TableCell>{role.userCount || 0}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditRole(role)}
                                >
                                  <Edit2 size={16} />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>编辑角色 - {role.name}</DialogTitle>
                                  <DialogDescription>修改角色权限配置</DialogDescription>
                                </DialogHeader>

                                <div className="space-y-4">
                                  {/* 权限选择 */}
                                  <div>
                                    <label className="text-sm font-medium mb-3 block">权限配置</label>
                                    <div className="space-y-4 max-h-96 overflow-y-auto border rounded-lg p-4">
                                      {Object.entries(permissionsByCategory).map(([category, perms]: [string, any]) => (
                                        <div key={category}>
                                          <h4 className="font-medium text-sm mb-2 text-foreground">{category}</h4>
                                          <div className="space-y-2 ml-4">
                                            {perms.map((perm: any) => (
                                              <div key={perm.id} className="flex items-center gap-2">
                                                <Checkbox
                                                  id={`edit-${perm.id}`}
                                                  checked={selectedPermissions.includes(perm.id)}
                                                  onCheckedChange={(checked) => {
                                                    if (checked) {
                                                      setSelectedPermissions([...selectedPermissions, perm.id]);
                                                    } else {
                                                      setSelectedPermissions(
                                                        selectedPermissions.filter((p) => p !== perm.id)
                                                      );
                                                    }
                                                  }}
                                                />
                                                <label htmlFor={`edit-${perm.id}`} className="text-sm cursor-pointer">
                                                  {perm.name}
                                                </label>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* 操作按钮 */}
                                  <div className="flex gap-2 justify-end pt-4">
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        setEditingRoleId(null);
                                        setSelectedPermissions([]);
                                      }}
                                    >
                                      取消
                                    </Button>
                                    <Button
                                      onClick={() => handleUpdateRole(role.id)}
                                    >
                                      保存
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteRole(role.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        没有找到匹配的角色
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* 权限说明 */}
        <Card>
          <CardHeader>
            <CardTitle>权限说明</CardTitle>
            <CardDescription>系统中所有可用的权限</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(permissionsByCategory).map(([category, perms]: [string, any]) => (
                <div key={category}>
                  <h4 className="font-medium mb-2 text-foreground">{category}</h4>
                  <div className="space-y-2 ml-4">
                    {perms.map((perm: any) => (
                      <div key={perm.id} className="text-sm">
                        <div className="font-medium text-foreground">{perm.name}</div>
                        <div className="text-muted-foreground">{perm.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
