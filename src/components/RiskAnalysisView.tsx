import React from "react";
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  BarChart3,
  HelpCircle,
  Lightbulb,
  GitPullRequest,
  ArrowRight,
  Shield,
  Activity,
  Layers,
} from "lucide-react";
import { AnalysisResponse } from "../types";

interface RiskAnalysisViewProps {
  data: AnalysisResponse | null;
  onNavigateToExplain: () => void;
  onNavigateToRecommendations: () => void;
  onNavigateToImprove: () => void;
  onNavigateToAnalyzer: () => void;
}

export const RiskAnalysisView: React.FC<RiskAnalysisViewProps> = ({
  data,
  onNavigateToExplain,
  onNavigateToRecommendations,
  onNavigateToImprove,
  onNavigateToAnalyzer,
}) => {
  if (!data) {
    return (
      <div className="p-12 rounded-2xl bg-[#111827]/80 border border-gray-800 text-center space-y-4 max-w-2xl mx-auto my-12">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mx-auto">
          <AlertOctagon className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-bold text-white">No Active Analysis Loaded</h2>
          <p className="text-xs text-gray-400">
            Analyze source code or generate a module to view genuine machine learning defect predictions.
          </p>
        </div>
        <button
          onClick={onNavigateToAnalyzer}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs inline-flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20"
        >
          <span>Open Code Analyzer</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  const { prediction, analysis } = data;
  const metrics = analysis.rawMetrics;

  const riskBadgeColors = {
    HIGH: "bg-rose-500/15 text-rose-400 border-rose-500/30 ring-rose-500/20",
    MEDIUM: "bg-amber-500/15 text-amber-400 border-amber-500/30 ring-amber-500/20",
    LOW: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 ring-emerald-500/20",
  }[prediction.overallRisk];

  const riskBgGradients = {
    HIGH: "from-rose-500/10 via-rose-500/5 to-transparent border-rose-500/30",
    MEDIUM: "from-amber-500/10 via-amber-500/5 to-transparent border-amber-500/30",
    LOW: "from-emerald-500/10 via-emerald-500/5 to-transparent border-emerald-500/30",
  }[prediction.overallRisk];

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full pb-10">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Software Risk Analysis</h1>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-300">
              {analysis.fileName}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Machine learning software defect classification based on the NASA Metrics Data Program (KC1/JM1).
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToExplain}
            className="px-3.5 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-indigo-300 border border-indigo-500/30 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>Why is this risky? (XAI)</span>
          </button>

          <button
            onClick={onNavigateToRecommendations}
            className="px-3.5 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-amber-300 border border-amber-500/30 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Recommendations</span>
          </button>

          <button
            onClick={onNavigateToImprove}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
          >
            <GitPullRequest className="w-3.5 h-3.5" />
            <span>Improve with AI &rarr;</span>
          </button>
        </div>
      </div>

      {/* Main Overall Risk Hero Card */}
      <div className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-br ${riskBgGradients} border bg-[#111827]/90 relative overflow-hidden shadow-2xl`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Model Classification Output
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-black/40 text-gray-400 font-mono">
                NASA MDP Logistic Classifier
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className={`text-4xl sm:text-5xl font-black tracking-tight px-4 py-1.5 rounded-2xl border ring-4 ${riskBadgeColors}`}>
                {prediction.overallRisk} RISK
              </div>

              <div>
                <div className="text-2xl font-extrabold text-white">
                  {Math.round(prediction.defectProbability * 100)}%
                </div>
                <div className="text-xs text-gray-400 font-medium">
                  Defect Probability
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed pt-1">
              {prediction.summaryExplanation}
            </p>
          </div>

          {/* Model Trust Gauge */}
          <div className="p-4 rounded-2xl bg-black/40 border border-gray-800/80 shrink-0 space-y-3 md:w-64">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400 font-medium">Model Confidence</span>
              <span className="font-bold text-white">{prediction.confidenceScore}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-1000"
                style={{ width: `${prediction.confidenceScore}%` }}
              />
            </div>

            <div className="pt-2 border-t border-gray-800/60 space-y-1.5 text-[11px]">
              <div className="flex justify-between text-gray-400">
                <span>Model Baseline Logit:</span>
                <span className="font-mono text-gray-300">{prediction.baseValue}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Calculated Logit (z):</span>
                <span className="font-mono text-gray-300">{prediction.logitScore}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Training Records:</span>
                <span className="font-mono text-gray-300">2,109 NASA Instances</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Software Metrics Progress Cards Section (matching prompt section 7 layout) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">Software Metrics &amp; Risk Thresholds</h2>
          <span className="text-xs text-gray-400">Static measurements analyzed against defect benchmarks</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Lines of Code */}
          <div className="p-5 rounded-2xl bg-[#111827]/80 border border-gray-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-400">Lines of Code</span>
                <span className="text-lg font-bold text-white font-mono">{metrics.loc}</span>
              </div>
              <div className="mt-3 w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${metrics.loc > 150 ? "bg-amber-500" : "bg-indigo-500"}`}
                  style={{ width: `${Math.min(100, (metrics.loc / 300) * 100)}%` }}
                />
              </div>
            </div>
            <div className="text-[11px] text-gray-400 mt-3 flex justify-between">
              <span>{metrics.sloc} SLOC</span>
              <span>Threshold: &lt; 150 LOC</span>
            </div>
          </div>

          {/* Complexity */}
          <div className="p-5 rounded-2xl bg-[#111827]/80 border border-gray-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-400">Cyclomatic Complexity</span>
                <span className={`text-lg font-bold font-mono ${metrics.cyclomaticComplexity > 10 ? "text-rose-400" : "text-emerald-400"}`}>
                  {metrics.cyclomaticComplexity}
                </span>
              </div>
              <div className="mt-3 w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${metrics.cyclomaticComplexity > 10 ? "bg-rose-500" : "bg-emerald-500"}`}
                  style={{ width: `${Math.min(100, (metrics.cyclomaticComplexity / 20) * 100)}%` }}
                />
              </div>
            </div>
            <div className="text-[11px] text-gray-400 mt-3 flex justify-between">
              <span>{metrics.branchCount} Decision Branches</span>
              <span>McCabe limit: &le; 10</span>
            </div>
          </div>

          {/* Dependencies */}
          <div className="p-5 rounded-2xl bg-[#111827]/80 border border-gray-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-400">Dependencies</span>
                <span className="text-lg font-bold text-indigo-400 font-mono">{metrics.dependencyCount}</span>
              </div>
              <div className="mt-3 w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${metrics.dependencyCount > 6 ? "bg-amber-500" : "bg-indigo-500"}`}
                  style={{ width: `${Math.min(100, (metrics.dependencyCount / 12) * 100)}%` }}
                />
              </div>
            </div>
            <div className="text-[11px] text-gray-400 mt-3 flex justify-between">
              <span>Coupled packages</span>
              <span>Threshold: &le; 6</span>
            </div>
          </div>

          {/* Test Coverage */}
          <div className="p-5 rounded-2xl bg-[#111827]/80 border border-gray-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-gray-400">Test Coverage</span>
                <span className={`text-lg font-bold font-mono ${metrics.estimatedTestCoverage < 50 ? "text-amber-400" : "text-emerald-400"}`}>
                  {metrics.estimatedTestCoverage}%
                </span>
              </div>
              <div className="mt-3 w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${metrics.estimatedTestCoverage < 50 ? "bg-amber-500" : "bg-emerald-500"}`}
                  style={{ width: `${metrics.estimatedTestCoverage}%` }}
                />
              </div>
            </div>
            <div className="text-[11px] text-gray-400 mt-3 flex justify-between">
              <span>{metrics.testAssertionCount} assertions</span>
              <span>Target: &ge; 75%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Deep Dive Callouts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          onClick={onNavigateToExplain}
          className="p-5 rounded-2xl bg-[#111827]/80 border border-gray-800 hover:border-indigo-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
              <HelpCircle className="w-4 h-4" />
              <span>Explainable AI (SHAP)</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="font-bold text-sm text-white mb-1">Why is this code risky?</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Inspect the exact mathematical factor breakdown (SHAP values) driving this risk classification.
          </p>
        </div>

        <div
          onClick={onNavigateToRecommendations}
          className="p-5 rounded-2xl bg-[#111827]/80 border border-gray-800 hover:border-amber-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <Lightbulb className="w-4 h-4" />
              <span>Smart Recommendations</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="font-bold text-sm text-white mb-1">What should you improve?</h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Review actionable problems, why they matter, and trigger one-click AI code improvements.
          </p>
        </div>
      </div>
    </div>
  );
};
