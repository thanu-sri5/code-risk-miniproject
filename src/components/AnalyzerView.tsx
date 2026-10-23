import React, { useState, useRef } from "react";
import {
  SearchCode,
  UploadCloud,
  FileCode,
  AlertOctagon,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  Activity,
  GitCommit,
} from "lucide-react";
import { SupportedLanguage, AnalysisResponse } from "../types";
import { CodeEditor } from "./CodeEditor";

interface AnalyzerViewProps {
  initialCode?: string;
  initialLanguage?: SupportedLanguage;
  onAnalysisComplete: (result: AnalysisResponse) => void;
  onViewRiskAnalysis: () => void;
}

export const AnalyzerView: React.FC<AnalyzerViewProps> = ({
  initialCode,
  initialLanguage = "java",
  onAnalysisComplete,
  onViewRiskAnalysis,
}) => {
  const [code, setCode] = useState<string>(
    initialCode ||
      `package com.enterprise.security;

import java.util.*;
import java.security.MessageDigest;

public class LoginService {

    private int failedAttempts = 0;

    /**
     * Authenticates user against credentials
     */
    public boolean authenticate(String username, String password, boolean isMfa, String mfaToken) {
        if (failedAttempts > 5) {
            return false;
        }

        if (username != null && password != null) {
            if (username.length() >= 4 && password.length() >= 8) {
                if (isMfa) {
                    if (mfaToken != null && mfaToken.length() == 6) {
                        for (char c : mfaToken.toCharArray()) {
                            if (!Character.isDigit(c)) {
                                return false;
                            }
                        }
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }
            } else {
                failedAttempts++;
                return false;
            }
        }
        return false;
    }
}`
  );

  const [language, setLanguage] = useState<SupportedLanguage>(initialLanguage);
  const [fileName, setFileName] = useState<string>("LoginService.java");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const presets = [
    {
      title: "Complex Java Auth (High Risk)",
      lang: "java" as const,
      name: "LoginService.java",
      code: `package com.enterprise.security;

import java.util.*;
import java.security.MessageDigest;

public class LoginService {
    private int failedAttempts = 0;

    public boolean authenticate(String username, String password, boolean isMfa, String mfaToken) {
        if (failedAttempts > 5) {
            return false;
        }
        if (username != null && password != null) {
            if (username.length() >= 4 && password.length() >= 8) {
                if (isMfa) {
                    if (mfaToken != null && mfaToken.length() == 6) {
                        for (char c : mfaToken.toCharArray()) {
                            if (!Character.isDigit(c)) return false;
                        }
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }
            } else {
                failedAttempts++;
                return false;
            }
        }
        return false;
    }
}`,
    },
    {
      title: "Python Payment Pipeline (Medium-High)",
      lang: "python" as const,
      name: "PaymentProcessor.py",
      code: `import json
import logging
import requests

class PaymentProcessor:
    def execute(self, payload):
        if not payload or not isinstance(payload, dict):
            return {"error": "invalid_payload"}
        
        amount = payload.get("amount", 0)
        currency = payload.get("currency", "USD")
        
        if amount <= 0:
            return {"error": "amount_too_low"}
            
        if currency not in ["USD", "EUR", "GBP"]:
            return {"error": "unsupported_currency"}
            
        # External call without timeout
        res = requests.post("https://payment.example/charge", json={"amt": amount})
        return res.json()`,
    },
    {
      title: "Clean JS String Formatter (Low Risk)",
      lang: "javascript" as const,
      name: "FormatterUtil.js",
      code: `/**
 * Pure Utility Formatting Library
 */
export function formatCurrency(amount, currency = 'USD') {
  if (typeof amount !== 'number') return '$0.00';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

export function truncate(text, maxLength = 50) {
  if (!text || typeof text !== 'string') return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}`,
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    if (file.name.endsWith(".py")) setLanguage("python");
    else if (file.name.endsWith(".java")) setLanguage("java");
    else if (file.name.endsWith(".js") || file.name.endsWith(".ts")) setLanguage("javascript");

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) setCode(content);
    };
    reader.readAsText(file);
  };

  const handleAnalyze = async () => {
    if (!code.trim()) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language,
          fileName,
          projectName: "Enterprise Core",
          saveToHistory: true,
        }),
      });

      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Analysis failed.");
      }

      const data: AnalysisResponse = await res.json();
      setAnalysisData(data);
      onAnalysisComplete(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to analyze code.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full pb-10">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Code Analyzer</h1>
          <p className="text-xs text-gray-400 mt-1">
            Compute authentic static software metrics and extract feature vectors for machine learning defect inference.
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !code.trim()}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <SearchCode className="w-4 h-4" />
          <span>{isAnalyzing ? "Extracting Metrics..." : "Analyze Code"}</span>
        </button>
      </div>

      {/* Input Options Card */}
      <div className="p-4 rounded-2xl bg-[#111827]/80 border border-gray-800 flex flex-wrap items-center justify-between gap-3">
        {/* Languages */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-400">Target Language:</span>
          <div className="inline-flex rounded-lg p-1 bg-gray-900 border border-gray-800">
            {(["java", "python", "javascript"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  setLanguage(lang);
                  setFileName(`module_${Date.now()}.${lang === "java" ? "java" : lang === "python" ? "py" : "js"}`);
                }}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  language === lang
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {lang === "java" ? "Java" : lang === "python" ? "Python" : "JavaScript"}
              </button>
            ))}
          </div>
        </div>

        {/* File Upload Option */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".java,.py,.js,.ts"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <UploadCloud className="w-3.5 h-3.5 text-indigo-400" />
            <span>Upload Source File (.java, .py, .js)</span>
          </button>
        </div>
      </div>

      {/* Benchmark Presets Quick Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] text-gray-400 font-medium">Or load benchmark code:</span>
        {presets.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCode(preset.code);
              setLanguage(preset.lang);
              setFileName(preset.name);
            }}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-gray-900 border border-gray-800 hover:border-gray-700 text-gray-300 hover:text-white transition-colors"
          >
            {preset.title}
          </button>
        ))}
      </div>

      {/* Code Editor */}
      <CodeEditor
        value={code}
        onChange={setCode}
        language={language}
        height="380px"
        title={fileName}
      />

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Extracted Software Metrics Dashboard */}
      {analysisData && (
        <div className="p-6 rounded-2xl bg-[#111827]/90 border border-indigo-500/30 space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-800">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h2 className="text-base font-bold text-white">Extracted Software Metrics</h2>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Authentic structural and cognitive measurements computed directly from AST &amp; control flow.
              </p>
            </div>

            {/* Direct Link to Risk & XAI */}
            <button
              onClick={onViewRiskAnalysis}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all self-start sm:self-auto cursor-pointer"
            >
              <span>View ML Risk Analysis &amp; XAI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Lines of Code */}
            <div className="p-3.5 rounded-xl bg-gray-900/90 border border-gray-800">
              <div className="text-[10px] text-gray-400 uppercase font-semibold">Lines of Code</div>
              <div className="text-xl font-extrabold text-white mt-1">
                {analysisData.analysis.rawMetrics.loc}
              </div>
              <div className="text-[10px] text-gray-400 mt-1">
                {analysisData.analysis.rawMetrics.sloc} SLOC &bull; {analysisData.analysis.rawMetrics.blankLines} Blank
              </div>
            </div>

            {/* Cyclomatic Complexity */}
            <div className="p-3.5 rounded-xl bg-gray-900/90 border border-gray-800">
              <div className="text-[10px] text-gray-400 uppercase font-semibold">Cyclomatic (v(G))</div>
              <div className={`text-xl font-extrabold mt-1 ${analysisData.analysis.rawMetrics.cyclomaticComplexity > 10 ? "text-rose-400" : "text-emerald-400"}`}>
                {analysisData.analysis.rawMetrics.cyclomaticComplexity}
              </div>
              <div className="text-[10px] text-gray-400 mt-1">
                McCabe threshold: &le;10
              </div>
            </div>

            {/* Test Coverage */}
            <div className="p-3.5 rounded-xl bg-gray-900/90 border border-gray-800">
              <div className="text-[10px] text-gray-400 uppercase font-semibold">Test Coverage</div>
              <div className={`text-xl font-extrabold mt-1 ${analysisData.analysis.rawMetrics.estimatedTestCoverage < 50 ? "text-amber-400" : "text-emerald-400"}`}>
                {analysisData.analysis.rawMetrics.estimatedTestCoverage}%
              </div>
              <div className="text-[10px] text-gray-400 mt-1">
                {analysisData.analysis.rawMetrics.testAssertionCount} test assertions
              </div>
            </div>

            {/* Dependencies */}
            <div className="p-3.5 rounded-xl bg-gray-900/90 border border-gray-800">
              <div className="text-[10px] text-gray-400 uppercase font-semibold">Dependencies</div>
              <div className="text-xl font-extrabold text-indigo-400 mt-1">
                {analysisData.analysis.rawMetrics.dependencyCount}
              </div>
              <div className="text-[10px] text-gray-400 mt-1 truncate" title={analysisData.analysis.rawMetrics.dependencies.join(", ")}>
                {analysisData.analysis.rawMetrics.dependencies.length > 0 ? analysisData.analysis.rawMetrics.dependencies.slice(0, 2).join(", ") : "None"}
              </div>
            </div>

            {/* Previous Bugs (Halstead estimate) */}
            <div className="p-3.5 rounded-xl bg-gray-900/90 border border-gray-800">
              <div className="text-[10px] text-gray-400 uppercase font-semibold">Est. Defects (B)</div>
              <div className="text-xl font-extrabold text-purple-400 mt-1">
                {analysisData.analysis.rawMetrics.halstead.estimatedBugs}
              </div>
              <div className="text-[10px] text-gray-400 mt-1">
                Halstead V/3000
              </div>
            </div>

            {/* Maintainability Index */}
            <div className="p-3.5 rounded-xl bg-gray-900/90 border border-gray-800">
              <div className="text-[10px] text-gray-400 uppercase font-semibold">Maintainability</div>
              <div className={`text-xl font-extrabold mt-1 ${analysisData.analysis.rawMetrics.maintainabilityIndex > 65 ? "text-emerald-400" : "text-amber-400"}`}>
                {analysisData.analysis.rawMetrics.maintainabilityIndex}/100
              </div>
              <div className="text-[10px] text-gray-400 mt-1">
                SEI Quality Index
              </div>
            </div>
          </div>

          {/* Quick Risk Preview Banner */}
          <div className="p-4 rounded-xl bg-gray-900/90 border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-3.5 h-3.5 rounded-full ${
                  analysisData.prediction.overallRisk === "HIGH"
                    ? "bg-rose-500 animate-pulse"
                    : analysisData.prediction.overallRisk === "MEDIUM"
                    ? "bg-amber-500"
                    : "bg-emerald-500"
                }`}
              />
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>ML Risk Prediction:</span>
                  <span
                    className={`font-black ${
                      analysisData.prediction.overallRisk === "HIGH"
                        ? "text-rose-400"
                        : analysisData.prediction.overallRisk === "MEDIUM"
                        ? "text-amber-400"
                        : "text-emerald-400"
                    }`}
                  >
                    {analysisData.prediction.overallRisk} RISK
                  </span>
                  <span className="text-gray-400 text-[11px] font-normal font-mono">
                    ({Math.round(analysisData.prediction.defectProbability * 100)}% Defect Probability)
                  </span>
                </div>
                <div className="text-[11px] text-gray-400 mt-0.5">
                  {analysisData.prediction.summaryExplanation}
                </div>
              </div>
            </div>

            <button
              onClick={onViewRiskAnalysis}
              className="px-3.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-indigo-300 text-xs font-semibold shrink-0 transition-colors"
            >
              Open Full Breakdown &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
