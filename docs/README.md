# SPMS 系统文档

本目录包含 SPMS（System Software Performance Management System）系统的所有设计文档、规范和参考资料。

## 📋 文档清单

### 核心设计文档

- **SPMS_System_Architecture_Design.md** - 系统整体架构设计，包括技术栈、数据模型、API 设计等
- **SPMS_Performance_Dimensions_Architecture.md** - 绩效维度架构设计，详细说明 6 个维度的评分体系
- **SPMS_Real_Performance_Dimensions.md** - 真实绩效维度提取，基于原始绩效表格的维度和规则

### 前端设计文档

- **SPMS_Frontend_Design_Template.md** - 前端设计模板和组件库使用指南
- **SPMS_Dashboard_Design.md** - 员工绩效评分仪表板设计
- **SPMS_Dashboard_Custom_Period_Design.md** - 自定义周期仪表板设计
- **SPMS_Dashboard_Management_Design.md** - 管理层绩效处理仪表板设计

### 部署和运维文档

- **SPMS_Deployment_Guide.md** - 系统部署指南，包括环境配置、数据库初始化等

### 业务文档

- **SPMS_Performance_Rules_From_Table.md** - 从原始表格提取的绩效评分规则
- **SPMS_AI_Competition_Proposal.md** - AI 竞赛方案提案
- **SPMS_AI_Competition_Proposal_4D.md** - AI 竞赛 4D 方案提案

### 进度文档

- **SPMS_Current_Progress.md** - 项目当前进度总结

### 原始资料

- **副本-【系统软件_SW】绩效标准V4.2_平台设计一部_202603.xlsx** - 原始绩效评分表格（Excel）
- **截屏2026-04-0720.28.14.webp** - 系统截图参考

## 🎯 快速开始

1. 阅读 **SPMS_System_Architecture_Design.md** 了解系统整体架构
2. 查看 **SPMS_Real_Performance_Dimensions.md** 理解绩效维度体系
3. 参考 **SPMS_Frontend_Design_Template.md** 进行前端开发
4. 按照 **SPMS_Deployment_Guide.md** 部署系统

## 📊 绩效维度概览

系统采用 6 维度评分体系，满分 150 分：

| 维度 | 满分 | 权重 | 说明 |
|------|------|------|------|
| 日常工作 | 100 分 | 50% | 项目成效、解决问题数量和难度 |
| 工作质量 | 15 分 | 7.5% | 代码走查、代码审核、Bug 打回率等 |
| 个人目标 | 15 分 | 7.5% | 关键指标和关键事项达成情况 |
| 部门互评 | 5 分 | 2.5% | 相关方对团队交付、协作、态度的评价 |
| 绩效加分 | 15 分 | 7.5% | 培养新人、分享、专利、文档、表扬等 |
| 绩效减分 | - | - | 技术失误、管理失误、质量异常等 |

## 🔗 相关链接

- 项目 GitHub 仓库：[spms-docs-site](https://github.com/your-org/spms-docs-site)
- 在线演示：[SPMS 系统](https://spmsdocs-f2hybiuw.manus.space)

## 📝 文档维护

所有文档定期更新，最后更新时间：2026-04-09

如有问题或建议，请提交 Issue 或 Pull Request。
