import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  Flame,
  Search,
  Filter,
  BarChart3,
  ArrowRight,
  ShieldAlert,
  Users,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  Clock,
  Zap,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { KeyIssue, NormalizedCommentRecord, PriorityAnalysisResult } from '../../types';
import {
  formatNumber,
  getPriorityBadgeClass,
  getPriorityScoreColor,
  getStakeholderBadgeClass,
  truncateText,
} from '../../utils/formatters';
import { IssueDetailModal } from './IssueDetailModal';

interface KeyIssuesSectionProps {
  priorityResult: PriorityAnalysisResult;
  comments: NormalizedCommentRecord[];
}

export const KeyIssuesSection: React.FC<KeyIssuesSectionProps> = ({
  priorityResult,
  comments,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<'All' | 'HIGH' | 'MEDIUM' | 'LOW'>('All');
  const [sortBy, setSortBy] = useState<'priority' | 'negative' | 'volume'>('priority');
  const [selectedIssue, setSelectedIssue] = useState<KeyIssue | null>(null);

  // Filtered and sorted key issues
  const filteredIssues = useMemo(() => {
    return priorityResult.issues
      .filter((issue) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = issue.title.toLowerCase().includes(q);
          const matchesSeverity = issue.severityIndicators.some((t) => t.toLowerCase().includes(q));
          const matchesUrgency = issue.urgencyIndicators.some((t) => t.toLowerCase().includes(q));
          if (!matchesTitle && !matchesSeverity && !matchesUrgency) return false;
        }

        if (selectedLevel !== 'All' && issue.priorityLevel !== selectedLevel) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'priority') return b.priorityScore - a.priorityScore;
        if (sortBy === 'negative') return b.negativeSentimentPercentage - a.negativeSentimentPercentage;
        if (sortBy === 'volume') return b.commentCount - a.commentCount;
        return 0;
      });
  }, [priorityResult.issues, searchQuery, selectedLevel, sortBy]);

  // Chart data for priority ranking
  const chartData = useMemo(() => {
    return priorityResult.issues.slice(0, 8).map((iss) => ({
      name: truncateText(iss.title, 22),
      fullTitle: iss.title,
      score: iss.priorityScore,
      level: iss.priorityLevel,
    }));
  }, [priorityResult.issues]);

  const getBarFill = (level: string) => {
    if (level === 'HIGH') return '#B86B4B'; // Terracotta
    if (level === 'MEDIUM') return '#66735A'; // Olive Stone
    return '#477852'; // Forest Green
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Priority Summary Banner */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-sand-300 shadow-card space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-sand-200">
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <span className="p-2 rounded-xl bg-terracotta-100 text-terracotta-800 border border-terracotta-300">
                <ShieldAlert className="w-5 h-5 text-terracotta-700" />
              </span>
              <h3 className="font-display font-bold text-lg sm:text-xl text-forest-950">
                Key Issues & Multi-Factor Priority Engine
              </h3>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-900 border border-forest-300">
                Phase 2C Active
              </span>
            </div>
            <p className="text-xs text-earth-600">
              Explainable 0–100 priority scoring weighted by submission volume, negative sentiment ratio, severity indicators, and urgency/risk factors.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-sand-50 p-3 rounded-xl border border-sand-300">
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-earth-500 block">
                Avg Issue Priority
              </span>
              <span className="font-display font-extrabold text-xl text-forest-950">
                {priorityResult.averagePriorityScore} <span className="text-xs text-earth-500 font-normal">/ 100</span>
              </span>
            </div>
            <div className="h-8 w-px bg-sand-300" />
            <div className="text-xs space-y-0.5">
              <span className="text-terracotta-800 font-bold block">{priorityResult.highPriorityCount} High Priority</span>
              <span className="text-olive-800 font-bold block">{priorityResult.mediumPriorityCount} Medium Priority</span>
            </div>
          </div>
        </div>

        {/* Priority Summary Grid & Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {/* Priority Ranking Bar Chart */}
          <div className="lg:col-span-2 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-forest-950 text-xs flex items-center space-x-1.5">
                <BarChart3 className="w-4 h-4 text-forest-700" />
                <span>Issue Priority Ranking (0–100 Scale)</span>
              </h4>
              <span className="text-[11px] text-earth-500 font-medium">Top policy friction areas</span>
            </div>

            <div className="h-64 w-full bg-[#FAF8F3]/60 rounded-xl p-3 border border-sand-200">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                >
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: '#6E5F4E' }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={130}
                    tick={{ fontSize: 10, fill: '#243B2A', fontWeight: 600 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FAF8F3',
                      borderColor: '#D8CDBB',
                      borderRadius: '8px',
                      fontSize: '11px',
                      color: '#3B3028',
                    }}
                    formatter={(value: any) => [`${value} / 100 Points`, 'Priority Score']}
                  />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getBarFill(entry.level)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Priority Level Threshold Breakdown Card */}
          <div className="space-y-3 p-4 rounded-xl bg-sand-50/80 border border-sand-300 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-forest-950 text-xs flex items-center space-x-1.5 mb-2.5">
                <Info className="w-4 h-4 text-forest-700" />
                <span>Priority Index Thresholds</span>
              </h4>

              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-terracotta-50 border border-terracotta-200">
                  <div className="flex justify-between items-center font-bold text-terracotta-900">
                    <span>HIGH PRIORITY (70–100)</span>
                    <span className="font-mono">{priorityResult.highPriorityCount} Issues</span>
                  </div>
                  <p className="text-[11px] text-terracotta-800 mt-0.5">
                    Critical friction, high submission volume, and severe operational/compliance risks requiring immediate legislative amendments.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-olive-50 border border-olive-200">
                  <div className="flex justify-between items-center font-bold text-olive-900">
                    <span>MEDIUM PRIORITY (40–69)</span>
                    <span className="font-mono">{priorityResult.mediumPriorityCount} Issues</span>
                  </div>
                  <p className="text-[11px] text-olive-800 mt-0.5">
                    Moderate pushback or definitional ambiguities warranting clarifying guidelines or transitional runways.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-forest-50 border border-forest-200">
                  <div className="flex justify-between items-center font-bold text-forest-900">
                    <span>LOW PRIORITY (0–39)</span>
                    <span className="font-mono">{priorityResult.lowPriorityCount} Issues</span>
                  </div>
                  <p className="text-[11px] text-forest-800 mt-0.5">
                    Broadly favorable or procedural feedback with minimal legislative friction.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-earth-500 italic pt-2 border-t border-sand-200 text-center">
              Deterministic 4-Factor Weighted Algorithm · SIH 2025 PS-25035
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl p-4 border border-sand-300 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-earth-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search key issues by title, severity, or risk triggers..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-sand-300 bg-sand-50/50 focus:bg-white text-earth-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-1.5">
            <span className="font-bold text-earth-700">Priority Level:</span>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg border border-sand-300 bg-white text-earth-900 font-medium focus:ring-2 focus:ring-forest-600"
            >
              <option value="All">All Priority Levels ({priorityResult.issues.length})</option>
              <option value="HIGH">High Priority (70–100)</option>
              <option value="MEDIUM">Medium Priority (40–69)</option>
              <option value="LOW">Low Priority (0–39)</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="font-bold text-earth-700">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg border border-sand-300 bg-white text-earth-900 font-medium focus:ring-2 focus:ring-forest-600"
            >
              <option value="priority">Highest Priority Score First</option>
              <option value="negative">Highest Critical Opposition %</option>
              <option value="volume">Highest Submission Volume</option>
            </select>
          </div>
        </div>
      </div>

      {/* Key Issues Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredIssues.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-white rounded-xl border border-sand-300 text-earth-500 italic">
            No key issues matched your search and filter criteria.
          </div>
        ) : (
          filteredIssues.map((issue) => {
            const scoreStyle = getPriorityScoreColor(issue.priorityScore);

            return (
              <div
                key={issue.id}
                onClick={() => setSelectedIssue(issue)}
                className="bg-white rounded-xl p-5 border border-sand-300 shadow-card hover:shadow-card-hover hover:border-forest-600/70 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Top Badge & Score Row */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-extrabold border ${getPriorityBadgeClass(issue.priorityLevel)}`}>
                      {issue.priorityLevel} PRIORITY
                    </span>

                    <div className="flex items-center space-x-1">
                      <span className="text-[10px] text-earth-500 font-bold uppercase">Score:</span>
                      <span className={`font-mono font-extrabold text-sm px-2 py-0.5 rounded border ${scoreStyle.bg} ${scoreStyle.text}`}>
                        {issue.priorityScore} / 100
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h4 className="font-display font-bold text-base text-forest-950 group-hover:text-forest-700 transition-colors line-clamp-2 leading-snug">
                    {issue.title}
                  </h4>

                  {/* Volume & Negative % Strip */}
                  <div className="flex items-center justify-between text-xs pb-1 border-b border-sand-200 font-mono">
                    <span className="text-earth-700 font-semibold">
                      {issue.commentCount} Submissions ({issue.commentPercentage}%)
                    </span>
                    <span className="text-terracotta-800 font-bold">
                      {issue.negativeSentimentPercentage}% Critical
                    </span>
                  </div>

                  {/* Explainable Why Rationale Box */}
                  <div className="p-3 rounded-lg bg-[#FAF8F3] border border-sand-300 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-forest-900 block flex items-center space-x-1">
                      <Zap className="w-3 h-3 text-terracotta-600" />
                      <span>Priority Rationale (Explainable)</span>
                    </span>
                    <p className="text-earth-800 text-[11px] leading-relaxed line-clamp-3">
                      {issue.explanation}
                    </p>
                  </div>

                  {/* Indicator Pills (Severity & Urgency) */}
                  {(issue.severityIndicators.length > 0 || issue.urgencyIndicators.length > 0) && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex flex-wrap gap-1">
                        {issue.severityIndicators.slice(0, 3).map((term, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-terracotta-50 text-terracotta-900 border border-terracotta-200"
                            title="Severity indicator detected"
                          >
                            ⚠ {term}
                          </span>
                        ))}
                        {issue.urgencyIndicators.slice(0, 3).map((term, i) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-olive-50 text-olive-900 border border-olive-200"
                            title="Urgency / Risk indicator detected"
                          >
                            ⏱ {term}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Key Voices */}
                  {issue.affectedStakeholders.length > 0 && (
                    <div className="flex items-center space-x-1.5 text-[11px] text-earth-600 pt-1">
                      <Users className="w-3.5 h-3.5 text-forest-700 flex-shrink-0" />
                      <span className="truncate">
                        Key submitters: <strong>{issue.affectedStakeholders.map((s) => s.type).join(', ')}</strong>
                      </span>
                    </div>
                  )}
                </div>

                {/* Card CTA */}
                <div className="pt-3 border-t border-sand-200 flex items-center justify-between text-xs text-forest-800 font-bold group-hover:text-forest-900">
                  <span className="flex items-center space-x-1">
                    <span>Inspect {issue.commentCount} Submissions & Score Details</span>
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detailed Drilldown Modal */}
      <IssueDetailModal
        issue={selectedIssue}
        allComments={comments}
        onClose={() => setSelectedIssue(null)}
      />
    </div>
  );
};
