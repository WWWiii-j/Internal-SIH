import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { KeywordMetric, ThematicCluster } from '../../types';
import { WordCloud } from './WordCloud';
import { Tag, Cloud, Layers, X } from 'lucide-react';

interface KeywordAnalyticsProps {
  keywords: KeywordMetric[];
  themes: ThematicCluster[];
  selectedKeyword: string | null;
  onSelectKeyword: (keyword: string | null) => void;
}

export const KeywordAnalytics: React.FC<KeywordAnalyticsProps> = ({
  keywords,
  themes,
  selectedKeyword,
  onSelectKeyword,
}) => {
  const topKeywordsForChart = keywords.slice(0, 10).map((k) => ({
    text: k.text,
    count: k.count,
    dominantSentiment: k.dominantSentiment,
    fill:
      k.dominantSentiment === 'Positive'
        ? '#345E3D'
        : k.dominantSentiment === 'Negative'
        ? '#B86B4B'
        : '#66735A',
  }));

  const CustomKeywordTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-forest-950 text-sand-100 p-2.5 rounded-lg shadow-lg text-xs border border-forest-900">
          <div className="font-bold text-sage-300">"{data.text}"</div>
          <div className="mt-1 text-sand-300">
            Total Mentions: <span className="font-mono font-bold text-white">{data.count}</span>
          </div>
          <div className="text-sand-300">
            Dominant Sentiment: <span className="font-bold text-white">{data.dominantSentiment}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* Left Column: Word Cloud (7 cols) */}
      <div className="lg:col-span-7 bg-white rounded-xl p-5 sm:p-6 shadow-card border border-sand-300 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h4 className="font-display font-bold text-forest-950 text-sm flex items-center space-x-2">
                <Cloud className="w-4 h-4 text-forest-700" />
                <span>Interactive Sentiment Word Cloud</span>
              </h4>
              <p className="text-xs text-earth-600">
                Key terms sized by frequency and colored by stakeholder sentiment
              </p>
            </div>

            {selectedKeyword && (
              <button
                type="button"
                onClick={() => onSelectKeyword(null)}
                className="inline-flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-semibold bg-forest-100 text-forest-900 border border-forest-300 hover:bg-forest-200 transition-colors"
              >
                <span>Filter: "{selectedKeyword}"</span>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <WordCloud
            keywords={keywords}
            selectedKeyword={selectedKeyword}
            onSelectKeyword={onSelectKeyword}
          />
        </div>

        {/* Thematic Category Pills */}
        <div className="mt-5 pt-4 border-t border-sand-200">
          <div className="flex items-center space-x-1.5 text-[11px] font-bold text-earth-700 uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5 text-earth-500" />
            <span>Recurring Governance Themes</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {themes.map((t) => (
              <div
                key={t.theme}
                className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-sand-100 border border-sand-300 text-xs font-medium text-earth-800"
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    t.sentiment === 'Positive'
                      ? 'bg-forest-700'
                      : t.sentiment === 'Negative'
                      ? 'bg-terracotta-600'
                      : 'bg-olive-600'
                  }`}
                />
                <span>{t.theme}</span>
                <span className="text-[10px] text-earth-700 font-mono bg-white px-1.5 py-0.2 rounded border border-sand-300">
                  {t.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Top Keyword Frequency Chart (5 cols) */}
      <div className="lg:col-span-5 bg-white rounded-xl p-5 sm:p-6 shadow-card border border-sand-300 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-display font-bold text-forest-950 text-sm flex items-center space-x-2">
              <Tag className="w-4 h-4 text-forest-700" />
              <span>Top Keyword Frequency</span>
            </h4>
            <p className="text-xs text-earth-600">Most cited terms across all submissions</p>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topKeywordsForChart}
              layout="vertical"
              margin={{ top: 5, right: 25, left: 35, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F3EFE6" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#6E5F4E' }} allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="text"
                tick={{ fontSize: 11, fill: '#3B3028', fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                width={85}
              />
              <Tooltip content={<CustomKeywordTooltip />} />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {topKeywordsForChart.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fill}
                    className="cursor-pointer hover:opacity-85 transition-opacity"
                    onClick={() => onSelectKeyword(entry.text)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};


