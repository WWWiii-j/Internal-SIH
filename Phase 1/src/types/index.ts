export type SentimentType = 'Positive' | 'Negative' | 'Neutral';

export interface CommentRecord {
  id: string;
  originalText: string;
  sentiment: SentimentType;
  confidence: number; // 0.0 to 1.0 (e.g. 0.94)
  polarityScore: number; // -1.0 to 1.0 (compound score)
  keywords: string[];
  stakeholderType?: string; // Optional metadata: Citizen, Industry, Academic, NGO, Legal Expert
  category?: string; // e.g. Compliance, Cost, Feasibility, Timelines, Innovation
  length: number;
}

export interface KeywordMetric {
  text: string;
  count: number;
  sentimentBreakdown: {
    positive: number;
    negative: number;
    neutral: number;
  };
  dominantSentiment: SentimentType;
  relevanceScore: number;
}

export interface ThematicCluster {
  theme: string;
  count: number;
  sentiment: SentimentType;
  representativeQuotes: string[];
}

export interface ExecutiveSummary {
  overallStance: string; // e.g. "Cautiously Optimistic (68% Favorable)"
  publicSentimentDistribution: string;
  executiveBrief: string;
  majorPositiveHighlights: string[];
  majorConcerns: string[];
  actionableRecommendations: string[];
  criticalRiskAreas: string[];
  stakeholderBreakdownText: string;
}

export interface AnalysisStatistics {
  totalComments: number;
  positiveCount: number;
  negativeCount: number;
  neutralCount: number;
  positivePercentage: number;
  negativePercentage: number;
  neutralPercentage: number;
  averageConfidence: number;
  averageWordCount: number;
  publicStanceScore: number; // -100 to +100
}

export interface AnalysisResult {
  fileName: string;
  analyzedAt: string;
  records: CommentRecord[];
  stats: AnalysisStatistics;
  keywords: KeywordMetric[];
  themes: ThematicCluster[];
  summary: ExecutiveSummary;
  rawColumns: string[];
  selectedCommentColumn: string;
}

export interface CsvValidationResult {
  isValid: boolean;
  totalRows: number;
  detectedColumns: string[];
  suggestedCommentColumn: string | null;
  sampleRows: Record<string, string>[];
  errors: string[];
  warnings: string[];
}

export type ProcessingStep =
  | 'uploading'
  | 'validating'
  | 'extracting'
  | 'sentiment'
  | 'keywords'
  | 'summary'
  | 'ready';

export interface ProcessingState {
  currentStep: ProcessingStep;
  progress: number; // 0 - 100
  statusMessage: string;
  completedSteps: ProcessingStep[];
}

export interface FilterState {
  searchQuery: string;
  sentiment: 'All' | SentimentType;
  minConfidence: number;
  selectedKeyword: string | null;
  selectedCategory: string | null;
  sortBy: 'index' | 'confidence-desc' | 'confidence-asc' | 'sentiment' | 'length-desc';
  page: number;
  pageSize: number;
}

export interface SampleDatasetInfo {
  id: string;
  title: string;
  description: string;
  category: string;
  commentCount: number;
  iconName: string;
  csvContent: string;
}
