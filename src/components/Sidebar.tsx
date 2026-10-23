import React from "react";
import {
  LayoutDashboard,
  Sparkles,
  FileCode2,
  AlertOctagon,
  Lightbulb,
  History,
  GitPullRequest,
  CheckCircle,
  Layers,
  ArrowRight,
} from "lucide-react";

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  hasActiveAnalysis: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  hasActiveAnalysis,
}) => {
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "generator",
      label: "AI Code Generator",
      icon: Sparkles,
      badge: "AI",
    },
    {
      id: "analyzer",
      label: "Code Analyzer",
      icon: FileCode2,
      badge: null,
    },
    {
      id: "risk-analysis",
      label: "Risk Analysis",
      icon: AlertOctagon,
      badge: hasActiveAnalysis ? "Live" : null,
    },
    {
      id: "prioritization",
      label: "Risk Priority",
      icon: Layers,
      badge: null,
    },
    {
      id: "recommendations",
      label: "Recommendations",
      icon: Lightbulb,
      badge: null,
    },
    {
      id: "improvement",
      label: "AI Code Improvement",
      icon: GitPullRequest,
      badge: "AI",
    },
    {
      id: "history",
      label: "History",
      icon: History,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 border-r border-gray-800/80 bg-[#0B0F17] flex flex-col justify-between shrink-0 select-none">
      {/* Navigation list */}
      <div className="p-4 space-y-6">
        <div>
          <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Workspaces
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm"
                      : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-indigo-400" : "text-gray-400"
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                        item.badge === "Live"
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                          : "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Workflow Lifecycle Card */}
        <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800/80">
          <div className="text-[11px] font-semibold text-gray-300 mb-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            Software Risk Pipeline
          </div>
          <p className="text-[10px] text-gray-400 leading-relaxed mb-2.5">
            Seamless closed loop from requirement to verifiable defect mitigation.
          </p>
          <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono bg-black/40 px-2 py-1.5 rounded border border-gray-800">
            <span>Gen</span>
            <ArrowRight className="w-2.5 h-2.5 text-gray-400" />
            <span>Analyze</span>
            <ArrowRight className="w-2.5 h-2.5 text-gray-400" />
            <span>Predict</span>
            <ArrowRight className="w-2.5 h-2.5 text-gray-400" />
            <span>Fix</span>
          </div>
        </div>
      </div>

      {/* Footer Model info */}
      <div className="p-4 border-t border-gray-800/80 bg-gray-900/20">
        <div className="flex items-center justify-between text-[11px] text-gray-400">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>NASA MDP KC1/JM1</span>
          </div>
          <span className="text-[10px] font-mono text-gray-400">v2.4</span>
        </div>
        <div className="text-[10px] text-gray-400 mt-1">
          2,109 NASA defect training instances
        </div>
      </div>
    </aside>
  );
};
