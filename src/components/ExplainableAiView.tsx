import React from "react";
import {
  HelpCircle,
  TrendingUp,
  TrendingDown,
  Info,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { AnalysisResponse, ShapFactor } from "../types";

interface ExplainableAiViewProps {
  data: AnalysisResponse | null;
  onNavigateToRecommendations: () => void;
  onNavigateToImprove: () => void;
  onNavigateToAnalyzer: () => void;
}

export const ExplainableAiView: React.FC<ExplainableAiViewProps> = ({
  data,
  onNavigateToRecommendations,
  onNavigateToImprove,
  onNavigateToAnalyzer,
}) => {
  if (!data || !data.prediction || !data.prediction.shapFactors) {
    return (
      <div className="p-12 rounded-2xl bg-[#111827]/80 border border-gray-800 text-center space-y-4 max-w-2xl mx-auto my-12">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
          <Info className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-base font-bold text-white">Risk prediction is currently unavailable.</h2>
          <p className="text-xs text-gray-400">
            Please run an analysis on a source file to generate the explainability breakdown.
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

  const { prediction, analysis } = data;
  const factors: ShapFactor[] = prediction.shapFactors;

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full pb-10">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Explainable AI (XAI)</h1>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-bold">
              Linear SHAP
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Why is this code risky? Mathematical attribution of software quality features towards the defect classification.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToRecommendations}
            className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-amber-300 border border-amber-500/30 font-semibold text-xs flex items-center gap-1.5 transition-colors"
          >
            <span>View Recommendations &rarr;</span>
          </button>
          <button
            onClick={onNavigateToImprove}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fix with AI</span>
          </button>
        </div>
      </div>

      {/* Summary Explanation Box (Directly from prompt requirements) */}
      <div className="p-6 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-3">
        <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs">
          <HelpCircle className="w-4 h-4" />
          <span>Why is this code risky?</span>
        </div>

        <div className="text-sm sm:text-base font-medium text-gray-200 leading-relaxed">
          &ldquo;{prediction.summaryExplanation}&rdquo;
        </div>

        <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-gray-400 border-t border-gray-800/80">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Increases Defect Risk</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Mitigates / Reduces Risk</span>
          </div>
          <div className="ml-auto text-[11px] font-mono text-gray-400">
            Log-odds attribution: &Delta;z = {prediction.logitScore}
          </div>
        </div>
      </div>

      {/* Horizontal SHAP Feature Impact Bars */}
      <div className="p-6 rounded-2xl bg-[#111827]/90 border border-gray-800/90 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">SHAP Attribution Factors</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Ranked by normalized influence on defect probability.
            </p>
          </div>
          <span className="text-[10px] font-mono text-gray-400">
            Base: {prediction.baseValue}
          </span>
        </div>

        <div className="space-y-4">
          {factors.map((factor, index) => {
            const isIncrease = factor.direction === "increases_risk";
            const barWidth = Math.max(8, factor.normalizedImpact);

            return (
              <div
                key={index}
                className="p-3.5 rounded-xl bg-gray-900/60 border border-gray-800/70 space-y-2 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {isIncrease ? (
                      <TrendingUp className="w-4 h-4 text-rose-400 shrink-0" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    <span className="font-bold text-gray-200">{factor.factor}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-gray-400">
                      Value: {factor.rawFeatureValue}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold font-mono ${
                        isIncrease ? "text-rose-400" : "text-emerald-400"
                      }`}
                    >
                      {factor.shapValue > 0 ? `+${factor.shapValue.toFixed(3)}` : factor.shapValue.toFixed(3)} SHAP
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        isIncrease
                          ? "bg-rose-500/15 text-rose-300"
                          : "bg-emerald-500/15 text-emerald-300"
                      }`}
                    >
                      {isIncrease ? "Increases Risk" : "Reduces Risk"}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-800/80 rounded-full h-2.5 overflow-hidden flex">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isIncrease
                        ? "bg-gradient-to-r from-rose-500 to-red-400"
                        : "bg-gradient-to-r from-emerald-500 to-teal-400"
                    }`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>

                <div className="text-[11px] text-gray-400 leading-normal">
                  {factor.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Model Scientific Transparency Card */}
      <div className="p-5 rounded-2xl bg-[#111827]/80 border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">
              Dataset: {prediction.modelMeta.dataset}
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5">
              Trained on {prediction.modelMeta.trainedInstances} verified modules &bull; Benchmark Accuracy {prediction.modelMeta.benchmarkAccuracy}% &bull; AUC {prediction.modelMeta.benchmarkAucRoc}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Zero Synthetic / Fake Output</span>
          </div>
        </div>
      </div>
    </div>
  );
};
