import React, { useState } from 'react';
import { X, Database, Check, Eye, HelpCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { ColumnProfile, SchemaMappingConfig } from '../../types';

interface SchemaMappingModalProps {
  isOpen: boolean;
  onClose: () => void;
  headers: string[];
  profiles: ColumnProfile[];
  initialMapping: SchemaMappingConfig;
  sampleRows: Record<string, string>[];
  onSaveMapping: (mapping: SchemaMappingConfig) => void;
}

export const SchemaMappingModal: React.FC<SchemaMappingModalProps> = ({
  isOpen,
  onClose,
  headers,
  profiles,
  initialMapping,
  sampleRows,
  onSaveMapping,
}) => {
  const [mapping, setMapping] = useState<SchemaMappingConfig>({ ...initialMapping });
  const [activeTab, setActiveTab] = useState<'mapping' | 'preview'>('mapping');

  if (!isOpen) return null;

  const handleSelectField = (fieldKey: keyof SchemaMappingConfig, value: string) => {
    setMapping((prev) => ({
      ...prev,
      [fieldKey]: value === '__NONE__' ? undefined : value,
    }));
  };

  const handleApply = () => {
    if (!mapping.commentColumn) {
      alert('Please select a valid column containing comment or feedback text.');
      return;
    }
    onSaveMapping(mapping);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF8F3] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-modal border border-sand-300 flex flex-col animate-fade-in">
        {/* Header */}
        <div className="bg-forest-800 p-5 text-white flex items-center justify-between border-b border-forest-900">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-forest-700 text-sage-300 border border-forest-600">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Configure Dataset Schema Mapping
              </h3>
              <p className="text-xs text-sage-300">
                Map raw CSV columns to policy intelligence semantic roles
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-sage-300 hover:text-white hover:bg-forest-700 transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-sand-300 bg-sand-100/70 px-6 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('mapping')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'mapping'
                ? 'border-forest-800 text-forest-950 bg-white rounded-t-lg'
                : 'border-transparent text-earth-600 hover:text-earth-900'
            }`}
          >
            Column Role Mappings
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'preview'
                ? 'border-forest-800 text-forest-950 bg-white rounded-t-lg'
                : 'border-transparent text-earth-600 hover:text-earth-900'
            }`}
          >
            Live Mapped Data Preview ({sampleRows.length} Rows)
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-earth-900">
          {activeTab === 'mapping' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-forest-50/80 border border-forest-200 text-forest-950 text-xs">
                Our schema engine auto-detected roles based on column names and lexical profiles. You can customize any field assignment below.
              </div>

              {/* Grid of Mappings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Comment Text Column (Mandatory) */}
                <div className="p-4 rounded-xl bg-white border-2 border-forest-600/40 shadow-subtle space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-forest-950 flex items-center space-x-1.5">
                      <span>Primary Comment / Feedback Text</span>
                      <span className="text-[10px] text-terracotta-700 bg-terracotta-100 px-1.5 py-0.2 rounded font-bold">
                        Mandatory
                      </span>
                    </label>
                  </div>
                  <p className="text-[11px] text-earth-600">
                    The core narrative feedback evaluated for sentiment, topics, and urgency.
                  </p>
                  <select
                    value={mapping.commentColumn}
                    onChange={(e) => handleSelectField('commentColumn', e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-lg border border-sand-300 bg-white font-medium text-earth-900 focus:ring-2 focus:ring-forest-600"
                  >
                    {headers.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Stakeholder Type Column */}
                <div className="p-4 rounded-xl bg-white border border-sand-300 shadow-subtle space-y-1.5">
                  <label className="font-bold text-forest-950 flex items-center space-x-1.5">
                    <span>Stakeholder Group / Category</span>
                    <span className="text-[10px] text-forest-800 bg-forest-100 px-1.5 py-0.2 rounded">
                      Optional
                    </span>
                  </label>
                  <p className="text-[11px] text-earth-600">
                    Classifies submitters (e.g. Citizen, MSME, Industry, NGO, Academic).
                  </p>
                  <select
                    value={mapping.stakeholderTypeColumn || '__NONE__'}
                    onChange={(e) => handleSelectField('stakeholderTypeColumn', e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-lg border border-sand-300 bg-white font-medium text-earth-900 focus:ring-2 focus:ring-forest-600"
                  >
                    <option value="__NONE__">— None / Not Present (Default to General Public) —</option>
                    {headers.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Organization Column */}
                <div className="p-4 rounded-xl bg-white border border-sand-300 shadow-subtle space-y-1.5">
                  <label className="font-bold text-forest-950 flex items-center space-x-1.5">
                    <span>Organization / Institution Name</span>
                    <span className="text-[10px] text-forest-800 bg-forest-100 px-1.5 py-0.2 rounded">
                      Optional
                    </span>
                  </label>
                  <p className="text-[11px] text-earth-600">
                    Specific company, university, union, or entity representation.
                  </p>
                  <select
                    value={mapping.organizationColumn || '__NONE__'}
                    onChange={(e) => handleSelectField('organizationColumn', e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-lg border border-sand-300 bg-white font-medium text-earth-900 focus:ring-2 focus:ring-forest-600"
                  >
                    <option value="__NONE__">— None / Not Present —</option>
                    {headers.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. Policy Section / Clause Column */}
                <div className="p-4 rounded-xl bg-white border border-sand-300 shadow-subtle space-y-1.5">
                  <label className="font-bold text-forest-950 flex items-center space-x-1.5">
                    <span>Policy Section / Clause Reference</span>
                    <span className="text-[10px] text-forest-800 bg-forest-100 px-1.5 py-0.2 rounded">
                      Optional
                    </span>
                  </label>
                  <p className="text-[11px] text-earth-600">
                    Specific draft section, rule, or clause targeted by the feedback.
                  </p>
                  <select
                    value={mapping.policySectionColumn || '__NONE__'}
                    onChange={(e) => handleSelectField('policySectionColumn', e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-lg border border-sand-300 bg-white font-medium text-earth-900 focus:ring-2 focus:ring-forest-600"
                  >
                    <option value="__NONE__">— None / Not Present (Default to General Policy) —</option>
                    {headers.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 5. Thematic Category Column */}
                <div className="p-4 rounded-xl bg-white border border-sand-300 shadow-subtle space-y-1.5">
                  <label className="font-bold text-forest-950 flex items-center space-x-1.5">
                    <span>Thematic Area / Category</span>
                    <span className="text-[10px] text-forest-800 bg-forest-100 px-1.5 py-0.2 rounded">
                      Optional
                    </span>
                  </label>
                  <p className="text-[11px] text-earth-600">
                    Pre-categorized subject area (e.g. Incentives, Licensing, Compliance).
                  </p>
                  <select
                    value={mapping.categoryColumn || '__NONE__'}
                    onChange={(e) => handleSelectField('categoryColumn', e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-lg border border-sand-300 bg-white font-medium text-earth-900 focus:ring-2 focus:ring-forest-600"
                  >
                    <option value="__NONE__">— None / Not Present —</option>
                    {headers.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 6. Region / State Column */}
                <div className="p-4 rounded-xl bg-white border border-sand-300 shadow-subtle space-y-1.5">
                  <label className="font-bold text-forest-950 flex items-center space-x-1.5">
                    <span>Geographic Region / State</span>
                    <span className="text-[10px] text-forest-800 bg-forest-100 px-1.5 py-0.2 rounded">
                      Optional
                    </span>
                  </label>
                  <p className="text-[11px] text-earth-600">
                    State or territory location of the submitter.
                  </p>
                  <select
                    value={mapping.regionColumn || '__NONE__'}
                    onChange={(e) => handleSelectField('regionColumn', e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-lg border border-sand-300 bg-white font-medium text-earth-900 focus:ring-2 focus:ring-forest-600"
                  >
                    <option value="__NONE__">— None / Not Present —</option>
                    {headers.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 7. Unique ID Column */}
                <div className="p-4 rounded-xl bg-white border border-sand-300 shadow-subtle space-y-1.5">
                  <label className="font-bold text-forest-950 flex items-center space-x-1.5">
                    <span>Submission / Stakeholder ID</span>
                    <span className="text-[10px] text-forest-800 bg-forest-100 px-1.5 py-0.2 rounded">
                      Optional
                    </span>
                  </label>
                  <p className="text-[11px] text-earth-600">
                    Identifier code for citation traceability.
                  </p>
                  <select
                    value={mapping.idColumn || '__NONE__'}
                    onChange={(e) => handleSelectField('idColumn', e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-lg border border-sand-300 bg-white font-medium text-earth-900 focus:ring-2 focus:ring-forest-600"
                  >
                    <option value="__NONE__">— None (Auto-Generate SUB-0001) —</option>
                    {headers.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 8. Timestamp Column */}
                <div className="p-4 rounded-xl bg-white border border-sand-300 shadow-subtle space-y-1.5">
                  <label className="font-bold text-forest-950 flex items-center space-x-1.5">
                    <span>Submission Date / Timestamp</span>
                    <span className="text-[10px] text-forest-800 bg-forest-100 px-1.5 py-0.2 rounded">
                      Optional
                    </span>
                  </label>
                  <p className="text-[11px] text-earth-600">
                    Timestamp for chronological consultation tracking.
                  </p>
                  <select
                    value={mapping.timestampColumn || '__NONE__'}
                    onChange={(e) => handleSelectField('timestampColumn', e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-lg border border-sand-300 bg-white font-medium text-earth-900 focus:ring-2 focus:ring-forest-600"
                  >
                    <option value="__NONE__">— None / Not Present —</option>
                    {headers.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-sand-100 border border-sand-300 text-earth-800 text-xs">
                Preview of how the first {sampleRows.length} rows will be ingested under the current column mapping configuration.
              </div>

              <div className="overflow-x-auto border border-sand-300 rounded-xl bg-white">
                <table className="min-w-full divide-y divide-sand-200 text-[11px]">
                  <thead className="bg-sand-100 text-earth-800 font-bold">
                    <tr>
                      <th className="px-3 py-2 text-left">ID</th>
                      <th className="px-3 py-2 text-left">Stakeholder</th>
                      <th className="px-3 py-2 text-left">Organization</th>
                      <th className="px-3 py-2 text-left">Section</th>
                      <th className="px-3 py-2 text-left">Category</th>
                      <th className="px-3 py-2 text-left min-w-[240px]">Comment Text</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sand-100">
                    {sampleRows.map((row, idx) => (
                      <tr key={idx} className="hover:bg-sand-50/80">
                        <td className="px-3 py-2 font-mono font-bold text-forest-900">
                          {mapping.idColumn ? row[mapping.idColumn] : `SUB-${String(idx + 1).padStart(4, '0')}`}
                        </td>
                        <td className="px-3 py-2 text-earth-700">
                          {mapping.stakeholderTypeColumn ? row[mapping.stakeholderTypeColumn] : 'General Public'}
                        </td>
                        <td className="px-3 py-2 text-earth-600">
                          {mapping.organizationColumn ? row[mapping.organizationColumn] || '—' : '—'}
                        </td>
                        <td className="px-3 py-2 font-medium text-forest-800">
                          {mapping.policySectionColumn ? row[mapping.policySectionColumn] || '—' : '—'}
                        </td>
                        <td className="px-3 py-2 text-earth-600">
                          {mapping.categoryColumn ? row[mapping.categoryColumn] || '—' : '—'}
                        </td>
                        <td className="px-3 py-2 text-earth-900 italic">
                          "{row[mapping.commentColumn] || ''}"
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-sand-100 border-t border-sand-300 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-sand-300 bg-white hover:bg-sand-50 text-earth-800 font-semibold text-xs transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-white font-bold text-xs shadow-sm transition-colors"
          >
            <Check className="w-4 h-4 text-sage-300" />
            <span>Apply Schema Mapping</span>
          </button>
        </div>
      </div>
    </div>
  );
};
