import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { AnalysisStatistics } from '../../types';
import { PieChart as PieIcon, BarChart2, TrendingUp } from 'lucide-react';

interface SentimentChartsProps {
  stats: AnalysisStatistics;
}

const COLORS = {
  Positive: '#345E3D', // Muted Deep Forest Green
  Neutral: '#66735A',  // Muted Olive Stone
  Negative: '#B86B4B', // Muted Terracotta Rust
};

export const SentimentCharts: React.FC<SentimentChartsProps> = ({ stats }) => {
  const pieData = [
    { name: 'Favorable', value: stats.positiveCount, percentage: stats.positivePercentage, color: COLORS.Positive },
    { name: 'Neutral', value: stats.neutralCount, percentage: stats.neutralPercentage, color: COLORS.Neutral },
    { name: 'Critical', value: stats.negativeCount, percentage: stats.negativePercentage, color: COLORS.Negative },
  ].filter((d) => d.value > 0);

  const barData = [
    {
      category: 'Favorable Feedback',
      count: stats.positiveCount,
      percentage: stats.positivePercentage,
      fill: COLORS.Positive,
    },
    {
      category: 'Neutral / Inquiries',
      count: stats.neutralCount,
      percentage: stats.neutralPercentage,
      fill: COLORS.Neutral,
    },
    {
      category: 'Critical Objections',
      count: stats.negativeCount,
      percentage: stats.negativePercentage,
      fill: COLORS.Negative,
    },
  ];

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-forest-950 text-sand-100 p-2.5 rounded-lg shadow-lg text-xs border border-forest-900">
          <div className="font-bold flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
            <span>{data.name} Sentiment</span>
          </div>
          <div className="mt-1 text-sand-300">
            Count: <span className="font-mono font-bold text-white">{data.value}</span> submissions
          </div>
          <div className="text-sand-300">
            Share: <span className="font-mono font-bold text-white">{data.percentage}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-forest-950 text-sand-100 p-2.5 rounded-lg shadow-lg text-xs border border-forest-900">
          <div className="font-bold text-sand-100">{data.category}</div>
          <div className="mt-1 text-sand-300">
            Volume: <span className="font-mono font-bold text-white">{data.count}</span> comments ({data.percentage}%)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Chart 1: Donut Distribution */}
      <div className="bg-white rounded-xl p-5 sm:p-6 shadow-card border border-sand-300 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-display font-bold text-forest-950 text-sm flex items-center space-x-2">
              <PieIcon className="w-4 h-4 text-forest-700" />
              <span>Sentiment Share Distribution</span>
            </h4>
            <p className="text-xs text-earth-600">Proportional breakdown across all verified submissions</p>
          </div>
          <span className="text-xs font-mono font-semibold text-earth-800 bg-sand-100 px-2.5 py-0.5 rounded border border-sand-300">
            {stats.totalComments} Total
          </span>
        </div>

        <div className="h-64 sm:h-72 w-full relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={68}
                outerRadius={96}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#FAF8F3" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={32}
                formatter={(value) => <span className="text-xs font-medium text-earth-800">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Callout inside Donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-7">
            <span className="text-2xl font-display font-extrabold text-forest-950 font-mono">
              {stats.positivePercentage}%
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-forest-800">
              Favorable
            </span>
          </div>
        </div>
      </div>

      {/* Chart 2: Volume Comparison Bar Chart */}
      <div className="bg-white rounded-xl p-5 sm:p-6 shadow-card border border-sand-300 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h4 className="font-display font-bold text-forest-950 text-sm flex items-center space-x-2">
              <BarChart2 className="w-4 h-4 text-forest-700" />
              <span>Sentiment Volume & Net Stance</span>
            </h4>
            <p className="text-xs text-earth-600">Absolute count per sentiment category</p>
          </div>
          <div className="flex items-center space-x-1 text-xs font-semibold text-forest-900 bg-forest-50 px-2.5 py-1 rounded border border-forest-200">
            <TrendingUp className="w-3.5 h-3.5 text-forest-700" />
            <span>Index: {stats.publicStanceScore >= 0 ? `+${stats.publicStanceScore}` : stats.publicStanceScore}</span>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 20, left: -15, bottom: 15 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F3EFE6" vertical={false} />
              <XAxis
                dataKey="category"
                tick={{ fontSize: 11, fill: '#544739' }}
                axisLine={{ stroke: '#D8CDBB' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#544739' }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};


