import React from 'react';
import {
  CheckCircle2,
  Loader2,
  FileSpreadsheet,
  Cpu,
  Sparkles,
  BarChart3,
  Layers,
  FileCheck2,
} from 'lucide-react';
import { ProcessingState, ProcessingStep } from '../../types';

interface ProcessingScreenProps {
  state: ProcessingState;
  totalCommentsCount: number;
  fileName: string;
}

const STEP_LABELS: Record<
  ProcessingStep,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  uploading: { label: 'Reading CSV Data Stream', icon: FileSpreadsheet },
  validating: { label: 'Schema & Column Verification', icon: FileCheck2 },
  extracting: { label: 'Clause Tokenization & Parsing', icon: Layers },
  sentiment: { label: 'VADER Polarity Scoring', icon: Cpu },
  keywords: { label: 'N-Gram & Thematic Extraction', icon: BarChart3 },
  summary: { label: 'Synthesizing Policy Brief', icon: Sparkles },
  ready: { label: 'Preparing Analytics Dossier', icon: CheckCircle2 },
};

const ALL_STEPS: ProcessingStep[] = [
  'uploading',
  'validating',
  'extracting',
  'sentiment',
  'keywords',
  'summary',
  'ready',
];

export const ProcessingScreen: React.FC<ProcessingScreenProps> = ({
  state,
  totalCommentsCount,
  fileName,
}) => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="bg-[#FAF8F3] rounded-2xl p-8 sm:p-10 shadow-modal border border-sand-300 space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-forest-100 text-forest-800 mb-2 border border-forest-300">
            <Loader2 className="w-7 h-7 animate-spin text-forest-800" />
          </div>
          <h3 className="font-display font-extrabold text-xl text-forest-900">
            Processing Stakeholder Feedback
          </h3>
          <p className="text-xs text-earth-600">
            Executing multi-stage NLP pipeline on <span className="font-semibold text-earth-900 font-mono">{fileName}</span>
            {totalCommentsCount > 0 && ` (${totalCommentsCount} submissions)`}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-earth-700">{state.statusMessage}</span>
            <span className="text-forest-800 font-mono font-bold">{state.progress}%</span>
          </div>
          <div className="h-2 w-full bg-sand-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-forest-800 transition-all duration-300 ease-out rounded-full"
              style={{ width: `${state.progress}%` }}
            />
          </div>
        </div>

        {/* Multi-Step Pipeline List */}
        <div className="space-y-2.5 pt-2">
          {ALL_STEPS.map((step) => {
            const isCompleted = state.completedSteps.includes(step);
            const isCurrent = state.currentStep === step && !isCompleted;
            const StepIcon = STEP_LABELS[step].icon;

            return (
              <div
                key={step}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs transition-all ${
                  isCompleted
                    ? 'bg-forest-50/80 border-forest-200 text-forest-900 font-medium'
                    : isCurrent
                    ? 'bg-sand-100 border-sand-400 text-earth-900 font-bold ring-1 ring-forest-700/30'
                    : 'bg-white/60 border-sand-200 text-earth-500 opacity-60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <StepIcon
                    className={`w-4 h-4 ${
                      isCompleted
                        ? 'text-forest-700'
                        : isCurrent
                        ? 'text-forest-800'
                        : 'text-sand-400'
                    }`}
                  />
                  <span>{STEP_LABELS[step].label}</span>
                </div>

                <div>
                  {isCompleted && (
                    <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-forest-800 bg-forest-100 px-2 py-0.5 rounded border border-forest-300">
                      <CheckCircle2 className="w-3 h-3 text-forest-700" />
                      <span>Complete</span>
                    </span>
                  )}
                  {isCurrent && (
                    <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-earth-900 bg-sand-200 px-2 py-0.5 rounded border border-sand-300">
                      <Loader2 className="w-3 h-3 animate-spin text-forest-800" />
                      <span>Running</span>
                    </span>
                  )}
                  {!isCompleted && !isCurrent && (
                    <span className="text-[11px] text-earth-500 font-medium">Pending</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Technical footnote */}
        <div className="mt-6 pt-4 border-t border-sand-200 text-center text-[11px] text-earth-600">
          Deterministic VADER Algorithm · N-Gram Lexicon Processing · SIH 2025 PS-25035
        </div>
      </div>
    </div>
  );
};
