export type SemanticColumnRole =
  | 'comment_text'       // Main feedback, suggestion, objection, or comment text (Mandatory)
  | 'submission_id'      // Unique stakeholder/submission identifier
  | 'stakeholder_type'   // Stakeholder segment/category (e.g. Industry, Citizen, Academic, NGO)
  | 'organization'       // Entity name, company, institution, or department
  | 'policy_section'     // Draft policy section, clause, rule, or article reference
  | 'category'           // Topic area or thematic category
  | 'region'             // State, city, district, or geographic scope
  | 'timestamp'          // Date or time of submission
  | 'stance'             // Pre-annotated stance / rating if present
  | 'ignore';            // Unmapped or ignored metadata

export type InferredDataType =
  | 'text_long'          // Long prose/commentary (avg len > 40 chars)
  | 'text_short'         // Short text/labels
  | 'categorical'        // Low cardinality discrete categories
  | 'identifier'         // Unique IDs, keys, hashes
  | 'date'               // ISO dates, date formats
  | 'numeric'            // Integers, floats
  | 'unknown';

export interface ColumnProfile {
  name: string;
  inferredRole: SemanticColumnRole;
  inferredDataType: InferredDataType;
  confidence: number;            // 0.0 to 1.0 confidence in role assignment
  totalValues: number;
  nonEmptyCount: number;
  nullPercentage: number;
  uniqueCount: number;
  sampleValues: string[];
  avgCharLength: number;
}

export interface SchemaMappingConfig {
  commentColumn: string;         // Primary text column (Mandatory)
  idColumn?: string;
  stakeholderTypeColumn?: string;
  organizationColumn?: string;
  policySectionColumn?: string;
  categoryColumn?: string;
  regionColumn?: string;
  timestampColumn?: string;
  stanceColumn?: string;
  customFieldMappings?: Record<string, string>;
}

export interface IngestionDiagnostics {
  totalRawRows: number;
  validIngestedRows: number;
  droppedEmptyRows: number;
  exactDuplicateRows: number;
  nearDuplicateRows: number;
  dataCleanlinessScore: number;  // 0 - 100
  avgCommentWordCount: number;
  minWordCount: number;
  maxWordCount: number;
  stakeholderTypeCounts: Record<string, number>;
  policySectionCounts: Record<string, number>;
  categoryCounts: Record<string, number>;
  warnings: string[];
  notices: string[];
}

export interface CsvRawParseResult {
  data: Record<string, string>[];
  headers: string[];
  delimiter: string;
  errors: string[];
  warnings: string[];
}
