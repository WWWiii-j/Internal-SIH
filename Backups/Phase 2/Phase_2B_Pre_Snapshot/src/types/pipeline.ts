export type PipelineStage =
  | '2A_INGESTION'        // Core & Data Ingestion
  | '2B_NLP_TOPICS'       // Dynamic Topic Extraction & Multi-Clause Stance
  | '2C_PRIORITY'         // Multi-Factor Priority Engine
  | '2D_STAKEHOLDERS'     // Stakeholder Cross-Tabulation
  | '2E_AI_INSIGHTS'      // Grounded AI Insights
  | '2F_POLICY_RECS'      // Evidence-Linked Recommendations
  | '2G_DOSSIER';         // Interactive Policy Dossier & PDF Export

export type IngestionStep =
  | 'uploading'
  | 'parsing'
  | 'schema_detecting'
  | 'cleaning_normalizing'
  | 'diagnostics_computing'
  | 'ready';

export interface IngestionProcessingState {
  currentStep: IngestionStep;
  progress: number; // 0 - 100
  statusMessage: string;
  completedSteps: IngestionStep[];
}

export interface IngestionFilterState {
  searchQuery: string;
  selectedStakeholderType: string;
  selectedPolicySection: string;
  selectedCategory: string;
  showOnlyDuplicates: boolean;
  showOnlyShort: boolean;
  sortBy: 'index' | 'length-desc' | 'length-asc' | 'stakeholder';
  page: number;
  pageSize: number;
}
