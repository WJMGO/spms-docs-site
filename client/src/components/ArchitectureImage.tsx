export default function ArchitectureImage() {
  return (
    <div className="my-8 p-6 bg-card rounded-lg border border-border">
      <div className="bg-muted rounded-lg p-8 flex items-center justify-center min-h-96">
        <div className="text-center">
          <p className="text-muted-foreground text-lg mb-4">系统架构图</p>
          <p className="text-sm text-muted-foreground">
            展示系统的分层架构、数据流向和核心模块关系
          </p>
          <svg
            viewBox="0 0 1000 600"
            className="w-full mt-6"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* User Interface Layer */}
            <rect x="50" y="50" width="900" height="120" fill="none" stroke="currentColor" strokeWidth="2" rx="8" className="text-primary" />
            <text x="500" y="80" textAnchor="middle" className="text-lg font-bold fill-foreground">用户界面层</text>
            
            <rect x="80" y="100" width="150" height="50" fill="currentColor" rx="4" className="fill-primary" />
            <text x="155" y="130" textAnchor="middle" className="fill-primary-foreground font-semibold">部门成员门户</text>
            
            <rect x="280" y="100" width="150" height="50" fill="currentColor" rx="4" className="fill-primary" />
            <text x="355" y="130" textAnchor="middle" className="fill-primary-foreground font-semibold">经理门户</text>
            
            <rect x="480" y="100" width="150" height="50" fill="currentColor" rx="4" className="fill-primary" />
            <text x="555" y="130" textAnchor="middle" className="fill-primary-foreground font-semibold">管理员门户</text>
            
            <rect x="680" y="100" width="150" height="50" fill="currentColor" rx="4" className="fill-primary" />
            <text x="755" y="130" textAnchor="middle" className="fill-primary-foreground font-semibold">文档中心</text>

            {/* Application Layer */}
            <rect x="50" y="220" width="900" height="140" fill="none" stroke="currentColor" strokeWidth="2" rx="8" className="text-secondary" />
            <text x="500" y="250" textAnchor="middle" className="text-lg font-bold fill-foreground">应用层</text>
            
            <rect x="80" y="270" width="140" height="60" fill="currentColor" rx="4" className="fill-secondary" />
            <text x="150" y="305" textAnchor="middle" className="fill-secondary-foreground font-semibold text-sm">数据集成服务</text>
            
            <rect x="250" y="270" width="140" height="60" fill="currentColor" rx="4" className="fill-secondary" />
            <text x="320" y="305" textAnchor="middle" className="fill-secondary-foreground font-semibold text-sm">绩效计算服务</text>
            
            <rect x="420" y="270" width="140" height="60" fill="currentColor" rx="4" className="fill-secondary" />
            <text x="490" y="305" textAnchor="middle" className="fill-secondary-foreground font-semibold text-sm">多模态解析</text>
            
            <rect x="590" y="270" width="140" height="60" fill="currentColor" rx="4" className="fill-secondary" />
            <text x="660" y="305" textAnchor="middle" className="fill-secondary-foreground font-semibold text-sm">跨部门排序</text>
            
            <rect x="760" y="270" width="140" height="60" fill="currentColor" rx="4" className="fill-secondary" />
            <text x="830" y="305" textAnchor="middle" className="fill-secondary-foreground font-semibold text-sm">报表生成</text>

            {/* Data Layer */}
            <rect x="50" y="420" width="900" height="120" fill="none" stroke="currentColor" strokeWidth="2" rx="8" className="text-accent" />
            <text x="500" y="450" textAnchor="middle" className="text-lg font-bold fill-foreground">数据层</text>
            
            <rect x="80" y="470" width="130" height="50" fill="currentColor" rx="4" className="fill-accent" />
            <text x="145" y="500" textAnchor="middle" className="fill-accent-foreground font-semibold text-sm">Jira 数据</text>
            
            <rect x="240" y="470" width="130" height="50" fill="currentColor" rx="4" className="fill-accent" />
            <text x="305" y="500" textAnchor="middle" className="fill-accent-foreground font-semibold text-sm">GitLab 数据</text>
            
            <rect x="400" y="470" width="130" height="50" fill="currentColor" rx="4" className="fill-accent" />
            <text x="465" y="500" textAnchor="middle" className="fill-accent-foreground font-semibold text-sm">问卷数据</text>
            
            <rect x="560" y="470" width="130" height="50" fill="currentColor" rx="4" className="fill-accent" />
            <text x="625" y="500" textAnchor="middle" className="fill-accent-foreground font-semibold text-sm">自评数据</text>
            
            <rect x="720" y="470" width="130" height="50" fill="currentColor" rx="4" className="fill-accent" />
            <text x="785" y="500" textAnchor="middle" className="fill-accent-foreground font-semibold text-sm">配置数据</text>

            {/* Arrows */}
            <line x1="155" y1="150" x2="150" y2="270" stroke="currentColor" strokeWidth="2" className="stroke-muted-foreground" markerEnd="url(#arrowhead)" />
            <line x1="355" y1="150" x2="320" y2="270" stroke="currentColor" strokeWidth="2" className="stroke-muted-foreground" markerEnd="url(#arrowhead)" />
            <line x1="555" y1="150" x2="490" y2="270" stroke="currentColor" strokeWidth="2" className="stroke-muted-foreground" markerEnd="url(#arrowhead)" />
            <line x1="755" y1="150" x2="830" y2="270" stroke="currentColor" strokeWidth="2" className="stroke-muted-foreground" markerEnd="url(#arrowhead)" />
            
            <line x1="150" y1="330" x2="145" y2="470" stroke="currentColor" strokeWidth="2" className="stroke-muted-foreground" markerEnd="url(#arrowhead)" />
            <line x1="320" y1="330" x2="305" y2="470" stroke="currentColor" strokeWidth="2" className="stroke-muted-foreground" markerEnd="url(#arrowhead)" />
            <line x1="490" y1="330" x2="465" y2="470" stroke="currentColor" strokeWidth="2" className="stroke-muted-foreground" markerEnd="url(#arrowhead)" />
            <line x1="660" y1="330" x2="625" y2="470" stroke="currentColor" strokeWidth="2" className="stroke-muted-foreground" markerEnd="url(#arrowhead)" />
            <line x1="830" y1="330" x2="785" y2="470" stroke="currentColor" strokeWidth="2" className="stroke-muted-foreground" markerEnd="url(#arrowhead)" />

            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                <polygon points="0 0, 10 3, 0 6" fill="currentColor" className="fill-muted-foreground" />
              </marker>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
}
