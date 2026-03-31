import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  sections: Array<{ id: string; title: string; icon: string }>;
  currentSection: string;
  onSectionChange: (section: string) => void;
}

export default function Sidebar({
  sections,
  currentSection,
  onSectionChange,
}: SidebarProps) {
  return (
    <div className="h-full flex flex-col bg-card">
      {/* Logo Area */}
      <div className="px-6 py-6 border-b border-border">
        <h2 className="text-lg font-bold text-foreground">SPMS</h2>
        <p className="text-sm text-muted-foreground mt-1">
          绩效管理系统设计文档
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-2">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => onSectionChange(section.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left",
                  currentSection === section.id
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-foreground hover:bg-secondary"
                )}
              >
                <span className="text-lg">{section.icon}</span>
                <span className="flex-1">{section.title}</span>
                {currentSection === section.id && (
                  <ChevronRight size={18} />
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-border text-xs text-muted-foreground">
        <p>版本: V2.0</p>
        <p>最后更新: 2026年3月31日</p>
      </div>
    </div>
  );
}
