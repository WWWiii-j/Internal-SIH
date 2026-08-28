import React from 'react';
import { MessageSquare, ThumbsUp, ThumbsDown, Minus, Target, Award, TrendingUp, TrendingDown } from 'lucide-react';
import { AnalysisStatistics } from '../../types';
import { formatPercentage, formatConfidence } from '../../utils/formatters';

interface KpiCardsProps {
  stats: AnalysisStatistics;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ stats }) => {
  const isStancePositive = stats.publicStanceScore >= 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5 sm:gap-4">
      {/* 1. Total Comments */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Total Submissions
          </span>
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <MessageSquare className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900">
          {stats.totalComments}
        </div>
        <div className="text-[11px] text-slate-500 mt-1 flex items-center space-x-1">
          <span>Avg length: ~{stats.averageWordCount} words</span>
        </div>
      </div>

      {/* 2. Positive Comments */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-emerald-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50 rounded-full -mr-6 -mt-6 pointer-events-none" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
            Positive Feedback
          </span>
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700">
            <ThumbsUp className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl sm:text-3xl font-display font-extrabold text-emerald-600">
            {stats.positiveCount}
          </span>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
            {formatPercentage(stats.positivePercentage)}
          </span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
          <div
            className="bg-emerald-500 h-full rounded-full"
            style={{ width: `${stats.positivePercentage}%` }}
          />
        </div>
      </div>

      {/* 3. Negative Comments */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-rose-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-rose-50 rounded-full -mr-6 -mt-6 pointer-events-none" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider">
            Critical Concerns
          </span>
          <div className="p-2 rounded-xl bg-rose-100 text-rose-700">
            <ThumbsDown className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl sm:text-3xl font-display font-extrabold text-rose-600">
            {stats.negativeCount}
          </span>
          <span className="text-xs font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
            {formatPercentage(stats.negativePercentage)}
          </span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
          <div
            className="bg-rose-500 h-full rounded-full"
            style={{ width: `${stats.negativePercentage}%` }}
          />
        </div>
      </div>

      {/* 4. Neutral Comments */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            Neutral / Procedural
          </span>
          <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
            <Minus className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline space-x-2">
          <span className="text-2xl sm:text-3xl font-display font-extrabold text-slate-700">
            {stats.neutralCount}
          </span>
          <span className="text-xs font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
            {formatPercentage(stats.neutralPercentage)}
          </span>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
          <div
            className="bg-slate-400 h-full rounded-full"
            style={{ width: `${stats.neutralPercentage}%` }}
          />
        </div>
      </div>

      {/* 5. Average Confidence */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
            Avg Confidence
          </span>
          <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
            <Target className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-display font-extrabold text-indigo-900">
          {formatConfidence(stats.averageConfidence)}
        </div>
        <div className="text-[11px] text-slate-500 mt-1 flex items-center space-x-1">
          <span className="text-emerald-600 font-semibold">High Model Precision</span>
        </div>
      </div>

      {/* 6. Public Stance Score */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-blue-950 text-white shadow-md hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">
            Net Stance Index
          </span>
          <div className="p-2 rounded-xl bg-white/10 text-white">
            {isStancePositive ? <TrendingUp className="w-4 h-4 text-emerald-400" /> : <TrendingDown className="w-4 h-4 text-rose-400" />}
          </div>
        </div>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-2xl sm:text-3xl font-display font-extrabold text-white">
            {isStancePositive ? `+${stats.publicStanceScore}` : stats.publicStanceScore}
          </span>
          <span className="text-xs text-blue-200 font-medium">/ 100</span>
        </div>
        <div className="text-[11px] text-slate-300 mt-1 truncate">
          {isStancePositive ? 'Net Favorable' : 'Net Critical'}
        </div>
      </div>
    </div>
  );
};
