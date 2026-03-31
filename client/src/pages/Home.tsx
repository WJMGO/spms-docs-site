import { useState } from "react";
import { Menu, X, Search, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Sidebar from "@/components/Sidebar";
import DocumentContent from "@/components/DocumentContent";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentSection, setCurrentSection] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  const sections = [
    { id: "overview", title: "系统概览", icon: "📋" },
    { id: "background", title: "项目背景", icon: "🎯" },
    { id: "users", title: "用户角色", icon: "👥" },
    { id: "features", title: "功能需求", icon: "⚙️" },
    { id: "architecture", title: "系统架构", icon: "🏗️" },
    { id: "pages", title: "页面原型", icon: "🎨" },
    { id: "nonfunctional", title: "非功能需求", icon: "✅" },
    { id: "roadmap", title: "后续计划", icon: "🚀" },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } transition-all duration-300 border-r border-border bg-card overflow-hidden`}
      >
        <Sidebar
          sections={sections}
          currentSection={currentSection}
          onSectionChange={setCurrentSection}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
            <h1 className="text-xl font-bold text-foreground">
              SPMS 系统设计文档
            </h1>
          </div>

          {/* Search Bar */}
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="搜索内容..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto px-8 py-8">
            <DocumentContent section={currentSection} searchQuery={searchQuery} />
          </div>
        </main>
      </div>
    </div>
  );
}
