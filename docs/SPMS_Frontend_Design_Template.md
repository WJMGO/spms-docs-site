# SPMS 前端页面设计文档模板

**文档版本**：V1.0  
**最后更新**：2026年3月31日  
**适用系统**：SPMS（系统软件部绩效管理系统）  
**文档用途**：指导前端页面设计、开发和实现的标准模板

---

## 目录

1. [文档概述](#文档概述)
2. [设计系统](#设计系统)
3. [页面模板](#页面模板)
4. [组件库](#组件库)
5. [交互设计](#交互设计)
6. [响应式设计](#响应式设计)
7. [性能优化](#性能优化)
8. [可访问性](#可访问性)
9. [开发规范](#开发规范)
10. [页面清单](#页面清单)

---

## 文档概述

### 目的

本文档为 SPMS 系统的所有前端页面提供统一的设计标准和开发规范，确保：

- 🎨 **视觉一致性**：所有页面遵循统一的设计语言
- 🚀 **开发效率**：提供可复用的组件和模板
- 📱 **用户体验**：确保跨设备的良好体验
- ♿ **可访问性**：满足 WCAG 2.1 AA 标准
- ⚡ **性能**：优化加载速度和交互响应

### 适用范围

- 所有 SPMS 前端页面
- 新功能开发时必须遵循本规范
- 现有页面改版时应逐步迁移到本规范

### 使用方法

1. 选择对应的页面类型（见[页面模板](#页面模板)）
2. 复制相应的模板
3. 根据具体需求调整内容
4. 遵循[开发规范](#开发规范)进行实现

---

## 设计系统

### 颜色系统

#### 主色系

| 颜色 | 值 | 用途 | 示例 |
| :--- | :--- | :--- | :--- |
| **主蓝色** | `#0066CC` | 主要操作、链接、强调 | 按钮、导航激活状态 |
| **成功绿** | `#10B981` | 成功状态、完成 | 成功提示、绿色按钮 |
| **警告黄** | `#F59E0B` | 警告、需要注意 | 警告提示、待处理 |
| **危险红** | `#EF4444` | 错误、删除、危险操作 | 错误提示、删除按钮 |
| **中立灰** | `#6B7280` | 辅助文本、禁用状态 | 副标题、禁用按钮 |

#### 中性色系

| 颜色 | 值 | 用途 |
| :--- | :--- | :--- |
| **背景白** | `#FFFFFF` | 页面背景 |
| **浅灰** | `#F3F4F6` | 次级背景、分组背景 |
| **中灰** | `#E5E7EB` | 边框、分割线 |
| **深灰** | `#374151` | 主文本 |
| **极深灰** | `#1F2937` | 标题、强调文本 |

#### 使用示例（Tailwind CSS）

```html
<!-- 主蓝色按钮 -->
<button class="bg-blue-600 hover:bg-blue-700 text-white">操作</button>

<!-- 成功状态 -->
<div class="bg-green-50 text-green-800 border border-green-200">成功</div>

<!-- 警告状态 -->
<div class="bg-yellow-50 text-yellow-800 border border-yellow-200">警告</div>

<!-- 中立文本 -->
<p class="text-gray-600">辅助说明文本</p>
```

### 排版系统

#### 字体设置

```css
/* 全局字体 */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
               'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
               'Helvetica Neue', sans-serif;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 中文字体优化 */
body {
  font-family: 'Segoe UI', 'Roboto', -apple-system, BlinkMacSystemFont,
               'Noto Sans', 'Noto Sans CJK SC', sans-serif;
}
```

#### 字体大小和权重

| 用途 | 大小 | 权重 | 行高 | 示例 |
| :--- | :--- | :--- | :--- | :--- |
| **页面标题** | 32px | 700 | 1.2 | 页面大标题 |
| **模块标题** | 24px | 600 | 1.3 | 卡片标题 |
| **小标题** | 18px | 600 | 1.4 | 表单标签 |
| **正文** | 14px | 400 | 1.6 | 段落文本 |
| **小文本** | 12px | 400 | 1.5 | 辅助说明 |
| **极小文本** | 11px | 400 | 1.4 | 时间戳 |

#### 使用示例

```html
<!-- 页面标题 -->
<h1 class="text-4xl font-bold leading-tight">绩效评分</h1>

<!-- 模块标题 -->
<h2 class="text-2xl font-semibold leading-snug">评分详情</h2>

<!-- 小标题 -->
<h3 class="text-lg font-semibold leading-normal">基本信息</h3>

<!-- 正文 -->
<p class="text-base font-normal leading-relaxed">这是正文内容</p>

<!-- 小文本 -->
<span class="text-sm font-normal leading-normal">辅助说明</span>
```

### 间距系统

使用 8px 基础单位的间距系统：

| 间距 | 值 | 用途 |
| :--- | :--- | :--- |
| **xs** | 4px | 元素内部微小间距 |
| **sm** | 8px | 相邻元素间距 |
| **md** | 16px | 组件间距 |
| **lg** | 24px | 模块间距 |
| **xl** | 32px | 大模块间距 |
| **2xl** | 48px | 页面主要分区间距 |

#### 使用示例

```html
<!-- 组件内部间距 -->
<div class="p-4">内容</div>

<!-- 组件间距 -->
<div class="mb-6">
  <input class="mb-4" />
  <button>提交</button>
</div>

<!-- 模块间距 -->
<section class="mb-8">
  <h2>模块标题</h2>
  <div>模块内容</div>
</section>
```

### 圆角系统

| 圆角 | 值 | 用途 |
| :--- | :--- | :--- |
| **无** | 0px | 严肃、正式的设计 |
| **小** | 4px | 按钮、小组件 |
| **中** | 8px | 卡片、输入框 |
| **大** | 12px | 大卡片、模态框 |
| **超大** | 16px | 特殊强调元素 |

#### 使用示例

```html
<!-- 按钮 -->
<button class="rounded-md">按钮</button>

<!-- 卡片 -->
<div class="rounded-lg border">卡片</div>

<!-- 输入框 -->
<input class="rounded-md border" />
```

### 阴影系统

| 阴影 | 用途 | Tailwind 类 |
| :--- | :--- | :--- |
| **无** | 平面设计 | - |
| **浅** | 微妙提升 | `shadow-sm` |
| **中** | 卡片、悬停 | `shadow-md` |
| **深** | 模态框、弹窗 | `shadow-lg` |
| **超深** | 最高层级 | `shadow-2xl` |

#### 使用示例

```html
<!-- 卡片 -->
<div class="bg-white rounded-lg shadow-md p-6">卡片内容</div>

<!-- 悬停效果 -->
<div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
  可交互卡片
</div>

<!-- 模态框 -->
<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
  <div class="bg-white rounded-lg shadow-2xl p-8">模态框内容</div>
</div>
```

---

## 页面模板

### 模板 1：仪表板页面（Dashboard）

**用途**：展示关键指标、统计数据和快速操作  
**示例**：首页、绩效概览、数据统计

#### 页面结构

```
┌─────────────────────────────────────────────────────┐
│  顶部导航栏                                         │
├─────────────────────────────────────────────────────┤
│  侧边栏          │  主内容区                        │
│                  │  ┌──────────────────────────┐   │
│  导航菜单        │  │ 页面标题 + 操作按钮     │   │
│                  │  ├──────────────────────────┤   │
│  • 首页          │  │ 统计卡片 1  统计卡片 2  │   │
│  • 绩效评分      │  │ 统计卡片 3  统计卡片 4  │   │
│  • 数据分析      │  ├──────────────────────────┤   │
│  • 设置          │  │ 图表区域                │   │
│                  │  ├──────────────────────────┤   │
│                  │  │ 列表区域                │   │
│                  │  └──────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

#### 代码模板

```typescript
// pages/Dashboard.tsx
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartComponent } from '@/components/ChartComponent';
import { ListComponent } from '@/components/ListComponent';

export function Dashboard() {
  const [dateRange, setDateRange] = useState('month');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面头部 */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">绩效概览</h1>
            <p className="text-gray-600 mt-1">查看您的绩效统计和关键指标</p>
          </div>
          <Button variant="primary">导出报告</Button>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="p-8">
        {/* 统计卡片行 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="总分"
            value="85"
            unit="分"
            trend="up"
            trendValue="5%"
          />
          <StatCard
            title="排名"
            value="12"
            unit="/ 50"
            trend="down"
            trendValue="2%"
          />
          <StatCard
            title="完成度"
            value="92"
            unit="%"
            trend="up"
            trendValue="8%"
          />
          <StatCard
            title="评价"
            value="优秀"
            unit=""
            trend="stable"
            trendValue=""
          />
        </div>

        {/* 图表区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">绩效趋势</h3>
            <ChartComponent type="line" data={trendData} />
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">维度分布</h3>
            <ChartComponent type="pie" data={dimensionData} />
          </Card>
        </div>

        {/* 列表区域 */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">最近动态</h3>
          <ListComponent data={recentActivities} />
        </Card>
      </div>
    </div>
  );
}

// 统计卡片组件
function StatCard({ title, value, unit, trend, trendValue }) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <p className="text-gray-600 text-sm mb-2">{title}</p>
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        <span className="text-gray-500">{unit}</span>
      </div>
      {trend && (
        <div
          className={`text-sm font-semibold ${
            trend === 'up'
              ? 'text-green-600'
              : trend === 'down'
                ? 'text-red-600'
                : 'text-gray-600'
          }`}
        >
          {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
        </div>
      )}
    </Card>
  );
}
```

#### 设计要点

- ✅ 统计卡片使用网格布局，自适应列数
- ✅ 卡片之间保持一致的间距（24px）
- ✅ 使用颜色区分趋势方向（绿色上升、红色下降）
- ✅ 图表和列表使用卡片容器，保持视觉一致性
- ✅ 页面头部固定，便于查看标题

---

### 模板 2：列表/表格页面（List）

**用途**：展示数据列表、支持搜索、筛选、排序  
**示例**：员工列表、绩效记录、操作日志

#### 页面结构

```
┌─────────────────────────────────────────────────────┐
│  页面标题 + 新增按钮                                │
├─────────────────────────────────────────────────────┤
│  搜索框    │ 筛选器  │ 排序  │ 刷新  │ 导出         │
├─────────────────────────────────────────────────────┤
│  表格头                                             │
├─────────────────────────────────────────────────────┤
│  表格行 1                                           │
│  表格行 2                                           │
│  表格行 3                                           │
│  ...                                                │
├─────────────────────────────────────────────────────┤
│  分页器                                             │
└─────────────────────────────────────────────────────┘
```

#### 代码模板

```typescript
// pages/EmployeeList.tsx
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Table } from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';
import { Search, Filter, Download, Plus, Edit, Trash2 } from 'lucide-react';

export function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  // 获取数据
  useEffect(() => {
    fetchEmployees();
  }, []);

  // 应用过滤和搜索
  useEffect(() => {
    let result = [...employees];

    // 搜索过滤
    if (searchQuery) {
      result = result.filter(
        (emp) =>
          emp.name.includes(searchQuery) ||
          emp.email.includes(searchQuery) ||
          emp.employeeId.includes(searchQuery)
      );
    }

    // 部门过滤
    if (selectedDepartment !== 'all') {
      result = result.filter((emp) => emp.department === selectedDepartment);
    }

    // 排序
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'score') {
        return b.score - a.score;
      }
      return 0;
    });

    setFilteredEmployees(result);
    setCurrentPage(1);
  }, [employees, searchQuery, selectedDepartment, sortBy]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      // 调用 API 获取数据
      const response = await fetch('/api/employees');
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    } finally {
      setLoading(false);
    }
  };

  // 分页
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredEmployees.slice(
    startIndex,
    startIndex + pageSize
  );
  const totalPages = Math.ceil(filteredEmployees.length / pageSize);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* 页面头部 */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">员工列表</h1>
            <p className="text-gray-600 mt-1">
              共 {filteredEmployees.length} 名员工
            </p>
          </div>
          <Button variant="primary" className="flex items-center gap-2">
            <Plus size={18} />
            新增员工
          </Button>
        </div>

        {/* 工具栏 */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* 搜索框 */}
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <Input
                placeholder="搜索员工名称、邮箱或工号..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* 筛选器 */}
            <Select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-40"
            >
              <option value="all">全部部门</option>
              <option value="platform">平台设计一部</option>
              <option value="platform2">平台设计二部</option>
              <option value="kernel">内核组</option>
            </Select>

            {/* 排序 */}
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-40"
            >
              <option value="name">按名称排序</option>
              <option value="score">按分数排序</option>
            </Select>

            {/* 操作按钮 */}
            <Button variant="outline" size="sm" onClick={fetchEmployees}>
              刷新
            </Button>
            <Button variant="outline" size="sm">
              <Download size={18} />
            </Button>
          </div>
        </Card>
      </div>

      {/* 表格 */}
      <Card>
        <Table>
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                员工名称
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                工号
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                部门
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                职位
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                绩效分数
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedData.map((employee) => (
              <tr
                key={employee.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 text-sm text-gray-900">
                  {employee.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {employee.employeeId}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {employee.department}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {employee.position}
                </td>
                <td className="px-6 py-4 text-sm font-semibold">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      employee.score >= 80
                        ? 'bg-green-100 text-green-800'
                        : employee.score >= 60
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {employee.score}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit size={16} />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* 分页器 */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            第 {currentPage} 页，共 {totalPages} 页
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </Card>
    </div>
  );
}
```

#### 设计要点

- ✅ 搜索框放在工具栏最左边，便于快速访问
- ✅ 筛选器和排序选项并排放置
- ✅ 表格行使用 hover 效果增强交互感
- ✅ 分数使用颜色编码（绿色优秀、黄色良好、红色需改进）
- ✅ 操作按钮集中在最右列
- ✅ 分页器显示当前页码和总页数

---

### 模板 3：表单页面（Form）

**用途**：数据输入、编辑、创建  
**示例**：绩效评分表单、员工信息编辑、设置页面

#### 页面结构

```
┌─────────────────────────────────────────────────────┐
│  页面标题                                           │
├─────────────────────────────────────────────────────┤
│  表单区域                                           │
│  ┌──────────────────────────────────────────────┐  │
│  │ 基本信息                                     │  │
│  │ ┌────────────────────────────────────────┐  │  │
│  │ │ 字段 1  │ 字段 2                       │  │  │
│  │ │ 字段 3  │ 字段 4                       │  │  │
│  │ └────────────────────────────────────────┘  │  │
│  │                                              │  │
│  │ 绩效评分                                     │  │
│  │ ┌────────────────────────────────────────┐  │  │
│  │ │ 维度 1: [评分]                         │  │  │
│  │ │ 维度 2: [评分]                         │  │  │
│  │ │ 维度 3: [评分]                         │  │  │
│  │ └────────────────────────────────────────┘  │  │
│  │                                              │  │
│  │ [取消] [保存]                                │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

#### 代码模板

```typescript
// pages/PerformanceForm.tsx
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';

export function PerformanceForm() {
  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    department: '',
    evaluationPeriod: '2026-03',
    dailyWork: 0,
    workQuality: 0,
    personalObjectives: 0,
    peerReview: 0,
    bonus: 0,
    deduction: 0,
    comments: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    // 清除该字段的错误
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.employeeId) newErrors.employeeId = '请选择员工';
    if (formData.dailyWork < 0 || formData.dailyWork > 100)
      newErrors.dailyWork = '日常工作分数应在 0-100 之间';
    if (formData.workQuality < 0 || formData.workQuality > 50)
      newErrors.workQuality = '工作质量分数应在 0-50 之间';
    if (formData.personalObjectives < 0 || formData.personalObjectives > 100)
      newErrors.personalObjectives = '个人目标分数应在 0-100 之间';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setSubmitStatus({ type: 'error', message: '请检查表单中的错误' });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: '绩效评分已保存'
        });
        // 重置表单
        setFormData({
          employeeId: '',
          employeeName: '',
          department: '',
          evaluationPeriod: '2026-03',
          dailyWork: 0,
          workQuality: 0,
          personalObjectives: 0,
          peerReview: 0,
          bonus: 0,
          deduction: 0,
          comments: ''
        });
      } else {
        setSubmitStatus({
          type: 'error',
          message: '保存失败，请重试'
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: '网络错误，请重试'
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalScore = () => {
    return (
      formData.dailyWork +
      formData.workQuality +
      formData.personalObjectives +
      formData.peerReview +
      formData.bonus -
      formData.deduction
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* 页面头部 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">绩效评分表</h1>
        <p className="text-gray-600 mt-1">填写员工的绩效评分信息</p>
      </div>

      {/* 状态提示 */}
      {submitStatus && (
        <Alert
          type={submitStatus.type}
          className="mb-6"
          icon={
            submitStatus.type === 'success' ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )
          }
        >
          {submitStatus.message}
        </Alert>
      )}

      {/* 表单 */}
      <form onSubmit={handleSubmit}>
        {/* 基本信息卡片 */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">基本信息</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                员工 <span className="text-red-600">*</span>
              </label>
              <Select
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                className={errors.employeeId ? 'border-red-500' : ''}
              >
                <option value="">选择员工</option>
                <option value="E001">张三 (E001)</option>
                <option value="E002">李四 (E002)</option>
                <option value="E003">王五 (E003)</option>
              </Select>
              {errors.employeeId && (
                <p className="text-red-600 text-sm mt-1">{errors.employeeId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                评估周期
              </label>
              <Input
                type="month"
                name="evaluationPeriod"
                value={formData.evaluationPeriod}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                员工名称
              </label>
              <Input
                type="text"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleChange}
                disabled
                className="bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                部门
              </label>
              <Input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                disabled
                className="bg-gray-100"
              />
            </div>
          </div>
        </Card>

        {/* 绩效评分卡片 */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">绩效评分</h2>

          <div className="space-y-6">
            {/* 日常工作 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-900">
                  日常工作 <span className="text-gray-500">(0-100)</span>
                </label>
                <span className="text-lg font-semibold text-blue-600">
                  {formData.dailyWork}
                </span>
              </div>
              <input
                type="range"
                name="dailyWork"
                min="0"
                max="100"
                value={formData.dailyWork}
                onChange={handleChange}
                className="w-full"
              />
              {errors.dailyWork && (
                <p className="text-red-600 text-sm mt-1">{errors.dailyWork}</p>
              )}
            </div>

            {/* 工作质量 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-900">
                  工作质量 <span className="text-gray-500">(0-50)</span>
                </label>
                <span className="text-lg font-semibold text-blue-600">
                  {formData.workQuality}
                </span>
              </div>
              <input
                type="range"
                name="workQuality"
                min="0"
                max="50"
                value={formData.workQuality}
                onChange={handleChange}
                className="w-full"
              />
              {errors.workQuality && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.workQuality}
                </p>
              )}
            </div>

            {/* 个人目标 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-900">
                  个人目标 <span className="text-gray-500">(0-100)</span>
                </label>
                <span className="text-lg font-semibold text-blue-600">
                  {formData.personalObjectives}
                </span>
              </div>
              <input
                type="range"
                name="personalObjectives"
                min="0"
                max="100"
                value={formData.personalObjectives}
                onChange={handleChange}
                className="w-full"
              />
              {errors.personalObjectives && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.personalObjectives}
                </p>
              )}
            </div>

            {/* 同行评价 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-900">
                  同行评价 <span className="text-gray-500">(0-10)</span>
                </label>
                <span className="text-lg font-semibold text-blue-600">
                  {formData.peerReview}
                </span>
              </div>
              <input
                type="range"
                name="peerReview"
                min="0"
                max="10"
                value={formData.peerReview}
                onChange={handleChange}
                className="w-full"
              />
            </div>

            {/* 奖励和扣分 */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  奖励加分
                </label>
                <Input
                  type="number"
                  name="bonus"
                  min="0"
                  value={formData.bonus}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  扣分
                </label>
                <Input
                  type="number"
                  name="deduction"
                  min="0"
                  value={formData.deduction}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* 总分显示 */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-gray-900 font-semibold">总分</span>
              <span className="text-2xl font-bold text-blue-600">
                {calculateTotalScore()}
              </span>
            </div>
          </div>
        </Card>

        {/* 备注卡片 */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">备注</h2>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              评价备注
            </label>
            <Textarea
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              placeholder="输入评价备注..."
              rows={4}
            />
          </div>
        </Card>

        {/* 按钮组 */}
        <div className="flex gap-4 justify-end">
          <Button variant="outline">取消</Button>
          <Button
            variant="primary"
            type="submit"
            disabled={loading}
          >
            {loading ? '保存中...' : '保存'}
          </Button>
        </div>
      </form>
    </div>
  );
}
```

#### 设计要点

- ✅ 使用卡片分组相关字段
- ✅ 必填字段用红色星号标记
- ✅ 实时显示计算结果（总分）
- ✅ 使用 range 输入器进行分数调整，更直观
- ✅ 表单验证和错误提示
- ✅ 提交状态反馈（成功/失败）
- ✅ 禁用状态字段使用灰色背景

---

### 模板 4：详情页面（Detail）

**用途**：展示单个对象的详细信息  
**示例**：员工详情、绩效报告、项目详情

#### 代码模板

```typescript
// pages/EmployeeDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/tabs';
import { ArrowLeft, Edit, Download, Share2 } from 'lucide-react';

export function EmployeeDetail() {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchEmployeeDetail();
  }, [employeeId]);

  const fetchEmployeeDetail = async () => {
    try {
      const response = await fetch(`/api/employees/${employeeId}`);
      const data = await response.json();
      setEmployee(data);
    } catch (error) {
      console.error('Failed to fetch employee detail:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">加载中...</div>;
  }

  if (!employee) {
    return <div className="flex items-center justify-center min-h-screen">未找到数据</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 页面头部 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              返回
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download size={18} />
              </Button>
              <Button variant="outline" size="sm">
                <Share2 size={18} />
              </Button>
              <Button variant="primary" size="sm">
                <Edit size={18} />
              </Button>
            </div>
          </div>

          {/* 员工基本信息 */}
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {employee.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {employee.name}
              </h1>
              <p className="text-gray-600">{employee.position}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="primary">{employee.department}</Badge>
                <Badge variant="secondary">{employee.employeeId}</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 标签页 */}
      <div className="max-w-6xl mx-auto px-8 py-8">
        <Tabs
          tabs={[
            { label: '概览', value: 'overview' },
            { label: '绩效记录', value: 'performance' },
            { label: '评价', value: 'reviews' },
            { label: '历史', value: 'history' }
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* 概览标签页 */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* 左侧信息卡片 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 基本信息 */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  基本信息
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 text-sm">邮箱</p>
                    <p className="text-gray-900 font-medium">{employee.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">电话</p>
                    <p className="text-gray-900 font-medium">{employee.mobile}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">入职日期</p>
                    <p className="text-gray-900 font-medium">
                      {employee.joinDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">报告人</p>
                    <p className="text-gray-900 font-medium">
                      {employee.manager}
                    </p>
                  </div>
                </div>
              </Card>

              {/* 绩效统计 */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  绩效统计
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">本月分数</span>
                      <span className="font-semibold text-gray-900">
                        {employee.currentScore}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(employee.currentScore / 100) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* 右侧统计卡片 */}
            <div className="space-y-4">
              <Card className="p-6 text-center">
                <p className="text-gray-600 text-sm mb-2">平均分数</p>
                <p className="text-3xl font-bold text-blue-600">
                  {employee.averageScore}
                </p>
              </Card>

              <Card className="p-6 text-center">
                <p className="text-gray-600 text-sm mb-2">排名</p>
                <p className="text-3xl font-bold text-green-600">
                  {employee.ranking}
                </p>
              </Card>

              <Card className="p-6 text-center">
                <p className="text-gray-600 text-sm mb-2">评价等级</p>
                <p className="text-2xl font-bold text-purple-600">
                  {employee.rating}
                </p>
              </Card>
            </div>
          </div>
        )}

        {/* 其他标签页内容 */}
        {activeTab === 'performance' && (
          <Card className="p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              绩效记录
            </h3>
            {/* 绩效记录列表 */}
          </Card>
        )}
      </div>
    </div>
  );
}
```

#### 设计要点

- ✅ 页面头部包含返回按钮和操作按钮
- ✅ 员工头像和基本信息突出显示
- ✅ 使用标签页组织不同类型的信息
- ✅ 右侧边栏显示关键统计数据
- ✅ 进度条可视化展示分数

---

## 组件库

### 常用组件清单

| 组件 | 用途 | 示例 |
| :--- | :--- | :--- |
| **Button** | 各种操作按钮 | 提交、取消、删除 |
| **Input** | 文本输入框 | 搜索、表单输入 |
| **Select** | 下拉选择器 | 部门选择、排序 |
| **Card** | 容器组件 | 信息卡片、模块容器 |
| **Table** | 数据表格 | 列表展示 |
| **Modal** | 模态框 | 确认对话框、表单弹窗 |
| **Tabs** | 标签页 | 内容分类 |
| **Badge** | 标签 | 状态标记 |
| **Alert** | 提示框 | 成功/错误/警告提示 |
| **Pagination** | 分页器 | 列表分页 |

### 组件使用示例

#### Button 组件

```typescript
// 不同变体
<Button variant="primary">主按钮</Button>
<Button variant="secondary">次按钮</Button>
<Button variant="outline">边框按钮</Button>
<Button variant="ghost">幽灵按钮</Button>
<Button variant="danger">危险按钮</Button>

// 不同大小
<Button size="sm">小按钮</Button>
<Button size="md">中按钮</Button>
<Button size="lg">大按钮</Button>

// 加载状态
<Button disabled loading>加载中...</Button>

// 带图标
<Button>
  <Plus size={18} />
  新增
</Button>
```

#### Card 组件

```typescript
// 基础卡片
<Card>
  <div className="p-6">卡片内容</div>
</Card>

// 带标题的卡片
<Card className="p-6">
  <h3 className="text-lg font-semibold mb-4">卡片标题</h3>
  <p>卡片内容</p>
</Card>

// 可悬停的卡片
<Card className="hover:shadow-lg transition-shadow cursor-pointer">
  可交互卡片
</Card>
```

#### Badge 组件

```typescript
// 不同变体
<Badge variant="primary">主要</Badge>
<Badge variant="success">成功</Badge>
<Badge variant="warning">警告</Badge>
<Badge variant="danger">危险</Badge>

// 可关闭的 Badge
<Badge onClose={() => {}}>可关闭标签</Badge>
```

---

## 交互设计

### 状态反馈

#### 加载状态

```typescript
// 页面级加载
{loading ? (
  <div className="flex items-center justify-center min-h-screen">
    <Spinner />
  </div>
) : (
  <div>内容</div>
)}

// 按钮级加载
<Button disabled loading>
  提交中...
</Button>
```

#### 成功/错误状态

```typescript
// 成功提示
<Alert type="success" icon={<CheckCircle />}>
  操作成功
</Alert>

// 错误提示
<Alert type="error" icon={<AlertCircle />}>
  操作失败，请重试
</Alert>

// Toast 通知
toast.success('保存成功');
toast.error('保存失败');
```

### 表单交互

#### 表单验证

```typescript
// 实时验证
const [errors, setErrors] = useState({});

const validateField = (name, value) => {
  if (!value) {
    setErrors((prev) => ({
      ...prev,
      [name]: '此字段不能为空'
    }));
  }
};

// 显示错误
{errors.email && (
  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
)}
```

#### 表单提交

```typescript
// 防止重复提交
const [submitting, setSubmitting] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (submitting) return; // 防止重复提交
  
  setSubmitting(true);
  try {
    // 提交逻辑
  } finally {
    setSubmitting(false);
  }
};
```

### 动画和过渡

#### 常用过渡效果

```css
/* 淡入淡出 */
.fade-enter {
  opacity: 0;
}
.fade-enter-active {
  opacity: 1;
  transition: opacity 300ms;
}

/* 滑动 */
.slide-enter {
  transform: translateX(-100%);
}
.slide-enter-active {
  transform: translateX(0);
  transition: transform 300ms;
}

/* 缩放 */
.scale-enter {
  transform: scale(0.95);
  opacity: 0;
}
.scale-enter-active {
  transform: scale(1);
  opacity: 1;
  transition: all 300ms;
}
```

#### Tailwind 过渡类

```html
<!-- 悬停效果 -->
<div class="hover:shadow-lg hover:scale-105 transition-all duration-300">
  可交互元素
</div>

<!-- 颜色过渡 -->
<button class="bg-blue-600 hover:bg-blue-700 transition-colors duration-200">
  按钮
</button>
```

---

## 响应式设计

### 断点系统

| 断点 | 宽度 | 设备 | Tailwind 前缀 |
| :--- | :--- | :--- | :--- |
| **Mobile** | < 640px | 手机 | - |
| **Small** | 640px - 767px | 小平板 | `sm:` |
| **Medium** | 768px - 1023px | 平板 | `md:` |
| **Large** | 1024px - 1279px | 小屏幕 | `lg:` |
| **XL** | 1280px - 1535px | 桌面 | `xl:` |
| **2XL** | ≥ 1536px | 大屏幕 | `2xl:` |

### 响应式布局示例

```typescript
// 响应式网格
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  {/* 移动端：1列，平板：2列，桌面：4列 */}
</div>

// 响应式文本大小
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  标题
</h1>

// 响应式间距
<div className="p-4 md:p-6 lg:p-8">
  内容
</div>

// 响应式显示/隐藏
<div className="hidden md:block">
  仅在平板及以上显示
</div>

<div className="md:hidden">
  仅在移动端显示
</div>
```

### 移动优先开发

```typescript
// ✅ 推荐：从移动端开始
<div className="text-sm md:text-base lg:text-lg">
  文本
</div>

// ❌ 不推荐：从桌面端开始
<div className="text-lg lg:text-base md:text-sm">
  文本
</div>
```

---

## 性能优化

### 代码分割

```typescript
import { lazy, Suspense } from 'react';

// 动态导入组件
const Dashboard = lazy(() => import('./pages/Dashboard'));
const EmployeeList = lazy(() => import('./pages/EmployeeList'));

// 使用 Suspense 包装
<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>
```

### 图片优化

```typescript
// 使用 Next.js Image 组件（如果使用 Next.js）
import Image from 'next/image';

<Image
  src="/avatar.jpg"
  alt="用户头像"
  width={100}
  height={100}
  priority // 优先加载
/>

// 或使用原生 img 标签
<img
  src="/avatar.jpg"
  alt="用户头像"
  loading="lazy" // 懒加载
  width="100"
  height="100"
/>
```

### 列表虚拟化

```typescript
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={1000}
  itemSize={50}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>
      行 {index}
    </div>
  )}
</FixedSizeList>
```

### 防抖和节流

```typescript
// 防抖：延迟执行
const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

const handleSearch = debounce((query) => {
  // 搜索逻辑
}, 300);

// 节流：限制执行频率
const throttle = (fn, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

const handleScroll = throttle(() => {
  // 滚动逻辑
}, 1000);
```

---

## 可访问性

### 键盘导航

```typescript
// 支持 Tab 键导航
<button tabIndex={0}>可聚焦按钮</button>

// 跳过导航链接
<a href="#main-content" className="sr-only">
  跳到主内容
</a>

// 焦点管理
const buttonRef = useRef(null);

useEffect(() => {
  buttonRef.current?.focus();
}, []);

<button ref={buttonRef}>自动聚焦按钮</button>
```

### 屏幕阅读器支持

```typescript
// 使用语义化 HTML
<button aria-label="关闭对话框">✕</button>

// ARIA 属性
<div role="alert" aria-live="polite">
  错误信息
</div>

// 表单标签关联
<label htmlFor="email">邮箱</label>
<input id="email" type="email" />

// 列表语义
<ul role="list">
  <li>项目 1</li>
  <li>项目 2</li>
</ul>
```

### 颜色对比度

```css
/* 确保文本与背景有足够的对比度 */
/* WCAG AA 标准：正常文本 4.5:1，大文本 3:1 */

/* ✅ 推荐 */
.text-dark-on-light {
  color: #1f2937; /* 深灰 */
  background-color: #ffffff; /* 白色 */
}

/* ❌ 不推荐 */
.text-light-on-light {
  color: #e5e7eb; /* 浅灰 */
  background-color: #ffffff; /* 白色 */
}
```

---

## 开发规范

### 文件结构

```
client/src/
├── pages/              # 页面组件
│   ├── Dashboard.tsx
│   ├── EmployeeList.tsx
│   ├── PerformanceForm.tsx
│   └── EmployeeDetail.tsx
├── components/         # 可复用组件
│   ├── ui/            # UI 组件库
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── ...
│   ├── layout/        # 布局组件
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   └── common/        # 通用组件
│       ├── Loading.tsx
│       ├── Empty.tsx
│       └── ...
├── hooks/             # 自定义 Hook
│   ├── useAuth.ts
│   ├── useFetch.ts
│   └── ...
├── contexts/          # React Context
│   ├── AuthContext.tsx
│   └── ...
├── utils/             # 工具函数
│   ├── api.ts
│   ├── format.ts
│   └── ...
├── styles/            # 全局样式
│   └── index.css
├── App.tsx            # 应用入口
└── main.tsx           # React 入口
```

### 命名规范

```typescript
// 组件文件：PascalCase
// ✅ Button.tsx, UserProfile.tsx, EmployeeList.tsx

// 工具函数：camelCase
// ✅ formatDate(), calculateScore(), getUserInfo()

// 常量：UPPER_SNAKE_CASE
// ✅ MAX_RETRIES, API_BASE_URL, DEFAULT_PAGE_SIZE

// 变量和函数：camelCase
// ✅ const userData = {}, function handleClick() {}

// CSS 类名：kebab-case
// ✅ class="user-card", class="form-input"
```

### 代码注释规范

```typescript
/**
 * 计算员工绩效总分
 * @param {Object} scores - 各维度分数
 * @param {number} scores.dailyWork - 日常工作分数
 * @param {number} scores.workQuality - 工作质量分数
 * @returns {number} 总分
 */
function calculateTotalScore(scores) {
  return scores.dailyWork + scores.workQuality;
}

// 单行注释用于解释复杂逻辑
// 防止重复提交
if (submitting) return;
```

### 类型定义

```typescript
// 定义接口
interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  score: number;
}

// 定义类型
type SortOrder = 'asc' | 'desc';
type PerformanceRating = 'excellent' | 'good' | 'fair' | 'poor';

// 在组件中使用
interface EmployeeListProps {
  employees: Employee[];
  onSelect: (employee: Employee) => void;
  sortOrder: SortOrder;
}

export function EmployeeList({ employees, onSelect, sortOrder }: EmployeeListProps) {
  // ...
}
```

### 错误处理

```typescript
// 使用 try-catch
try {
  const response = await fetch('/api/data');
  const data = await response.json();
} catch (error) {
  console.error('Failed to fetch data:', error);
  // 显示用户友好的错误消息
  toast.error('加载数据失败，请重试');
}

// 检查响应状态
if (!response.ok) {
  throw new Error(`HTTP error! status: ${response.status}`);
}
```

---

## 页面清单

### 需要设计的页面列表

| 页面名称 | 页面类型 | 优先级 | 状态 | 备注 |
| :--- | :--- | :--- | :--- | :--- |
| **登录页** | Form | 🔴 必做 | ⏳ 待设计 | 企业微信认证 |
| **首页/仪表板** | Dashboard | 🔴 必做 | ⏳ 待设计 | 展示关键指标 |
| **员工列表** | List | 🔴 必做 | ⏳ 待设计 | 支持搜索、筛选、排序 |
| **绩效评分** | Form | 🔴 必做 | ⏳ 待设计 | 多维度评分 |
| **员工详情** | Detail | 🟡 推荐 | ⏳ 待设计 | 展示员工信息和绩效 |
| **绩效报告** | Detail | 🟡 推荐 | ⏳ 待设计 | 生成绩效报告 |
| **数据分析** | Dashboard | 🟡 推荐 | ⏳ 待设计 | 图表和统计 |
| **部门排名** | List | 🟡 推荐 | ⏳ 待设计 | 跨部门排名 |
| **设置页面** | Form | 🟢 可选 | ⏳ 待设计 | 系统设置 |
| **审计日志** | List | 🟢 可选 | ⏳ 待设计 | 操作记录 |

---

## 总结

本文档提供了 SPMS 系统前端开发的完整指南，包括：

✅ **设计系统**：统一的颜色、排版、间距规范  
✅ **页面模板**：4 种常见页面类型的完整代码示例  
✅ **组件库**：常用 UI 组件的使用指南  
✅ **交互设计**：状态反馈、表单交互、动画效果  
✅ **响应式设计**：移动优先的布局策略  
✅ **性能优化**：代码分割、图片优化、虚拟化  
✅ **可访问性**：WCAG 标准的实现方法  
✅ **开发规范**：文件结构、命名规范、代码注释  

### 下一步行动

1. 选择第一个需要设计的页面（建议从登录页开始）
2. 根据对应的模板进行定制
3. 遵循设计系统和开发规范
4. 进行充分的测试和优化
5. 收集反馈并迭代改进

---

**文档结束**

**最后更新**：2026年3月31日  
**版本**：V1.0  
**维护者**：SPMS 开发团队
