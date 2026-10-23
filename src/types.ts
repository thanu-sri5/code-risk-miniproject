/**
 * Shared TypeScript definitions for Smart Software Risk AI
 */

export type SupportedLanguage = "java" | "python" | "javascript";
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";
export type PriorityLevel = "Critical" | "Review" | "Monitor";

export interface SoftwareMetrics {
  loc: number;
  sloc: number;
  cyclomatic: number;
  essential: number;
  halsteadVolume: number;
  halsteadDifficulty: number;
  halsteadEffort: number;
  halsteadBugs: number;
  dependencies: number;
  testCoverage: number;
  commentRatio: number;
  branchCount: number;
}

export interface RawMetrics {
  loc: number;
  sloc: number;
  blankLines: number;
  commentLines: number;
  cyclomaticComplexity: number;
  essentialComplexity: number;
  halstead: {
    distinctOperators: number;
    distinctOperands: number;
    totalOperators: number;
    totalOperands: number;
    volume: number;
    difficulty: number;
    effort: number;
    estimatedBugs: number;
  };
  dependencies: string[];
  dependencyCount: number;
  testAssertionCount: number;
  estimatedTestCoverage: number;
  branchCount: number;
  functionCount: number;
  maintainabilityIndex: number;
}

export interface ShapFactor {
  factor: string;
  shapValue: number;
  normalizedImpact: number;
  rawFeatureValue: number | string;
  direction: "increases_risk" | "reduces_risk";
  description: string;
}

export interface RiskPredictionResult {
  overallRisk: RiskLevel;
  defectProbability: number;
  confidenceScore: number;
  logitScore: number;
  baseValue: number;
  shapFactors: ShapFactor[];
  summaryExplanation: string;
  modelMeta: {
    dataset: string;
    modelType: string;
    trainedInstances: number;
    benchmarkAccuracy: number;
    benchmarkAucRoc: number;
  };
}

export interface CodeRecommendation {
  id: string;
  category: "complexity" | "testing" | "modularity" | "coupling" | "documentation" | "exceptions";
  severity: "high" | "medium" | "low";
  problem: string;
  whyItMatters: string;
  recommendation: string;
  codeSnippetExample?: string;
  targetRefactorGoal: string;
}

export interface AnalysisResponse {
  analysis: {
    fileName: string;
    language: SupportedLanguage;
    rawMetrics: RawMetrics;
    metrics: SoftwareMetrics;
  };
  prediction: RiskPredictionResult;
  recommendations: CodeRecommendation[];
  historyId?: string;
}

export interface HistoryItem {
  id: string;
  projectName: string;
  fileName: string;
  language: SupportedLanguage;
  timestamp: number;
  dateString: string;
  overallRisk: RiskLevel;
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

export interface DashboardStats {
  totalAnalyses: number;
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
  recentAnalyses: HistoryItem[];
}

export interface ModulePriorityItem {
  module: string;
  fileName: string;
  language: SupportedLanguage;
  risk: RiskLevel;
  defectProbability: number;
  priority: PriorityLevel;
  cyclomatic: number;
  loc: number;
  testCoverage: number;
  code: string;
  summaryExplanation: string;
  shapFactors: ShapFactor[];
}
