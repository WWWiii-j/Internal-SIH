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
  Database,
  Sliders,
  FolderOpen,
  Check,
  SlidersHorizontal,
  TableProperties
} from 'lucide-react';
import { ColumnProfile, SampleDataset, SchemaMappingConfig } from '../../types';
import { SAMPLE_CONSULTATION_DATASETS } from '../../services/sampleDataService';
import { parseRawCsv } from '../../services/csvParser';
import { profileDatasetColumns } from '../../services/schemaDetector';
import { SchemaMappingModal } from './SchemaMappingModal';

interface ConsultationUploaderProps {
  onIngestDataset: (
    fileName: string,
    rawRows: Record<string, string>[],
    mappingConfig: SchemaMappingConfig,
    title?: string
  ) => void;
}

export const ConsultationUploader: React.FC<ConsultationUploaderProps> = ({
  onIngestDataset,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSample, setSelectedSample] = useState<SampleDataset | null>(null);
  const [activeFileName, setActiveFileName] = useState<string>('');
  const [rawRows, setRawRows] = useState<Record<string, string>[]>([]);
  const [detectedHeaders, setDetectedHeaders] = useState<string[]>([]);
  const [columnProfiles, setColumnProfiles] = useState<ColumnProfile[]>([]);
  const [mappingConfig, setMappingConfig] = useState<SchemaMappingConfig | null>(null);
  const [isMappingModalOpen, setIsMappingModalOpen] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [parseErrors, setParseErrors] = useState<string[]>([]);

  // Drag and Drop handlers
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
    setSelectedSample(null);
    setSelectedFile(file);
    setActiveFileName(file.name);
    setIsLoadingFile(true);
    setParseErrors([]);

    try {
      const { data, headers, errors } = await parseRawCsv(file);
      if (errors.length > 0) {
        setParseErrors(errors);
      }
      setRawRows(data);
      setDetectedHeaders(headers);

      const { profiles, suggestedMapping } = profileDatasetColumns(headers, data);
      setColumnProfiles(profiles);
      setMappingConfig(suggestedMapping);
    } catch (err: any) {
      setParseErrors([err.message || 'Failed to read CSV dataset']);
    } finally {
      setIsLoadingFile(false);
    }
  };

  const handleSelectSampleDataset = async (dataset: SampleDataset) => {
    setSelectedFile(null);
    setSelectedSample(dataset);
    setActiveFileName(`${dataset.id}_consultation.csv`);
    setIsLoadingFile(true);
    setParseErrors([]);

    try {
      const { data, headers, errors } = await parseRawCsv(dataset.csvContent);
      if (errors.length > 0) {
        setParseErrors(errors);
      }
      setRawRows(data);
      setDetectedHeaders(headers);

      const { profiles, suggestedMapping } = profileDatasetColumns(headers, data);
      setColumnProfiles(profiles);
      setMappingConfig(suggestedMapping);
    } catch (err: any) {
      setParseErrors([err.message || 'Failed to parse sample dataset']);
    } finally {
      setIsLoadingFile(false);
    }
  };

  const handleTriggerIngestion = () => {
    if (!mappingConfig || !mappingConfig.commentColumn || rawRows.length === 0) {
      alert('Please select a valid comment column before proceeding.');
      return;
    }
    const customTitle = selectedSample ? selectedSample.title : undefined;
    onIngestDataset(activeFileName, rawRows, mappingConfig, customTitle);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Hero Header */}
      <div className="text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-forest-100 border border-forest-300 text-forest-900 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-forest-700" />
          <span>Smart India Hackathon 2025 · PS-25035 Phase 2</span>
        </div>

        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-forest-900 tracking-tight leading-tight">
          Policy Intelligence & Stakeholder Analytics <br className="hidden sm:inline" />
          <span className="text-forest-700">For E-Consultation Feedback</span>
        </h1>

        <p className="text-earth-700 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
          Ingest multi-stakeholder submissions, infer dataset schema, sanitize text streams, and structure feedback records for explainable policy intelligence.
        </p>

        {/* Phase 2A Pipeline Guarantees */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-left">
          <div className="p-3.5 rounded-xl bg-white border border-sand-300 shadow-subtle">
            <div className="flex items-center space-x-2 text-forest-900 font-bold text-xs uppercase tracking-wider mb-1">
              <Database className="w-3.5 h-3.5 text-forest-700" />
              <span>Multi-Column Ingestion</span>
            </div>
            <p className="text-xs text-earth-700 leading-relaxed">
              Auto-maps comments, stakeholder groups, policy sections, and organizations with manual override flexibility.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-sand-300 shadow-subtle">
            <div className="flex items-center space-x-2 text-forest-900 font-bold text-xs uppercase tracking-wider mb-1">
              <Sliders className="w-3.5 h-3.5 text-forest-700" />
              <span>Duplicate & Noise Detection</span>
            </div>
            <p className="text-xs text-earth-700 leading-relaxed">
              Discovers verbatim repeats, coordinated near-duplicates, and trivial submissions to ensure high-signal policy synthesis.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-sand-300 shadow-subtle">
            <div className="flex items-center space-x-2 text-forest-900 font-bold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-forest-700" />
              <span>Normalized Data Layer</span>
            </div>
            <p className="text-xs text-earth-700 leading-relaxed">
              Clean structured foundation powering topic extraction, priority indexing, and grounded recommendations.
            </p>
          </div>
        </div>
      </div>

      {/* Main Upload Box */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-sand-300 relative space-y-8">
        {/* Section 1: Dropzone */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-bold text-forest-900 text-base flex items-center space-x-2">
              <UploadCloud className="w-4 h-4 text-forest-700" />
              <span>Upload E-Consultation Submissions CSV</span>
            </h3>
            <span className="text-xs text-earth-600 font-medium">Standard CSV · Multi-column support</span>
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
                  Supports consultation datasets with columns for feedback, stakeholder affiliation, and policy clauses
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-1 text-xs text-earth-600">
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-forest-700" />
                  <span>Automatic schema detection</span>
                </span>
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-forest-700" />
                  <span>Data cleanliness diagnostics</span>
                </span>
                <span className="flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-forest-700" />
                  <span>Zero data leakage (100% in-browser)</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Sample Datasets */}
        <div className="pt-6 border-t border-sand-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-display font-bold text-forest-900 text-sm flex items-center space-x-2">
                <span>Or Load High-Impact Government Consultation Datasets</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-sand-200 text-earth-800 font-medium">
                  Instant Test
                </span>
              </h3>
              <p className="text-xs text-earth-600">
                Pre-configured multi-column stakeholder feedback datasets for national policies.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {SAMPLE_CONSULTATION_DATASETS.map((dataset) => {
              const isSelected = selectedSample?.id === dataset.id;
              return (
                <button
                  key={dataset.id}
                  type="button"
                  onClick={() => handleSelectSampleDataset(dataset)}
                  className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-forest-700 bg-forest-50/90 ring-2 ring-forest-600/20 shadow-sm'
                      : 'border-sand-300 hover:border-forest-600 bg-white hover:bg-sand-50/80'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-forest-900 bg-forest-100 px-2 py-0.5 rounded border border-forest-300">
                        {dataset.badge}
                      </span>
                      <span className="text-[11px] font-semibold text-earth-600 font-mono">
                        {dataset.recordCount} rows
                      </span>
                    </div>
                    <h4 className="font-bold text-forest-950 text-xs line-clamp-1 mb-1">
                      {dataset.title}
                    </h4>
                    <p className="text-earth-600 text-[11px] line-clamp-2 leading-relaxed mb-3">
                      {dataset.description}
                    </p>
                  </div>

                  <div className="flex items-center space-x-1 text-xs font-semibold text-forest-800 pt-2 border-t border-sand-200/60">
                    {isSelected ? (
                      <span className="flex items-center space-x-1 text-forest-800 font-bold">
                        <Check className="w-3.5 h-3.5 text-forest-700" />
                        <span>Selected & Verified</span>
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

        {/* Section 3: Schema Detection & Ingestion Confirmation */}
        {mappingConfig && (
          <div className="pt-6 border-t border-sand-200 space-y-4 animate-fade-in">
            {/* Error alerts if any */}
            {parseErrors.length > 0 && (
              <div className="p-4 rounded-xl bg-terracotta-50 border border-terracotta-200 text-terracotta-900 text-xs space-y-1">
                <div className="flex items-center space-x-2 font-bold text-terracotta-950">
                  <AlertCircle className="w-4 h-4 text-terracotta-700" />
                  <span>CSV Ingestion Alerts</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5">
                  {parseErrors.map((e, idx) => (
                    <li key={idx}>{e}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Ingestion Config Card */}
            <div className="bg-sand-100/70 rounded-xl p-5 border border-sand-300 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-sand-200">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-forest-100 text-forest-800 border border-forest-300">
                    <TableProperties className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-forest-950 flex items-center space-x-2">
                      <span>{activeFileName}</span>
                      <span className="text-[10px] font-semibold bg-forest-100 text-forest-800 px-2 py-0.5 rounded border border-forest-300">
                        {rawRows.length} Submissions Found
                      </span>
                    </h4>
                    <p className="text-[11px] text-earth-600">
                      {detectedHeaders.length} columns detected: {detectedHeaders.join(', ')}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMappingModalOpen(true)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-sand-300 bg-white hover:bg-sand-50 text-earth-800 text-xs font-semibold shadow-subtle transition-colors"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-forest-700" />
                  <span>Customize Schema Mapping</span>
                </button>
              </div>

              {/* Detected Mapping Summary Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-white border border-sand-200">
                  <span className="text-[10px] uppercase font-bold text-earth-500 block">
                    Comment Text (Mandatory)
                  </span>
                  <span className="font-semibold text-forest-950 font-mono truncate block mt-0.5">
                    {mappingConfig.commentColumn}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-sand-200">
                  <span className="text-[10px] uppercase font-bold text-earth-500 block">
                    Stakeholder Group
                  </span>
                  <span className="font-semibold text-earth-800 font-mono truncate block mt-0.5">
                    {mappingConfig.stakeholderTypeColumn || '— (Default: Citizen)'}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-sand-200">
                  <span className="text-[10px] uppercase font-bold text-earth-500 block">
                    Policy Section / Clause
                  </span>
                  <span className="font-semibold text-earth-800 font-mono truncate block mt-0.5">
                    {mappingConfig.policySectionColumn || '— (Default: General)'}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-sand-200">
                  <span className="text-[10px] uppercase font-bold text-earth-500 block">
                    Organization / Entity
                  </span>
                  <span className="font-semibold text-earth-800 font-mono truncate block mt-0.5">
                    {mappingConfig.organizationColumn || '— (Optional)'}
                  </span>
                </div>
              </div>

              {/* Sample Comment Snippet */}
              <div className="p-3 bg-white rounded-lg border border-sand-300 text-xs">
                <span className="text-[10px] font-bold uppercase text-earth-500 block mb-1">
                  Sample Submission Preview
                </span>
                <p className="text-earth-900 italic line-clamp-2 text-[11px]">
                  "{rawRows[0]?.[mappingConfig.commentColumn] || 'No preview available'}"
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleTriggerIngestion}
                  className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-700 text-white text-xs font-bold shadow-sm transition-all focus:ring-2 focus:ring-forest-500"
                >
                  <Zap className="w-4 h-4 text-terracotta-400" />
                  <span>Execute Data Ingestion & Quality Diagnostics</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Schema Mapping Modal */}
      {mappingConfig && (
        <SchemaMappingModal
          isOpen={isMappingModalOpen}
          onClose={() => setIsMappingModalOpen(false)}
          headers={detectedHeaders}
          profiles={columnProfiles}
          initialMapping={mappingConfig}
          sampleRows={rawRows.slice(0, 3)}
          onSaveMapping={(newMapping) => setMappingConfig(newMapping)}
        />
      )}
    </div>
  );
};
