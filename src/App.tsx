/**
 * Smart Software Risk AI - Main Application Component
 */

import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { LandingPage } from "./components/LandingPage";
import { DashboardView } from "./components/DashboardView";
import { GeneratorView } from "./components/GeneratorView";
import { AnalyzerView } from "./components/AnalyzerView";
import { RiskAnalysisView } from "./components/RiskAnalysisView";
import { ExplainableAiView } from "./components/ExplainableAiView";
import { PrioritizationView } from "./components/PrioritizationView";
import { RecommendationsView } from "./components/RecommendationsView";
import { ImprovementView } from "./components/ImprovementView";
import { HistoryView } from "./components/HistoryView";
import {
  SupportedLanguage,
  AnalysisResponse,
  DashboardStats,
  HistoryItem,
} from "./types";

export default function App() {
  const [currentView, setCurrentView] = useState<string>("landing");
  const [activeAnalysis, setActiveAnalysis] = useState<AnalysisResponse | null>(null);
  const [currentCode, setCurrentCode] = useState<string>("");
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>("java");
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalAnalyses: 0,
    highRisk: 0,
    mediumRisk: 0,
    lowRisk: 0,
    recentAnalyses: [],
  });

  // Fetch stats and history
  const loadStatsAndHistory = async () => {
    try {
      const [statsRes, histRes] = await Promise.all([
        fetch("/api/dashboard/stats"),
        fetch("/api/history"),
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (histRes.ok) {
        const histData = await histRes.json();
        setHistoryList(histData);
      }
    } catch (err) {
      console.error("Failed to load initial stats:", err);
    }
  };

  useEffect(() => {
    loadStatsAndHistory();
  }, []);

  // When analysis completes
  const handleAnalysisComplete = (result: AnalysisResponse) => {
    setActiveAnalysis(result);
    setCurrentLanguage(result.analysis.language);
    loadStatsAndHistory();
  };

  // Connected Flow 1: From Generator -> Analyze Code
  const handleAnalyzeGeneratedCode = async (code: string, language: SupportedLanguage) => {
    setCurrentCode(code);
    setCurrentLanguage(language);
    setCurrentView("analyzer");

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language,
          fileName: `generated_${language}_${Date.now()}.${language === "java" ? "java" : language === "python" ? "py" : "js"}`,
          projectName: "AI Synthesis",
          saveToHistory: true,
        }),
      });

      if (res.ok) {
        const data: AnalysisResponse = await res.json();
        setActiveAnalysis(data);
        loadStatsAndHistory();
        setCurrentView("risk-analysis");
      }
    } catch (e) {
      console.error("Auto analyze error:", e);
    }
  };

  // Connected Flow 2: From Generator -> Direct Improve
  const handleImproveGeneratedCode = (code: string, language: SupportedLanguage) => {
    setCurrentCode(code);
    setCurrentLanguage(language);
    setCurrentView("improvement");
  };

  // Connected Flow 3: From Prioritization -> Inspect Module
  const handleSelectModuleForAnalysis = async (
    code: string,
    language: SupportedLanguage,
    fileName: string
  ) => {
    setCurrentCode(code);
    setCurrentLanguage(language);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          language,
          fileName,
          projectName: "Multi-Module Portfolio",
          saveToHistory: true,
        }),
      });

      if (res.ok) {
        const data: AnalysisResponse = await res.json();
        setActiveAnalysis(data);
        loadStatsAndHistory();
        setCurrentView("risk-analysis");
      }
    } catch (e) {
      console.error("Inspect module error:", e);
    }
  };

  // Connected Flow 4: Re-analyze Improved Code
  const handleReAnalyzeImproved = async (improvedCode: string, language: SupportedLanguage) => {
    setCurrentCode(improvedCode);
    setCurrentLanguage(language);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: improvedCode,
          language,
          fileName: `refactored_${language}_${Date.now()}.${language === "java" ? "java" : language === "python" ? "py" : "js"}`,
          projectName: "Hardened Release",
          saveToHistory: true,
        }),
      });

      if (res.ok) {
        const data: AnalysisResponse = await res.json();
        setActiveAnalysis(data);
        loadStatsAndHistory();
        setCurrentView("risk-analysis");
      }
    } catch (e) {
      console.error("Re-analyze error:", e);
    }
  };

  // Selecting history item
  const handleSelectHistoryItem = async (item: HistoryItem) => {
    setCurrentCode(item.code);
    setCurrentLanguage(item.language);

    // Re-run analysis or load
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: item.code,
          language: item.language,
          fileName: item.fileName,
          projectName: item.projectName,
          saveToHistory: false,
        }),
      });

      if (res.ok) {
        const data: AnalysisResponse = await res.json();
        data.historyId = item.id;
        setActiveAnalysis(data);
        setCurrentView("risk-analysis");
      }
    } catch (e) {
      console.error("History reload error:", e);
    }
  };

  // Delete history item
  const handleDeleteHistoryItem = async (id: string) => {
    try {
      await fetch(`/api/history/${id}`, { method: "DELETE" });
      loadStatsAndHistory();
    } catch (e) {
      console.error("Delete history error:", e);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-gray-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        highRiskCount={stats.highRisk}
      />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Persistent Sidebar (hidden only on landing page if preferred, but accessible) */}
        {currentView !== "landing" && (
          <Sidebar
            currentView={currentView}
            onNavigate={setCurrentView}
            hasActiveAnalysis={Boolean(activeAnalysis)}
          />
        )}

        {/* View Surface */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {currentView === "landing" && (
            <LandingPage
              onStartAnalysis={() => setCurrentView("dashboard")}
              onTryGenerator={() => setCurrentView("generator")}
            />
          )}

          {currentView === "dashboard" && (
            <DashboardView
              stats={stats}
              onNavigate={setCurrentView}
              onSelectHistoryItem={handleSelectHistoryItem}
            />
          )}

          {currentView === "generator" && (
            <GeneratorView
              onAnalyzeGeneratedCode={handleAnalyzeGeneratedCode}
              onImproveGeneratedCode={handleImproveGeneratedCode}
            />
          )}

          {currentView === "analyzer" && (
            <AnalyzerView
              initialCode={currentCode}
              initialLanguage={currentLanguage}
              onAnalysisComplete={handleAnalysisComplete}
              onViewRiskAnalysis={() => setCurrentView("risk-analysis")}
            />
          )}

          {currentView === "risk-analysis" && (
            <RiskAnalysisView
              data={activeAnalysis}
              onNavigateToExplain={() => setCurrentView("explainable-ai")}
              onNavigateToRecommendations={() => setCurrentView("recommendations")}
              onNavigateToImprove={() => setCurrentView("improvement")}
              onNavigateToAnalyzer={() => setCurrentView("analyzer")}
            />
          )}

          {currentView === "explainable-ai" && (
            <ExplainableAiView
              data={activeAnalysis}
              onNavigateToRecommendations={() => setCurrentView("recommendations")}
              onNavigateToImprove={() => setCurrentView("improvement")}
              onNavigateToAnalyzer={() => setCurrentView("analyzer")}
            />
          )}

          {currentView === "prioritization" && (
            <PrioritizationView
              onSelectModuleForAnalysis={handleSelectModuleForAnalysis}
            />
          )}

          {currentView === "recommendations" && (
            <RecommendationsView
              data={activeAnalysis}
              onNavigateToImprove={() => setCurrentView("improvement")}
              onNavigateToAnalyzer={() => setCurrentView("analyzer")}
            />
          )}

          {currentView === "improvement" && (
            <ImprovementView
              currentCode={currentCode || activeAnalysis?.analysis?.fileName || ""}
              currentLanguage={currentLanguage}
              currentAnalysis={activeAnalysis}
              onReAnalyze={handleReAnalyzeImproved}
              onUseImprovedVersion={(improved) => {
                setCurrentCode(improved);
                alert("Improved version loaded into editor workspace.");
              }}
            />
          )}

          {currentView === "history" && (
            <HistoryView
              historyItems={historyList}
              onSelectHistoryItem={handleSelectHistoryItem}
              onDeleteHistoryItem={handleDeleteHistoryItem}
            />
          )}
        </main>
      </div>
    </div>
  );
}
