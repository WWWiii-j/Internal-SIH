import React from 'react';
import { Cpu, KeyRound, RefreshCw, Layers } from 'lucide-react';
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
    <header className="sticky top-0 z-40 bg-stone-900 border-b border-stone-800 text-stone-100 shadow-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-17">
          {/* Logo & Branding */}
          <div
            className="flex items-center space-x-3 cursor-pointer select-none"
            onClick={hasActiveAnalysis ? onReset : undefined}
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-stone-800 text-stone-100 border border-stone-700">
              <Layers className="w-4 h-4 text-stone-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-bold text-base sm:text-lg tracking-tight text-white">
                  E-Consultation <span className="text-stone-400 font-normal">Analytics</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-stone-800 border border-stone-700 text-stone-300">
                  SIH 2025 · PS-25035
                </span>
              </div>
              <p className="text-[11px] text-stone-400 hidden sm:block">
                Stakeholder Feedback & Sentiment Intelligence Platform
              </p>
            </div>
          </div>

          {/* Actions & Utilities */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Architecture Modal Trigger */}
            <button
              onClick={onOpenArchitecture}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors shadow-sm"
              title="View NLP Pipeline Architecture & Model Details"
            >
              <Cpu className="w-3.5 h-3.5 text-stone-400" />
              <span className="hidden md:inline">Architecture & Pipeline</span>
              <span className="md:hidden">Pipeline</span>
            </button>

            {/* AI Provider Config */}
            <button
              onClick={onOpenApiSettings}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors shadow-sm ${
                isAiActive
                  ? 'bg-stone-800 text-emerald-300 border-stone-700 hover:bg-stone-700'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border-stone-700'
              }`}
              title="Configure Model or Backend"
            >
              <KeyRound className="w-3.5 h-3.5 text-stone-400" />
              <span className="hidden sm:inline">{isAiActive ? 'Engine Configured' : 'Model Settings'}</span>
            </button>

            {/* Start New Analysis Button */}
            {hasActiveAnalysis && (
              <button
                onClick={onReset}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-white text-stone-900 transition-colors shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Upload CSV</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
