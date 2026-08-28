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
 * Export normalized dataset as standard CSV
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
    Cleaned_Comment_Text: c.cleanedText,
    Word_Count: c.wordCount,
    Is_Duplicate: c.isDuplicate ? 'Yes' : 'No',
    Is_Short: c.isShort ? 'Yes' : 'No',
    Timestamp: c.timestamp || '',
  }));

  const csv = Papa.unparse(rows);
  const cleanName = dataset.fileName.replace(/\.[^/.]+$/, '');
  const timestamp = new Date().toISOString().slice(0, 10);
  triggerDownload(csv, `Normalized_Consultation_${cleanName}_${timestamp}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Export full JSON payload with schema mappings and diagnostics
 */
export function exportDatasetJson(dataset: ConsultationDataset) {
  const payload = {
    metadata: {
      platform: 'SIH 2025 PS-25035 Phase 2 Policy Intelligence Platform',
      fileName: dataset.fileName,
      title: dataset.title,
      uploadedAt: dataset.uploadedAt,
      schemaMapping: dataset.schemaMapping,
      diagnostics: dataset.diagnostics,
    },
    columnProfiles: dataset.columnProfiles,
    totalRecords: dataset.comments.length,
    comments: dataset.comments,
  };

  const jsonStr = JSON.stringify(payload, null, 2);
  const cleanName = dataset.fileName.replace(/\.[^/.]+$/, '');
  triggerDownload(jsonStr, `Consultation_Dataset_${cleanName}_Schema.json`, 'application/json;charset=utf-8;');
}
