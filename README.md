# SPMS - 系统软件绩效管理系统

## 项目概述

SPMS（System Software Performance Management System）是一个企业级绩效管理系统，用于员工绩效评估、规则管理和数据分析。系统提供了完整的绩效评定工作台、多维度绩效数据展示和灵活的规则编辑功能。

## 主要功能

### 1. 绩效汇总（Dashboard）
- 绩效概览统计
- 部门绩效排名
- 关键指标展示
- 快速导航到其他功能模块

### 2. 月度绩效评定工作台（Monthly Performance Workbench）
- 员工绩效评分表格（10 列数据展示）
- 分页和数据管理
- 季度对比图表
- 管理建议和反馈
- 实时数据更新

### 3. 绩效数据多维度展示
- **当月绩效**：当前月度的绩效数据
- **历史月度绩效**：过去 12 个月的绩效趋势分析
- **历史季度绩效**：季度级别的绩效数据对比
- **全年绩效**：年度绩效汇总和分析

### 4. 绩效规则管理（Performance Rules）
- **评分维度规则**：管理评分维度、权重和评分标准
- **加分规则**：定义加分条件和加分点数
- **减分规则**：定义减分条件和减分点数
- **等级划分规则**：设置绩效等级和分数范围

#### 规则编辑功能
- 在线编辑规则名称、描述、权重
- 表单验证（名称非空、权重 0-100、点数为整数）
- 实时保存到数据库
- 成功/失败提示
- 权限检查（仅 admin 和 hr 可编辑）

### 5. 统一导航系统
- **侧边栏导航**：快速访问所有主要功能
  - 绩效汇总
  - 月度绩效评定工作台
  - 绩效规则
- **顶部导航栏**：在绩效数据页面间快速切换
  - 当月绩效
  - 历史月度绩效
  - 历史季度绩效
  - 全年绩效

## 技术栈

- **前端框架**：React 19 + TypeScript
- **样式**：Tailwind CSS 4
- **后端框架**：Express 4 + tRPC 11
- **数据库**：MySQL/TiDB
- **ORM**：Drizzle ORM
- **认证**：Manus OAuth
- **图表库**：Recharts/Chart.js
- **UI 组件**：shadcn/ui + Lucide Icons

## 项目结构

```
spms-docs-site/
├── client/                          # 前端应用
│   ├── src/
│   │   ├── pages/                  # 页面组件
│   │   │   ├── Dashboard.tsx       # 绩效汇总
│   │   │   ├── MonthlyPerformance.tsx
│   │   │   ├── HistoricalMonthlyPerformance.tsx
│   │   │   ├── HistoricalQuarterlyPerformance.tsx
│   │   │   ├── AnnualPerformance.tsx
│   │   │   ├── MonthlyPerformanceWorkbench.tsx
│   │   │   └── PerformanceRules.tsx
│   │   ├── components/             # 可复用组件
│   │   │   ├── PerformanceLayout.tsx  # 统一布局组件
│   │   │   └── ...
│   │   ├── App.tsx                 # 路由配置
│   │   └── index.css               # 全局样式
│   └── public/                     # 静态资源
├── server/                          # 后端应用
│   ├── routers/                    # tRPC 路由
│   │   ├── performance-dimensions.ts
│   │   ├── performance-rules.ts
│   │   └── ...
│   ├── db.ts                       # 数据库查询
│   ├── db-performance-rules.ts     # 规则相关查询
│   └── routers.ts                  # 主路由
├── drizzle/                         # 数据库迁移
│   ├── schema.ts                   # 数据库表定义
│   └── migrations/
├── shared/                          # 共享类型和常量
└── README.md                        # 项目文档
```

## 数据库表结构

### 核心表
- `users` - 用户信息
- `employees` - 员工信息
- `departments` - 部门信息
- `positions` - 职位信息

### 绩效相关表
- `performance_assessments` - 绩效评估记录
- `performance_rules` - 评分维度规则
- `performance_rule_criteria` - 评分等级标准
- `performance_bonus_rules` - 加分规则
- `performance_penalty_rules` - 减分规则
- `performance_grade_rules` - 等级划分规则
- `performance_rule_versions` - 规则版本历史

## API 路由

### 绩效维度 API (`/api/trpc/performanceDimensions`)
- `monthly.getMonthlyData` - 获取当月绩效数据
- `historicalMonthly.getTrendData` - 获取月度趋势
- `historicalMonthly.getDepartmentComparison` - 部门对比
- `historicalQuarterly.getQuarterlyData` - 获取季度数据
- `annual.getAnnualData` - 获取年度数据

### 绩效规则 API (`/api/trpc/performanceRules`)
- `getRules` - 获取所有规则
- `updateRule` - 更新评分维度规则
- `updateBonusRule` - 更新加分规则
- `updatePenaltyRule` - 更新减分规则
- `getRuleVersions` - 获取规则版本历史

## 快速开始

### 安装依赖
```bash
pnpm install
```

### 数据库设置
```bash
pnpm db:push
```

### 开发模式
```bash
pnpm dev
```

### 生产构建
```bash
pnpm build
```

### 运行测试
```bash
pnpm test
```

## 环境变量

系统使用以下环境变量（由 Manus 平台自动注入）：
- `DATABASE_URL` - 数据库连接字符串
- `JWT_SECRET` - JWT 签名密钥
- `VITE_APP_ID` - OAuth 应用 ID
- `OAUTH_SERVER_URL` - OAuth 服务器地址
- `VITE_OAUTH_PORTAL_URL` - OAuth 登录门户地址
- `BUILT_IN_FORGE_API_URL` - Manus API 地址
- `BUILT_IN_FORGE_API_KEY` - Manus API 密钥

## 权限控制

- **Public** - 任何用户可访问
- **Protected** - 需要登录
- **Admin/HR Only** - 仅 admin 和 hr 角色可编辑规则

## 设计系统

系统采用 Stitch 设计系统，包括：
- **主色**：深蓝色 (#455f88)
- **辅色**：灰蓝色 (#546073)
- **强调色**：亮蓝色 (#1a61a4)
- **字体**：Manrope（标题）+ Inter（正文）
- **圆角**：2px、4px、8px、12px
- **响应式**：移动优先设计

## 功能清单

### 已完成功能
- ✅ 绩效汇总页面
- ✅ 月度绩效评定工作台
- ✅ 多维度绩效数据展示（月度、季度、年度）
- ✅ 绩效规则管理（查看和编辑）
- ✅ 规则在线编辑功能
- ✅ 表单验证和错误处理
- ✅ tRPC API 集成
- ✅ 统一导航系统（侧边栏和顶部栏）
- ✅ 权限控制
- ✅ 响应式设计

### 计划中的功能
- 🔄 规则版本管理和回滚
- 🔄 规则预览和模拟功能
- 🔄 数据导出（PDF/Excel）
- 🔄 操作日志记录
- 🔄 高级筛选和搜索
- 🔄 实时数据更新

## 贡献指南

1. 创建功能分支：`git checkout -b feature/your-feature`
2. 提交更改：`git commit -am 'Add your feature'`
3. 推送到远程：`git push origin feature/your-feature`
4. 创建 Pull Request

## 许可证

MIT License

## 联系方式

如有问题或建议，请联系项目管理员。

---

**最后更新**：2026-04-17
**版本**：1.0.0
