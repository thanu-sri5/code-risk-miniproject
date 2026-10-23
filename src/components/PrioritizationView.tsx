import React, { useState, useEffect } from "react";
import {
  Layers,
  AlertTriangle,
  CheckCircle,
  Eye,
  ArrowUpDown,
  RefreshCw,
  Loader2,
  Code2,
  SlidersHorizontal,
} from "lucide-react";
import { ModulePriorityItem, AnalysisResponse } from "../types";

interface PrioritizationViewProps {
  onSelectModuleForAnalysis: (code: string, language: any, fileName: string) => void;
}

export const PrioritizationView: React.FC<PrioritizationViewProps> = ({
  onSelectModuleForAnalysis,
}) => {
  const [modules, setModules] = useState<ModulePriorityItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterPriority, setFilterPriority] = useState<string>("all");

  const fetchBatch = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/modules/batch-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (!res.ok) throw new Error("Batch analysis failed");
      const data = await res.json();
      setModules(data);
    } catch (err) {
      console.error("Batch fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatch();
  }, []);

  const filtered = modules.filter((m) => {
    if (filterPriority === "all") return true;
    return m.priority.toLowerCase() === filterPriority.toLowerCase();
  });

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-rose-500/15 text-rose-300 border-rose-500/30";
      case "Review":
        return "bg-amber-500/15 text-amber-300 border-amber-500/30";
      case "Monitor":
        return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
      default:
        return "bg-gray-800 text-gray-300 border-gray-700";
    }
  };

  const getRiskStyle = (risk: string) => {
    switch (risk) {
      case "HIGH":
        return "text-rose-400 font-bold";
      case "MEDIUM":
        return "text-amber-400 font-bold";
      case "LOW":
        return "text-emerald-400 font-bold";
      default:
        return "text-gray-300";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full pb-10">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Risk Prioritization</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
              Triage Matrix
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Prioritize QA focus across codebase modules based on authentic ML defect probabilities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchBatch}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Re-evaluate Matrix</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400 font-medium">Filter by Priority:</span>
        <div className="inline-flex rounded-lg p-1 bg-gray-900 border border-gray-800 text-xs">
          {["all", "Critical", "Review", "Monitor"].map((p) => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={`px-3 py-1 rounded-md capitalize font-medium transition-all ${
                filterPriority === p
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Main Prioritization Table */}
      <div className="rounded-2xl bg-[#111827]/90 border border-gray-800/90 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/50 text-gray-400 uppercase tracking-wider font-semibold">
                <th className="py-3.5 pl-6">Module Name</th>
                <th className="py-3.5">Risk Level</th>
                <th className="py-3.5">Priority Action</th>
                <th className="py-3.5">Defect Prob.</th>
                <th className="py-3.5">Complexity v(G)</th>
                <th className="py-3.5">LOC</th>
                <th className="py-3.5">Test Coverage</th>
                <th className="py-3.5 pr-6 text-right">Inspect &amp; Fix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-500 mb-2" />
                    <span>Evaluating module metrics with ML model...</span>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-500">
                    No modules found for filter &ldquo;{filterPriority}&rdquo;
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-gray-800/40 transition-colors group cursor-pointer"
                    onClick={() =>
                      onSelectModuleForAnalysis(item.code, item.language, item.fileName)
                    }
                  >
                    <td className="py-4 pl-6">
                      <div className="font-bold text-white text-sm group-hover:text-indigo-400 transition-colors">
                        {item.module}
                      </div>
                      <div className="text-[11px] text-gray-400 font-mono">
                        {item.fileName} ({item.language})
                      </div>
                    </td>

                    <td className="py-4">
                      <span className={getRiskStyle(item.risk)}>
                        {item.risk}
                      </span>
                    </td>

                    <td className="py-4">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md border ${getPriorityStyle(
                          item.priority
                        )}`}
                      >
                        {item.priority}
                      </span>
                    </td>

                    <td className="py-4 font-mono text-gray-200 font-semibold">
                      {Math.round(item.defectProbability * 100)}%
                    </td>

                    <td className="py-4 font-mono text-gray-300">
                      {item.cyclomatic}
                    </td>

                    <td className="py-4 font-mono text-gray-300">
                      {item.loc}
                    </td>

                    <td className="py-4 font-mono text-gray-300">
                      {item.testCoverage}%
                    </td>

                    <td className="py-4 pr-6 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectModuleForAnalysis(item.code, item.language, item.fileName);
                        }}
                        className="px-3 py-1 rounded-lg bg-indigo-600/10 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/20 text-xs font-semibold transition-all inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Guidance Footnote */}
      <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 text-xs text-gray-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          <span>
            Sorting is automatically organized by genuine defect probability descending (Critical &gt; Review &gt; Monitor).
          </span>
        </div>
        <span className="text-[11px] font-mono text-gray-500">
          Evaluated via NASA JM1 Dataset Rules
        </span>
      </div>
    </div>
  );
};
