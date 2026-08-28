import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  Filter,
  BarChart3,
  Layers,
  ArrowRight,
  Eye,
  Tag,
  Users,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  MessageSquareQuote,
  Hash,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts';
import { DynamicTopic, NormalizedCommentRecord, TopicAnalysisResult } from '../../types';
import {
  getSentimentBadgeClass,
  getStakeholderBadgeClass,
  truncateText,
} from '../../utils/formatters';
import { TopicCommentsModal } from './TopicCommentsModal';

interface TopicExplorerSectionProps {
  analysis: TopicAnalysisResult;
  comments: NormalizedCommentRecord[];
}

export const TopicExplorerSection: React.FC<TopicExplorerSectionProps> = ({
  analysis,
  comments,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState<'All' | 'Positive' | 'Neutral' | 'Negative'>('All');
  const [sortBy, setSortBy] = useState<'volume' | 'polarity-asc' | 'polarity-desc' | 'friction'>('volume');
  const [selectedTopic, setSelectedTopic] = useState<DynamicTopic | null>(null);

  // Filtered and sorted topics
  const filteredTopics = useMemo(() => {
    return analysis.topics
      .filter((t) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = t.title.toLowerCase().includes(q);
          const matchesKeywords = t.keywords.some((k) => k.toLowerCase().includes(q));
          if (!matchesTitle && !matchesKeywords) return false;
        }

        if (sentimentFilter !== 'All' && t.dominantSentiment !== sentimentFilter) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'volume') return b.commentCount - a.commentCount;
        if (sortBy === 'polarity-desc') return b.averagePolarity - a.averagePolarity;
        if (sortBy === 'polarity-asc') return a.averagePolarity - b.averagePolarity;
        if (sortBy === 'friction') return b.sentimentBreakdown.negative - a.sentimentBreakdown.negative;
        return 0;
      });
  }, [analysis.topics, searchQuery, sentimentFilter, sortBy]);

  // Chart Data preparation
  const chartData = useMemo(() => {
    return analysis.topics.slice(0, 8).map((t) => ({
      name: truncateText(t.title, 24),
      fullTitle: t.title,
      Positive: t.sentimentBreakdown.positive,
      Neutral: t.sentimentBreakdown.neutral,
      Negative: t.sentimentBreakdown.negative,
      total: t.commentCount,
    }));
  }, [analysis.topics]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-sand-300 shadow-card space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-sand-200">
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <span className="p-2 rounded-xl bg-forest-100 text-forest-800 border border-forest-300">
                <Sparkles className="w-5 h-5 text-forest-800" />
              </span>
              <h3 className="font-display font-bold text-lg sm:text-xl text-forest-950">
                Dynamic Topic Discovery & Thematic Sentiment
              </h3>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-900 border border-forest-300">
                {analysis.totalTopics} Emergent Themes Discovered
              </span>
            </div>
            <p className="text-xs text-earth-600">
              Unsupervised clustering of N-Gram TF-IDF features with multi-clause sentiment decomposition
            </p>
          </div>

          {/* Stance Score Pill */}
          <div className="flex items-center space-x-3 bg-sand-50 p-3 rounded-xl border border-sand-300">
            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-earth-500 block">
                Net Public Stance
              </span>
              <span className="font-display font-extrabold text-lg text-forest-950">
                {analysis.sentimentSummary.netStanceScore >= 0 ? '+' : ''}
                {analysis.sentimentSummary.netStanceScore} Net Index
              </span>
            </div>
            <div className="h-8 w-px bg-sand-300" />
            <div className="text-xs space-y-0.5">
              <span className="text-forest-800 font-bold block">{analysis.sentimentSummary.positivePercentage}% Favorable</span>
              <span className="text-terracotta-700 font-bold block">{analysis.sentimentSummary.negativePercentage}% Critical</span>
            </div>
          </div>
        </div>

        {/* Visualizations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
          {/* Chart 1: Thematic Distribution Stacked Bar */}
          <div className="lg:col-span-2 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-forest-950 text-xs flex items-center space-x-1.5">
                <BarChart3 className="w-4 h-4 text-forest-700" />
                <span>Thematic Volume & Sentiment Breakdown</span>
              </h4>
              <span className="text-[11px] text-earth-500 font-medium">Submissions per topic</span>
            </div>

            <div className="h-64 w-full bg-[#FAF8F3]/60 rounded-xl p-3 border border-sand-200">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#6E5F4E' }} />
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
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }}
                  />
                  <Bar dataKey="Positive" stackId="a" fill="#477852" name="Favorable" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Neutral" stackId="a" fill="#D8CDBB" name="Neutral" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Negative" stackId="a" fill="#B86B4B" name="Critical" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Top TF-IDF N-Grams Cloud Pills */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-forest-950 text-xs flex items-center space-x-1.5">
                <Tag className="w-4 h-4 text-forest-700" />
                <span>Salient N-Gram Terms (TF-IDF)</span>
              </h4>
              <span className="text-[11px] text-earth-500 font-medium">Top distinctive terms</span>
            </div>

            <div className="h-64 overflow-y-auto bg-[#FAF8F3]/60 rounded-xl p-3.5 border border-sand-200 flex flex-wrap gap-1.5 content-start">
              {analysis.globalKeywords.slice(0, 20).map((kw, i) => (
                <span
                  key={i}
                  className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-medium border shadow-subtle ${
                    kw.dominantSentiment === 'Positive'
                      ? 'bg-forest-50 text-forest-900 border-forest-200'
                      : kw.dominantSentiment === 'Negative'
                      ? 'bg-terracotta-50 text-terracotta-900 border-terracotta-200'
                      : 'bg-white text-earth-800 border-sand-300'
                  }`}
                  title={`Doc frequency: ${kw.docCount} | TF-IDF score: ${kw.avgTfidfScore}`}
                >
                  <Hash className="w-3 h-3 opacity-60" />
                  <span>{kw.term}</span>
                  <span className="text-[9px] font-mono opacity-75 font-bold">({kw.docCount})</span>
                </span>
              ))}
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
            placeholder="Search topics by title or distinctive keywords..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-sand-300 bg-sand-50/50 focus:bg-white text-earth-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-1.5">
            <span className="font-bold text-earth-700">Sentiment:</span>
            <select
              value={sentimentFilter}
              onChange={(e) => setSentimentFilter(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg border border-sand-300 bg-white text-earth-900 font-medium focus:ring-2 focus:ring-forest-600"
            >
              <option value="All">All ({analysis.topics.length})</option>
              <option value="Positive">Positive Dominant</option>
              <option value="Neutral">Neutral Dominant</option>
              <option value="Negative">Critical Dominant</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="font-bold text-earth-700">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg border border-sand-300 bg-white text-earth-900 font-medium focus:ring-2 focus:ring-forest-600"
            >
              <option value="volume">Highest Submission Volume</option>
              <option value="friction">Highest Critical Friction</option>
              <option value="polarity-desc">Most Favorable Polarity</option>
              <option value="polarity-asc">Most Critical Polarity</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dynamic Topic Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTopics.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-white rounded-xl border border-sand-300 text-earth-500 italic">
            No dynamic topics matched your search and filter criteria.
          </div>
        ) : (
          filteredTopics.map((topic) => {
            return (
              <div
                key={topic.id}
                onClick={() => setSelectedTopic(topic)}
                className="bg-white rounded-xl p-5 border border-sand-300 shadow-card hover:shadow-card-hover hover:border-forest-600/70 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-earth-500 block">
                        Theme · {topic.id}
                      </span>
                      <h4 className="font-display font-bold text-sm sm:text-base text-forest-950 group-hover:text-forest-700 transition-colors line-clamp-2">
                        {topic.title}
                      </h4>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border flex-shrink-0 ${getSentimentBadgeClass(topic.dominantSentiment)}`}>
                      {topic.dominantSentiment}
                    </span>
                  </div>

                  {/* Volume & Percentage Strip */}
                  <div className="flex items-center justify-between text-xs pb-1 border-b border-sand-200">
                    <span className="font-mono font-bold text-forest-950">
                      {topic.commentCount} Submissions
                    </span>
                    <span className="text-earth-600 text-[11px] font-semibold">
                      {topic.commentPercentage}% of consultation
                    </span>
                  </div>

                  {/* Sentiment Proportional Multi-Color Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-semibold text-earth-600">
                      <span className="text-forest-800">{topic.sentimentPercentages.positive}% Pos</span>
                      <span className="text-earth-600">{topic.sentimentPercentages.neutral}% Neu</span>
                      <span className="text-terracotta-700">{topic.sentimentPercentages.negative}% Crit</span>
                    </div>

                    <div className="h-2 w-full bg-sand-200 rounded-full overflow-hidden flex">
                      <div
                        className="bg-forest-600 h-full transition-all"
                        style={{ width: `${topic.sentimentPercentages.positive}%` }}
                        title={`${topic.sentimentBreakdown.positive} positive submissions`}
                      />
                      <div
                        className="bg-sand-300 h-full transition-all"
                        style={{ width: `${topic.sentimentPercentages.neutral}%` }}
                        title={`${topic.sentimentBreakdown.neutral} neutral submissions`}
                      />
                      <div
                        className="bg-terracotta-500 h-full transition-all"
                        style={{ width: `${topic.sentimentPercentages.negative}%` }}
                        title={`${topic.sentimentBreakdown.negative} negative submissions`}
                      />
                    </div>
                  </div>

                  {/* Distinctive N-gram Tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {topic.keywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] bg-sand-100 text-earth-800 border border-sand-300 font-mono"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>

                  {/* Stakeholder Representation Summary */}
                  {topic.topStakeholders.length > 0 && (
                    <div className="flex items-center space-x-1.5 text-[11px] text-earth-600 pt-1">
                      <Users className="w-3.5 h-3.5 text-forest-700 flex-shrink-0" />
                      <span className="truncate">
                        Key voices: <strong>{topic.topStakeholders.map((s) => s.type).join(', ')}</strong>
                      </span>
                    </div>
                  )}

                  {/* Representative Quote Preview */}
                  {topic.representativeQuotes.length > 0 && (
                    <div className="p-2.5 rounded-lg bg-[#FAF8F3] border border-sand-200 text-xs">
                      <p className="text-earth-900 italic line-clamp-2 text-[11px]">
                        "{topic.representativeQuotes[0]}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Card CTA */}
                <div className="pt-3 border-t border-sand-200 flex items-center justify-between text-xs text-forest-800 font-bold group-hover:text-forest-900">
                  <span className="flex items-center space-x-1">
                    <MessageSquareQuote className="w-3.5 h-3.5" />
                    <span>Inspect {topic.commentCount} Submissions</span>
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Supporting Evidence Modal */}
      <TopicCommentsModal
        topic={selectedTopic}
        allComments={comments}
        onClose={() => setSelectedTopic(null)}
      />
    </div>
  );
};
