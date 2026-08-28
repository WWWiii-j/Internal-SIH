import Papa from 'papaparse';
import { CsvValidationResult } from '../types';

const COMMON_COMMENT_COLUMNS = [
  'comment',
  'comments',
  'feedback',
  'feedbacks',
  'suggestion',
  'suggestions',
  'text',
  'opinion',
  'opinions',
  'remarks',
  'remark',
  'stakeholder_comment',
  'public_feedback',
  'response',
  'responses',
  'submission',
  'submissions',
  'description',
  'input',
  'review',
  'reviews',
  'statement',
  'content'
];

/**
 * Parses raw CSV string or file content and provides validation diagnostics
 */
export async function parseAndValidateCsv(
  fileOrText: File | string
): Promise<{ result: CsvValidationResult; rawRows: Record<string, string>[] }> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(fileOrText as any, {
      header: true,
      skipEmptyLines: 'greedy',
      dynamicTyping: false,
      delimitersToGuess: [',', '\t', '|', ';'],
      transformHeader: (header: string) => {
        // Strip BOM and trim whitespace
        return header.replace(/^[\uFEFF\u200B]+/, '').trim();
      },
      transform: (value: string) => {
        return typeof value === 'string' ? value.trim() : value;
      },
      complete: (results) => {
        let rawRows = results.data || [];
        const detectedColumns = results.meta.fields || (rawRows.length > 0 ? Object.keys(rawRows[0]) : []);
        const errors: string[] = [];
        const warnings: string[] = [];

        // 1. Process PapaParse errors (Filter out benign warnings like UndetectableDelimiter)
        if (results.errors && results.errors.length > 0) {
          for (const err of results.errors) {
            // UndetectableDelimiter is normal when there is only 1 column or delimiter detection defaults to comma
            if (
              err.code === 'UndetectableDelimiter' ||
              err.type === 'Delimiter' ||
              (err.message && err.message.toLowerCase().includes('auto-detect delimiting character'))
            ) {
              // Ignore or treat as non-fatal
              continue;
            }

            // Record true syntax errors (e.g. quote mismatch)
            errors.push(`Row ${err.row !== undefined ? err.row + 1 : 'Header'}: ${err.message}`);
          }
        }

        // 2. Check if file is completely empty
        if (rawRows.length === 0 && detectedColumns.length === 0) {
          errors.push('The uploaded CSV file is empty. Please provide a CSV file containing stakeholder feedback.');
        }

        if (detectedColumns.length === 0 && rawRows.length > 0) {
          errors.push('No column headers were detected. Ensure the CSV contains a valid header row.');
        }

        // Clean detectedColumns: remove empty string keys
        const cleanColumns = detectedColumns.filter((c) => c && c.trim().length > 0);

        // 3. Automatic comment column detection
        let suggestedCommentColumn: string | null = null;

        // Rule A: If there is only one column in the CSV, treat it as the comment column automatically
        if (cleanColumns.length === 1) {
          suggestedCommentColumn = cleanColumns[0];
        } else {
          // Rule B: Match known comment/feedback column names
          for (const col of cleanColumns) {
            const normalized = col.toLowerCase().replace(/[^a-z0-9]/g, '');
            for (const candidate of COMMON_COMMENT_COLUMNS) {
              const candNorm = candidate.replace(/[^a-z0-9]/g, '');
              if (normalized === candNorm || normalized.includes(candNorm)) {
                suggestedCommentColumn = col;
                break;
              }
            }
            if (suggestedCommentColumn) break;
          }

          // Rule C: If no name matched, select the column with highest average character length
          if (!suggestedCommentColumn && rawRows.length > 0 && cleanColumns.length > 0) {
            let maxAvgLength = 0;
            let longestCol = cleanColumns[0];

            for (const col of cleanColumns) {
              let totalLen = 0;
              let count = 0;
              for (let i = 0; i < Math.min(15, rawRows.length); i++) {
                const val = rawRows[i]?.[col];
                if (typeof val === 'string') {
                  totalLen += val.trim().length;
                  count++;
                }
              }
              const avg = count > 0 ? totalLen / count : 0;
              if (avg > maxAvgLength) {
                maxAvgLength = avg;
                longestCol = col;
              }
            }

            suggestedCommentColumn = longestCol;
            if (maxAvgLength > 10) {
              warnings.push(
                `Automatically selected column "${longestCol}" based on comment text length.`
              );
            }
          }
        }

        if (!suggestedCommentColumn && cleanColumns.length > 0) {
          suggestedCommentColumn = cleanColumns[0];
        }

        // 4. Filter and sanitize rows (Ignore completely empty rows or rows where comment is blank)
        const validRows: Record<string, string>[] = [];
        if (suggestedCommentColumn) {
          for (const row of rawRows) {
            const commentVal = row[suggestedCommentColumn];
            if (typeof commentVal === 'string' && commentVal.trim().length > 0) {
              validRows.push(row);
            }
          }
        }

        if (validRows.length < rawRows.length && rawRows.length > 0) {
          const omitted = rawRows.length - validRows.length;
          if (omitted > 0) {
            warnings.push(
              `${omitted} empty or blank row(s) were automatically filtered out.`
            );
          }
        }

        if (validRows.length === 0 && cleanColumns.length > 0) {
          errors.push('No non-empty comment rows were found in the selected column.');
        }

        const isValid = errors.length === 0 && validRows.length > 0;

        const validationResult: CsvValidationResult = {
          isValid,
          totalRows: validRows.length,
          detectedColumns: cleanColumns,
          suggestedCommentColumn,
          sampleRows: validRows.slice(0, 3),
          errors,
          warnings,
        };

        resolve({ result: validationResult, rawRows: validRows });
      },
      error: (err) => {
        reject(new Error(`Failed to parse CSV file: ${err.message}`));
      },
    });
  });
}
