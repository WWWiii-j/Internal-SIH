import React from 'react';
import { X, Cpu, Layers, CheckCircle2, Server, ShieldCheck, Database, Zap, FileSpreadsheet, Bot } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF8F3] rounded-2xl shadow-modal max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-sand-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-forest-900 bg-forest-800 text-white rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-forest-700 text-sage-300 border border-forest-600">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">System Architecture & NLP Pipeline</h3>
              <p className="text-xs text-sage-300/80">SIH 2025 PS-25035 Technical Specification</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-sage-300 hover:text-white hover:bg-forest-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-sm text-earth-800">
          {/* Pipeline Flow Diagram */}
          <div>
            <h4 className="font-semibold text-forest-800 text-sm mb-3 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-forest-600" />
              <span>Multi-Stage Feedback Processing Pipeline</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-white border border-sand-200 shadow-subtle">
                <span className="text-[10px] font-bold text-forest-800 uppercase tracking-wider bg-forest-100 px-2 py-0.5 rounded">Stage 1</span>
                <h5 className="font-semibold text-earth-800 mt-2 mb-1 text-xs">CSV Ingestion</h5>
                <p className="text-[11px] text-earth-600 leading-relaxed">
                  PapaParse stream reader, UTF-8 normalization, auto column detection & schema validation heuristics.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-sand-200 shadow-subtle">
                <span className="text-[10px] font-bold text-olive-800 uppercase tracking-wider bg-olive-100 px-2 py-0.5 rounded">Stage 2</span>
                <h5 className="font-semibold text-earth-800 mt-2 mb-1 text-xs">NLP VADER Engine</h5>
                <p className="text-[11px] text-earth-600 leading-relaxed">
                  Lexical polarity scoring, clause segmentation, governance vocabulary dictionary, negation windowing.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-sand-200 shadow-subtle">
                <span className="text-[10px] font-bold text-sage-800 uppercase tracking-wider bg-sage-200 px-2 py-0.5 rounded">Stage 3</span>
                <h5 className="font-semibold text-earth-800 mt-2 mb-1 text-xs">Thematic Extraction</h5>
                <p className="text-[11px] text-earth-600 leading-relaxed">
                  N-Gram TF-IDF statistical weighting, stopword filtering, thematic category assignment.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-sand-200 shadow-subtle">
                <span className="text-[10px] font-bold text-terracotta-800 uppercase tracking-wider bg-terracotta-100 px-2 py-0.5 rounded">Stage 4</span>
                <h5 className="font-semibold text-earth-800 mt-2 mb-1 text-xs">Policy Synthesis</h5>
                <p className="text-[11px] text-earth-600 leading-relaxed">
                  Executive Brief generation, Net Stance calculation, structured PDF report & analytics dashboard.
                </p>
              </div>
            </div>
          </div>

          {/* Model & Algorithm Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-white border border-sand-200 shadow-subtle">
              <h5 className="font-bold text-forest-800 flex items-center space-x-2 mb-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-forest-600" />
                <span>Deterministic In-Browser NLP</span>
              </h5>
              <ul className="space-y-1.5 text-xs text-earth-700">
                <li>• Zero-latency local execution in client memory (no backend lag).</li>
                <li>• Custom governance & legislative lexicon dictionary.</li>
                <li>• Negation and booster awareness (e.g. <em>"not compliant"</em> vs <em>"fully compliant"</em>).</li>
                <li>• Calibrated confidence metric and normalized polarity [-1.0, 1.0].</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-white border border-sand-200 shadow-subtle">
              <h5 className="font-bold text-forest-800 flex items-center space-x-2 mb-2 text-xs">
                <Bot className="w-4 h-4 text-olive-600" />
                <span>Pluggable Enterprise Backend Connector</span>
              </h5>
              <ul className="space-y-1.5 text-xs text-earth-700">
                <li>• Modular connector for Google Gemini 1.5 Flash or OpenAI models.</li>
                <li>• REST API contract ready for Python FastAPI / HuggingFace RoBERTa.</li>
                <li>• Graceful fallback ensures offline demo readiness.</li>
                <li>• Zero-data-retention security model.</li>
              </ul>
            </div>
          </div>

          {/* Code Guide */}
          <div>
            <h4 className="font-semibold text-earth-800 text-xs uppercase tracking-wider mb-2 flex items-center space-x-2">
              <Server className="w-4 h-4 text-forest-700" />
              <span>Python FastAPI / Backend Microservice Contract</span>
            </h4>
            <div className="p-3.5 bg-forest-950 text-sand-100 rounded-xl font-mono text-xs overflow-x-auto leading-relaxed border border-forest-900">
              <span className="text-sand-400"># 1. In your .env file:</span><br />
              <span className="text-sage-300">VITE_BACKEND_URL</span>=http://localhost:8000/api/analyze<br /><br />
              <span className="text-sand-400"># 2. FastAPI endpoint implementation:</span><br />
              <span className="text-terracotta-300">@app.post</span>(<span className="text-sand-200">"/api/analyze"</span>)<br />
              <span className="text-sage-300">async def</span> <span className="text-sand-100">analyze_consultation</span>(payload: ConsultationPayload):<br />
              &nbsp;&nbsp;<span className="text-sand-400"># Transformer pipeline('sentiment-analysis', model='cardiffnlp/twitter-roberta-base-sentiment-latest')</span><br />
              &nbsp;&nbsp;<span className="text-sage-300">return</span> &#123;<span className="text-sand-200">"records"</span>: records, <span className="text-sand-200">"summary"</span>: executive_brief&#125;
            </div>
          </div>

          {/* Security Banner */}
          <div className="flex items-center space-x-2.5 text-xs text-earth-700 bg-sand-100/70 p-3.5 rounded-xl border border-sand-200">
            <ShieldCheck className="w-4 h-4 text-forest-700 flex-shrink-0" />
            <span>
              <strong>Zero-Trust Architecture:</strong> Feedback submissions remain strictly on your machine unless an authenticated API endpoint is explicitly configured.
            </span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-sand-200 bg-sand-100/50 flex justify-end rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-forest-800 hover:bg-forest-700 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Close Architecture View
          </button>
        </div>
      </div>
    </div>
  );
};


