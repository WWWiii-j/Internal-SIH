import React from 'react';
import { CheckCircle2, Loader2, Sparkles, Database, FileText, BarChart2, ShieldCheck, Zap } from 'lucide-react';
import { ProcessingState, ProcessingStep } from '../../types';

interface ProcessingScreenProps {
  state: ProcessingState;
  totalCommentsCount: number;
  fileName: string;
}

interface StepItem {
  id: ProcessingStep;
  label: string;
  subLabel: string;
  icon: React.ElementType;
}

const STEPS: StepItem[] = [
  { id: 'uploading', label: 'Uploading data...', subLabel: 'Ingesting CSV byte stream into memory', icon: Database },
  { id: 'validating', label: 'CSV validated', subLabel: 'Column schema and encoding verified', icon: ShieldCheck },
  { id: 'extracting', label: 'Comments extracted', subLabel: 'Tokenizing text clauses and metadata', icon: FileText },
  { id: 'sentiment', label: 'Sentiment analysis', subLabel: 'Running multi-clause VADER polarity engine', icon: Zap },
  { id: 'keywords', label: 'Keyword extraction', subLabel: 'Computing N-gram TF-IDF & frequency weights', icon: BarChart2 },
  { id: 'summary', label: 'Generating insights', subLabel: 'Synthesizing executive briefing & policy recommendations', icon: Sparkles },
  { id: 'ready', label: 'Preparing dashboard', subLabel: 'Building interactive charts and visualizations', icon: CheckCircle2 },
];

export const ProcessingScreen: React.FC<ProcessingScreenProps> = ({
  state,
  totalCommentsCount,
  fileName,
}) => {
  const currentStepIndex = STEPS.findIndex((s) => s.id === state.currentStep);

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-200/80">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/10 text-blue-600 mb-4 border border-blue-200 animate-pulse-subtle">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
          <h2 className="font-display font-bold text-2xl text-slate-900">
            Analyzing E-Consultation Feedback
          </h2>
          <p className="text-sm text-slate-500 mt-1.5">
            Processing <span className="font-semibold text-slate-800">{fileName}</span> ({totalCommentsCount} submissions)
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center text-xs font-semibold text-slate-600 mb-2">
            <span className="text-blue-700">{state.statusMessage}</span>
            <span className="font-mono text-slate-800">{Math.round(state.progress)}%</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.max(5, state.progress)}%` }}
            />
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-3">
          {STEPS.map((step, idx) => {
            const isCompleted = state.completedSteps.includes(step.id) || idx < currentStepIndex;
            const isCurrent = step.id === state.currentStep;
            const isPending = !isCompleted && !isCurrent;
            const Icon = step.icon;

            return (
              <div
                key={step.id}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-blue-50/70 border-blue-300 shadow-sm'
                    : isCompleted
                    ? 'bg-slate-50/70 border-slate-200'
                    : 'bg-transparent border-transparent opacity-40'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-lg ${
                      isCompleted
                        ? 'bg-emerald-100 text-emerald-700'
                        : isCurrent
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h4
                      className={`text-xs font-semibold ${
                        isCurrent
                          ? 'text-blue-900 font-bold'
                          : isCompleted
                          ? 'text-slate-800'
                          : 'text-slate-500'
                      }`}
                    >
                      {step.label}
                    </h4>
                    <p className="text-[11px] text-slate-500">{step.subLabel}</p>
                  </div>
                </div>

                <div>
                  {isCompleted && (
                    <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Done
                    </span>
                  )}
                  {isCurrent && (
                    <span className="text-[11px] font-semibold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-md animate-pulse">
                      In Progress
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* SIH Note */}
        <div className="mt-8 text-center text-xs text-slate-400">
          Powered by Local NLP VADER Algorithm & Executive Synthesis Engine
        </div>
      </div>
    </div>
  );
};
