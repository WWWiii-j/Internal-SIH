import { ColumnProfile, IngestionDiagnostics, SchemaMappingConfig } from './schema';

export interface StakeholderMetadata {
  type: string;            // Standardized: 'Citizen', 'Industry MSME', 'Conglomerate', 'NGO', 'Academic', 'Legal Expert', etc.
  organization?: string;   // Specific organization / institution / company
  region?: string;         // State / Territory / Geography
  rawLabel?: string;       // Original unmapped label from CSV
}

export interface PolicyTargetMetadata {
  section?: string;        // e.g. 'Section 4', 'Clause 3.2', 'Rule 17'
  category?: string;       // e.g. 'Tariffs & Incentives', 'Compliance & Audits'
  rawSection?: string;     // Original unmapped text
}

export interface NormalizedCommentRecord {
  id: string;              // Normalized sequential ID e.g. 'comm-001'
  submissionId: string;    // Original submission/stakeholder ID or generated
  originalText: string;    // Verbatim text
  cleanedText: string;     // Sanitized, normalized text (trimmed, whitespace normalized)
  wordCount: number;
  charCount: number;
  isShort: boolean;        // e.g. < 4 words
  isDuplicate: boolean;    // Detected duplicate submission
  duplicateOfId?: string;
  stakeholder: StakeholderMetadata;
  policyTarget: PolicyTargetMetadata;
  timestamp?: string;
  rawRow: Record<string, string>;

  // Future phase extension slots (2B, 2C, 2D, 2E)
  sentiment?: {
    label: 'Positive' | 'Negative' | 'Neutral';
    confidence: number;
    polarityScore: number;
  };
  stance?: {
    label: 'Support' | 'Oppose' | 'Conditional Support' | 'Amendment Needed' | 'Neutral/Inquiry';
    confidence: number;
  };
  extractedKeywords?: string[];
  topics?: string[];
  priorityScore?: number;
}

export interface ConsultationDataset {
  id: string;
  fileName: string;
  title: string;
  description?: string;
  category?: string;
  uploadedAt: string;
  schemaMapping: SchemaMappingConfig;
  columnProfiles: ColumnProfile[];
  diagnostics: IngestionDiagnostics;
  comments: NormalizedCommentRecord[];
  rawRows: Record<string, string>[];
  rawHeaders: string[];
}

export interface SampleDataset {
  id: string;
  title: string;
  description: string;
  category: string;
  recordCount: number;
  badge: string;
  iconName: string;
  csvContent: string;
}
