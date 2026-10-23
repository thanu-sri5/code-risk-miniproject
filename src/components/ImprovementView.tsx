import React, { useState } from "react";
import {
  GitPullRequest,
  CheckSquare,
  Square,
  Sparkles,
  Loader2,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  SearchCode,
  FileCheck2,
  TrendingDown,
} from "lucide-react";
import { SupportedLanguage, AnalysisResponse } from "../types";
import { CodeEditor } from "./CodeEditor";

interface ImprovementViewProps {
  currentCode: string;
  currentLanguage: SupportedLanguage;
  currentAnalysis: AnalysisResponse | null;
  onReAnalyze: (code: string, language: SupportedLanguage) => void;
  onUseImprovedVersion: (code: string) => void;
}

export const ImprovementView: React.FC<ImprovementViewProps> = ({
  currentCode,
  currentLanguage,
  currentAnalysis,
  onReAnalyze,
  onUseImprovedVersion,
}) => {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([
    "Fix detected issues",
    "Reduce complexity",
    "Add error handling",
    "Improve readability",
  ]);

  const [isImproving, setIsImproving] = useState<boolean>(false);
  const [improvedCode, setImprovedCode] = useState<string>("");
  const [summaryOfChanges, setSummaryOfChanges] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const goalOptions = [
    "Fix detected issues",
    "Reduce complexity",
    "Improve readability",
    "Add error handling",
    "Add comments",
    "Improve performance",
    "Generate test cases",
  ];

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter((g) => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleImprove = async () => {
    if (!currentCode.trim()) return;

    setIsImproving(true);
    setError(null);

    const detectedRisks = currentAnalysis?.recommendations?.map((r) => r.problem) || [];

    try {
      const res = await fetch("/api/ai/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalCode: currentCode,
          language: currentLanguage,
          goals: selectedGoals,
          detectedRisks,
          historyId: currentAnalysis?.historyId,
        }),
      });

      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Failed to improve code.");
      }

      const data = await res.json();
      setImprovedCode(data.improvedCode);
      setSummaryOfChanges(data.summaryOfChanges || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to improve code.");
    } finally {
      setIsImproving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full pb-10">
      {/* View Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">AI Code Improvement</h1>
        <p className="text-xs text-gray-400 mt-1">
          Automated structural refactoring and defensive hardening designed to mitigate detected software defect risks.
        </p>
      </div>

      {/* Refactoring Strategy Selection Card */}
      <div className="p-5 rounded-2xl bg-[#111827]/90 border border-gray-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-gray-200">Select Refactoring Directives</span>
            <p className="text-[11px] text-gray-400">
              Customize the goals Gemini applies when rewriting the module.
            </p>
          </div>

          <button
            onClick={handleImprove}
            disabled={isImproving || selectedGoals.length === 0 || !currentCode.trim()}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isImproving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Refactoring Code...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Improve Code</span>
              </>
            )}
          </button>
        </div>

        {/* Checkbox Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 pt-2 border-t border-gray-800">
          {goalOptions.map((goal) => {
            const isChecked = selectedGoals.includes(goal);
            return (
              <button
                key={goal}
                onClick={() => toggleGoal(goal)}
                className={`p-2.5 rounded-xl text-xs text-left flex items-center gap-2.5 border transition-all ${
                  isChecked
                    ? "bg-indigo-600/15 border-indigo-500/40 text-indigo-300 font-semibold"
                    : "bg-gray-900/60 border-gray-800 text-gray-400 hover:text-gray-200"
                }`}
              >
                {isChecked ? (
                  <CheckSquare className="w-4 h-4 text-indigo-400 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-gray-600 shrink-0" />
                )}
                <span>{goal}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Summary of Changes (when available) */}
      {summaryOfChanges.length > 0 && (
        <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2.5 animate-in fade-in">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
            <CheckCircle className="w-4 h-4" />
            <span>Summary of Refactoring Changes Applied:</span>
          </div>
          <ul className="space-y-1.5 pl-6 list-disc text-xs text-gray-300">
            {summaryOfChanges.map((change, idx) => (
              <li key={idx} className="leading-relaxed">
                {change}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Side-by-Side Code Comparison: Original vs Improved */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Original Code */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Original Code
            </span>
            {currentAnalysis && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-300">
                Complexity: {currentAnalysis.analysis.rawMetrics.cyclomaticComplexity} &bull; {currentAnalysis.prediction.overallRisk} RISK
              </span>
            )}
          </div>
          <CodeEditor
            value={currentCode}
            language={currentLanguage}
            readOnly={true}
            height="440px"
            title="Original Source"
          />
        </div>

        {/* Improved Code */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Improved Code</span>
            </span>
            {improvedCode && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Defensively Hardened
              </span>
            )}
          </div>

          {improvedCode ? (
            <CodeEditor
              value={improvedCode}
              language={currentLanguage}
              onChange={setImprovedCode}
              height="440px"
              title="Improved Source"
            />
          ) : (
            <div className="h-[440px] rounded-xl border border-dashed border-gray-800 bg-[#0E131F] flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500">
                <GitPullRequest className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-semibold text-gray-300">
                  Ready to Refactor
                </div>
                <div className="text-[11px] text-gray-500 max-w-xs">
                  Click &ldquo;Improve Code&rdquo; above to synthesize the hardened, low-complexity implementation.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Bar for Improved Code */}
      {improvedCode && (
        <div className="p-5 rounded-2xl bg-[#111827]/90 border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <FileCheck2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">
                Verify Risk Reduction
              </div>
              <div className="text-[11px] text-gray-400">
                Re-analyze the improved code to verify that cyclomatic complexity and defect likelihood dropped.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onUseImprovedVersion(improvedCode)}
              className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-200 border border-gray-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Use Improved Version
            </button>

            <button
              onClick={() => onReAnalyze(improvedCode, currentLanguage)}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <SearchCode className="w-3.5 h-3.5" />
              <span>Re-analyze Improved Code &rarr;</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
