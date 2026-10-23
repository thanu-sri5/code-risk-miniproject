/**
 * Recommendation Engine for Software Risk Mitigation
 * 
 * Generates specific, actionable guidance based on detected software risks and code metrics.
 */

import { SoftwareMetrics } from "./ml-model";
import { DetailedAnalysisResult } from "./code-analyzer";

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

export function generateRecommendations(
  analysis: DetailedAnalysisResult,
  defectProbability: number
): CodeRecommendation[] {
  const recommendations: CodeRecommendation[] = [];
  const { metrics, rawMetrics, language } = analysis;

  // 1. High Cyclomatic Complexity
  if (metrics.cyclomatic > 10) {
    recommendations.push({
      id: "rec-complexity",
      category: "complexity",
      severity: metrics.cyclomatic > 15 ? "high" : "medium",
      problem: `High Code Complexity (Cyclomatic Complexity = ${metrics.cyclomatic})`,
      whyItMatters: "Complex code contains too many nested execution paths, which exponentially increases testing difficulty, bug hiding, and maintenance overhead.",
      recommendation: "Break large compound methods into smaller single-responsibility functions. Replace deep nested if-else ladders with early returns or guard clauses.",
      codeSnippetExample: language === "java" 
        ? "// Prefer early exit:\nif (!isValidUser(user)) return Result.FAILED;\nprocessOrder(user);"
        : "// Prefer early returns over nested if/else:\nif (!is_valid(user):\n    return False\nreturn process_order(user)",
      targetRefactorGoal: "reduce complexity",
    });
  }

  // 2. Low Test Coverage
  if (metrics.testCoverage < 50) {
    recommendations.push({
      id: "rec-testing",
      category: "testing",
      severity: metrics.testCoverage < 30 ? "high" : "medium",
      problem: `Low Test Coverage (Estimated at ${metrics.testCoverage}%)`,
      whyItMatters: "Code without comprehensive automated tests has high defect regression risk. Edge conditions and error handlers may fail silently in production.",
      recommendation: `Add automated unit test suites covering boundary values, null/empty inputs, and exception paths. Target at least 75% branch coverage for this module.`,
      codeSnippetExample: language === "java"
        ? "@Test\nvoid shouldHandleNullInputGracefully() {\n    assertThrows(IllegalArgumentException.class, () -> auth.login(null, \"pass\"));\n}"
        : "def test_invalid_input():\n    with pytest.raises(ValueError):\n        authenticate(None, 'pass')",
      targetRefactorGoal: "generate test cases",
    });
  }

  // 3. High Halstead Difficulty & Effort (Cognitive Overload)
  if (metrics.halsteadDifficulty > 14 || rawMetrics.halstead.effort > 30000) {
    recommendations.push({
      id: "rec-modularity",
      category: "modularity",
      severity: "medium",
      problem: `High Cognitive Load (Halstead Difficulty = ${metrics.halsteadDifficulty})`,
      whyItMatters: "A high volume of unique operators and operands increases the mental effort required for any developer to safely read, modify, or verify this code.",
      recommendation: "Refactor complex inline expressions into named intermediate variables or extracted utility helpers to enhance readability.",
      targetRefactorGoal: "improve readability",
    });
  }

  // 4. Large Module Size
  if (metrics.loc > 140) {
    recommendations.push({
      id: "rec-size",
      category: "modularity",
      severity: "medium",
      problem: `Large File Size (${metrics.loc} Lines of Code)`,
      whyItMatters: "Monolithic modules violate the Single Responsibility Principle, accumulating multiple reasons to change and increasing merge conflicts.",
      recommendation: "Decompose this file into modular components: isolate domain business logic, data access, and input validation into separate classes/files.",
      targetRefactorGoal: "improve modularity",
    });
  }

  // 5. High Coupling / External Dependencies
  if (metrics.dependencies > 6) {
    recommendations.push({
      id: "rec-coupling",
      category: "coupling",
      severity: "medium",
      problem: `Tight Coupling (${metrics.dependencies} External Dependencies)`,
      whyItMatters: "Heavy coupling makes modules fragile to upstream API changes and complicates isolated unit testing.",
      recommendation: "Apply Dependency Inversion: pass abstractions or interfaces rather than instantiating external concrete classes directly.",
      targetRefactorGoal: "improve architecture",
    });
  }

  // 6. Sparse Documentation
  if (metrics.commentRatio < 0.1 && metrics.loc > 30) {
    recommendations.push({
      id: "rec-doc",
      category: "documentation",
      severity: "low",
      problem: `Low Documentation Density (${Math.round(metrics.commentRatio * 100)}% comments)`,
      whyItMatters: "Sparse documentation forces team members to reverse-engineer business intent from raw syntax.",
      recommendation: "Add docstrings/Javadoc explaining non-obvious preconditions, return guarantees, and parameter bounds.",
      targetRefactorGoal: "add comments",
    });
  }

  // 7. General Error Handling
  if (rawMetrics.maintainabilityIndex < 65 || defectProbability >= 0.5) {
    recommendations.push({
      id: "rec-exceptions",
      category: "exceptions",
      severity: "medium",
      problem: "Defensive Error Handling Needed",
      whyItMatters: "Software defect prediction indicates elevated risk. Unchecked nulls, type mismatches, or unhandled network/db faults can crash the service.",
      recommendation: "Enforce strict input validation, sanitize incoming parameters, and handle potential failures with structured try-catch/except blocks.",
      targetRefactorGoal: "add error handling",
    });
  }

  // If no critical recommendations triggered, provide positive maintainability tips
  if (recommendations.length === 0) {
    recommendations.push({
      id: "rec-clean",
      category: "modularity",
      severity: "low",
      problem: "Code is Structurally Sound",
      whyItMatters: "Metrics reflect clean, low-risk modularity with low cyclomatic complexity.",
      recommendation: "Maintain code quality by preserving current unit test coverage and running automated static analysis on every pull request.",
      targetRefactorGoal: "maintain quality",
    });
  }

  return recommendations;
}
