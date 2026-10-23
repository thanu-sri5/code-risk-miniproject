/**
 * History Store for Smart Software Risk AI
 * Persists code analyses, metrics, risk predictions, and improvements to disk.
 */

import fs from "fs";
import path from "path";
import { DetailedAnalysisResult } from "./code-analyzer";
import { RiskPredictionResult } from "./ml-model";
import { CodeRecommendation } from "./recommendations";

export interface HistoryItem {
  id: string;
  projectName: string;
  fileName: string;
  language: "java" | "python" | "javascript";
  timestamp: number;
  dateString: string;
  overallRisk: "LOW" | "MEDIUM" | "HIGH";
  defectProbability: number;
  confidenceScore: number;
  metrics: {
    loc: number;
    cyclomatic: number;
    dependencies: number;
    testCoverage: number;
    maintainabilityIndex: number;
  };
  summaryExplanation: string;
  code: string;
  improvedCode?: string;
  recommendations: CodeRecommendation[];
  status: "Completed" | "Improved" | "Critical Attention";
}

const DATA_DIR = path.join(process.cwd(), "data");
const HISTORY_FILE = path.join(DATA_DIR, "history.json");

function ensureDirectoryExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(HISTORY_FILE)) {
    // Seed with realistic starting history as described in requirements
    const seedHistory: HistoryItem[] = [
      {
        id: "hist-seed-1",
        projectName: "Enterprise Core",
        fileName: "Login.java",
        language: "java",
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
        dateString: "20 Sep 2026",
        overallRisk: "HIGH",
        defectProbability: 0.784,
        confidenceScore: 84,
        metrics: {
          loc: 245,
          cyclomatic: 14,
          dependencies: 8,
          testCoverage: 28,
          maintainabilityIndex: 48,
        },
        summaryExplanation: "The prediction is mainly influenced by high code complexity (14) and low test coverage (28%). These factors significantly elevate the probability of software defects.",
        code: `package com.enterprise.auth;\n\npublic class Login {\n    // Deep nested authentication checks\n    public boolean login(String u, String p) {\n        if (u != null) {\n            if (p != null) {\n                if (u.length() > 3) {\n                    // Unhandled exceptions\n                    return true;\n                }\n            }\n        }\n        return false;\n    }\n}`,
        recommendations: [
          {
            id: "rec-seed-1",
            category: "complexity",
            severity: "high",
            problem: "High Code Complexity (Cyclomatic = 14)",
            whyItMatters: "Complex code can be harder to maintain and test.",
            recommendation: "Break large methods into smaller functions and use guard clauses.",
            targetRefactorGoal: "reduce complexity"
          }
        ],
        status: "Critical Attention",
      },
      {
        id: "hist-seed-2",
        projectName: "User Account Service",
        fileName: "UserService.java",
        language: "java",
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3,
        dateString: "20 Sep 2026",
        overallRisk: "MEDIUM",
        defectProbability: 0.492,
        confidenceScore: 78,
        metrics: {
          loc: 168,
          cyclomatic: 8,
          dependencies: 6,
          testCoverage: 52,
          maintainabilityIndex: 68,
        },
        summaryExplanation: "The prediction reflects moderate risk: elevated code complexity (8) is partially mitigated by favorable test coverage (52%).",
        code: `public class UserService {\n    // User repository operations\n}`,
        recommendations: [
          {
            id: "rec-seed-2",
            category: "testing",
            severity: "medium",
            problem: "Moderate Test Coverage (52%)",
            whyItMatters: "Edge conditions may go unchecked during refactoring.",
            recommendation: "Increase unit test coverage for user role permission checks.",
            targetRefactorGoal: "generate test cases"
          }
        ],
        status: "Completed",
      },
      {
        id: "hist-seed-3",
        projectName: "Billing & Invoicing",
        fileName: "PaymentProcessor.py",
        language: "python",
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5,
        dateString: "18 Sep 2026",
        overallRisk: "HIGH",
        defectProbability: 0.742,
        confidenceScore: 82,
        metrics: {
          loc: 310,
          cyclomatic: 16,
          dependencies: 9,
          testCoverage: 34,
          maintainabilityIndex: 44,
        },
        summaryExplanation: "The prediction is mainly influenced by high code complexity (16) and low test coverage (34%).",
        code: `class PaymentProcessor:\n    def process_transaction(self, data):\n        pass`,
        recommendations: [],
        status: "Critical Attention",
      },
      {
        id: "hist-seed-4",
        projectName: "Common Tools",
        fileName: "StringUtility.js",
        language: "javascript",
        timestamp: Date.now() - 1000 * 60 * 60 * 24 * 7,
        dateString: "15 Sep 2026",
        overallRisk: "LOW",
        defectProbability: 0.185,
        confidenceScore: 89,
        metrics: {
          loc: 64,
          cyclomatic: 3,
          dependencies: 1,
          testCoverage: 88,
          maintainabilityIndex: 86,
        },
        summaryExplanation: "The code is categorized as low risk, supported by healthy test coverage (88%) and controlled cyclomatic complexity.",
        code: `export function sanitize(str) { return (str || '').trim(); }`,
        recommendations: [],
        status: "Completed",
      }
    ];
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(seedHistory, null, 2), "utf-8");
  }
}

export function getAllHistory(): HistoryItem[] {
  ensureDirectoryExists();
  try {
    const raw = fs.readFileSync(HISTORY_FILE, "utf-8");
    const items: HistoryItem[] = JSON.parse(raw);
    return items.sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error("Failed to read history:", error);
    return [];
  }
}

export function saveHistoryItem(item: HistoryItem): HistoryItem {
  ensureDirectoryExists();
  const list = getAllHistory();
  const existingIdx = list.findIndex(h => h.id === item.id);
  if (existingIdx >= 0) {
    list[existingIdx] = item;
  } else {
    list.unshift(item);
  }
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(list, null, 2), "utf-8");
  return item;
}

export function getHistoryById(id: string): HistoryItem | undefined {
  const list = getAllHistory();
  return list.find(h => h.id === id);
}

export function deleteHistoryItem(id: string): boolean {
  ensureDirectoryExists();
  const list = getAllHistory().filter(h => h.id !== id);
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(list, null, 2), "utf-8");
  return true;
}
