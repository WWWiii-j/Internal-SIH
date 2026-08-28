import React, { useState, useRef, useEffect } from 'react';
import { Download, FileSpreadsheet, FileText, Code, ChevronDown } from 'lucide-react';
import { AnalysisResult } from '../../types';
import {
  exportAnalyzedCsv,
  exportJsonAnalysis,
  exportExecutivePdfReport,
} from '../../utils/exportUtils';
import confetti from 'canvas-confetti';

interface ExportDropdownProps {
  result: AnalysisResult;
}

export const ExportDropdown: React.FC<ExportDropdownProps> = ({ result }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCsvExport = () => {
    exportAnalyzedCsv(result);
    setIsOpen(false);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
  };

  const handlePdfExport = () => {
    exportExecutivePdfReport(result);
    setIsOpen(false);
    confetti({ particleCount: 45, spread: 60, origin: { y: 0.8 } });
  };

  const handleJsonExport = () => {
    exportJsonAnalysis(result);
    setIsOpen(false);
    confetti({ particleCount: 25, spread: 45, origin: { y: 0.8 } });
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-white text-xs font-bold shadow-card transition-all focus:outline-none focus:ring-2 focus:ring-forest-500"
      >
        <Download className="w-3.5 h-3.5 text-terracotta-300" />
        <span>Export Findings</span>
        <ChevronDown className="w-3.5 h-3.5 opacity-70" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-[#FAF8F3] shadow-modal border border-sand-300 py-2 z-50 animate-fade-in">
          <div className="px-3 py-1.5 border-b border-sand-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-earth-600 block">
              Consultation Data Exports
            </span>
          </div>

          <div className="py-1">
            <button
              type="button"
              onClick={handlePdfExport}
              className="w-full text-left px-3.5 py-2.5 hover:bg-sand-100 flex items-start space-x-3 transition-colors group"
            >
              <div className="p-1.5 rounded-lg bg-terracotta-100 text-terracotta-800 mt-0.5">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-earth-950 group-hover:text-terracotta-900">
                  Official PDF Briefing
                </div>
                <div className="text-[11px] text-earth-600">
                  Structured executive report for committee review
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={handleCsvExport}
              className="w-full text-left px-3.5 py-2.5 hover:bg-sand-100 flex items-start space-x-3 transition-colors group"
            >
              <div className="p-1.5 rounded-lg bg-forest-100 text-forest-800 mt-0.5">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-earth-950 group-hover:text-forest-900">
                  Enriched CSV Dataset
                </div>
                <div className="text-[11px] text-earth-600">
                  Includes raw text, scores, sentiment & tags
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={handleJsonExport}
              className="w-full text-left px-3.5 py-2.5 hover:bg-sand-100 flex items-start space-x-3 transition-colors group"
            >
              <div className="p-1.5 rounded-lg bg-olive-100 text-olive-800 mt-0.5">
                <Code className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-earth-950 group-hover:text-olive-900">
                  Schema JSON Payload
                </div>
                <div className="text-[11px] text-earth-600">
                  Full programmatic API payload & statistics
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
