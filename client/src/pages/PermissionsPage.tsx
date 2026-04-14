import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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

// Mock 数据 - 后续替换为真实 API
const MOCK_ROLES: Role[] = [
  {
    id: 'role1',
    name: '超级管理员',
    description: '拥有系统所有权限',
    permissions: [
      'assessments:view',
      'assessments:edit',
      'assessments:delete',
      'assessments:publish',
      'management:view',
      'management:edit',
      'analytics:view',
      'analytics:export',
      'audit_logs:view',
      'audit_logs:export',
      'permissions:manage',
      'users:manage',
    ],
    userCount: 2,
  },
  {
    id: 'role2',
    name: '部门经理',
    description: '可以管理部门内的绩效评分',
    permissions: [
      'assessments:view',
      'assessments:edit',
      'management:view',
      'management:edit',
      'analytics:view',
      'audit_logs:view',
    ],
    userCount: 5,
  },
  {
    id: 'role3',
    name: '评分员',
    description: '可以填写和提交绩效评分',
    permissions: ['assessments:view', 'assessments:edit'],
    userCount: 20,
  },
  {
    id: 'role4',
    name: '普通员工',
    description: '可以查看自己的绩效评分',
    permissions: ['assessments:view'],
    userCount: 100,
  },
];

const MOCK_PERMISSIONS: Permission[] = [
  {
    id: 'assessments:view',
    name: '查看绩效评分',
    description: '可以查看绩效评分列表和详情',
    category: '绩效评分',
  },
  {
    id: 'assessments:edit',
    name: '编辑绩效评分',
    description: '可以编辑和提交绩效评分',
    category: '绩效评分',
  },
  {
    id: 'assessments:delete',
    name: '删除绩效评分',
    description: '可以删除绩效评分记录',
    category: '绩效评分',
  },
  {
    id: 'assessments:publish',
    name: '发布绩效评分',
    description: '可以发布和定版绩效评分',
    category: '绩效评分',
  },
  {
    id: 'management:view',
    name: '查看管理层仪表板',
    description: '可以查看管理层仪表板',
    category: '管理',
  },
  {
    id: 'management:edit',
    name: '编辑管理层仪表板',
    description: '可以编辑分数和排名',
    category: '管理',
  },
  {
    id: 'analytics:view',
    name: '查看数据分析',
    description: '可以查看数据分析报表',
    category: '分析',
  },
  {
    id: 'analytics:export',
    name: '导出分析数据',
    description: '可以导出数据分析报表',
    category: '分析',
  },
  {
    id: 'audit_logs:view',
    name: '查看审计日志',
    description: '可以查看操作审计日志',
    category: '审计',
  },
  {
    id: 'audit_logs:export',
    name: '导出审计日志',
    description: '可以导出审计日志',
    category: '审计',
  },
  {
    id: 'permissions:manage',
    name: '管理权限',
    description: '可以管理角色和权限',
    category: '系统',
  },
  {
    id: 'users:manage',
    name: '管理用户',
    description: '可以管理用户和分配角色',
    category: '系统',
  },
];

