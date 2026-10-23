import React, { useState } from "react";
import {
  ShieldAlert,
  Search,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Sparkles,
  ExternalLink,
  Download,
  Check,
} from "lucide-react";
import { RiskLevel } from "../types";

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  highRiskCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  highRiskCount,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadZip = () => {
    setDownloading(true);
    const link = document.createElement("a");
    link.href = "/api/download-project";
    link.setAttribute("download", "smart-software-risk-ai.zip");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    }, 1200);
  };

  return (
    <header className="h-16 border-b border-gray-800/80 bg-[#0B0F17]/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Brand & Breadcrumbs */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => onNavigate("landing")}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight text-white flex items-center gap-2">
              Smart Software Risk AI
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                NASA MDP ML
              </span>
            </div>
          </div>
        </button>

        <div className="hidden md:flex items-center text-xs text-gray-500 space-x-2 pl-4 border-l border-gray-800">
          <span>Platform</span>
          <span>/</span>
          <span className="text-gray-300 font-medium capitalize">
            {currentView === "landing" ? "Overview" : currentView.replace("-", " ")}
          </span>
        </div>
      </div>

      {/* Center Search / Info */}
      <div className="hidden lg:flex items-center">
        <div className="relative w-80">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search modules, risks, or metrics..."
            className="w-full bg-gray-900/80 border border-gray-800 text-xs rounded-lg pl-9 pr-3 py-1.5 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-indigo-500/60 transition-colors"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* ML Status Pill */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium">ML Model: Online (83.4% Acc)</span>
        </div>

        {/* Download Project ZIP Button */}
        <button
          onClick={handleDownloadZip}
          disabled={downloading}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 hover:text-indigo-200 border border-indigo-500/30 font-semibold transition-all shadow-sm active:scale-95 cursor-pointer"
          title="Download complete project source code (.zip)"
        >
          {downloadSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-300">Downloaded!</span>
            </>
          ) : downloading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              <span>Preparing ZIP...</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Download ZIP</span>
              <span className="sm:hidden">ZIP</span>
            </>
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/60 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {highRiskCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#0B0F17]" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#111827] border border-gray-800 rounded-xl shadow-2xl p-4 text-xs z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <span className="font-semibold text-gray-200">Defect Alerts</span>
                <span className="text-[10px] text-gray-500">Real-time ML</span>
              </div>
              <div className="mt-3 space-y-2.5">
                {highRiskCount > 0 ? (
                  <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-white">{highRiskCount} High-Risk Modules Detected</div>
                      <div className="text-[11px] text-rose-300/80 mt-0.5">
                        Cyclomatic complexity exceeds threshold (&gt;10). Urgent refactoring recommended.
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>All analyzed modules are currently within acceptable risk bounds.</span>
                  </div>
                )}
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    onNavigate("prioritization");
                  }}
                  className="w-full py-1.5 text-center text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition-colors text-[11px] font-medium"
                >
                  View Risk Prioritization &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-gray-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-500 flex items-center justify-center font-bold text-xs text-white border border-indigo-400/30">
            DL
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-semibold text-gray-200 leading-tight">Dev Lead</div>
            <div className="text-[10px] text-gray-400">Quality Assurance</div>
          </div>
        </div>
      </div>
    </header>
  );
};
