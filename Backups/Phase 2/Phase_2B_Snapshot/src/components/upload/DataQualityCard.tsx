import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  FileCheck,
  HelpCircle,
  Info,
  Layers,
  Sparkles,
  Users,
} from 'lucide-react';
import { IngestionDiagnostics } from '../../types';

interface DataQualityCardProps {
  diagnostics: IngestionDiagnostics;
}

export const DataQualityCard: React.FC<DataQualityCardProps> = ({ diagnostics }) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-forest-700 bg-forest-100 border-forest-300';
    if (score >= 65) return 'text-olive-700 bg-olive-100 border-olive-300';
    return 'text-terracotta-700 bg-terracotta-100 border-terracotta-300';
  };

  return (
    <div className="bg-white rounded-xl p-5 border border-sand-300 shadow-subtle space-y-4">
      {/* Header with Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-sand-200">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-forest-100 text-forest-800 border border-forest-300">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-display font-bold text-forest-950 text-sm">
              Dataset Ingestion & Quality Diagnostics
            </h4>
            <p className="text-[11px] text-earth-600">
              Deterministic schema validation and noise reduction report
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-earth-600 font-medium">Data Cleanliness Score:</span>
          <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getScoreColor(diagnostics.dataCleanlinessScore)}`}>
            {diagnostics.dataCleanlinessScore} / 100
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-lg bg-sand-50 border border-sand-200">
          <span className="text-earth-500 text-[10px] block font-bold uppercase tracking-wider">
            Ingested Submissions
          </span>
          <span className="text-sm font-bold text-forest-950 font-mono mt-0.5 block">
            {diagnostics.validIngestedRows} <span className="text-[10px] text-earth-500 font-normal">/ {diagnostics.totalRawRows} rows</span>
          </span>
        </div>

        <div className="p-3 rounded-lg bg-sand-50 border border-sand-200">
          <span className="text-earth-500 text-[10px] block font-bold uppercase tracking-wider">
            Repeated / Duplicates
          </span>
          <span className="text-sm font-bold text-earth-900 font-mono mt-0.5 block">
            {diagnostics.exactDuplicateRows + diagnostics.nearDuplicateRows}{' '}
            <span className="text-[10px] text-earth-500 font-normal">
              ({diagnostics.exactDuplicateRows} exact, {diagnostics.nearDuplicateRows} near)
            </span>
          </span>
        </div>

        <div className="p-3 rounded-lg bg-sand-50 border border-sand-200">
          <span className="text-earth-500 text-[10px] block font-bold uppercase tracking-wider">
            Avg Submission Length
          </span>
          <span className="text-sm font-bold text-forest-950 font-mono mt-0.5 block">
            {diagnostics.avgCommentWordCount} <span className="text-[10px] text-earth-500 font-normal">words / comment</span>
          </span>
        </div>

        <div className="p-3 rounded-lg bg-sand-50 border border-sand-200">
          <span className="text-earth-500 text-[10px] block font-bold uppercase tracking-wider">
            Stakeholder Segments
          </span>
          <span className="text-sm font-bold text-forest-950 font-mono mt-0.5 block">
            {Object.keys(diagnostics.stakeholderTypeCounts).length} <span className="text-[10px] text-earth-500 font-normal">distinct groups</span>
          </span>
        </div>
      </div>

      {/* Warnings & Notices */}
      {(diagnostics.warnings.length > 0 || diagnostics.notices.length > 0) && (
        <div className="space-y-2 pt-1">
          {diagnostics.warnings.map((warn, i) => (
            <div key={i} className="flex items-start space-x-2 p-2.5 rounded-lg bg-sand-100 border border-sand-300 text-xs text-earth-800">
              <AlertTriangle className="w-3.5 h-3.5 text-terracotta-600 flex-shrink-0 mt-0.5" />
              <span>{warn}</span>
            </div>
          ))}

          {diagnostics.notices.map((notice, i) => (
            <div key={i} className="flex items-start space-x-2 p-2.5 rounded-lg bg-forest-50 border border-forest-200 text-xs text-forest-900">
              <CheckCircle2 className="w-3.5 h-3.5 text-forest-700 flex-shrink-0 mt-0.5" />
              <span>{notice}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
