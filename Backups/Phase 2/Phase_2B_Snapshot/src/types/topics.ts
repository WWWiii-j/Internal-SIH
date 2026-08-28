import { NormalizedCommentRecord } from './consultation';

export type SentimentLabel = 'Positive' | 'Negative' | 'Neutral';
export type StanceLabel = 'Support' | 'Oppose' | 'Conditional Support' | 'Amendment Needed' | 'Neutral/Inquiry';

export interface TfidfTerm {
  term: string;
  nGramType: 'unigram' | 'bigram' | 'trigram';
  docCount: number;
  totalCount: number;
  avgTfidfScore: number;
  dominantSentiment: SentimentLabel;
}

export interface DynamicTopic {
  id: string;
  title: string;
  keywords: string[];
  commentCount: number;
  commentPercentage: number;
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  sentimentPercentages: {
    positive: number;
    neutral: number;
    negative: number;
  };
  dominantSentiment: SentimentLabel;
  averagePolarity: number; // -1.0 to +1.0
  supportingCommentIds: string[];
  topStakeholders: Array<{ type: string; count: number }>;
  topSections: Array<{ section: string; count: number }>;
  representativeQuotes: string[];
}

export interface TopicAnalysisResult {
  topics: DynamicTopic[];
  globalKeywords: TfidfTerm[];
  totalTopics: number;
  totalCommentsAnalyzed: number;
  sentimentSummary: {
    positiveCount: number;
    neutralCount: number;
    negativeCount: number;
    positivePercentage: number;
    neutralPercentage: number;
    negativePercentage: number;
    averageConfidence: number;
    netStanceScore: number; // -100 to +100
  };
}
