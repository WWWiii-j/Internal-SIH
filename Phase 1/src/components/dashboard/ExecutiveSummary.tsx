import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Download,
  AlertTriangle,
  Lightbulb,
  ThumbsUp,
  ShieldAlert,
  BarChart,
  Users,
} from 'lucide-react';
import { AnalysisResult } from '../../types';
import { exportExecutivePdfReport } from '../../utils/exportUtils';
import confetti from 'canvas-confetti';

interface ExecutiveSummaryProps {
  result: AnalysisResult;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ result }) => {
  const { summary, stats, fileName } = result;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const fullText = `
EXECUTIVE POLICY BRIEFING: ${fileName}
Generated: ${result.analyzedAt}
Overall Stance: ${summary.overallStance}
Public Sentiment Distribution: ${summary.publicSentimentDistribution}

EXECUTIVE BRIEF:
${summary.executiveBrief}

MAJOR POSITIVE HIGHLIGHTS:
${summary.majorPositiveHighlights.map((h) => `• ${h}`).join('\n')}

MAJOR CONCERNS & OBJECTIONS:
${summary.majorConcerns.map((c) => `• ${c}`).join('\n')}

ACTIONABLE RECOMMENDATIONS:
${summary.actionableRecommendations.map((r) => `• ${r}`).join('\n')}

CRITICAL RISK AREAS:
${summary.criticalRiskAreas.map((k) => `• ${k}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePdfExport = () => {
    exportExecutivePdfReport(result);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
  };

  return (
    <div className="bg-white rounded-xl p-5 sm:p-6 shadow-card border border-sand-300 space-y-5 animate-fade-in">
      {/* Dossier Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-sand-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-forest-100 text-forest-800 border border-forest-300">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-display font-bold text-base sm:text-lg text-forest-950">
                Executive Policy Briefing Dossier
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-sand-200 text-earth-800 px-2 py-0.5 rounded border border-sand-300">
                Official Brief
              </span>
            </div>
            <p className="text-xs text-earth-600">
              Automated synthesis for ministerial review & parliamentary consultation records
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-sand-300 bg-white hover:bg-sand-100 text-xs font-semibold text-earth-800 transition-colors shadow-subtle"
            title="Copy briefing dossier to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-forest-700" />
                <span className="text-forest-800">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-earth-600" />
                <span>Copy Brief</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePdfExport}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-forest-800 hover:bg-forest-700 text-white text-xs font-bold shadow-subtle transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-terracotta-300" />
            <span>Download PDF Brief</span>
          </button>
        </div>
      </div>

      {/* Stance Banner Strip */}
      <div className="p-3.5 rounded-xl bg-forest-50/80 border border-forest-200 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-forest-900 uppercase tracking-wider text-[11px]">
            Overall Public Stance:
          </span>
          <span className="font-bold text-forest-950 px-2 py-0.5 rounded bg-forest-100 border border-forest-300">
            {summary.overallStance}
          </span>
        </div>

        <div className="flex items-center space-x-4 text-earth-700">
          <div className="flex items-center space-x-1.5">
            <BarChart className="w-3.5 h-3.5 text-forest-700" />
            <span>Ratio: <strong className="text-forest-950 font-mono">{summary.publicSentimentDistribution}</strong></span>
          </div>
          <div className="hidden sm:flex items-center space-x-1.5">
            <Users className="w-3.5 h-3.5 text-olive-700" />
            <span>{summary.stakeholderBreakdownText}</span>
          </div>
        </div>
      </div>

      {/* Executive Brief Synthesis Paragraph */}
      <div className="p-4 rounded-xl bg-[#FAF8F3] border border-sand-300 text-xs sm:text-sm text-earth-900 leading-relaxed">
        <p className="font-serif italic text-earth-800">
          "{summary.executiveBrief}"
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        {/* Pillar 1: Major Positives */}
        <div className="p-4 rounded-xl bg-forest-50/60 border border-forest-200 space-y-2">
          <div className="flex items-center space-x-2 text-forest-900 font-bold text-xs">
            <ThumbsUp className="w-4 h-4 text-forest-700" />
            <span>Major Positive Highlights</span>
          </div>
          <ul className="space-y-1.5 text-xs text-forest-950">
            {summary.majorPositiveHighlights.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-1.5">
                <span className="text-forest-700 font-bold">•</span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pillar 2: Major Concerns & Objections */}
        <div className="p-4 rounded-xl bg-terracotta-50/60 border border-terracotta-200 space-y-2">
          <div className="flex items-center space-x-2 text-terracotta-900 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 text-terracotta-700" />
            <span>Major Concerns & Objections</span>
          </div>
          <ul className="space-y-1.5 text-xs text-terracotta-950">
            {summary.majorConcerns.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-1.5">
                <span className="text-terracotta-700 font-bold">•</span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pillar 3: Actionable Policy Suggestions */}
        <div className="p-4 rounded-xl bg-sand-50 border border-sand-300 space-y-2">
          <div className="flex items-center space-x-2 text-earth-900 font-bold text-xs">
            <Lightbulb className="w-4 h-4 text-olive-700" />
            <span>Common Policy Suggestions</span>
          </div>
          <ul className="space-y-1.5 text-xs text-earth-800">
            {summary.actionableRecommendations.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-1.5">
                <span className="text-olive-700 font-bold">•</span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pillar 4: Critical Risk Areas */}
        <div className="p-4 rounded-xl bg-terracotta-100/40 border border-terracotta-300 space-y-2">
          <div className="flex items-center space-x-2 text-terracotta-900 font-bold text-xs">
            <ShieldAlert className="w-4 h-4 text-terracotta-700" />
            <span>Critical Risk Alerts & Hotspots</span>
          </div>
          <ul className="space-y-1.5 text-xs text-terracotta-950">
            {summary.criticalRiskAreas.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-1.5">
                <span className="text-terracotta-700 font-bold">•</span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
