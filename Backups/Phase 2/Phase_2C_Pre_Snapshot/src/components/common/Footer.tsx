import React from 'react';
import { Shield, Database, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-forest-900 border-t border-forest-950 text-sand-300 py-10 mt-16 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Column 1: SIH Context */}
          <div>
            <div className="flex items-center space-x-2 text-white font-bold text-base mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-terracotta-400"></span>
              <span>Smart India Hackathon 2025</span>
            </div>
            <p className="text-xs text-sand-300/80 leading-relaxed mb-3">
              Problem Statement 25035: "Sentiment analysis of comments received through E-Consultation module".
              Phase 2 extends basic sentiment classification into an end-to-end Policy Intelligence & Decision Support Platform.
            </p>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-forest-800 text-sand-200 text-xs border border-forest-700">
              <Shield className="w-3.5 h-3.5 text-sage-400" />
              <span>Government of India E-Consultation Standards</span>
            </div>
          </div>

          {/* Column 2: Phase 2 Pipeline Roadmap */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Phase 2 Intelligence Pipeline
            </h4>
            <ul className="space-y-2 text-xs text-sand-300/80">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sage-400 flex-shrink-0" />
                <span className="font-semibold text-white">2A: Multi-Column Schema Ingestion & Normalization</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sand-400 ml-1 mr-1"></span>
                <span>2B: Dynamic Topic Extraction & Root Cause Analysis</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sand-400 ml-1 mr-1"></span>
                <span>2C: Multi-Factor Policy Priority Engine</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-sand-400 ml-1 mr-1"></span>
                <span>2D-2G: Stakeholder Cross-Tab & Grounded Recommendations</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Data Security */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Data Privacy & Explainability
            </h4>
            <p className="text-xs text-sand-300/80 leading-relaxed mb-3">
              Zero-Trust Architecture: Consultation datasets are processed entirely client-side. No proprietary citizen data is leaked to external endpoints without authorization.
            </p>
            <div className="flex items-center space-x-1.5 text-xs text-sand-400">
              <Database className="w-3.5 h-3.5 text-sage-400" />
              <span>Deterministic Data Hygiene & Ingestion Validation</span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-forest-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-sand-400">
          <p>© 2025 National E-Consultation Policy Intelligence Platform · SIH PS-25035 (Phase 2)</p>
          <p className="mt-2 sm:mt-0">React 18 · TypeScript · Tailwind CSS · Earthy Government Palette</p>
        </div>
      </div>
    </footer>
  );
};
