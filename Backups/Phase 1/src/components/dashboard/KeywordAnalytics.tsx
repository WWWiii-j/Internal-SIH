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
        ? '#10B981'
        : k.dominantSentiment === 'Negative'
        ? '#EF4444'
        : '#64748B',
  }));

  const CustomKeywordTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs border border-slate-700">
          <div className="font-bold text-sm text-blue-300">"{data.text}"</div>
          <div className="mt-1 text-slate-300">
            Total Mentions: <span className="font-bold text-white">{data.count}</span>
          </div>
          <div className="text-slate-300">
            Dominant Sentiment: <span className="font-bold text-white">{data.dominantSentiment}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Word Cloud (7 cols) */}
      <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-xl border border-slate-200/90 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="font-display font-bold text-slate-900 text-base flex items-center space-x-2">
                <Cloud className="w-4 h-4 text-blue-600" />
                <span>Interactive Sentiment Word Cloud</span>
              </h4>
              <p className="text-xs text-slate-500">
                Key terms sized by frequency and colored by stakeholder sentiment
              </p>
            </div>

            {selectedKeyword && (
              <button
                onClick={() => onSelectKeyword(null)}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
              >
                <span>Filter: "{selectedKeyword}"</span>
                <X className="w-3.5 h-3.5" />
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
        <div className="mt-6 pt-4 border-t border-slate-100">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
            <Layers className="w-3.5 h-3.5 text-slate-500" />
            <span>Recurring Governance Themes</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {themes.map((t) => (
              <div
                key={t.theme}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700"
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    t.sentiment === 'Positive'
                      ? 'bg-emerald-500'
                      : t.sentiment === 'Negative'
                      ? 'bg-rose-500'
                      : 'bg-slate-400'
                  }`}
                />
                <span>{t.theme}</span>
                <span className="text-[10px] text-slate-500 font-mono bg-white px-1.5 py-0.5 rounded border border-slate-200">
                  {t.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Top Keyword Frequency Chart (5 cols) */}
      <div className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-xl border border-slate-200/90 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-display font-bold text-slate-900 text-base flex items-center space-x-2">
              <Tag className="w-4 h-4 text-emerald-600" />
              <span>Top Keyword Frequency</span>
            </h4>
            <p className="text-xs text-slate-500">Most cited terms across all submissions</p>
          </div>
        </div>

        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topKeywordsForChart}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#64748B' }} allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="text"
                tick={{ fontSize: 11, fill: '#334155', fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                width={85}
              />
              <Tooltip content={<CustomKeywordTooltip />} />
              <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                {topKeywordsForChart.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fill}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
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