export default function PermissionsPage() {
  const [roles, setRoles] = useState<Role[]>(MOCK_ROLES);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [searchText, setSearchText] = useState('');

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchText.toLowerCase()) ||
    role.description.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSaveRole = () => {
    if (!editingRole) return;

    const existingIndex = roles.findIndex((r) => r.id === editingRole.id);
    if (existingIndex >= 0) {
      const newRoles = [...roles];
      newRoles[existingIndex] = editingRole;
      setRoles(newRoles);
    } else {
      setRoles([...roles, { ...editingRole, id: `role${Date.now()}` }]);
    }

    setEditingRole(null);
  };

  const handleDeleteRole = (roleId: string) => {
    setRoles(roles.filter((r) => r.id !== roleId));
    if (selectedRole?.id === roleId) {
      setSelectedRole(null);
    }
  };

  const togglePermission = (permissionId: string) => {
    if (!editingRole) return;

    const permissions = editingRole.permissions.includes(permissionId)
      ? editingRole.permissions.filter((p) => p !== permissionId)
      : [...editingRole.permissions, permissionId];

    setEditingRole({ ...editingRole, permissions });
  };

  const permissionsByCategory = MOCK_PERMISSIONS.reduce(
    (acc, perm) => {
      if (!acc[perm.category]) {
        acc[perm.category] = [];
      }
      acc[perm.category].push(perm);
      return acc;
    },
    {} as Record<string, Permission[]>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">权限管理</h1>
            <p className="text-muted-foreground">管理系统角色和权限</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingRole({
                    id: '',
                    name: '',
                    description: '',
                    permissions: [],
                    userCount: 0,
                  });
                }}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                新建角色
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingRole?.id ? '编辑角色' : '新建角色'}</DialogTitle>
                <DialogDescription>
                  {editingRole?.id ? '编辑角色信息和权限' : '创建新的系统角色'}
                </DialogDescription>
              </DialogHeader>

              {editingRole && (
                <div className="space-y-6">
                  {/* 基本信息 */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        角色名称
                      </label>
                      <Input
                        value={editingRole.name}
                        onChange={(e) =>
                          setEditingRole({ ...editingRole, name: e.target.value })
                        }
                        placeholder="输入角色名称"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        角色描述
                      </label>
                      <Input
                        value={editingRole.description}
                        onChange={(e) =>
                          setEditingRole({ ...editingRole, description: e.target.value })
                        }
                        placeholder="输入角色描述"
                      />
                    </div>
                  </div>

                  {/* 权限选择 */}
                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-4">权限配置</h3>
                    <div className="space-y-4">
                      {Object.entries(permissionsByCategory).map(([category, permissions]) => (
                        <div key={category}>
                          <h4 className="text-sm font-medium text-foreground mb-2">{category}</h4>
                          <div className="space-y-2 ml-4">
                            {permissions.map((perm) => (
                              <div key={perm.id} className="flex items-start gap-3">
                                <Checkbox
                                  id={perm.id}
                                  checked={editingRole.permissions.includes(perm.id)}
                                  onCheckedChange={() => togglePermission(perm.id)}
                                  className="mt-1"
                                />
                                <div className="flex-1">
                                  <label
                                    htmlFor={perm.id}
                                    className="text-sm font-medium text-foreground cursor-pointer"
                                  >
                                    {perm.name}
                                  </label>
                                  <p className="text-xs text-muted-foreground">{perm.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      onClick={() => setEditingRole(null)}
                      className="gap-2"
                    >
                      <X className="w-4 h-4" />
                      取消
                    </Button>
                    <Button onClick={handleSaveRole} className="gap-2">
                      <Save className="w-4 h-4" />
                      保存
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* 搜索 */}
        <div className="mb-6">
          <Input
            placeholder="搜索角色..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* 角色列表 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 角色列表 */}
          <div className="lg:col-span-1">
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">角色列表</h2>
                <div className="space-y-2">
                  {filteredRoles.map((role) => (
                    <div
                      key={role.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedRole?.id === role.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                      onClick={() => setSelectedRole(role)}
                    >
                      <div className="font-medium">{role.name}</div>
                      <div className="text-xs opacity-75">{role.userCount} 个用户</div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* 角色详情 */}
          <div className="lg:col-span-2">
            {selectedRole ? (
              <Card>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-foreground mb-2">
                        {selectedRole.name}
                      </h2>
                      <p className="text-muted-foreground">{selectedRole.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingRole(selectedRole)}
                        className="gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        编辑
                      </Button>
                      {selectedRole.userCount === 0 && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteRole(selectedRole.id)}
                          className="gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          删除
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* 权限列表 */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">权限</h3>
                    <div className="space-y-4">
                      {Object.entries(permissionsByCategory).map(([category, permissions]) => {
                        const categoryPermissions = permissions.filter((p) =>
                          selectedRole.permissions.includes(p.id)
                        );

                        if (categoryPermissions.length === 0) return null;

                        return (
                          <div key={category}>
                            <h4 className="text-sm font-medium text-foreground mb-2">
                              {category}
                            </h4>
                            <div className="space-y-2 ml-4">
                              {categoryPermissions.map((perm) => (
                                <div key={perm.id} className="flex items-start gap-3">
                                  <Badge variant="secondary" className="mt-1">
                                    ✓
                                  </Badge>
                                  <div className="flex-1">
                                    <div className="text-sm font-medium text-foreground">
                                      {perm.name}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                      {perm.description}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 用户列表 */}
                  <div className="mt-8 pt-8 border-t border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                      该角色的用户 ({selectedRole.userCount})
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      此功能需要集成真实的用户数据
                    </p>
                  </div>
                </div>
              </Card>
            ) : (
              <Card>
                <div className="p-12 text-center">
                  <p className="text-muted-foreground">选择一个角色查看详情</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
