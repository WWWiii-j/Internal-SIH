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
  Positive: '#10B981', // Emerald 500
  Neutral: '#64748B',  // Slate 500
  Negative: '#EF4444', // Rose 500
};

export const SentimentCharts: React.FC<SentimentChartsProps> = ({ stats }) => {
  const pieData = [
    { name: 'Positive', value: stats.positiveCount, percentage: stats.positivePercentage, color: COLORS.Positive },
    { name: 'Neutral', value: stats.neutralCount, percentage: stats.neutralPercentage, color: COLORS.Neutral },
    { name: 'Negative', value: stats.negativeCount, percentage: stats.negativePercentage, color: COLORS.Negative },
  ].filter((d) => d.value > 0);

  const barData = [
    {
      category: 'Positive Feedback',
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
      category: 'Critical Concerns',
      count: stats.negativeCount,
      percentage: stats.negativePercentage,
      fill: COLORS.Negative,
    },
  ];

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs border border-slate-700">
          <div className="font-bold flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
            <span>{data.name} Sentiment</span>
          </div>
          <div className="mt-1 text-slate-300">
            Count: <span className="font-bold text-white">{data.value}</span> submissions
          </div>
          <div className="text-slate-300">
            Share: <span className="font-bold text-white">{data.percentage}%</span>
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
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs border border-slate-700">
          <div className="font-bold">{data.category}</div>
          <div className="mt-1 text-slate-300">
            Volume: <span className="font-bold text-white">{data.count}</span> comments ({data.percentage}%)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: Donut Distribution */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200/90 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-display font-bold text-slate-900 text-base flex items-center space-x-2">
              <PieIcon className="w-4 h-4 text-blue-600" />
              <span>Sentiment Share Distribution</span>
            </h4>
            <p className="text-xs text-slate-500">Proportional breakdown of all stakeholder inputs</p>
          </div>
          <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
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
                innerRadius={65}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span className="text-xs font-medium text-slate-700">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Callout inside Donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
            <span className="text-2xl font-display font-black text-slate-800">
              {stats.positivePercentage}%
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">
              Favorable
            </span>
          </div>
        </div>
      </div>

      {/* Chart 2: Volume Comparison Bar Chart */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200/90 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-display font-bold text-slate-900 text-base flex items-center space-x-2">
              <BarChart2 className="w-4 h-4 text-indigo-600" />
              <span>Sentiment Volume & Stance</span>
            </h4>
            <p className="text-xs text-slate-500">Absolute count per sentiment category</p>
          </div>
          <div className="flex items-center space-x-1 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Stance: {stats.publicStanceScore >= 0 ? `+${stats.publicStanceScore}` : stats.publicStanceScore}</span>
          </div>
        </div>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis
                dataKey="category"
                tick={{ fontSize: 11, fill: '#475569' }}
                axisLine={{ stroke: '#CBD5E1' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#475569' }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
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
