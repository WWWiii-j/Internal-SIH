import React from 'react';
import { Shield, Sparkles, Database, FileSpreadsheet } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-10 mt-16 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 text-white font-bold text-base mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span>Smart India Hackathon 2025</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Problem Statement 25035: "Sentiment analysis of comments received through E-Consultation module".
              Designed to help government committees rapidly synthesize thousands of stakeholder submissions.
            </p>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs border border-slate-700">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>Government of India E-Governance Standard</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Core Capabilities
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li className="flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Multi-clause VADER Sentiment Classification</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Database className="w-3.5 h-3.5 text-blue-400" />
                <span>N-Gram TF-IDF Keyword & Theme Extraction</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-400" />
                <span>Executive Summary & Formal PDF Report Export</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Data Privacy & Security
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              All client-side analysis occurs strictly in-memory without unconsented external data sharing.
              External LLM augmentations are protected using strict API key scoping and secure environment isolation.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2025 E-Consultation Sentiment Analyzer · SIH PS-25035 Solution</p>
          <p className="mt-2 sm:mt-0">Built with React, TypeScript, Tailwind CSS, Recharts & Web NLP Engine</p>
        </div>
      </div>
    </footer>
  );
};
