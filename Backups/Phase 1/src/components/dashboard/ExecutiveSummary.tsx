import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Sparkles,
  ThumbsUp,
  AlertTriangle,
  Lightbulb,
  ShieldAlert,
  Download,
  Users
} from 'lucide-react';
import { AnalysisResult } from '../../types';
import { exportExecutivePdfReport } from '../../utils/exportUtils';
import confetti from 'canvas-confetti';

interface ExecutiveSummaryProps {
  result: AnalysisResult;
}

export const ExecutiveSummary: React.FC<ExecutiveSummaryProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);
  const { summary, stats } = result;

  const handleCopy = () => {
    const textToCopy = `EXECUTIVE SUMMARY - E-CONSULTATION FEEDBACK
Dataset: ${result.fileName}
Overall Stance: ${summary.overallStance}
Sentiment Distribution: ${summary.publicSentimentDistribution}

EXECUTIVE BRIEF:
${summary.executiveBrief}

MAJOR POSITIVE HIGHLIGHTS:
${summary.majorPositiveHighlights.map((p) => `• ${p}`).join('\n')}

KEY CONCERNS & FRICTION POINTS:
${summary.majorConcerns.map((c) => `• ${c}`).join('\n')}

ACTIONABLE POLICY RECOMMENDATIONS:
${summary.actionableRecommendations.map((r) => `• ${r}`).join('\n')}

CRITICAL RISK AREAS:
${summary.criticalRiskAreas.map((k) => `• ${k}`).join('\n')}
`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = () => {
    exportExecutivePdfReport(result);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/90 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
              <FileText className="w-4 h-4" />
            </span>
            <h3 className="font-display font-bold text-xl text-slate-900">
              Executive Policy Briefing
            </h3>
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              <span>AI Synthesized</span>
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Synthesized overview prepared for legislative review committees and ministerial leadership.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
            title="Copy Executive Summary"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Text</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadPdf}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-md shadow-slate-900/10"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>Download Official PDF</span>
          </button>
        </div>
      </div>

      {/* Overall Stance Strip */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-blue-300">
            Overall Stakeholder Stance
          </div>
          <div className="text-base sm:text-lg font-bold text-white mt-0.5">
            {summary.overallStance}
          </div>
        </div>
        <div className="sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-white/10">
          <div className="text-[11px] font-medium text-slate-300">
            Distribution Ratio
          </div>
          <div className="text-xs font-mono font-semibold text-emerald-300">
            {summary.publicSentimentDistribution}
          </div>
        </div>
      </div>

      {/* Executive Brief Paragraph */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center space-x-1.5">
          <span>Official Summary & Consultation Context</span>
        </h4>
        <p className="text-slate-700 text-xs sm:text-sm leading-relaxed">
          {summary.executiveBrief}
        </p>
        <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-500 flex items-center space-x-2">
          <Users className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span>{summary.stakeholderBreakdownText}</span>
        </div>
      </div>

      {/* 4 Pillars Grid: Positives, Concerns, Suggestions, Risks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pillar 1: Major Positive Highlights */}
        <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/80">
          <div className="flex items-center space-x-2 mb-3">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <ThumbsUp className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-emerald-900 text-xs sm:text-sm">
              Major Positive Points & Commendations
            </h4>
          </div>
          <ul className="space-y-2 text-xs text-emerald-950">
            {summary.majorPositiveHighlights.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-emerald-600 font-bold mt-0.5">•</span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pillar 2: Major Concerns */}
        <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-200/80">
          <div className="flex items-center space-x-2 mb-3">
            <div className="p-1.5 rounded-lg bg-rose-100 text-rose-800">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-rose-900 text-xs sm:text-sm">
              Major Concerns & Critical Objections
            </h4>
          </div>
          <ul className="space-y-2 text-xs text-rose-950">
            {summary.majorConcerns.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-rose-600 font-bold mt-0.5">•</span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pillar 3: Common Suggestions */}
        <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-200/80">
          <div className="flex items-center space-x-2 mb-3">
            <div className="p-1.5 rounded-lg bg-blue-100 text-blue-800">
              <Lightbulb className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-blue-900 text-xs sm:text-sm">
              Common Suggestions & Policy Ideas
            </h4>
          </div>
          <ul className="space-y-2 text-xs text-blue-950">
            {summary.actionableRecommendations.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-blue-600 font-bold mt-0.5">•</span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pillar 4: Risk Areas */}
        <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80">
          <div className="flex items-center space-x-2 mb-3">
            <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-amber-900 text-xs sm:text-sm">
              Critical Risk & Ambiguity Alerts
            </h4>
          </div>
          <ul className="space-y-2 text-xs text-amber-950">
            {summary.criticalRiskAreas.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-amber-600 font-bold mt-0.5">•</span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
