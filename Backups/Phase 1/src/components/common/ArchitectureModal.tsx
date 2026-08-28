import React from 'react';
import { X, Cpu, Layers, GitBranch, Sparkles, CheckCircle2, Server, ShieldCheck } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/30">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg">System Architecture & NLP Pipeline</h3>
              <p className="text-xs text-slate-400">SIH 2025 PS-25035 Technical Deep-Dive</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-sm text-slate-700">
          {/* Pipeline Flow Diagram */}
          <div>
            <h4 className="font-semibold text-slate-900 text-base mb-3 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>End-to-End Processing Pipeline</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-blue-600 uppercase">Stage 1</span>
                <h5 className="font-semibold text-slate-900 mt-1 mb-1">CSV Ingestion</h5>
                <p className="text-xs text-slate-600">
                  PapaParse streaming parser, automatic header detection, UTF-8 normalization, validation heuristics.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-indigo-600 uppercase">Stage 2</span>
                <h5 className="font-semibold text-slate-900 mt-1 mb-1">NLP Engine</h5>
                <p className="text-xs text-slate-600">
                  VADER clause segmentation, governance sentiment lexicon, negation/intensifier weighting.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-emerald-600 uppercase">Stage 3</span>
                <h5 className="font-semibold text-slate-900 mt-1 mb-1">Theme Extraction</h5>
                <p className="text-xs text-slate-600">
                  N-gram TF-IDF weighting, categorical heuristic mapping, word cloud clustering.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-amber-600 uppercase">Stage 4</span>
                <h5 className="font-semibold text-slate-900 mt-1 mb-1">Synthesis & Export</h5>
                <p className="text-xs text-slate-600">
                  Executive Brief generation, Net Stance calculation, interactive Recharts dashboard & PDF exports.
                </p>
              </div>
            </div>
          </div>

          {/* Model & Algorithm Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100">
              <h5 className="font-bold text-blue-900 flex items-center space-x-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                <span>Deterministic Client-Side NLP</span>
              </h5>
              <ul className="space-y-1.5 text-xs text-blue-950/80">
                <li>• Zero-latency local execution in browser memory.</li>
                <li>• Handles legislative vocabulary (e.g. <em>compliance, arbitrary, streamlined, draconian</em>).</li>
                <li>• Negation window awareness prevents false positives (e.g. <em>"not clear"</em>).</li>
                <li>• Normalized tanh score [-1.0, 1.0] with confidence calibration.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-100">
              <h5 className="font-bold text-emerald-900 flex items-center space-x-2 mb-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Pluggable AI & Custom Backends</span>
              </h5>
              <ul className="space-y-1.5 text-xs text-emerald-950/80">
                <li>• Modular connector for Google Gemini 1.5 Flash / OpenAI GPT-4o-mini.</li>
                <li>• Compatible with Python FastAPI backends (HuggingFace RoBERTa / IndicBERT).</li>
                <li>• Automatic graceful fallback ensures 100% demo reliability offline.</li>
                <li>• Configurable via environment variables (<code>.env</code>) or UI settings.</li>
              </ul>
            </div>
          </div>

          {/* ML/Backend Connection Code Guide */}
          <div>
            <h4 className="font-semibold text-slate-900 text-sm mb-2 flex items-center space-x-2">
              <Server className="w-4 h-4 text-slate-700" />
              <span>How to Connect a Real Python ML / FastAPI Backend</span>
            </h4>
            <div className="p-3 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed">
              <span className="text-slate-400"># 1. In your .env file:</span><br />
              <span className="text-emerald-400">VITE_BACKEND_URL</span>=http://localhost:8000/api/analyze<br />
              <span className="text-emerald-400">VITE_GEMINI_API_KEY</span>=AIzaSy...<br /><br />
              <span className="text-slate-400"># 2. Python FastAPI endpoint contract:</span><br />
              <span className="text-blue-400">@app.post</span>(<span className="text-amber-300">"/api/analyze"</span>)<br />
              <span className="text-purple-400">async def</span> <span className="text-yellow-300">analyze_comments</span>(payload: CommentBatch):<br />
              &nbsp;&nbsp;<span className="text-slate-400"># Run HuggingFace pipeline('sentiment-analysis', model='cardiffnlp/twitter-roberta-base-sentiment-latest')</span><br />
              &nbsp;&nbsp;<span className="text-purple-400">return</span> &#123;<span className="text-amber-300">"records"</span>: analyzed_records, <span className="text-amber-300">"summary"</span>: generated_brief&#125;
            </div>
          </div>

          {/* Security Banner */}
          <div className="flex items-center space-x-2 text-xs text-slate-500 bg-slate-100 p-3 rounded-lg border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              <strong>Zero-Trust Architecture:</strong> No citizen or stakeholder data leaves the device unless explicitly routed through an authenticated backend proxy.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 bg-slate-50 flex justify-end rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Close Architecture View
          </button>
        </div>
      </div>
    </div>
  );
};
