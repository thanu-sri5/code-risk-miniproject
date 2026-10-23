import React, { useState } from "react";
import {
  Sparkles,
  SearchCode,
  GitPullRequest,
  RefreshCw,
  Loader2,
  CheckCircle,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import { SupportedLanguage } from "../types";
import { CodeEditor } from "./CodeEditor";

interface GeneratorViewProps {
  onAnalyzeGeneratedCode: (code: string, language: SupportedLanguage) => void;
  onImproveGeneratedCode: (code: string, language: SupportedLanguage) => void;
}

export const GeneratorView: React.FC<GeneratorViewProps> = ({
  onAnalyzeGeneratedCode,
  onImproveGeneratedCode,
}) => {
  const [requirement, setRequirement] = useState(
    "Create a Java login system with username and password validation."
  );
  const [language, setLanguage] = useState<SupportedLanguage>("java");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<number>(0);
  const [generatedCode, setGeneratedCode] = useState<string>("");
  const [explanation, setExplanation] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const samplePrompts = [
    {
      title: "Java Auth & Validation",
      lang: "java" as const,
      text: "Create a Java login system with username and password validation.",
    },
    {
      title: "Python Data Processor",
      lang: "python" as const,
      text: "Create a Python file parser with input validation, batch processing, and exception handling.",
    },
    {
      title: "JavaScript Session Manager",
      lang: "javascript" as const,
      text: "Build a JavaScript token authentication and role-based session authorization module.",
    },
  ];

  const handleGenerate = async () => {
    if (!requirement.trim()) return;

    setIsGenerating(true);
    setError(null);
    setGenerationStep(1); // "Understanding requirement..."

    const stepTimer1 = setTimeout(() => {
      setGenerationStep(2); // "Generating code..."
    }, 900);

    const stepTimer2 = setTimeout(() => {
      setGenerationStep(3); // "Reviewing generated code..."
    }, 2200);

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requirement: requirement.trim(),
          language,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to generate code.");
      }

      const data = await res.json();
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      setGeneratedCode(data.code);
      setExplanation(data.explanation || "");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate code.");
    } finally {
      setIsGenerating(false);
      setGenerationStep(0);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full pb-10">
      {/* Title & Introduction */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">AI Code Generator</h1>
        <p className="text-xs text-gray-400 mt-1">
          Specify functional software requirements to synthesize idiomatic, production-grade code ready for static quality and ML risk analysis.
        </p>
      </div>

      {/* Requirement Input Form Card */}
      <div className="p-5 rounded-2xl bg-[#111827]/90 border border-gray-800/90 shadow-xl space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-300 mb-2">
            Describe what you want to build
          </label>
          <textarea
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            rows={3}
            placeholder="Describe what you want to build... (e.g. Create a Java login system with username and password validation.)"
            className="w-full bg-[#0E131F] border border-gray-800 rounded-xl p-3.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500/80 transition-colors resize-none leading-relaxed"
          />
        </div>

        {/* Preset Samples */}
        <div>
          <div className="text-[11px] font-medium text-gray-400 mb-2 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Example Requirements (click to load):</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setRequirement(p.text);
                  setLanguage(p.lang);
                }}
                className="text-[11px] px-2.5 py-1.5 rounded-lg bg-gray-900 border border-gray-800 hover:border-gray-700 text-gray-300 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <span className="text-[9px] uppercase font-mono px-1 py-0.2 rounded bg-gray-800 text-indigo-400">
                  {p.lang}
                </span>
                <span>{p.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Options & Action Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-gray-800/80">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-400">Programming Language:</span>
            <div className="inline-flex rounded-lg p-1 bg-gray-900 border border-gray-800">
              {(["java", "python", "javascript"] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
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

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !requirement.trim()}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Generating Code...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate Code</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Professional Multi-Step Loading State */}
      {isGenerating && (
        <div className="p-6 rounded-2xl bg-[#111827]/90 border border-indigo-500/30 shadow-2xl flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-inner">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
          </div>

          <div className="space-y-1.5">
            <div className="text-sm font-bold text-white">AI Synthesis in Progress</div>
            <div className="text-xs text-gray-400 font-mono">
              {generationStep === 1 && "Understanding requirement..."}
              {generationStep === 2 && "Generating code..."}
              {generationStep === 3 && "Reviewing generated code..."}
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="flex items-center gap-3 pt-2">
            <div className={`flex items-center gap-1.5 text-xs ${generationStep >= 1 ? "text-indigo-400" : "text-gray-600"}`}>
              <span className={`w-2 h-2 rounded-full ${generationStep >= 1 ? "bg-indigo-400 ring-2 ring-indigo-400/20" : "bg-gray-700"}`} />
              <span>Understand</span>
            </div>
            <span className="text-gray-700">&rarr;</span>
            <div className={`flex items-center gap-1.5 text-xs ${generationStep >= 2 ? "text-indigo-400" : "text-gray-600"}`}>
              <span className={`w-2 h-2 rounded-full ${generationStep >= 2 ? "bg-indigo-400 ring-2 ring-indigo-400/20" : "bg-gray-700"}`} />
              <span>Synthesize</span>
            </div>
            <span className="text-gray-700">&rarr;</span>
            <div className={`flex items-center gap-1.5 text-xs ${generationStep >= 3 ? "text-indigo-400" : "text-gray-600"}`}>
              <span className={`w-2 h-2 rounded-full ${generationStep >= 3 ? "bg-indigo-400 ring-2 ring-indigo-400/20" : "bg-gray-700"}`} />
              <span>Review</span>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Generated Code Display and Action Suite */}
      {generatedCode && !isGenerating && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-gray-200">Generated Implementation</span>
            </div>

            {/* Core Workflow Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerate}
                className="px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3 h-3 text-gray-400" />
                <span>Regenerate</span>
              </button>

              <button
                onClick={() => onImproveGeneratedCode(generatedCode, language)}
                className="px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <GitPullRequest className="w-3 h-3 text-purple-400" />
                <span>Improve Code</span>
              </button>

              <button
                onClick={() => onAnalyzeGeneratedCode(generatedCode, language)}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
              >
                <SearchCode className="w-3.5 h-3.5" />
                <span>Analyze Code &rarr;</span>
              </button>
            </div>
          </div>

          <CodeEditor
            value={generatedCode}
            onChange={setGeneratedCode}
            language={language}
            height="460px"
            title={`Generated ${language.toUpperCase()} Module`}
          />

          {explanation && (
            <div className="p-3.5 rounded-xl bg-gray-900/60 border border-gray-800 text-xs text-gray-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
              <span>{explanation}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
