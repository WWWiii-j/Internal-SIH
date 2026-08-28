import React from 'react';
import { X, Cpu, Layers, ShieldCheck, CheckCircle2, ArrowRight, Database, FileSpreadsheet, GitBranch, Lightbulb } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const PIPELINE_STAGES = [
    {
      id: '2A',
      title: '2A — Multi-Column Data Ingestion & Schema Profiling',
      status: 'Active (Current Build)',
      desc: 'Parses multi-format CSVs, auto-detects column semantics (comments, stakeholder groups, policy sections, timestamps), cleans raw text, strips control characters, detects duplicate submissions, and outputs normalized structured records.',
      statusColor: 'bg-forest-100 text-forest-900 border-forest-300 font-bold',
    },
    {
      id: '2B',
      title: '2B — Dual-Layer NLP & Dynamic Topic Discovery',
      status: 'Next Stage',
      desc: 'Deploys multi-clause sentiment + stance analysis with unsupervised topic discovery and root cause identification without rigid pre-defined keyword silos.',
      statusColor: 'bg-sand-200 text-earth-800 border-sand-300',
    },
    {
      id: '2C',
      title: '2C — Multi-Factor Policy Priority Engine',
      status: 'Upcoming',
      desc: 'Computes explainable urgency indices combining sentiment intensity, submission frequency, stakeholder representation weight, and policy risk flags.',
      statusColor: 'bg-sand-200 text-earth-800 border-sand-300',
    },
    {
      id: '2D',
      title: '2D — Stakeholder Cross-Tabulation & Stance Matrix',
      status: 'Upcoming',
      desc: 'Segments feedback across Industry, MSMEs, Citizens, Academia, and NGOs to pinpoint demographic consensus and friction points.',
      statusColor: 'bg-sand-200 text-earth-800 border-sand-300',
    },
    {
      id: '2E',
      title: '2E — Grounded AI Policy Insights Engine',
      status: 'Upcoming',
      desc: 'Generates zero-hallucination synthesis strictly constrained to cited consultation feedback and traceable comment IDs.',
      statusColor: 'bg-sand-200 text-earth-800 border-sand-300',
    },
    {
      id: '2F',
      title: '2F — Evidence-Linked Policy Recommendations',
      status: 'Upcoming',
      desc: 'Drafts actionable legislative amendments directly tied to stakeholder pain points and verifiable submission clusters.',
      statusColor: 'bg-sand-200 text-earth-800 border-sand-300',
    },
    {
      id: '2G',
      title: '2G — Interactive Policy Dossier & PDF Export',
      status: 'Upcoming',
      desc: 'Produces comprehensive parliamentary briefs, heatmaps, and downloadable executive dossiers for review committees.',
      statusColor: 'bg-sand-200 text-earth-800 border-sand-300',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF8F3] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-modal border border-sand-300 flex flex-col animate-fade-in">
        {/* Modal Header */}
        <div className="bg-forest-800 p-5 text-white flex items-center justify-between border-b border-forest-900">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-forest-700 text-sage-300 border border-forest-600">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Phase 2 Architecture & Intelligence Roadmap
              </h3>
              <p className="text-xs text-sage-300">
                SIH 2025 PS-25035 · From Basic Sentiment to Policy Decision Intelligence
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-earth-900 text-xs">
          {/* Phase 1 vs Phase 2 Paradigm Shift */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white border border-sand-300">
              <div className="flex items-center space-x-2 text-forest-800 font-bold text-xs uppercase mb-1.5">
                <FileSpreadsheet className="w-4 h-4 text-forest-700" />
                <span>Phase 1 Baseline (Complete)</span>
              </div>
              <p className="text-earth-700 leading-relaxed">
                Focused on <strong>WHAT</strong> stakeholders said: single-column VADER sentiment polarity, N-gram keywords, and executive summary briefs.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-forest-50/80 border border-forest-300">
              <div className="flex items-center space-x-2 text-forest-900 font-bold text-xs uppercase mb-1.5">
                <Lightbulb className="w-4 h-4 text-forest-700" />
                <span>Phase 2 Policy Intelligence (In Progress)</span>
              </div>
              <p className="text-forest-950 leading-relaxed">
                Answers <strong>WHY</strong> they said it, <strong>WHO</strong> expressed it, <strong>WHICH</strong> clauses are high priority, and <strong>WHAT</strong> policy amendments to enact with traceable citations.
              </p>
            </div>
          </div>

          {/* Detailed Roadmap Accordion/List */}
          <div>
            <h4 className="font-display font-bold text-sm text-forest-950 mb-3 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-forest-700" />
              <span>Full Phase 2 Pipeline Roadmap (Phased Implementation)</span>
            </h4>

            <div className="space-y-2.5">
              {PIPELINE_STAGES.map((stage) => (
                <div
                  key={stage.id}
                  className="p-3.5 rounded-xl bg-white border border-sand-300 flex flex-col sm:flex-row sm:items-start justify-between gap-3 hover:border-forest-600 transition-colors"
                >
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-forest-950 text-xs">{stage.title}</span>
                    </div>
                    <p className="text-earth-700 text-[11px] leading-relaxed">{stage.desc}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`inline-block px-2.5 py-1 rounded text-[10px] border ${stage.statusColor}`}>
                      {stage.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Phase 2A Specific Deliverables */}
          <div className="p-4 rounded-xl bg-sand-100/80 border border-sand-300 space-y-2">
            <h5 className="font-bold text-forest-950 text-xs flex items-center space-x-1.5">
              <Database className="w-4 h-4 text-forest-700" />
              <span>Phase 2A Technical Guarantees</span>
            </h5>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-earth-800 text-[11px]">
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest-700 flex-shrink-0" />
                <span>Multi-format CSV & delimiter sniffing</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest-700 flex-shrink-0" />
                <span>Semantic column role inference</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest-700 flex-shrink-0" />
                <span>Interactive column mapping overrides</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest-700 flex-shrink-0" />
                <span>Exact & near-duplicate submission detection</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest-700 flex-shrink-0" />
                <span>Data quality & cleanliness scoring</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest-700 flex-shrink-0" />
                <span>Normalized data schema for 2B–2G stages</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-sand-100 border-t border-sand-300 flex items-center justify-between text-xs">
          <span className="text-earth-600">SIH 2025 · PS-25035 Verified Architecture</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-forest-800 hover:bg-forest-700 text-white font-semibold transition-colors"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
