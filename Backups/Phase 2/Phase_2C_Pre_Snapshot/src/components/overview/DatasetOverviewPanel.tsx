import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Layers,
  Database,
  Users,
  FileCheck2,
  Download,
  RefreshCw,
  SlidersHorizontal,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TableProperties,
  BarChart3,
  GitBranch,
} from 'lucide-react';
import { ConsultationDataset, SchemaMappingConfig } from '../../types';
import { exportDatasetJson, exportNormalizedDatasetCsv } from '../../utils/exportUtils';
import { formatNumber, getStakeholderBadgeClass } from '../../utils/formatters';
import { DataQualityCard } from '../upload/DataQualityCard';
import { IngestedCommentsTable } from './IngestedCommentsTable';
import { SchemaMappingModal } from '../upload/SchemaMappingModal';
import { TopicExplorerSection } from '../topics/TopicExplorerSection';

interface DatasetOverviewPanelProps {
  dataset: ConsultationDataset;
  onReset: () => void;
  onUpdateMapping: (mapping: SchemaMappingConfig) => void;
}

export const DatasetOverviewPanel: React.FC<DatasetOverviewPanelProps> = ({
  dataset,
  onReset,
  onUpdateMapping,
}) => {
  const [activeTab, setActiveTab] = useState<'topics' | 'submissions' | 'schema' | 'diagnostics' | 'roadmap'>('topics');
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);

  const stakeholderCount = Object.keys(dataset.diagnostics.stakeholderTypeCounts).length;
  const sectionCount = Object.keys(dataset.diagnostics.policySectionCounts).length;
  const topicCount = dataset.topicAnalysis?.totalTopics || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fade-in">
      {/* Dossier Header Strip */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-card border border-sand-300 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-forest-100 text-forest-800 border border-forest-300">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-forest-950">
              {dataset.title}
            </h2>
            <span className="text-[11px] font-bold bg-forest-100 text-forest-900 px-2.5 py-0.5 rounded-full border border-forest-300">
              Phase 2B Active · Topic Discovery Complete
            </span>
          </div>
          <p className="text-xs text-earth-600">
            Synthesized <span className="font-semibold text-earth-900">{dataset.comments.length}</span> consultation submissions into{' '}
            <span className="font-semibold text-forest-900">{topicCount} dynamic policy topics</span> from{' '}
            <code className="bg-sand-100 px-1.5 py-0.5 rounded text-earth-800 font-mono font-semibold border border-sand-300">
              {dataset.fileName}
            </code>
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsSchemaModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-sand-300 bg-white hover:bg-sand-100 text-earth-800 text-xs font-semibold shadow-subtle transition-colors"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-forest-700" />
            <span>Schema Mapping</span>
          </button>

          <button
            type="button"
            onClick={() => exportNormalizedDatasetCsv(dataset)}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-sand-300 bg-white hover:bg-sand-100 text-earth-800 text-xs font-semibold shadow-subtle transition-colors"
            title="Export cleaned normalized consultation records as CSV"
          >
            <Download className="w-3.5 h-3.5 text-forest-700" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={() => exportDatasetJson(dataset)}
            className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-xl border border-sand-300 bg-white hover:bg-sand-100 text-earth-800 text-xs font-semibold shadow-subtle transition-colors"
            title="Export full JSON payload with schema mappings and diagnostics"
          >
            <Database className="w-3.5 h-3.5 text-forest-700" />
            <span>Export JSON</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Ingest Another File</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: Ingested Submissions */}
        <div className="bg-white rounded-xl p-4 border border-sand-300 shadow-subtle space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-earth-500">
              Submissions Analyzed
            </span>
            <FileSpreadsheet className="w-4 h-4 text-forest-700" />
          </div>
          <p className="font-display font-extrabold text-2xl text-forest-950">
            {formatNumber(dataset.comments.length)}
          </p>
          <p className="text-[11px] text-earth-600">
            {dataset.diagnostics.droppedEmptyRows > 0 ? `${dataset.diagnostics.droppedEmptyRows} blank rows omitted` : '100% valid submissions'}
          </p>
        </div>

        {/* KPI 2: Dynamic Topics Discovered */}
        <div className="bg-white rounded-xl p-4 border border-sand-300 shadow-subtle space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-earth-500">
              Emergent Themes
            </span>
            <Sparkles className="w-4 h-4 text-forest-700" />
          </div>
          <p className="font-display font-extrabold text-2xl text-forest-950">
            {topicCount}
          </p>
          <p className="text-[11px] text-earth-600 truncate">
            Unsupervised TF-IDF clustering
          </p>
        </div>

        {/* KPI 3: Public Net Stance */}
        <div className="bg-white rounded-xl p-4 border border-sand-300 shadow-subtle space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-earth-500">
              Public Stance Index
            </span>
            <BarChart3 className="w-4 h-4 text-forest-700" />
          </div>
          <p className="font-display font-extrabold text-2xl text-forest-950">
            {dataset.topicAnalysis ? `${dataset.topicAnalysis.sentimentSummary.netStanceScore >= 0 ? '+' : ''}${dataset.topicAnalysis.sentimentSummary.netStanceScore}` : '0'}
          </p>
          <div className="w-full bg-sand-200 h-1.5 rounded-full overflow-hidden flex">
            <div
              className="bg-forest-700 h-full"
              style={{ width: `${dataset.topicAnalysis?.sentimentSummary.positivePercentage || 50}%` }}
            />
            <div
              className="bg-terracotta-600 h-full"
              style={{ width: `${dataset.topicAnalysis?.sentimentSummary.negativePercentage || 50}%` }}
            />
          </div>
        </div>

        {/* KPI 4: Stakeholder Groups */}
        <div className="bg-white rounded-xl p-4 border border-sand-300 shadow-subtle space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-earth-500">
              Stakeholder Groups
            </span>
            <Users className="w-4 h-4 text-forest-700" />
          </div>
          <p className="font-display font-extrabold text-2xl text-forest-950">
            {stakeholderCount}
          </p>
          <p className="text-[11px] text-earth-600 truncate">
            {Object.keys(dataset.diagnostics.stakeholderTypeCounts).slice(0, 2).join(', ')}...
          </p>
        </div>

        {/* KPI 5: Cleanliness Score */}
        <div className="bg-white rounded-xl p-4 border border-sand-300 shadow-subtle space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-earth-500">
              Cleanliness Score
            </span>
            <FileCheck2 className="w-4 h-4 text-forest-700" />
          </div>
          <p className="font-display font-extrabold text-2xl text-forest-950">
            {dataset.diagnostics.dataCleanlinessScore}<span className="text-xs text-earth-500 font-normal"> / 100</span>
          </p>
          <p className="text-[11px] text-earth-600">
            Avg {dataset.diagnostics.avgCommentWordCount} words / comment
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap border-b border-sand-300 bg-sand-100/70 px-4 rounded-xl">
        <button
          type="button"
          onClick={() => setActiveTab('topics')}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors flex items-center space-x-1.5 ${
            activeTab === 'topics'
              ? 'border-forest-800 text-forest-950 bg-white rounded-t-lg shadow-subtle'
              : 'border-transparent text-earth-600 hover:text-earth-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-forest-700" />
          <span>Dynamic Topics & Sentiment ({topicCount})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('submissions')}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors flex items-center space-x-1.5 ${
            activeTab === 'submissions'
              ? 'border-forest-800 text-forest-950 bg-white rounded-t-lg shadow-subtle'
              : 'border-transparent text-earth-600 hover:text-earth-900'
          }`}
        >
          <TableProperties className="w-3.5 h-3.5 text-forest-700" />
          <span>Submissions & Traceability ({dataset.comments.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('schema')}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors flex items-center space-x-1.5 ${
            activeTab === 'schema'
              ? 'border-forest-800 text-forest-950 bg-white rounded-t-lg shadow-subtle'
              : 'border-transparent text-earth-600 hover:text-earth-900'
          }`}
        >
          <Database className="w-3.5 h-3.5 text-forest-700" />
          <span>Schema Profiles ({dataset.columnProfiles.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('diagnostics')}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors flex items-center space-x-1.5 ${
            activeTab === 'diagnostics'
              ? 'border-forest-800 text-forest-950 bg-white rounded-t-lg shadow-subtle'
              : 'border-transparent text-earth-600 hover:text-earth-900'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5 text-forest-700" />
          <span>Quality & Ingestion Diagnostics</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('roadmap')}
          className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors flex items-center space-x-1.5 ${
            activeTab === 'roadmap'
              ? 'border-forest-800 text-forest-950 bg-white rounded-t-lg shadow-subtle'
              : 'border-transparent text-earth-600 hover:text-earth-900'
          }`}
        >
          <GitBranch className="w-3.5 h-3.5 text-forest-700" />
          <span>Pipeline Roadmap</span>
        </button>
      </div>

      {/* Tab 1: Dynamic Topics & Sentiment */}
      {activeTab === 'topics' && dataset.topicAnalysis && (
        <TopicExplorerSection
          analysis={dataset.topicAnalysis}
          comments={dataset.comments}
        />
      )}

      {/* Tab 2: Submissions Explorer */}
      {activeTab === 'submissions' && (
        <IngestedCommentsTable dataset={dataset} />
      )}

      {/* Tab 3: Schema & Column Profiles */}
      {activeTab === 'schema' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 border border-sand-300 shadow-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-sand-200">
              <div>
                <h3 className="font-display font-bold text-base text-forest-950">
                  Dataset Column Profiles & Semantic Inference
                </h3>
                <p className="text-xs text-earth-600">
                  Statistical metrics and role assignments discovered across {dataset.columnProfiles.length} dataset attributes
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsSchemaModalOpen(true)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-forest-800 hover:bg-forest-700 text-white text-xs font-semibold"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Adjust Mappings</span>
              </button>
            </div>

            <div className="overflow-x-auto border border-sand-300 rounded-xl">
              <table className="min-w-full divide-y divide-sand-200 text-xs">
                <thead className="bg-sand-100 text-earth-800 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-3 py-2.5 text-left">Column Name</th>
                    <th className="px-3 py-2.5 text-left">Mapped Semantic Role</th>
                    <th className="px-3 py-2.5 text-left">Data Type</th>
                    <th className="px-3 py-2.5 text-center">Completeness</th>
                    <th className="px-3 py-2.5 text-center">Distinct Values</th>
                    <th className="px-3 py-2.5 text-left">Sample Values</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-100 bg-white">
                  {dataset.columnProfiles.map((col) => (
                    <tr key={col.name} className="hover:bg-sand-50">
                      <td className="px-3 py-2.5 font-mono font-bold text-forest-950 text-xs">
                        {col.name}
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-forest-100 text-forest-900 border border-forest-300">
                          {col.inferredRole}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 font-mono text-[11px] text-earth-700">
                        {col.inferredDataType}
                      </td>
                      <td className="px-3 py-2.5 text-center font-mono text-[11px] text-forest-900 font-bold">
                        {100 - col.nullPercentage}%
                      </td>
                      <td className="px-3 py-2.5 text-center font-mono text-[11px] text-earth-700">
                        {col.uniqueCount}
                      </td>
                      <td className="px-3 py-2.5 text-earth-600 text-[11px] italic truncate max-w-xs">
                        {col.sampleValues.join(', ') || '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Quality & Diagnostics */}
      {activeTab === 'diagnostics' && (
        <div className="space-y-6">
          <DataQualityCard diagnostics={dataset.diagnostics} />

          {/* Demographic Breakdown Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Stakeholder Segment Breakdown */}
            <div className="bg-white rounded-xl p-5 border border-sand-300 shadow-subtle space-y-3">
              <h4 className="font-display font-bold text-forest-950 text-sm flex items-center space-x-2">
                <Users className="w-4 h-4 text-forest-700" />
                <span>Stakeholder Representation Distribution</span>
              </h4>
              <div className="space-y-2">
                {Object.entries(dataset.diagnostics.stakeholderTypeCounts).map(([type, count]) => {
                  const pct = Math.round((count / dataset.comments.length) * 100);
                  return (
                    <div key={type} className="space-y-1 text-xs">
                      <div className="flex justify-between font-semibold text-earth-800">
                        <span>{type}</span>
                        <span className="font-mono text-forest-900 font-bold">
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-sand-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-forest-700 h-full rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Policy Section Coverage Breakdown */}
            <div className="bg-white rounded-xl p-5 border border-sand-300 shadow-subtle space-y-3">
              <h4 className="font-display font-bold text-forest-950 text-sm flex items-center space-x-2">
                <Layers className="w-4 h-4 text-forest-700" />
                <span>Top Policy Sections & Clauses Referenced</span>
              </h4>
              <div className="space-y-2">
                {Object.entries(dataset.diagnostics.policySectionCounts).slice(0, 6).map(([sec, count]) => {
                  const pct = Math.round((count / dataset.comments.length) * 100);
                  return (
                    <div key={sec} className="space-y-1 text-xs">
                      <div className="flex justify-between font-semibold text-earth-800">
                        <span className="truncate max-w-[200px]">{sec}</span>
                        <span className="font-mono text-forest-900 font-bold">
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-sand-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-olive-600 h-full rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Phase 2 Pipeline Roadmap */}
      {activeTab === 'roadmap' && (
        <div className="bg-white rounded-xl p-6 border border-sand-300 shadow-card space-y-6">
          <div className="pb-3 border-b border-sand-200 space-y-1">
            <h3 className="font-display font-bold text-base text-forest-950 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-terracotta-500" />
              <span>Phase 2 Implementation Architecture & Roadmap</span>
            </h3>
            <p className="text-xs text-earth-600">
              Phase 2 transforms consultation feedback analysis into an explainable decision support platform across 8 progressive pipeline stages.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            {/* Phase 2A */}
            <div className="p-4 rounded-xl bg-forest-50 border-2 border-forest-700 text-forest-950 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 font-bold text-sm text-forest-900">
                  <CheckCircle2 className="w-4 h-4 text-forest-700" />
                  <span>Phase 2A — Core & Multi-Column Data Ingestion</span>
                </div>
                <p className="text-earth-800 text-[11px] leading-relaxed">
                  Multi-column CSV parsing, heuristic schema role inference, user-interactive mapping, text sanitization, duplicate discovery, and structured data normalization.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded bg-forest-800 text-white font-bold text-[10px] flex-shrink-0">
                Phase 2A: Complete
              </span>
            </div>

            {/* Phase 2B */}
            <div className="p-4 rounded-xl bg-forest-50 border-2 border-forest-700 text-forest-950 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 font-bold text-sm text-forest-900">
                  <CheckCircle2 className="w-4 h-4 text-forest-700" />
                  <span>Phase 2B — Dynamic Topic Discovery & Thematic Sentiment</span>
                </div>
                <p className="text-earth-800 text-[11px] leading-relaxed">
                  Unsupervised N-Gram TF-IDF topic clustering without fixed keyword lists, multi-clause VADER polarity decomposition, topic sentiment breakdown, and supporting evidence linking.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded bg-forest-800 text-white font-bold text-[10px] flex-shrink-0">
                Phase 2B: Active & Verified
              </span>
            </div>

            {/* Phase 2C */}
            <div className="p-4 rounded-xl bg-white border border-sand-300 text-earth-800 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="font-bold text-earth-900 block">Phase 2C — Multi-Factor Policy Priority Engine</span>
                <p className="text-earth-600 text-[11px]">
                  Explainable urgency scoring combining sentiment intensity, submission density, stakeholder weight, and legislative risk flags.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded bg-sand-200 text-earth-800 font-semibold text-[10px] flex-shrink-0">
                Upcoming (2C)
              </span>
            </div>

            {/* Phase 2D-2G */}
            <div className="p-4 rounded-xl bg-white border border-sand-300 text-earth-800 flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="font-bold text-earth-900 block">Phase 2D to 2G — Decision Support & Policy Dossiers</span>
                <p className="text-earth-600 text-[11px]">
                  Stakeholder cross-tabulation, grounded zero-hallucination AI insights, evidence-linked policy recommendations, and interactive PDF dossiers.
                </p>
              </div>
              <span className="px-2.5 py-1 rounded bg-sand-200 text-earth-800 font-semibold text-[10px] flex-shrink-0">
                Upcoming (2D-2G)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Schema Mapping Modal */}
      <SchemaMappingModal
        isOpen={isSchemaModalOpen}
        onClose={() => setIsSchemaModalOpen(false)}
        headers={dataset.rawHeaders}
        profiles={dataset.columnProfiles}
        initialMapping={dataset.schemaMapping}
        sampleRows={dataset.rawRows.slice(0, 3)}
        onSaveMapping={onUpdateMapping}
      />
    </div>
  );
};
