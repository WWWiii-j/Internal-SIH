import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  FileText,
  HelpCircle,
  Check
} from 'lucide-react';
import { CsvValidationResult, SampleDatasetInfo } from '../../types';
import { SAMPLE_DATASETS } from '../../services/sampleDataService';
import { parseAndValidateCsv } from '../../services/csvParser';
import { ValidationAlert } from './ValidationAlert';

interface CsvUploaderProps {
  onFileValidated: (
    fileOrContent: File | string,
    fileName: string,
    rawRows: Record<string, string>[],
    commentColumn: string
  ) => void;
}

export const CsvUploader: React.FC<CsvUploaderProps> = ({ onFileValidated }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedDataset, setSelectedDataset] = useState<SampleDatasetInfo | null>(null);
  const [activeFileName, setActiveFileName] = useState<string>('');
  const [validation, setValidation] = useState<CsvValidationResult | null>(null);
  const [rawRows, setRawRows] = useState<Record<string, string>[]>([]);
  const [selectedCommentCol, setSelectedCommentCol] = useState<string>('');
  const [isValidating, setIsValidating] = useState(false);

  // Handle file drop
  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
        alert('Please upload a valid .csv file format.');
        return;
      }
      processFile(file);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (file: File) => {
    setSelectedDataset(null);
    setSelectedFile(file);
    setActiveFileName(file.name);
    setIsValidating(true);

    try {
      const { result, rawRows: rows } = await parseAndValidateCsv(file);
      setValidation(result);
      setRawRows(rows);
      if (result.suggestedCommentColumn) {
        setSelectedCommentCol(result.suggestedCommentColumn);
      }
    } catch (err: any) {
      setValidation({
        isValid: false,
        totalRows: 0,
        detectedColumns: [],
        suggestedCommentColumn: null,
        sampleRows: [],
        errors: [err.message || 'Failed to read CSV file'],
        warnings: [],
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleSelectSampleDataset = async (dataset: SampleDatasetInfo) => {
    setSelectedFile(null);
    setSelectedDataset(dataset);
    setActiveFileName(`${dataset.id}_sample_consultation.csv`);
    setIsValidating(true);

    try {
      const { result, rawRows: rows } = await parseAndValidateCsv(dataset.csvContent);
      setValidation(result);
      setRawRows(rows);
      if (result.suggestedCommentColumn) {
        setSelectedCommentCol(result.suggestedCommentColumn);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsValidating(false);
    }
  };

  const handleStartAnalysis = () => {
    if (!validation || !validation.isValid || !selectedCommentCol) return;

    if (selectedFile) {
      onFileValidated(selectedFile, activeFileName, rawRows, selectedCommentCol);
    } else if (selectedDataset) {
      onFileValidated(selectedDataset.csvContent, activeFileName, rawRows, selectedCommentCol);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* SIH Problem Statement Hero Header */}
      <div className="text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Smart India Hackathon 2025 · Problem Statement 25035</span>
        </div>

        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-slate-900 tracking-tight leading-tight">
          AI-Powered E-Consultation <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-indigo-600 to-teal-600">
            Feedback Analysis
          </span>
        </h1>

        <p className="text-slate-600 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
          Analyze stakeholder feedback at scale using sentiment analysis, keyword extraction and AI-powered insights.
          Transform unorganized citizen and industry commentary into actionable legislative intelligence.
        </p>

        {/* Problem vs Solution Cards for SIH Judges */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 text-left">
          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200/80">
            <div className="flex items-center space-x-2 text-rose-800 font-bold text-xs uppercase tracking-wider mb-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>The Problem</span>
            </div>
            <p className="text-xs text-rose-950/80 leading-relaxed">
              Draft bills receive thousands of long stakeholder submissions. Manual review is slow, prone to bias, and delays policy finalization.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
            <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Our AI Solution</span>
            </div>
            <p className="text-xs text-emerald-950/80 leading-relaxed">
              Automated NLP pipeline parses thousands of comments in seconds—extracting polarity, confidence scores, thematic clusters, and government executive briefs.
            </p>
          </div>
        </div>
      </div>

      {/* Main Upload / Select Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/90 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-blue-100/40 to-transparent rounded-full pointer-events-none -mr-16 -mt-16" />

        {/* Section 1: File Dropzone */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
            dragActive
              ? 'border-blue-500 bg-blue-50/80 ring-4 ring-blue-500/10'
              : 'border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-slate-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileInput}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/25">
              <UploadCloud className="w-7 h-7" />
            </div>

            <div>
              <p className="text-base font-semibold text-slate-800">
                Drag and drop your consultation CSV here, or{' '}
                <span className="text-blue-600 hover:underline">browse files</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Supports standard CSV files containing feedback, comment, or suggestion columns
              </p>
            </div>

            <div className="flex items-center space-x-4 pt-1 text-xs text-slate-400">
              <span className="flex items-center space-x-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span>Auto-column detection</span>
              </span>
              <span className="flex items-center space-x-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span>Instant NLP scoring</span>
              </span>
              <span className="flex items-center space-x-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                <span>Executive briefing</span>
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Sample Datasets Selection */}
        <div className="mt-8 pt-8 border-t border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-slate-900 text-base flex items-center space-x-2">
                <span>Or Try Sample Consultation Datasets</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                  Instant Demo
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Realistic stakeholder feedback on recent draft policies and legislative frameworks.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {SAMPLE_DATASETS.map((dataset) => {
              const isSelected = selectedDataset?.id === dataset.id;
              return (
                <button
                  key={dataset.id}
                  type="button"
                  onClick={() => handleSelectSampleDataset(dataset)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-md'
                      : 'border-slate-200 hover:border-blue-300 bg-white hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded-md">
                      {dataset.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {dataset.commentCount} comments
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1 mb-1">
                    {dataset.title}
                  </h4>
                  <p className="text-slate-500 text-[11px] line-clamp-2 leading-relaxed mb-3">
                    {dataset.description}
                  </p>
                  <div className="flex items-center space-x-1 text-xs font-semibold text-blue-600">
                    {isSelected ? (
                      <span className="flex items-center space-x-1 text-emerald-600 font-bold">
                        <Check className="w-3.5 h-3.5" />
                        <span>Selected</span>
                      </span>
                    ) : (
                      <span>Load Dataset →</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3: Validation & Column Configuration */}
        {validation && (
          <div className="mt-8 pt-8 border-t border-slate-200/80 space-y-6 animate-fade-in">
            {/* Validation Alerts (if any errors or warnings) */}
            <ValidationAlert validation={validation} />

            {validation.isValid && (
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                        <span>{activeFileName}</span>
                        <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                          Validated ({validation.totalRows} valid comments)
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {validation.detectedColumns.length} columns detected: {validation.detectedColumns.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Column Selector */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Select Column Containing Stakeholder Comments
                    </label>
                    <select
                      value={selectedCommentCol}
                      onChange={(e) => setSelectedCommentCol(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    >
                      {validation.detectedColumns.map((col) => (
                        <option key={col} value={col}>
                          {col} {col === validation.suggestedCommentColumn ? '(Auto-Detected)' : ''}
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Choose which column holds the text to be analyzed for sentiment and keywords.
                    </p>
                  </div>

                  {/* Sample Snippet Preview */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                      Sample Comment Preview
                    </span>
                    <p className="text-slate-700 italic line-clamp-2 text-[11px]">
                      "{validation.sampleRows[0]?.[selectedCommentCol] || 'No preview available'}"
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleStartAnalysis}
                    className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 text-white text-sm font-bold shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <span>Analyze Consultation Feedback</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
