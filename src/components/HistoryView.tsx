import React, { useState } from "react";
import {
  History,
  Search,
  Filter,
  Trash2,
  Eye,
  Calendar,
  Code2,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { HistoryItem, RiskLevel } from "../types";

interface HistoryViewProps {
  historyItems: HistoryItem[];
  onSelectHistoryItem: (item: HistoryItem) => void;
  onDeleteHistoryItem: (id: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  historyItems,
  onSelectHistoryItem,
  onDeleteHistoryItem,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [riskFilter, setRiskFilter] = useState<string>("all");

  const filtered = historyItems.filter((item) => {
    const matchesSearch =
      item.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.language.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRisk =
      riskFilter === "all" || item.overallRisk.toLowerCase() === riskFilter.toLowerCase();

    return matchesSearch && matchesRisk;
  });

  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case "HIGH":
        return "bg-rose-500/15 text-rose-300 border-rose-500/30";
      case "MEDIUM":
        return "bg-amber-500/15 text-amber-300 border-amber-500/30";
      case "LOW":
        return "bg-emerald-500/15 text-emerald-300 border-emerald-500/30";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full pb-10">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Analysis History</h1>
        <p className="text-xs text-gray-400 mt-1">
          Historical log of all evaluated source code modules, risk levels, and refactoring snapshots.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#111827]/80 border border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by file, project, or language..."
            className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500/60 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs text-gray-400 font-medium">Risk Filter:</span>
          <div className="inline-flex rounded-lg p-1 bg-gray-900 border border-gray-800 text-xs">
            {["all", "HIGH", "MEDIUM", "LOW"].map((r) => (
              <button
                key={r}
                onClick={() => setRiskFilter(r)}
                className={`px-3 py-1 rounded-md uppercase font-medium transition-all ${
                  riskFilter === r
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="rounded-2xl bg-[#111827]/90 border border-gray-800/90 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/50 text-gray-400 uppercase tracking-wider font-semibold">
                <th className="py-3.5 pl-6">Project / File</th>
                <th className="py-3.5">Language</th>
                <th className="py-3.5">ML Risk</th>
                <th className="py-3.5">Complexity</th>
                <th className="py-3.5">Date</th>
                <th className="py-3.5">Status</th>
                <th className="py-3.5 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    No analysis history records match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onSelectHistoryItem(item)}
                    className="hover:bg-gray-800/40 transition-colors group cursor-pointer"
                  >
                    <td className="py-4 pl-6">
                      <div className="font-bold text-white group-hover:text-indigo-400 transition-colors text-sm">
                        {item.fileName}
                      </div>
                      <div className="text-[11px] text-gray-400">{item.projectName}</div>
                    </td>

                    <td className="py-4">
                      <span className="text-[10px] font-mono uppercase text-gray-300 px-2 py-0.5 rounded bg-gray-800">
                        {item.language}
                      </span>
                    </td>

                    <td className="py-4">
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md border ${getRiskBadge(
                          item.overallRisk
                        )}`}
                      >
                        {item.overallRisk} ({Math.round(item.defectProbability * 100)}%)
                      </span>
                    </td>

                    <td className="py-4 font-mono text-gray-300">
                      v(G) = {item.metrics.cyclomatic}
                    </td>

                    <td className="py-4 text-gray-400 font-mono text-[11px]">
                      {item.dateString}
                    </td>

                    <td className="py-4">
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          item.status === "Improved"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : item.status === "Critical Attention"
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            : "bg-gray-800 text-gray-300 border border-gray-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="py-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectHistoryItem(item);
                          }}
                          className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
                          title="Open Analysis"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteHistoryItem(item.id);
                          }}
                          className="p-1.5 rounded-lg bg-gray-800 hover:bg-rose-900/40 text-gray-400 hover:text-rose-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
