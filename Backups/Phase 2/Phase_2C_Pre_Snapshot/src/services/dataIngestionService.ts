import {
  ConsultationDataset,
  IngestionDiagnostics,
  NormalizedCommentRecord,
  SchemaMappingConfig,
} from '../types';
import {
  getNormalizedSignature,
  isTrivialSubmission,
  sanitizeCommentText,
  standardizePolicySection,
  standardizeStakeholderGroup,
} from './dataCleaner';
import { profileDatasetColumns } from './schemaDetector';
import { discoverDynamicTopics } from './topicDiscoveryService';

/**
 * Ingests, validates, cleans, and normalizes consultation rows according to the mapping config
 */
export function ingestConsultationDataset(
  fileName: string,
  rawRows: Record<string, string>[],
  mappingConfig: SchemaMappingConfig,
  customTitle?: string
): ConsultationDataset {
  const headers = rawRows.length > 0 ? Object.keys(rawRows[0]) : [];
  const { profiles } = profileDatasetColumns(headers, rawRows);

  const comments: NormalizedCommentRecord[] = [];
  const exactSignatureMap = new Map<string, string>(); // signature -> first comment id
  const verbatimTextMap = new Map<string, string>(); // exact text -> first comment id

  let droppedEmptyCount = 0;
  let exactDupCount = 0;
  let nearDupCount = 0;
  let totalWords = 0;
  let minWords = Infinity;
  let maxWords = 0;

  const stakeholderCounts: Record<string, number> = {};
  const sectionCounts: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};
  const warnings: string[] = [];
  const notices: string[] = [];

  const commentCol = mappingConfig.commentColumn;

  for (let idx = 0; idx < rawRows.length; idx++) {
    const row = rawRows[idx];
    const rawComment = row[commentCol];

    if (!rawComment || typeof rawComment !== 'string' || !rawComment.trim()) {
      droppedEmptyCount++;
      continue;
    }

    const cleanedText = sanitizeCommentText(rawComment);
    if (!cleanedText) {
      droppedEmptyCount++;
      continue;
    }

    const words = cleanedText.split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const charCount = cleanedText.length;
    totalWords += wordCount;
    if (wordCount < minWords) minWords = wordCount;
    if (wordCount > maxWords) maxWords = wordCount;

    const isShort = isTrivialSubmission(cleanedText);

    // Duplicate detection
    const normalizedSig = getNormalizedSignature(cleanedText);
    const exactTextKey = cleanedText.toLowerCase();

    let isDuplicate = false;
    let duplicateOfId: string | undefined = undefined;

    if (verbatimTextMap.has(exactTextKey)) {
      isDuplicate = true;
      duplicateOfId = verbatimTextMap.get(exactTextKey);
      exactDupCount++;
    } else if (normalizedSig.length > 15 && exactSignatureMap.has(normalizedSig)) {
      isDuplicate = true;
      duplicateOfId = exactSignatureMap.get(normalizedSig);
      nearDupCount++;
    }

    const commId = `comm-${String(comments.length + 1).padStart(3, '0')}`;

    if (!isDuplicate) {
      verbatimTextMap.set(exactTextKey, commId);
      if (normalizedSig.length > 15) {
        exactSignatureMap.set(normalizedSig, commId);
      }
    }

    // Resolve Stakeholder Metadata
    const rawStakeholder = mappingConfig.stakeholderTypeColumn ? row[mappingConfig.stakeholderTypeColumn] : undefined;
    const rawOrg = mappingConfig.organizationColumn ? row[mappingConfig.organizationColumn] : undefined;
    const rawRegion = mappingConfig.regionColumn ? row[mappingConfig.regionColumn] : undefined;
    const standardizedType = standardizeStakeholderGroup(rawStakeholder);

    stakeholderCounts[standardizedType] = (stakeholderCounts[standardizedType] || 0) + 1;

    // Resolve Policy Target Metadata
    const rawSec = mappingConfig.policySectionColumn ? row[mappingConfig.policySectionColumn] : undefined;
    const rawCat = mappingConfig.categoryColumn ? row[mappingConfig.categoryColumn] : undefined;
    const standardizedSection = standardizePolicySection(rawSec);
    const categoryName = rawCat && rawCat.trim() ? rawCat.trim() : 'General Policy Feedback';

    sectionCounts[standardizedSection] = (sectionCounts[standardizedSection] || 0) + 1;
    categoryCounts[categoryName] = (categoryCounts[categoryName] || 0) + 1;

    // Resolve ID & Timestamp
    const rawId = mappingConfig.idColumn ? row[mappingConfig.idColumn] : undefined;
    const submissionId = rawId && rawId.trim() ? rawId.trim() : `SUB-${String(idx + 1).padStart(4, '0')}`;
    const rawTimestamp = mappingConfig.timestampColumn ? row[mappingConfig.timestampColumn] : undefined;

    comments.push({
      id: commId,
      submissionId,
      originalText: rawComment,
      cleanedText,
      wordCount,
      charCount,
      isShort,
      isDuplicate,
      duplicateOfId,
      stakeholder: {
        type: standardizedType,
        organization: rawOrg && rawOrg.trim() ? rawOrg.trim() : undefined,
        region: rawRegion && rawRegion.trim() ? rawRegion.trim() : undefined,
        rawLabel: rawStakeholder,
      },
      policyTarget: {
        section: standardizedSection,
        category: categoryName,
        rawSection: rawSec,
      },
      timestamp: rawTimestamp,
      rawRow: row,
    });
  }

  // Quality Diagnostics Calculations
  const validIngestedRows = comments.length;
  if (minWords === Infinity) minWords = 0;
  const avgCommentWordCount = validIngestedRows > 0 ? Math.round(totalWords / validIngestedRows) : 0;

  // Cleanliness Score (0 - 100)
  let score = 100;
  if (rawRows.length > 0) {
    const droppedPct = (droppedEmptyCount / rawRows.length) * 100;
    const dupPct = ((exactDupCount + nearDupCount) / rawRows.length) * 100;
    score -= droppedPct * 1.5;
    score -= dupPct * 0.8;
    if (avgCommentWordCount < 10) score -= 15;
    if (validIngestedRows < 5) score -= 20;
  }
  const dataCleanlinessScore = Math.max(10, Math.min(100, Math.round(score)));

  // Generate Informative Warnings & Notices
  if (droppedEmptyCount > 0) {
    warnings.push(`${droppedEmptyCount} blank or whitespace-only rows were automatically omitted from analysis.`);
  }
  if (exactDupCount > 0 || nearDupCount > 0) {
    warnings.push(
      `Detected ${exactDupCount + nearDupCount} repeated submissions (${exactDupCount} verbatim, ${nearDupCount} coordinated/near-duplicate).`
    );
  }
  if (avgCommentWordCount < 8) {
    warnings.push('Average submission length is low; submissions may lack detailed policy arguments.');
  }

  const uniqueStakeholderCount = Object.keys(stakeholderCounts).length;
  notices.push(`Categorized submissions across ${uniqueStakeholderCount} distinct stakeholder segment(s).`);
  const uniqueSectionCount = Object.keys(sectionCounts).length;
  if (uniqueSectionCount > 1) {
    notices.push(`Mapped comments across ${uniqueSectionCount} policy sections / clauses.`);
  }

  const diagnostics: IngestionDiagnostics = {
    totalRawRows: rawRows.length,
    validIngestedRows,
    droppedEmptyRows: droppedEmptyCount,
    exactDuplicateRows: exactDupCount,
    nearDuplicateRows: nearDupCount,
    dataCleanlinessScore,
    avgCommentWordCount,
    minWordCount: minWords,
    maxWordCount: maxWords,
    stakeholderTypeCounts: stakeholderCounts,
    policySectionCounts: sectionCounts,
    categoryCounts,
    warnings,
    notices,
  };

  // Step: Execute Dynamic Topic Discovery and Multi-Clause Sentiment Analysis (Phase 2B)
  const { enrichedComments, analysisResult } = discoverDynamicTopics(comments);

  const cleanTitle = customTitle || fileName.replace(/\.[^/.]+$/, '').replace(/[_ -]+/g, ' ');

  return {
    id: `dataset-${Date.now()}`,
    fileName,
    title: cleanTitle,
    uploadedAt: new Date().toLocaleString(),
    schemaMapping: mappingConfig,
    columnProfiles: profiles,
    diagnostics,
    comments: enrichedComments,
    rawRows,
    rawHeaders: headers,
    topicAnalysis: analysisResult,
  };
}

