import React from 'react';
import { Shield, Sparkles, Database, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

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
              Engineered to assist parliamentary committees and ministries in synthesizing large volumes of public and industry feedback.
            </p>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-forest-800 text-sand-200 text-xs border border-forest-700">
              <Shield className="w-3.5 h-3.5 text-sage-400" />
              <span>Government of India E-Consultation Standard</span>
            </div>
          </div>

          {/* Column 2: Capabilities */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              NLP Engine Capabilities
            </h4>
            <ul className="space-y-2 text-xs text-sand-300/80">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sage-400 flex-shrink-0" />
                <span>Multi-Clause VADER Rule-Based Polarity Scoring</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-sand-300 flex-shrink-0" />
                <span>N-Gram Keyword Extraction & Governance Clustering</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-terracotta-300 flex-shrink-0" />
                <span>Executive Policy Brief & Official PDF Export</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Data Security */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Data Privacy & Security
            </h4>
            <p className="text-xs text-sand-300/80 leading-relaxed">
              Zero-Trust Architecture: Analysis executes strictly in-memory within client environment.
              Sensitive citizen submissions are never transmitted to unverified third-party endpoints.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-forest-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-sand-400">
          <p>© 2025 National E-Consultation Feedback Analyzer · SIH PS-25035</p>
          <p className="mt-2 sm:mt-0">React · TypeScript · Tailwind CSS · Recharts · In-Browser NLP</p>
        </div>
      </div>
    </footer>
  );
};


