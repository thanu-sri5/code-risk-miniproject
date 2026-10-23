import React from "react";
import {
  Lightbulb,
  AlertTriangle,
  Code2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  GitPullRequest,
} from "lucide-react";
import { AnalysisResponse, CodeRecommendation } from "../types";

interface RecommendationsViewProps {
  data: AnalysisResponse | null;
  onNavigateToImprove: () => void;
  onNavigateToAnalyzer: () => void;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  data,
  onNavigateToImprove,
  onNavigateToAnalyzer,
}) => {
  if (!data || !data.recommendations || data.recommendations.length === 0) {
    return (
      <div className="p-12 rounded-2xl bg-[#111827]/80 border border-gray-800 text-center space-y-4 max-w-2xl mx-auto my-12">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-bold text-white">No Critical Recommendations</h2>
          <p className="text-xs text-gray-400">
            All code metrics meet defect risk thresholds or no analysis has been performed yet.
          </p>
        </div>
        <button
          onClick={onNavigateToAnalyzer}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs inline-flex items-center gap-2 transition-all"
        >
          <span>Open Code Analyzer</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  const { recommendations, analysis, prediction } = data;

  const severityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-rose-500/15 text-rose-400 border-rose-500/30";
      case "medium":
        return "bg-amber-500/15 text-amber-400 border-amber-500/30";
      default:
        return "bg-indigo-500/15 text-indigo-400 border-indigo-500/30";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full pb-10">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">What should you improve?</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-semibold">
              {recommendations.length} Actionable Items
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Targeted refactoring directives and risk mitigation strategies tailored to {analysis.fileName}.
          </p>
        </div>

        {/* Action Button: Improve Code with AI */}
        <button
          onClick={onNavigateToImprove}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Improve Code with AI &rarr;</span>
        </button>
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {recommendations.map((rec, idx) => (
          <div
            key={rec.id || idx}
            className="p-6 rounded-2xl bg-[#111827]/90 border border-gray-800/90 space-y-4 shadow-md hover:border-gray-700 transition-colors"
          >
            {/* Header: Problem & Severity */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-gray-800">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    {rec.problem}
                  </h3>
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider font-mono">
                    Category: {rec.category}
                  </span>
                </div>
              </div>

              <span
                className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded border self-start sm:self-auto ${severityBadge(
                  rec.severity
                )}`}
              >
                {rec.severity} Severity
              </span>
            </div>

            {/* Why It Matters */}
            <div className="space-y-1">
              <div className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Why it matters:</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed pl-5">
                {rec.whyItMatters}
              </p>
            </div>

            {/* Recommendation */}
            <div className="space-y-1">
              <div className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Recommendation:</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed pl-5">
                {rec.recommendation}
              </p>
            </div>

            {/* Code Snippet Example if available */}
            {rec.codeSnippetExample && (
              <div className="space-y-1.5 pt-1 pl-5">
                <div className="text-[11px] font-semibold text-indigo-400 flex items-center gap-1">
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Pattern Example:</span>
                </div>
                <div className="p-3 rounded-xl bg-black/60 border border-gray-800/80 font-mono text-[11px] text-gray-300 overflow-x-auto">
                  <pre>{rec.codeSnippetExample}</pre>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom CTA Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-sm font-bold text-white">Apply All Recommendations Automatically</div>
          <div className="text-xs text-gray-400 mt-0.5">
            Launch AI Code Improvement to refactor complexity, strengthen error handling, and reduce defect likelihood.
          </div>
        </div>

        <button
          onClick={onNavigateToImprove}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer"
        >
          <GitPullRequest className="w-4 h-4" />
          <span>Launch AI Refactoring</span>
        </button>
      </div>
    </div>
  );
};
