import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Bell, Settings, Menu, X, TrendingUp, Download, ChevronRight, Users } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";

export default function Dashboard() {
  const [, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedQuarter, setSelectedQuarter] = useState("Q3");
  const [activeNav, setActiveNav] = useState("overview");

  // 模拟排名数据
  const rankingData = [
    {
      rank: 1,
      name: "张秋实",
      department: "研究中心 / 架构",
      jan: 94.5,
      feb: 96.0,
      mar: 98.0,
      quarterAvg: 96.17,
      coefficient: 1.05,
      finalScore: 101.0,
    },
    {
      rank: 2,
      name: "王伟",
      department: "市场部 / 品牌组",
      jan: 92.0,
      feb: 95.0,
      mar: 93.5,
      quarterAvg: 93.5,
      coefficient: 1.02,
      finalScore: 95.37,
    },
    {
      rank: 3,
      name: "李璿",
      department: "销售部 / 华东区",
      jan: 90.0,
      feb: 91.5,
      mar: 96.0,
      quarterAvg: 92.5,
      coefficient: 1.0,
      finalScore: 92.5,
    },
    {
      rank: 4,
      name: "刘洋",
      department: "人力资源 / 绩效",
      jan: 88.5,
      feb: 90.0,
      mar: 92.0,
      quarterAvg: 90.17,
      coefficient: 1.0,
      finalScore: 90.17,
    },
    {
      rank: 5,
      name: "陈燕",
      department: "客服部 / 大客户",
      jan: 85.0,
      feb: 88.0,
      mar: 87.5,
      quarterAvg: 86.83,
      coefficient: 0.98,
      finalScore: 85.09,
    },
  ];

  const navigationItems = [
    { id: "overview", label: "绩效汇总", icon: "📊", path: "/" },
    { id: "monthly", label: "月度绩效评定工作台", icon: "📋", path: "/monthly-workbench" },
    { id: "rules", label: "绩效规则", icon: "⚙️", path: "/performance-rules" },
  ];

  const topNavItems = [
    { label: "绩效汇总", path: "/", id: "overview" },
    { label: "当月绩效", path: "/monthly-performance", id: "monthly" },
    { label: "历史月度绩效", path: "/historical-monthly", id: "historical-monthly" },
    { label: "历史季度绩效", path: "/historical-quarterly", id: "historical-quarterly" },
    { label: "全年绩效", path: "/annual-performance", id: "annual" },
  ];

  const handleNavClick = (path: string, id: string) => {
    setActiveNav(id);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 顶部导航栏 */}
      <header className="bg-white border-b border-slate-200">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* 品牌标题 */}
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-blue-900">系统软件绩效管理系统</div>
              <div className="text-xs text-slate-500 font-medium">SPMS</div>
            </div>

            {/* 横向导航条目 */}
            <nav className="hidden md:flex gap-8">
              {topNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.path, item.id)}
                  className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
                    activeNav === item.id
                      ? "text-blue-900 border-blue-900"
                      : "text-slate-600 border-transparent hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-100 rounded-md">
              <Search size={20} className="text-slate-600" />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-md">
              <Bell size={20} className="text-slate-600" />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-md">
              <Settings size={20} className="text-slate-600" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* 左侧侧边栏 */}
        <aside
          className={`${
            sidebarOpen ? "w-64" : "w-0"
          } transition-all duration-300 bg-slate-100 overflow-hidden`}
        >
          <div className="p-6">
            <h2 className="text-lg font-bold text-blue-900 mb-6">绩效汇总</h2>
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.path, item.id)}
                  className={`w-full text-left px-4 py-3 rounded-md transition-colors flex items-center gap-3 ${
                    activeNav === item.id
                      ? "bg-blue-200 text-blue-900 font-semibold"
                      : "text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* 主内容区域 */}
        <main className="flex-1 p-8">
          {/* 侧边栏切换按钮 */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mb-4 p-2 hover:bg-slate-200 rounded-md md:hidden"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 左侧主内容 */}
            <div className="lg:col-span-2 space-y-8">
              {/* 季度概览标题 */}
              <div>
                <h1 className="text-3xl font-bold text-blue-900 mb-2">季度绩效概览</h1>
                <p className="text-slate-600 text-sm">
                  基于 2023 年第 3 季度的绩效指标评估，旨在现阶段各层级的战略对齐程度与扣分度与执行力产出。
                </p>
              </div>

              {/* 统计数据卡 */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="bg-white border-0 shadow-sm">
                  <CardContent className="pt-6">
                    <div className="text-slate-600 text-sm mb-2">平均得分</div>
                    <div className="text-3xl font-bold text-blue-900">92.4</div>
                    <div className="text-xs text-slate-500 mt-2">/ 100</div>
                  </CardContent>
                </Card>
                <Card className="bg-white border-0 shadow-sm">
                  <CardContent className="pt-6">
                    <div className="text-slate-600 text-sm mb-2">完成率</div>
                    <div className="text-3xl font-bold text-blue-900">98.2%</div>
                  </CardContent>
                </Card>
                <Card className="bg-white border-0 shadow-sm">
                  <CardContent className="pt-6">
                    <div className="text-slate-600 text-sm mb-2">参评人数</div>
                    <div className="text-3xl font-bold text-blue-900">1,248</div>
                  </CardContent>
                </Card>
              </div>

              {/* 排名表格 */}
              <div className="bg-white rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-blue-900 flex items-center gap-2">
                    <Users size={20} />
                    2023年第3季度个人绩效名单表
                  </h2>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 text-sm text-blue-900 hover:bg-slate-100 rounded-md">
                      筛选
                    </button>
                    <button className="px-4 py-2 text-sm bg-blue-900 text-white hover:bg-blue-800 rounded-md flex items-center gap-2">
                      <Download size={16} />
                      导出数据
                    </button>
                  </div>
                </div>

                {/* 表格 */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200">
                        <th className="px-4 py-3 text-left font-medium text-slate-700">排名</th>
                        <th className="px-4 py-3 text-left font-medium text-slate-700">员工信息</th>
                        <th className="px-4 py-3 text-left font-medium text-slate-700">所属部门</th>
                        <th className="px-4 py-3 text-right font-medium text-slate-700">1月分</th>
                        <th className="px-4 py-3 text-right font-medium text-slate-700">2月分</th>
                        <th className="px-4 py-3 text-right font-medium text-slate-700">3月分</th>
                        <th className="px-4 py-3 text-right font-medium text-slate-700">季度平均</th>
                        <th className="px-4 py-3 text-right font-medium text-slate-700">加权系数</th>
                        <th className="px-4 py-3 text-right font-medium text-slate-700">最终得分</th>
                        <th className="px-4 py-3 text-center font-medium text-slate-700">操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rankingData.map((row, idx) => (
                        <tr
                          key={row.rank}
                          className={`border-b border-slate-100 ${
                            idx % 2 === 0 ? "bg-white" : "bg-slate-50"
                          } hover:bg-slate-100 transition-colors`}
                        >
                          <td className="px-4 py-4 text-center">
                            <Badge className="bg-blue-100 text-blue-900">{row.rank}</Badge>
                          </td>
                          <td className="px-4 py-4 font-medium text-slate-900">{row.name}</td>
                          <td className="px-4 py-4 text-slate-600">{row.department}</td>
                          <td className="px-4 py-4 text-right text-slate-900">{row.jan}</td>
                          <td className="px-4 py-4 text-right text-slate-900">{row.feb}</td>
                          <td className="px-4 py-4 text-right text-slate-900">{row.mar}</td>
                          <td className="px-4 py-4 text-right text-slate-900">{row.quarterAvg}</td>
                          <td className="px-4 py-4 text-right text-slate-900">{row.coefficient}</td>
                          <td className="px-4 py-4 text-right font-bold text-blue-900">{row.finalScore}</td>
                          <td className="px-4 py-4 text-center">
                            <button className="text-blue-900 hover:text-blue-700 text-sm font-medium">
                              详情
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 分页 */}
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-slate-600">共 1248 名员工 1 页显示数据</div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 rounded">
                      上一页
                    </button>
                    <button className="px-3 py-1 text-sm bg-blue-900 text-white rounded">1</button>
                    <button className="px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 rounded">
                      2
                    </button>
                    <button className="px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 rounded">
                      3
                    </button>
                    <button className="px-3 py-1 text-sm text-slate-600 hover:bg-slate-100 rounded">
                      下一页
                    </button>
                  </div>
                </div>
              </div>

              {/* 季度选择器 */}
              <div className="flex gap-4 justify-center py-8">
                {["Q1", "Q2", "Q3", "Q4"].map((q) => (
                  <button
                    key={q}
                    onClick={() => setSelectedQuarter(q)}
                    className={`px-6 py-2 rounded-md font-medium transition-colors ${
                      selectedQuarter === q
                        ? "bg-blue-900 text-white"
                        : "bg-slate-200 text-slate-700 hover:bg-slate-300"
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* 右侧信息卡 */}
            <div className="space-y-6">
              {/* Q3 FINALIST 卡 */}
              <Card className="bg-gradient-to-br from-blue-900 to-blue-800 border-0 text-white">
                <CardContent className="pt-6">
                  <Badge className="bg-white text-blue-900 mb-4">Q3 FINALIST</Badge>
                  <h3 className="text-xl font-bold mb-2">季度最佳绩效员工</h3>
                  <p className="text-sm text-blue-100 mb-6">战略研究中心 - 张秋实</p>
                  <Button className="w-full bg-white text-blue-900 hover:bg-slate-100">
                    查看个人报告
                  </Button>
                </CardContent>
              </Card>

              {/* 会员信息卡 */}
              <Card className="bg-white border-0 shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-slate-300 rounded-full flex items-center justify-center">
                      <span className="text-xl">👤</span>
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">管理员</div>
                      <div className="text-xs text-slate-500">系统管理员</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 管理建议 */}
              <Card className="bg-white border-0 shadow-sm">
                <CardContent className="pt-6">
                  <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <TrendingUp size={18} className="text-blue-900" />
                    季度环比提升趋势
                  </h4>
                  <div className="space-y-3">
                    <div className="text-sm text-slate-700">
                      • 研究中心全体在在全部组织的平均绩效正在持续上升，建议作为绩效人才入库推荐。
                    </div>
                    <div className="text-sm text-slate-700">
                      • 生生销售主任在3月业绩超过预期，建议在2月份的目标下设。
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 查看完整诊断报告 */}
              <Link href="/analytics">
                <a className="flex items-center justify-center gap-2 text-blue-900 hover:text-blue-700 font-medium text-sm">
                  查看完整诊断报告 <ChevronRight size={16} />
                </a>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
