import React from 'react';
import { Cpu, RefreshCw, ShieldCheck, Database, Layers } from 'lucide-react';
import { ConsultationDataset } from '../../types';

interface NavbarProps {
  dataset: ConsultationDataset | null;
  onReset: () => void;
  onOpenArchitecture: () => void;
  onReconfigureSchema?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  dataset,
  onReset,
  onOpenArchitecture,
  onReconfigureSchema,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-forest-800 border-b border-forest-900 text-earth-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & SIH Badge */}
          <div
            className="flex items-center space-x-3 cursor-pointer select-none group"
            onClick={dataset ? onReset : undefined}
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-forest-700 text-sage-300 shadow-sm ring-1 ring-forest-600/80 group-hover:bg-forest-600 transition-colors">
              <ShieldCheck className="w-5 h-5 text-sage-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2.5">
                <span className="font-display font-bold text-base tracking-tight text-white">
                  Policy Intelligence <span className="text-sage-400 font-semibold">& Decision Platform</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-forest-900 border border-forest-700 text-sage-300 tracking-wide">
                  Phase 2A · SIH PS-25035
                </span>
              </div>
              <p className="text-[11px] text-sage-300/80 hidden sm:block">
                National E-Consultation Module Feedback Ingestion & Analysis System
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Schema Reconfiguration Button if dataset active */}
            {dataset && onReconfigureSchema && (
              <button
                type="button"
                onClick={onReconfigureSchema}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-forest-700/80 hover:bg-forest-600 text-earth-100 border border-forest-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
                title="Adjust column mapping and schema configuration"
              >
                <Database className="w-3.5 h-3.5 text-sage-400" />
                <span className="hidden md:inline">Schema Mapping</span>
                <span className="md:hidden">Schema</span>
              </button>
            )}

            {/* Architecture Modal Trigger */}
            <button
              type="button"
              onClick={onOpenArchitecture}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-forest-700/80 hover:bg-forest-600 text-earth-100 border border-forest-600 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
              title="View Phase 2 Multi-Stage Pipeline Architecture"
            >
              <Cpu className="w-3.5 h-3.5 text-sage-400" />
              <span className="hidden sm:inline">Platform Architecture</span>
              <span className="sm:hidden">Architecture</span>
            </button>

            {/* Ingestion Reset Button */}
            {dataset && (
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-terracotta-500 hover:bg-terracotta-600 text-white transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-terracotta-400"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Ingest New Dataset</span>
                <span className="sm:hidden">New CSV</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
