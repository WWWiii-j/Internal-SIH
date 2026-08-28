import Papa from 'papaparse';
import { ConsultationDataset } from '../types';

/**
 * Downloads a text file in browser
 */
function triggerDownload(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export normalized dataset as standard CSV with Phase 2B dynamic topics & sentiment
 */
export function exportNormalizedDatasetCsv(dataset: ConsultationDataset) {
  const rows = dataset.comments.map((c, i) => ({
    Row_Index: i + 1,
    Internal_ID: c.id,
    Submission_ID: c.submissionId,
    Stakeholder_Type: c.stakeholder.type,
    Organization: c.stakeholder.organization || '',
    Region: c.stakeholder.region || '',
    Policy_Section: c.policyTarget.section || '',
    Category: c.policyTarget.category || '',
    Dynamic_Topic: c.topics && c.topics.length > 0 ? c.topics[0] : 'Unclassified',
    Sentiment: c.sentiment?.label || 'Neutral',
    Polarity_Score: c.sentiment?.polarityScore !== undefined ? c.sentiment.polarityScore : 0,
    Stance: c.stance?.label || 'Neutral/Inquiry',
    Confidence: c.sentiment?.confidence !== undefined ? `${Math.round(c.sentiment.confidence * 100)}%` : '75%',
    Salient_Keywords: c.extractedKeywords?.join('; ') || '',
    Cleaned_Comment_Text: c.cleanedText,
    Word_Count: c.wordCount,
    Is_Duplicate: c.isDuplicate ? 'Yes' : 'No',
    Is_Short: c.isShort ? 'Yes' : 'No',
    Timestamp: c.timestamp || '',
  }));

  const csv = Papa.unparse(rows);
  const cleanName = dataset.fileName.replace(/\.[^/.]+$/, '');
  const timestamp = new Date().toISOString().slice(0, 10);
  triggerDownload(csv, `Policy_Intelligence_${cleanName}_${timestamp}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Export full JSON payload with schema mappings, diagnostics, and dynamic topic analysis
 */
export function exportDatasetJson(dataset: ConsultationDataset) {
  const payload = {
    metadata: {
      platform: 'SIH 2025 PS-25035 Phase 2 Policy Intelligence Platform',
      version: '2.0.0 (Phase 2B Active)',
      fileName: dataset.fileName,
      title: dataset.title,
      uploadedAt: dataset.uploadedAt,
      schemaMapping: dataset.schemaMapping,
      diagnostics: dataset.diagnostics,
    },
    topicAnalysis: dataset.topicAnalysis,
    columnProfiles: dataset.columnProfiles,
    totalRecords: dataset.comments.length,
    comments: dataset.comments,
  };

  const jsonStr = JSON.stringify(payload, null, 2);
  const cleanName = dataset.fileName.replace(/\.[^/.]+$/, '');
  triggerDownload(jsonStr, `Policy_Intelligence_${cleanName}_Dossier.json`, 'application/json;charset=utf-8;');
}
