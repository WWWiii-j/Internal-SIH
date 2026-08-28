import React, { useState, useRef, useEffect } from 'react';
import { Download, FileSpreadsheet, FileText, Code2, ChevronDown } from 'lucide-react';
import { AnalysisResult } from '../../types';
import { exportAnalyzedCsv, exportExecutivePdfReport, exportJsonAnalysis } from '../../utils/exportUtils';
import confetti from 'canvas-confetti';

interface ExportDropdownProps {
  result: AnalysisResult;
}

export const ExportDropdown: React.FC<ExportDropdownProps> = ({ result }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExportCsv = () => {
    exportAnalyzedCsv(result);
    setIsOpen(false);
    confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
  };

  const handleExportPdf = () => {
    exportExecutivePdfReport(result);
    setIsOpen(false);
    confetti({ particleCount: 35, spread: 55, origin: { y: 0.8 } });
  };

  const handleExportJson = () => {
    exportJsonAnalysis(result);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md shadow-slate-900/15 transition-all"
      >
        <Download className="w-4 h-4 text-blue-400" />
        <span>Export Analyzed Data</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl bg-white ring-1 ring-black/10 divide-y divide-slate-100 z-50 p-1.5 animate-fade-in">
          <div className="p-1">
            <button
              type="button"
              onClick={handleExportCsv}
              className="w-full group flex items-center space-x-3 px-3 py-2.5 text-xs text-slate-700 hover:bg-emerald-50 hover:text-emerald-900 rounded-xl transition-colors text-left"
            >
              <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 group-hover:bg-emerald-200">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold">Analyzed CSV Dataset</div>
                <div className="text-[10px] text-slate-400 group-hover:text-emerald-700">
                  Includes comment, sentiment, confidence & keywords
                </div>
              </div>
            </button>
          </div>

          <div className="p-1">
            <button
              type="button"
              onClick={handleExportPdf}
              className="w-full group flex items-center space-x-3 px-3 py-2.5 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-900 rounded-xl transition-colors text-left"
            >
              <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700 group-hover:bg-blue-200">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold">Executive Briefing (PDF)</div>
                <div className="text-[10px] text-slate-400 group-hover:text-blue-700">
                  Formal government summary report
                </div>
              </div>
            </button>
          </div>

          <div className="p-1">
            <button
              type="button"
              onClick={handleExportJson}
              className="w-full group flex items-center space-x-3 px-3 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-slate-900 rounded-xl transition-colors text-left"
            >
              <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold">Full JSON Payload</div>
                <div className="text-[10px] text-slate-400">
                  Raw schema for API & database ingestion
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
