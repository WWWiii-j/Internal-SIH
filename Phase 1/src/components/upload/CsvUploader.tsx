import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  FileText,
  HelpCircle,
  Check,
  FolderOpen
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

  // Handle file drag and drop
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
    setActiveFileName(`${dataset.id}_consultation_sample.csv`);
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* SIH Problem Statement Hero Header */}
      <div className="text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-forest-100 border border-forest-300 text-forest-900 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-forest-700" />
          <span>Smart India Hackathon 2025 · Problem Statement 25035</span>
        </div>

        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-forest-900 tracking-tight leading-tight">
          Sentiment Analysis of Comments Received <br className="hidden sm:inline" />
          <span className="text-forest-700">
            Through E-Consultation Module
          </span>
        </h1>

        <p className="text-earth-700 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
          AI-driven stakeholder feedback intelligence for government ministries and legislative committees.
          Automatically extracts sentiment polarity, high-impact policy themes, critical objections, and executive summaries.
        </p>

        {/* Problem vs Solution Cards for SIH Evaluation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-left">
          <div className="p-4 rounded-xl bg-white border border-sand-300 shadow-subtle">
            <div className="flex items-center space-x-2 text-terracotta-800 font-bold text-xs uppercase tracking-wider mb-1.5">
              <span className="w-2 h-2 rounded-full bg-terracotta-500"></span>
              <span>The Regulatory Challenge</span>
            </div>
            <p className="text-xs text-earth-700 leading-relaxed">
              Public draft bills often attract thousands of extensive, unstructured submissions. Manual review is labor-intensive, slow, and prone to subjective omission.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-sand-300 shadow-subtle">
            <div className="flex items-center space-x-2 text-forest-900 font-bold text-xs uppercase tracking-wider mb-1.5">
              <span className="w-2 h-2 rounded-full bg-forest-600"></span>
              <span>Automated Intelligence Platform</span>
            </div>
            <p className="text-xs text-earth-700 leading-relaxed">
              Deterministic VADER rule engine with clause segmentation processes submissions instantaneously—scoring confidence, tagging key themes, and generating committee briefs.
            </p>
          </div>
        </div>
      </div>

      {/* Main Upload Box */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-sand-300 relative">
        {/* Section 1: File Dropzone */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold text-forest-900 text-base flex items-center space-x-2">
              <UploadCloud className="w-4 h-4 text-forest-700" />
              <span>Upload Consultation Dataset</span>
            </h3>
            <span className="text-xs text-earth-600 font-medium">Standard CSV format</span>
          </div>

          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-150 ${
              dragActive
                ? 'border-forest-700 bg-forest-50/80 ring-4 ring-forest-600/10'
                : 'border-sand-400 hover:border-forest-700 bg-[#FAF8F3]/60 hover:bg-sand-50/80'
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
              <div className="w-12 h-12 rounded-xl bg-forest-800 text-white flex items-center justify-center shadow-sm">
                <FolderOpen className="w-6 h-6 text-sage-300" />
              </div>

              <div>
                <p className="text-sm font-semibold text-forest-950">
                  Click to browse files or drag and drop your CSV here
                </p>
                <p className="text-xs text-earth-600 mt-1">
                  Supports consultation datasets containing stakeholder feedback, suggestions, or comments
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-1 text-xs text-earth-600">
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-forest-700" />
                  <span>Automatic column detection</span>
                </span>
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-forest-700" />
                  <span>Instant sentiment classification</span>
                </span>
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-forest-700" />
                  <span>Executive briefing export</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Sample Datasets Selection */}
        <div className="mt-8 pt-6 border-t border-sand-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-display font-bold text-forest-900 text-sm flex items-center space-x-2">
                <span>Or Load Sample Consultation Datasets</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-sand-200 text-earth-800 font-medium">
                  Instant Test
                </span>
              </h3>
              <p className="text-xs text-earth-600">
                Pre-configured stakeholder feedback files on recent draft policies and legislative initiatives.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {SAMPLE_DATASETS.map((dataset) => {
              const isSelected = selectedDataset?.id === dataset.id;
              return (
                <button
                  key={dataset.id}
                  type="button"
                  onClick={() => handleSelectSampleDataset(dataset)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-forest-700 bg-forest-50/80 ring-2 ring-forest-600/20 shadow-sm'
                      : 'border-sand-300 hover:border-forest-600 bg-white hover:bg-sand-50/80'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-forest-900 bg-forest-100 px-2 py-0.5 rounded border border-forest-300">
                      {dataset.category}
                    </span>
                    <span className="text-xs font-semibold text-earth-600 font-mono">
                      {dataset.commentCount} records
                    </span>
                  </div>
                  <h4 className="font-bold text-forest-950 text-xs line-clamp-1 mb-1">
                    {dataset.title}
                  </h4>
                  <p className="text-earth-600 text-[11px] line-clamp-2 leading-relaxed mb-2.5">
                    {dataset.description}
                  </p>
                  <div className="flex items-center space-x-1 text-xs font-semibold text-forest-800">
                    {isSelected ? (
                      <span className="flex items-center space-x-1 text-forest-800 font-bold">
                        <Check className="w-3.5 h-3.5 text-forest-700" />
                        <span>Ready to Analyze</span>
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
          <div className="mt-8 pt-6 border-t border-sand-200 space-y-4 animate-fade-in">
            {/* Validation Alerts */}
            <ValidationAlert validation={validation} />

            {validation.isValid && (
              <div className="bg-sand-100/60 rounded-xl p-5 border border-sand-300 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-sand-200">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-forest-100 text-forest-800 border border-forest-300">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-forest-950 flex items-center space-x-2">
                        <span>{activeFileName}</span>
                        <span className="text-[10px] font-semibold bg-forest-100 text-forest-800 px-2 py-0.5 rounded border border-forest-300">
                          {validation.totalRows} Submissions Validated
                        </span>
                      </h4>
                      <p className="text-[11px] text-earth-600">
                        {validation.detectedColumns.length} columns detected: {validation.detectedColumns.join(', ')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Column Selector */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block text-xs font-bold text-earth-900 mb-1">
                      Select Column Containing Stakeholder Feedback
                    </label>
                    <select
                      value={selectedCommentCol}
                      onChange={(e) => setSelectedCommentCol(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-sand-300 bg-white font-medium text-earth-900 focus:outline-none focus:ring-2 focus:ring-forest-600 shadow-sm"
                    >
                      {validation.detectedColumns.map((col) => (
                        <option key={col} value={col}>
                          {col} {col === validation.suggestedCommentColumn ? '(Auto-Detected)' : ''}
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-earth-600 mt-1">
                      The chosen column text will be processed through the VADER NLP engine.
                    </p>
                  </div>

                  {/* Sample Snippet Preview */}
                  <div className="p-3 bg-white rounded-lg border border-sand-300 text-xs">
                    <span className="text-[10px] font-bold uppercase text-earth-500 block mb-1">
                      First Submission Preview
                    </span>
                    <p className="text-earth-800 italic line-clamp-2 text-[11px]">
                      "{validation.sampleRows[0]?.[selectedCommentCol] || 'No preview available'}"
                    </p>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleStartAnalysis}
                    className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-lg bg-forest-800 hover:bg-forest-700 text-white text-xs font-bold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-forest-500"
                  >
                    <Zap className="w-4 h-4 text-terracotta-400" />
                    <span>Execute Feedback Analysis</span>
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


