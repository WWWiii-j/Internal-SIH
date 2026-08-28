import { ColumnProfile, InferredDataType, SchemaMappingConfig, SemanticColumnRole } from '../types';

const COMMENT_HEADER_PATTERNS = [
  'comment', 'comments', 'feedback', 'feedbacks', 'suggestion', 'suggestions',
  'opinion', 'opinions', 'remark', 'remarks', 'submission', 'submissions',
  'text', 'stakeholder_comment', 'public_feedback', 'citizen_feedback',
  'response', 'responses', 'input', 'review', 'reviews', 'statement',
  'objection', 'view', 'content', 'description', 'detail', 'details'
];

const STAKEHOLDER_HEADER_PATTERNS = [
  'stakeholder_type', 'stakeholder_group', 'stakeholder', 'stakeholders',
  'entity_type', 'entity', 'group', 'actor', 'participant_type', 'user_type',
  'designation', 'role', 'affiliation', 'respondent_type', 'submitter_type'
];

const ORGANIZATION_HEADER_PATTERNS = [
  'organization', 'org', 'company', 'institution', 'entity_name',
  'department', 'agency', 'association', 'firm', 'ministry', 'body'
];

const POLICY_SECTION_PATTERNS = [
  'policy_section', 'section', 'clause', 'rule', 'rule_reference',
  'article', 'provision', 'chapter', 'sub_rule', 'guideline_ref',
  'section_no', 'clause_no', 'target_section'
];

const CATEGORY_HEADER_PATTERNS = [
  'category', 'domain', 'topic', 'thematic_area', 'sector', 'focus_area',
  'subject', 'classification', 'theme', 'area'
];

const ID_HEADER_PATTERNS = [
  'id', 'submission_id', 'stakeholder_id', 'ref_no', 'reference_id',
  'serial', 'sl_no', 'sr_no', 'token', 'tracking_id', 'uuid', 'record_id'
];

const REGION_HEADER_PATTERNS = [
  'region', 'state', 'location', 'city', 'district', 'country',
  'geography', 'jurisdiction', 'zone'
];

const TIMESTAMP_HEADER_PATTERNS = [
  'timestamp', 'date', 'time', 'submitted_at', 'created_at',
  'submission_date', 'date_time', 'datetime'
];

const STANCE_HEADER_PATTERNS = [
  'stance', 'sentiment', 'rating', 'sentiment_score', 'polarity',
  'vote', 'position', 'recommendation'
];

/**
 * Normalizes a header name for pattern matching (lowercase, strip non-alphanumeric)
 */
