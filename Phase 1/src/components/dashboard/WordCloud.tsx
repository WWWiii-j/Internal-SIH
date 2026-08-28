import React from 'react';
import { KeywordMetric } from '../../types';

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
      <div className="p-8 text-center text-xs text-earth-500">
        No significant keywords extracted.
      </div>
    );
  }

  // Determine min and max frequency for proportional scaling
  const maxCount = Math.max(...keywords.map((k) => k.count), 1);
  const minCount = Math.min(...keywords.map((k) => k.count), 1);

  const getFontSize = (count: number) => {
    if (maxCount === minCount) return 13;
    const minSize = 12;
    const maxSize = 22;
    const scaled = minSize + ((count - minCount) / (maxCount - minCount)) * (maxSize - minSize);
    return Math.round(scaled);
  };

  const getWordStyle = (keyword: KeywordMetric, isSelected: boolean) => {
    if (keyword.dominantSentiment === 'Positive') {
      return isSelected
        ? 'bg-forest-800 text-white border-forest-900 shadow-sm ring-2 ring-forest-500'
        : 'text-forest-900 bg-forest-50 hover:bg-forest-100 border-forest-300';
    } else if (keyword.dominantSentiment === 'Negative') {
      return isSelected
        ? 'bg-terracotta-700 text-white border-terracotta-800 shadow-sm ring-2 ring-terracotta-500'
        : 'text-terracotta-900 bg-terracotta-50 hover:bg-terracotta-100 border-terracotta-300';
    } else {
      return isSelected
        ? 'bg-earth-800 text-white border-earth-900 shadow-sm ring-2 ring-sand-400'
        : 'text-earth-800 bg-sand-100 hover:bg-sand-200 border-sand-300';
    }
  };

  return (
    <div className="space-y-3">
      {/* Legend & Instructions */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-earth-600 pb-2 border-b border-sand-200">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-forest-700" />
            <span>Favorable Focus</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-terracotta-600" />
            <span>Critical Concern</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-olive-600" />
            <span>Procedural / General</span>
          </span>
        </div>
        <span className="italic text-earth-500">Click any keyword to filter comments</span>
      </div>

      {/* Cloud Display */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-4 bg-[#FAF8F3] rounded-xl border border-sand-300 min-h-[200px]">
        {keywords.slice(0, 30).map((kw) => {
          const isSelected = selectedKeyword === kw.text;
          const fontSize = getFontSize(kw.count);

          return (
            <button
              key={kw.text}
              type="button"
              onClick={() => onSelectKeyword(isSelected ? null : kw.text)}
              style={{ fontSize: `${fontSize}px` }}
              className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg font-medium border transition-all duration-100 ${getWordStyle(
                kw,
                isSelected
              )}`}
              title={`${kw.text}: ${kw.count} occurrences (${kw.dominantSentiment} dominant)`}
            >
              <span>{kw.text}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  isSelected
                    ? 'bg-black/25 text-white'
                    : 'bg-white text-earth-800 border border-sand-300'
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


