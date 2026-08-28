import React from 'react';
import {
  Users,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Percent,
} from 'lucide-react';
import { AnalysisStatistics } from '../../types';
import { formatPercentage, formatConfidence } from '../../utils/formatters';

interface KpiCardsProps {
  stats: AnalysisStatistics;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ stats }) => {
  const isPositiveStance = stats.publicStanceScore >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3.5">
      {/* 1. Total Submissions */}
      <div className="bg-white rounded-xl p-4 shadow-card border border-sand-300 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-earth-600 uppercase tracking-wider">
            Total Submissions
          </span>
          <div className="p-1.5 rounded-lg bg-forest-100 text-forest-800">
            <Users className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-2xl font-display font-black text-forest-950 font-mono">
            {stats.totalComments.toLocaleString()}
          </div>
          <div className="text-[11px] text-earth-600 mt-0.5">
            Avg: <span className="font-semibold text-earth-900">{stats.averageWordCount}</span> words/record
          </div>
        </div>
      </div>

      {/* 2. Positive Feedback */}
      <div className="bg-white rounded-xl p-4 shadow-card border border-sand-300 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-forest-800 uppercase tracking-wider">
            Favorable
          </span>
          <div className="p-1.5 rounded-lg bg-forest-100 text-forest-800">
            <ThumbsUp className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-display font-black text-forest-900 font-mono">
              {stats.positiveCount}
            </span>
            <span className="text-[10px] font-bold bg-forest-100 text-forest-800 px-1.5 py-0.2 rounded border border-forest-300 font-mono">
              {formatPercentage(stats.positivePercentage)}
            </span>
          </div>
          <div className="w-full h-1 bg-sand-200 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-forest-600 rounded-full"
              style={{ width: `${stats.positivePercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Negative Feedback */}
      <div className="bg-white rounded-xl p-4 shadow-card border border-sand-300 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-terracotta-800 uppercase tracking-wider">
            Critical Objections
          </span>
          <div className="p-1.5 rounded-lg bg-terracotta-100 text-terracotta-800">
            <ThumbsDown className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-display font-black text-terracotta-950 font-mono">
              {stats.negativeCount}
            </span>
            <span className="text-[10px] font-bold bg-terracotta-100 text-terracotta-800 px-1.5 py-0.2 rounded border border-terracotta-300 font-mono">
              {formatPercentage(stats.negativePercentage)}
            </span>
          </div>
          <div className="w-full h-1 bg-sand-200 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-terracotta-500 rounded-full"
              style={{ width: `${stats.negativePercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4. Neutral Inquiries */}
      <div className="bg-white rounded-xl p-4 shadow-card border border-sand-300 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-earth-700 uppercase tracking-wider">
            Neutral / Inquiries
          </span>
          <div className="p-1.5 rounded-lg bg-sand-200 text-earth-800">
            <Minus className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-display font-black text-earth-900 font-mono">
              {stats.neutralCount}
            </span>
            <span className="text-[10px] font-bold bg-sand-200 text-earth-800 px-1.5 py-0.2 rounded border border-sand-400 font-mono">
              {formatPercentage(stats.neutralPercentage)}
            </span>
          </div>
          <div className="w-full h-1 bg-sand-200 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-olive-600 rounded-full"
              style={{ width: `${stats.neutralPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 5. Calibrated Confidence */}
      <div className="bg-white rounded-xl p-4 shadow-card border border-sand-300 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-olive-800 uppercase tracking-wider">
            Confidence
          </span>
          <div className="p-1.5 rounded-lg bg-olive-100 text-olive-800">
            <Sparkles className="w-3.5 h-3.5 text-olive-700" />
          </div>
        </div>
        <div className="mt-2">
          <div className="text-2xl font-display font-black text-forest-950 font-mono">
            {formatConfidence(stats.averageConfidence)}
          </div>
          <div className="text-[11px] text-earth-600 mt-0.5">
            Rule calibration score
          </div>
        </div>
      </div>

      {/* 6. Net Stance Score Card */}
      <div className="bg-forest-800 rounded-xl p-4 shadow-card border border-forest-900 text-earth-50 flex flex-col justify-between relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-sage-300 uppercase tracking-wider">
            Net Stance Index
          </span>
          <div className="p-1.5 rounded-lg bg-forest-700 text-sage-300">
            {isPositiveStance ? (
              <TrendingUp className="w-3.5 h-3.5 text-sage-300" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-terracotta-300" />
            )}
          </div>
        </div>

        <div className="mt-2">
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-display font-black text-white font-mono">
              {isPositiveStance ? `+${stats.publicStanceScore}` : stats.publicStanceScore}
            </span>
            <span className="text-[10px] text-sage-300 font-mono">/100</span>
          </div>
          <div className="mt-1">
            <span className="inline-block text-[10px] font-bold px-1.5 py-0.2 rounded bg-forest-900 border border-forest-700 text-sage-300">
              {isPositiveStance ? 'Net Favorable' : 'Net Critical'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