function normalizeHeader(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Checks if a normalized header matches any of the candidate patterns
 */
function matchesPattern(normalized: string, patterns: string[]): boolean {
  for (const pat of patterns) {
    const cleanPat = normalizeHeader(pat);
    if (normalized === cleanPat || normalized.includes(cleanPat) || cleanPat.includes(normalized)) {
      return true;
    }
  }
  return false;
}

/**
 * Profiles all columns and assigns inferred semantic roles and data types
 */
export function profileDatasetColumns(
  headers: string[],
  rows: Record<string, string>[]
): { profiles: ColumnProfile[]; suggestedMapping: SchemaMappingConfig } {
  const totalRows = rows.length;
  const profiles: ColumnProfile[] = [];

  for (const header of headers) {
    const values: string[] = [];
    let nonEmptyCount = 0;
    let totalCharLength = 0;

    for (const row of rows) {
      const val = row[header];
      if (typeof val === 'string' && val.trim().length > 0) {
        values.push(val.trim());
        nonEmptyCount++;
        totalCharLength += val.trim().length;
      }
    }

    const uniqueValues = new Set(values);
    const uniqueCount = uniqueValues.size;
    const avgCharLength = nonEmptyCount > 0 ? Math.round(totalCharLength / nonEmptyCount) : 0;
    const nullPercentage = totalRows > 0 ? Math.round(((totalRows - nonEmptyCount) / totalRows) * 100) : 100;
    const sampleValues = Array.from(uniqueValues).slice(0, 4);

    // Inferred Data Type
    let inferredDataType: InferredDataType = 'unknown';
    if (avgCharLength > 40) {
      inferredDataType = 'text_long';
    } else if (uniqueCount <= 12 && nonEmptyCount > 10) {
      inferredDataType = 'categorical';
    } else if (uniqueCount === nonEmptyCount && nonEmptyCount > 10 && avgCharLength < 25) {
      inferredDataType = 'identifier';
    } else if (values.some((v) => /^\d{4}-\d{2}-\d{2}/.test(v) || /^\d{1,2}\/\d{1,2}\/\d{2,4}/.test(v))) {
      inferredDataType = 'date';
    } else if (values.length > 0 && values.every((v) => !isNaN(Number(v)))) {
      inferredDataType = 'numeric';
    } else {
      inferredDataType = 'text_short';
    }

    // Inferred Role & Confidence
    const norm = normalizeHeader(header);
    let inferredRole: SemanticColumnRole = 'ignore';
    let confidence = 0.5;

    if (matchesPattern(norm, COMMENT_HEADER_PATTERNS)) {
      inferredRole = 'comment_text';
      confidence = 0.95;
    } else if (matchesPattern(norm, STAKEHOLDER_HEADER_PATTERNS)) {
      inferredRole = 'stakeholder_type';
      confidence = 0.9;
    } else if (matchesPattern(norm, POLICY_SECTION_PATTERNS)) {
      inferredRole = 'policy_section';
      confidence = 0.9;
    } else if (matchesPattern(norm, ORGANIZATION_HEADER_PATTERNS)) {
      inferredRole = 'organization';
      confidence = 0.85;
    } else if (matchesPattern(norm, CATEGORY_HEADER_PATTERNS)) {
      inferredRole = 'category';
      confidence = 0.85;
    } else if (matchesPattern(norm, ID_HEADER_PATTERNS)) {
      inferredRole = 'submission_id';
      confidence = 0.9;
    } else if (matchesPattern(norm, REGION_HEADER_PATTERNS)) {
      inferredRole = 'region';
      confidence = 0.85;
    } else if (matchesPattern(norm, TIMESTAMP_HEADER_PATTERNS)) {
      inferredRole = 'timestamp';
      confidence = 0.9;
    } else if (matchesPattern(norm, STANCE_HEADER_PATTERNS)) {
      inferredRole = 'stance';
      confidence = 0.8;
    } else if (avgCharLength > 45) {
      inferredRole = 'comment_text';
      confidence = 0.75;
    }

    profiles.push({
      name: header,
      inferredRole,
      inferredDataType,
      confidence,
      totalValues: totalRows,
      nonEmptyCount,
      nullPercentage,
      uniqueCount,
      sampleValues,
      avgCharLength,
    });
  }

  // Construct suggested schema mapping
  let suggestedCommentCol = profiles.find((p) => p.inferredRole === 'comment_text')?.name;

  // Fallback for comment column: longest text column if none explicitly matched
  if (!suggestedCommentCol && profiles.length > 0) {
    const sortedByLen = [...profiles].sort((a, b) => b.avgCharLength - a.avgCharLength);
    suggestedCommentCol = sortedByLen[0].name;
    const profile = profiles.find((p) => p.name === suggestedCommentCol);
    if (profile) {
      profile.inferredRole = 'comment_text';
      profile.confidence = 0.7;
    }
  }

  const suggestedMapping: SchemaMappingConfig = {
    commentColumn: suggestedCommentCol || (headers.length > 0 ? headers[0] : ''),
    idColumn: profiles.find((p) => p.inferredRole === 'submission_id')?.name,
    stakeholderTypeColumn: profiles.find((p) => p.inferredRole === 'stakeholder_type')?.name,
    organizationColumn: profiles.find((p) => p.inferredRole === 'organization')?.name,
    policySectionColumn: profiles.find((p) => p.inferredRole === 'policy_section')?.name,
    categoryColumn: profiles.find((p) => p.inferredRole === 'category')?.name,
    regionColumn: profiles.find((p) => p.inferredRole === 'region')?.name,
    timestampColumn: profiles.find((p) => p.inferredRole === 'timestamp')?.name,
    stanceColumn: profiles.find((p) => p.inferredRole === 'stance')?.name,
  };

  return { profiles, suggestedMapping };
}
