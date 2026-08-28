import React from 'react';
import { KeywordMetric } from '../../types';
import { Sparkles } from 'lucide-react';

interface WordCloudProps {
  keywords: KeywordMetric[];
  selectedKeyword: string | null;
  onSelectKeyword: (keyword: string | null) => void;
}

export const WordCloud: React.FC<WordCloudProps> = ({
  keywords,
  selectedKeyword,
  onSelectKeyword,
}) => {
  if (keywords.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-slate-400">
        No significant keywords extracted.
      </div>
    );
  }

  // Determine min and max frequency for proportional scaling
  const maxCount = Math.max(...keywords.map((k) => k.count), 1);
  const minCount = Math.min(...keywords.map((k) => k.count), 1);

  const getFontSize = (count: number) => {
    if (maxCount === minCount) return 14;
    const minSize = 12;
    const maxSize = 28;
    const scaled = minSize + ((count - minCount) / (maxCount - minCount)) * (maxSize - minSize);
    return Math.round(scaled);
  };

  const getWordStyle = (keyword: KeywordMetric, isSelected: boolean) => {
    let baseColor = 'text-slate-600 bg-slate-100 hover:bg-slate-200 border-slate-200';

    if (keyword.dominantSentiment === 'Positive') {
      baseColor = isSelected
        ? 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-400'
        : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border-emerald-200';
    } else if (keyword.dominantSentiment === 'Negative') {
      baseColor = isSelected
        ? 'bg-rose-600 text-white border-rose-700 shadow-md ring-2 ring-rose-400'
        : 'text-rose-700 bg-rose-50 hover:bg-rose-100 border-rose-200';
    } else {
      baseColor = isSelected
        ? 'bg-slate-800 text-white border-slate-900 shadow-md ring-2 ring-slate-400'
        : 'text-slate-700 bg-slate-100 hover:bg-slate-200 border-slate-200';
    }

    return baseColor;
  };

  return (
    <div className="space-y-4">
      {/* Legend & Instructions */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 pb-2 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span>Positive Focus</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Critical Concern</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
            <span>Neutral / Policy</span>
          </span>
        </div>
        <span className="italic text-slate-400">Click any keyword to filter table</span>
      </div>

      {/* Cloud Display */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 p-5 bg-slate-50/70 rounded-2xl border border-slate-200/80 min-h-[220px]">
        {keywords.slice(0, 32).map((kw) => {
          const isSelected = selectedKeyword === kw.text;
          const fontSize = getFontSize(kw.count);

          return (
            <button
              key={kw.text}
              type="button"
              onClick={() => onSelectKeyword(isSelected ? null : kw.text)}
              style={{ fontSize: `${fontSize}px` }}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-semibold border transition-all duration-150 transform hover:scale-105 ${getWordStyle(
                kw,
                isSelected
              )}`}
              title={`${kw.text}: ${kw.count} occurrences (${kw.dominantSentiment} dominant)`}
            >
              <span>{kw.text}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected
                    ? 'bg-black/20 text-white'
                    : 'bg-white/80 text-slate-700 border border-black/5'
                }`}
              >
                {kw.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
