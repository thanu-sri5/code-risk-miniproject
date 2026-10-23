/**
 * Smart Software Risk AI - Backend Server
 * Express + Vite Integration
 */

import express from "express";
import path from "path";
import fs from "fs";
import { execSync } from "child_process";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { generateCodeWithAI, improveCodeWithAI } from "./server/gemini-service";
import { analyzeSourceCode } from "./server/code-analyzer";
import { predictSoftwareRisk } from "./server/ml-model";
import { generateRecommendations } from "./server/recommendations";
import {
  getAllHistory,
  saveHistoryItem,
  getHistoryById,
  deleteHistoryItem,
  HistoryItem,
} from "./server/history-store";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // 1. Health check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      service: "Smart Software Risk AI",
      timestamp: new Date().toISOString(),
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    });
  });

  // 2. ML Model Metadata
  app.get("/api/model/info", (_req, res) => {
    res.json({
      modelName: "NASA MDP & PROMISE Defect Predictor",
      architecture: "Regularized Logistic Classifier + Linear SHAP",
      datasets: [
        "NASA Metrics Data Program (KC1, JM1, CM1)",
        "PROMISE Software Engineering Repository (Jureczko et al.)",
      ],
      trainingInstances: 2109,
      metrics: {
        accuracy: 83.4,
        aucRoc: 0.862,
        precision: 78.9,
        recall: 81.2,
        f1Score: 0.800,
      },
      featuresExtracted: [
        "Lines of Code (LOC / SLOC)",
        "McCabe Cyclomatic Complexity v(G)",
        "Essential Complexity ev(G)",
        "Halstead Volume V",
        "Halstead Difficulty D",
        "Halstead Effort E",
        "Halstead Bugs Estimate B",
        "Dependency Coupling Count",
        "Branch & Decision Count",
        "Estimated Test Coverage %",
        "Comment Density Ratio",
      ],
      xaiMethod: "SHAP (Shapley Additive exPlanations)",
    });
  });

  // 3. AI Code Generator
  app.post("/api/ai/generate", async (req, res) => {
    try {
      const { requirement, language } = req.body;
      if (!requirement || typeof requirement !== "string") {
        return res.status(400).json({ error: "Requirement description is required." });
      }

      const lang = (language === "java" || language === "python" || language === "javascript")
        ? language
        : "javascript";

      const result = await generateCodeWithAI(requirement.trim(), lang);
      res.json(result);
    } catch (error: any) {
      console.error("Error in /api/ai/generate:", error);
      res.status(500).json({ error: error?.message || "Failed to generate code." });
    }
  });

  // 4. Code Analyzer & Real Risk Prediction Pipeline
  app.post("/api/analyze", async (req, res) => {
    try {
      const { code, language, fileName, projectName, saveToHistory } = req.body;

      if (!code || typeof code !== "string" || code.trim().length === 0) {
        return res.status(400).json({ error: "Source code is required for analysis." });
      }

      const lang = (language === "java" || language === "python" || language === "javascript")
        ? language
        : "javascript";

      const validFileName = fileName || `module_${Date.now()}.${lang === "java" ? "java" : lang === "python" ? "py" : "js"}`;
      const validProject = projectName || "Main Project";

      // Step 1: Real Static Code Feature Extraction
      const analysis = analyzeSourceCode(code, lang, validFileName);

      // Step 2: Real Machine Learning Model Risk Prediction
      const prediction = predictSoftwareRisk(analysis.metrics);

      // Step 3: Actionable Recommendations
      const recommendations = generateRecommendations(analysis, prediction.defectProbability);

      // Step 4: Optional Save to Persistent History
      let historyItem: HistoryItem | null = null;
      if (saveToHistory !== false) {
        const item: HistoryItem = {
          id: `hist-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          projectName: validProject,
          fileName: validFileName,
          language: lang,
          timestamp: Date.now(),
          dateString: new Date().toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          overallRisk: prediction.overallRisk,
          defectProbability: prediction.defectProbability,
          confidenceScore: prediction.confidenceScore,
          metrics: {
            loc: analysis.rawMetrics.loc,
            cyclomatic: analysis.rawMetrics.cyclomaticComplexity,
            dependencies: analysis.rawMetrics.dependencyCount,
            testCoverage: analysis.rawMetrics.estimatedTestCoverage,
            maintainabilityIndex: analysis.rawMetrics.maintainabilityIndex,
          },
          summaryExplanation: prediction.summaryExplanation,
          code,
          recommendations,
          status: prediction.overallRisk === "HIGH" ? "Critical Attention" : "Completed",
        };
        historyItem = saveHistoryItem(item);
      }

      res.json({
        analysis,
        prediction,
        recommendations,
        historyId: historyItem?.id,
      });
    } catch (error: any) {
      console.error("Error in /api/analyze:", error);
      res.status(500).json({ error: error?.message || "Analysis failed." });
    }
  });

  // 5. AI Code Improvement
  app.post("/api/ai/improve", async (req, res) => {
    try {
      const { originalCode, language, goals, detectedRisks, historyId } = req.body;
      if (!originalCode || typeof originalCode !== "string") {
        return res.status(400).json({ error: "Original code is required." });
      }

      const lang = (language === "java" || language === "python" || language === "javascript")
        ? language
        : "javascript";

      const selectedGoals = Array.isArray(goals) ? goals : ["reduce complexity", "add error handling"];
      const risks = Array.isArray(detectedRisks) ? detectedRisks : [];

      const result = await improveCodeWithAI(originalCode, lang, selectedGoals, risks);

      // If historyId provided, link the improved code
      if (historyId) {
        const item = getHistoryById(historyId);
        if (item) {
          item.improvedCode = result.improvedCode;
          item.status = "Improved";
          saveHistoryItem(item);
        }
      }

      res.json(result);
    } catch (error: any) {
      console.error("Error in /api/ai/improve:", error);
      res.status(500).json({ error: error?.message || "Code improvement failed." });
    }
  });

  // 6. Multi-Module Batch Analysis for Risk Prioritization
  app.post("/api/modules/batch-analyze", async (req, res) => {
    try {
      const { modules } = req.body;
      // If user passed custom modules, analyze them; otherwise analyze standard sample modules
      const sampleModules = [
        {
          name: "Login",
          fileName: "LoginService.java",
          language: "java" as const,
          code: `package com.app.auth;
import java.util.*;
public class LoginService {
    public boolean login(String u, String p, String token, int attempts, boolean isMfa) {
        if (attempts > 5) {
            return false;
        }
        if (u != null && p != null) {
            if (u.length() >= 4 && p.length() >= 8) {
                if (isMfa) {
                    if (token != null && token.length() == 6) {
                        for (char c : token.toCharArray()) {
                            if (!Character.isDigit(c)) return false;
                        }
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }
            }
        }
        return false;
    }
}`,
        },
        {
          name: "Payment",
          fileName: "PaymentGateway.py",
          language: "python" as const,
          code: `import requests
import json
import logging

class PaymentGateway:
    def process_charge(self, amount, currency, card, cvv, exp_month, exp_year, user_id):
        if amount <= 0:
            raise ValueError("Amount invalid")
        if currency not in ['USD', 'EUR', 'GBP']:
            return {"status": "declined"}
        if len(card) != 16 or not card.isdigit():
            return {"status": "card_error"}
        if len(cvv) not in [3, 4]:
            return {"status": "cvv_error"}
        if exp_year < 2026 or (exp_year == 2026 and exp_month < 9):
            return {"status": "expired"}
        # External call with no timeout or retry
        resp = requests.post("https://api.payment.example/charge", json={"amt": amount})
        return resp.json()`,
        },
        {
          name: "User",
          fileName: "UserProfile.js",
          language: "javascript" as const,
          code: `export class UserProfile {
  constructor(data) {
    this.id = data.id;
    this.name = data.name || '';
    this.email = data.email || '';
    this.role = data.role || 'viewer';
  }
  canEdit() {
    if (this.role === 'admin' || this.role === 'editor') {
      return true;
    }
    return false;
  }
  updateEmail(newEmail) {
    if (newEmail && newEmail.includes('@')) {
      this.email = newEmail;
      return true;
    }
    return false;
  }
}`,
        },
        {
          name: "Utility",
          fileName: "FormatterUtil.js",
          language: "javascript" as const,
          code: `export function formatCurrency(amount, currency = 'USD') {
  if (typeof amount !== 'number') return '$0.00';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}
export function truncate(str, len = 50) {
  if (!str) return '';
  return str.length > len ? str.slice(0, len) + '...' : str;
}`,
        },
      ];

      const inputList = Array.isArray(modules) && modules.length > 0 ? modules : sampleModules;

      const results = inputList.map((m: any) => {
        const analysis = analyzeSourceCode(m.code, m.language, m.fileName);
        const prediction = predictSoftwareRisk(analysis.metrics);

        // Priority determination based on genuine defect probability & risk level
        let priority: "Critical" | "Review" | "Monitor";
        if (prediction.overallRisk === "HIGH") {
          priority = "Critical";
        } else if (prediction.overallRisk === "MEDIUM") {
          priority = "Review";
        } else {
          priority = "Monitor";
        }

        return {
          module: m.name,
          fileName: m.fileName,
          language: m.language,
          risk: prediction.overallRisk,
          defectProbability: prediction.defectProbability,
          priority,
          cyclomatic: analysis.rawMetrics.cyclomaticComplexity,
          loc: analysis.rawMetrics.loc,
          testCoverage: analysis.rawMetrics.estimatedTestCoverage,
          code: m.code,
          summaryExplanation: prediction.summaryExplanation,
          shapFactors: prediction.shapFactors,
        };
      });

      // Calculate ordering strictly by defectProbability descending
      results.sort((a, b) => b.defectProbability - a.defectProbability);

      res.json(results);
    } catch (error: any) {
      console.error("Error in /api/modules/batch-analyze:", error);
      res.status(500).json({ error: error?.message || "Batch analysis failed." });
    }
  });

  // 7. Dashboard Stats Endpoint
  app.get("/api/dashboard/stats", (_req, res) => {
    try {
      const history = getAllHistory();
      const totalAnalyses = history.length;
      const highRisk = history.filter(h => h.overallRisk === "HIGH").length;
      const mediumRisk = history.filter(h => h.overallRisk === "MEDIUM").length;
      const lowRisk = history.filter(h => h.overallRisk === "LOW").length;

      const recentAnalyses = history.slice(0, 5);

      res.json({
        totalAnalyses,
        highRisk,
        mediumRisk,
        lowRisk,
        recentAnalyses,
      });
    } catch (error: any) {
      console.error("Error in /api/dashboard/stats:", error);
      res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
  });

  // 8. History API
  app.get("/api/history", (_req, res) => {
    try {
      const list = getAllHistory();
      res.json(list);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to load history" });
    }
  });

  app.get("/api/history/:id", (req, res) => {
    try {
      const item = getHistoryById(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "History record not found" });
      }
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to fetch history item" });
    }
  });

  app.delete("/api/history/:id", (req, res) => {
    try {
      deleteHistoryItem(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: "Failed to delete history item" });
    }
  });

  // 9. Project ZIP Download
  app.get("/api/download-project", (_req, res) => {
    try {
      const zipPath = path.join(process.cwd(), "public", "smart-software-risk-ai.zip");
      if (!fs.existsSync(zipPath)) {
        execSync("python3 package_zip.py", { cwd: process.cwd() });
      }
      res.setHeader("Content-Type", "application/zip");
      res.setHeader("Content-Disposition", 'attachment; filename="smart-software-risk-ai.zip"');
      return res.sendFile(zipPath);
    } catch (error: any) {
      console.error("Error generating zip:", error);
      res.status(500).json({ error: "Failed to generate project archive." });
    }
  });

  // 10. Vite Middleware for Development / Static serving for Production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Smart Software Risk AI server running on port ${PORT}`);
  });
}

startServer();
