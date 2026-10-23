import React from "react";
import {
  Sparkles,
  SearchCode,
  AlertTriangle,
  HelpCircle,
  Wrench,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  ChevronRight,
  Download,
} from "lucide-react";

interface LandingPageProps {
  onStartAnalysis: () => void;
  onTryGenerator: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartAnalysis,
  onTryGenerator,
}) => {
  const flowSteps = [
    {
      id: "gen",
      name: "Generate",
      desc: "AI-generated source from developer requirements",
      icon: Sparkles,
      color: "from-blue-500 to-indigo-600",
    },
    {
      id: "ana",
      name: "Analyze",
      desc: "Authentic McCabe & Halstead metric extraction",
      icon: SearchCode,
      color: "from-indigo-500 to-purple-600",
    },
    {
      id: "pre",
      name: "Predict",
      desc: "Genuine ML model trained on NASA MDP defect datasets",
      icon: AlertTriangle,
      color: "from-purple-500 to-rose-600",
    },
    {
      id: "exp",
      name: "Explain",
      desc: "Transparent SHAP attribution & root factor discovery",
      icon: HelpCircle,
      color: "from-amber-500 to-orange-600",
    },
    {
      id: "imp",
      name: "Improve",
      desc: "Automated refactoring & verified risk mitigation",
      icon: Wrench,
      color: "from-emerald-500 to-teal-600",
    },
  ];

  return (
    <div className="min-h-full flex flex-col justify-between py-12 px-6 lg:px-16 max-w-7xl mx-auto w-full">
      {/* Top Tag & Hero */}
      <div className="text-center max-w-3xl mx-auto pt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          <span>NASA MDP &amp; PROMISE Machine Learning Engine</span>
          <span className="text-gray-400">|</span>
          <span className="text-gray-300">Java &bull; Python &bull; JavaScript</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
          Build Smarter. <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-blue-400 bg-clip-text text-transparent">
            Detect Risks Earlier.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-gray-300 leading-relaxed mb-10 max-w-2xl mx-auto font-normal">
          Generate code with AI, analyze software quality, and identify potential risks before they become problems.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartAnalysis}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2.5 transition-all hover:translate-y-[-1px] active:translate-y-[0px]"
          >
            <Activity className="w-4 h-4" />
            <span>Start Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onTryGenerator}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gray-900/90 hover:bg-gray-800 text-gray-200 border border-gray-700/80 font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:translate-y-[-1px] active:translate-y-[0px]"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Try AI Code Generator</span>
          </button>

          <a
            href="/api/download-project"
            download="smart-software-risk-ai.zip"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:translate-y-[-1px] active:translate-y-[0px]"
          >
            <Download className="w-4 h-4 text-indigo-400" />
            <span>Download Project (.zip)</span>
          </a>
        </div>
      </div>

      {/* Visual Connected Flow Banner */}
      <div className="my-16">
        <div className="text-center mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
            End-to-End Developer Workflow
          </span>
        </div>

        {/* Flow Steps Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {flowSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className="p-5 rounded-2xl bg-[#111827]/70 border border-gray-800/90 hover:border-gray-700 transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-xl group-hover:scale-125 transition-transform" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white shadow-md`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono text-gray-400 font-bold">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-white mb-1.5 flex items-center gap-1.5">
                    {step.name}
                    {idx < flowSteps.length - 1 && (
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400 hidden md:inline ml-auto" />
                    )}
                  </h3>

                  <p className="text-xs text-gray-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Engineering Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-gray-800/80">
        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-200 mb-1">Authentic ML Evaluation</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Trained on 2,109 NASA MDP (KC1/JM1) defect records. No randomized demo scores.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-200 mb-1">Explainable AI (SHAP)</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Understand the exact mathematical contributors driving your risk classification.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-200 mb-1">Automated Refactoring</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              Directly improve detected hotspots with Gemini 3.8 and re-verify risk drop.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
