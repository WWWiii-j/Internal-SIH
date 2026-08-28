import { NormalizedCommentRecord } from './consultation';

export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface PriorityScoreBreakdown {
  frequencyScore: number;        // 0 - 25 points (volume & prevalence weight)
  negativeRatioScore: number;    // 0 - 35 points (critical negative ratio)
  severityScore: number;         // 0 - 20 points (harsh/punitive/disruptive terms)
  urgencyRiskScore: number;      // 0 - 20 points (deadline/emergency/risk/litigation terms)
  totalScore: number;            // 0 - 100
  level: PriorityLevel;
  severityTriggers: string[];
  urgencyTriggers: string[];
}

export interface KeyIssue {
  id: string;                    // e.g. 'issue-1'
  topicId: string;               // linked DynamicTopic id
  title: string;                 // Issue / Topic title
  description?: string;
  priorityScore: number;         // 0 - 100
  priorityLevel: PriorityLevel;  // HIGH (70-100), MEDIUM (40-69), LOW (0-39)
  scoreBreakdown: PriorityScoreBreakdown;
  commentCount: number;
  commentPercentage: number;
  negativeSentimentPercentage: number;
  neutralSentimentPercentage: number;
  positiveSentimentPercentage: number;
  severityIndicators: string[];
  urgencyIndicators: string[];
  explanation: string;           // Transparent rationale: "High priority because..."
  supportingCommentIds: string[];
  affectedStakeholders: Array<{ type: string; count: number }>;
  targetedSections: Array<{ section: string; count: number }>;
  representativeQuotes: string[];
}

export interface PriorityAnalysisResult {
  issues: KeyIssue[];
  highPriorityCount: number;
  mediumPriorityCount: number;
  lowPriorityCount: number;
  averagePriorityScore: number;
  topUrgentIssues: KeyIssue[];
}
