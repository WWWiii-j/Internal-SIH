import React from 'react';
import { Cpu, KeyRound, RefreshCw, ShieldCheck } from 'lucide-react';
import { isExternalAiConfigured } from '../../services/aiService';

interface NavbarProps {
  hasActiveAnalysis: boolean;
  onReset: () => void;
  onOpenArchitecture: () => void;
  onOpenApiSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  hasActiveAnalysis,
  onReset,
  onOpenArchitecture,
  onOpenApiSettings,
}) => {
  const isAiActive = isExternalAiConfigured();

  return (
    <header className="sticky top-0 z-40 bg-forest-800 border-b border-forest-900 text-earth-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Branding */}
          <div
            className="flex items-center space-x-3 cursor-pointer select-none group"
            onClick={hasActiveAnalysis ? onReset : undefined}
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-forest-700 text-sage-300 shadow-sm ring-1 ring-forest-600/80 group-hover:bg-forest-600 transition-colors">
              <ShieldCheck className="w-5 h-5 text-sage-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <span className="font-display font-bold text-base tracking-tight text-white">
                  E-Consultation <span className="text-sage-400 font-semibold">AI Analytics</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-forest-900 border border-forest-700 text-sage-300 tracking-wide">
                  SIH 2025 · PS-25035
                </span>
              </div>
              <p className="text-[11px] text-sage-300/80 hidden sm:block">
                National Stakeholder Feedback & Sentiment Intelligence Platform
              </p>
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Architecture Modal Trigger */}
            <button
              type="button"
              onClick={onOpenArchitecture}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-forest-700/80 hover:bg-forest-600 text-earth-100 border border-forest-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
              title="View NLP Pipeline Architecture & Verification Details"
            >
              <Cpu className="w-3.5 h-3.5 text-sage-400" />
              <span className="hidden md:inline">Architecture & Pipeline</span>
              <span className="md:hidden">Pipeline</span>
            </button>

            {/* AI Provider Config */}
            <button
              type="button"
              onClick={onOpenApiSettings}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-sage-400 ${
                isAiActive
                  ? 'bg-forest-900 text-sage-300 border-sage-500/50 hover:bg-forest-700'
                  : 'bg-forest-700/80 hover:bg-forest-600 text-earth-200 border-forest-600'
              }`}
              title="Configure NLP Model or Backend URL"
            >
              <KeyRound className="w-3.5 h-3.5 text-sage-400" />
              <span className="hidden sm:inline">{isAiActive ? 'Engine Connected' : 'Model Settings'}</span>
              <span className="sm:hidden">Settings</span>
            </button>

            {/* Reset / New Analysis Action */}
            {hasActiveAnalysis && (
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-terracotta-500 hover:bg-terracotta-600 text-white transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-terracotta-400"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Analyze New File</span>
                <span className="sm:hidden">New CSV</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};


