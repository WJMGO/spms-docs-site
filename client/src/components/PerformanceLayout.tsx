import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Search, Bell, Settings, Menu, X } from 'lucide-react';

interface PerformanceLayoutProps {
  children: ReactNode;
  activeNav?: string;
}

export default function PerformanceLayout({ children, activeNav = 'overview' }: PerformanceLayoutProps) {
  const [, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentActiveNav, setCurrentActiveNav] = useState(activeNav);

  const navigationItems = [
    { id: 'overview', label: '绩效汇总', icon: '📊', path: '/' },
    { id: 'monthly-workbench', label: '月度绩效评定工作台', icon: '📋', path: '/monthly-workbench' },
    { id: 'rules', label: '绩效规则', icon: '⚙️', path: '/performance-rules' },
  ];

  const topNavItems = [
    { label: '绩效汇总', path: '/', id: 'overview' },
    { label: '当月绩效', path: '/monthly-performance', id: 'monthly' },
    { label: '历史月度绩效', path: '/historical-monthly', id: 'historical-monthly' },
    { label: '历史季度绩效', path: '/historical-quarterly', id: 'historical-quarterly' },
    { label: '全年绩效', path: '/annual-performance', id: 'annual' },
  ];

  const handleNavClick = (path: string, id: string) => {
    setCurrentActiveNav(id);
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
                    currentActiveNav === item.id
                      ? 'text-blue-900 border-blue-900'
                      : 'text-slate-600 border-transparent hover:text-slate-900'
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
            sidebarOpen ? 'w-64' : 'w-0'
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
                    currentActiveNav === item.id
                      ? 'bg-blue-200 text-blue-900 font-semibold'
                      : 'text-slate-700 hover:bg-slate-200'
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
        <main className="flex-1">
          {/* 侧边栏切换按钮 */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="fixed bottom-6 right-6 p-3 bg-blue-900 text-white rounded-full hover:bg-blue-800 transition-colors md:hidden z-40"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {children}
        </main>
      </div>
    </div>
  );
}
