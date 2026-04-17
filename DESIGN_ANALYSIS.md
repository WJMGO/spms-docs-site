# Stitch 原型设计规范分析

## 1. 设计系统概览

### 品牌名称
- **Creative North Star**: "The Architectural Ledger"
- 高端 ERP 和绩效管理系统

### 设计理念
- 精确性和信息密度
- 对称的标题对齐和表面容器建议
- 现代、"干净"的界面
- 减少认知负荷

## 2. 颜色系统

### 主色板
- **Primary**: `#455f88` (深蓝)
- **Primary Fixed**: `#d6e3ff` (浅蓝)
- **Secondary**: `#546073` (灰蓝)
- **Tertiary**: `#1a61a4` (蓝)
- **Error**: `#9f403d` (红)

### 背景和表面
- **Background**: `#f7fafc` (极浅蓝灰)
- **Surface**: `#f7fafc`
- **Surface Container**: `#e7eff3`
- **Surface Container High**: `#dfeaef`
- **Surface Container Highest**: `#d7e5eb`

### 文本颜色
- **On Surface**: `#283439` (深灰)
- **On Primary**: `#f6f7ff` (白)
- **On Secondary**: `#f8f8ff` (白)

### 边框和轮廓
- **Outline**: `#707d82`
- **Outline Variant**: `#a7b4ba`
- **Surface Variant**: `#d7e5eb`

## 3. 排版系统

### 字体
- **Headline**: Manrope (现代、几何无衬线)
- **Body**: Inter (可读性强)
- **Label**: Inter

### 字体大小和权重
- **Display**: Manrope, 大尺寸
- **Headline**: Manrope, 中等尺寸
- **Body**: Inter, 400-600 weight
- **Label**: Inter, 500 weight

## 4. 圆角系统

- **Default**: 0.125rem (2px)
- **lg**: 0.25rem (4px)
- **xl**: 0.5rem (8px)
- **full**: 0.75rem (12px)

## 5. 阴影和深度

### 分层原则
- **Base**: `surface` (0px)
- **Scrim**: `surface-container-low` (1)
- **Floating Elements**: `surface-container` (2)
- **Floating Elements (High)**: `surface-container-high` (3)
- **Ghost Fallback**: `outline-variant` (15% opacity)

### 阴影示例
- 浅色卡片: `0 2px 4px rgba(0,0,0,0.08)`
- 深色卡片: `0 8px 16px rgba(0,0,0,0.12)`

## 6. 核心组件

### 按钮
- **Primary**: `#455f88` 背景，`#f6f7ff` 文本，圆角 4px
- **Tertiary**: 无背景，使用 `#1a61a4` 文本
- **Outline**: 边框 `#707d82`，无背景

### 数据表格
- **Header**: `surface-container-low` 背景，`label` 字体
- **Alignment**: 数字右对齐，使用表格线条分隔
- **Numeric Data**: 使用等宽字体

### 输入字段
- **Style**: `surface-container-highest` 背景，底部"活跃"条 `#455f88`
- **Error State**: `#fe8983` 背景，`error-container` 文本

### 性能芯片
- **Success**: `#1a61a4` 背景，`#f8f8ff` 文本，圆角 12px
- **Warning**: 自定义琥珀色
- **Shape**: 始终使用 `rounded-full` 对比结构化矩形

## 7. 设计规则

### Do's
- ✅ 使用垂直空间 (32px) 分隔部分
- ✅ 使用 `primary_fixed` 和 `die` 突出显示
- ✅ 使用 `on_primary_fixed` 作为"仅读"数据

### Don'ts
- ❌ 不使用 100% 黑色 (#000000)
- ❌ 不使用 90 度角
- ❌ 不使用标准"成功绿"或"警告红"

## 8. 布局原则

### 页面结构
1. **Header**: 导航和标题
2. **Content Area**: 主要内容区域
3. **Sidebar**: 可选的侧边栏
4. **Footer**: 页脚信息

### 间距
- **Small**: 8px
- **Medium**: 16px
- **Large**: 24px
- **XL**: 32px

### 响应式设计
- 移动优先
- 使用 Tailwind 的容器查询
- 断点: sm, md, lg, xl

## 9. 绩效规则页面特定规范

### 页面布局
- 顶部导航栏
- 左侧边栏（导航菜单）
- 主内容区域
- 右侧信息卡片

### 规则展示
- 可展开/折叠的规则卡片
- 清晰的权重显示
- 评分等级标准表格

### 编辑功能
- 编辑模式切换按钮
- 内联编辑表单
- 保存/取消按钮

### 权限提示
- 仅 Admin 和 HR 可编辑
- 清晰的权限提示信息
