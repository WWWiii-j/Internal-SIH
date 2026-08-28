import Papa from 'papaparse';
import { CsvRawParseResult } from '../types';

/**
 * Parses raw CSV string or File object into tabular headers and key-value records
 */
export async function parseRawCsv(
  fileOrText: File | string
): Promise<CsvRawParseResult> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(fileOrText as any, {
      header: true,
      skipEmptyLines: 'greedy',
      dynamicTyping: false,
      delimitersToGuess: [',', '\t', '|', ';'],
      transformHeader: (header: string) => {
        // Strip BOM, zero-width characters, and trim whitespace
        return header.replace(/^[\uFEFF\u200B\u0000]+/, '').trim();
      },
      transform: (value: string) => {
        return typeof value === 'string' ? value.trim() : value;
      },
      complete: (results) => {
        let rawRows = results.data || [];
        const headers = (results.meta.fields || (rawRows.length > 0 ? Object.keys(rawRows[0]) : []))
          .filter((h) => h && h.trim().length > 0);

        const errors: string[] = [];
        const warnings: string[] = [];

        // Handle PapaParse non-fatal vs fatal errors
        if (results.errors && results.errors.length > 0) {
          for (const err of results.errors) {
            if (
              err.code === 'UndetectableDelimiter' ||
              err.type === 'Delimiter' ||
              (err.message && err.message.toLowerCase().includes('auto-detect delimiting character'))
            ) {
              continue;
            }
            errors.push(`Row ${err.row !== undefined ? err.row + 1 : 'Header'}: ${err.message}`);
          }
        }

        if (rawRows.length === 0 && headers.length === 0) {
          errors.push('The uploaded CSV file is empty. Please provide a CSV file containing stakeholder feedback.');
        }

        if (headers.length === 0 && rawRows.length > 0) {
          errors.push('No column headers detected. Ensure the CSV contains a valid header row.');
        }

        resolve({
          data: rawRows,
          headers,
          delimiter: results.meta.delimiter || ',',
          errors,
          warnings,
        });
      },
      error: (err) => {
        reject(new Error(`Failed to parse CSV file: ${err.message}`));
      },
    });
  });
}
