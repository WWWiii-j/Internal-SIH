import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Tag,
  ThumbsUp,
  ThumbsDown,
  Minus,
} from 'lucide-react';
import { CommentRecord, SentimentType } from '../../types';
import { formatConfidence, getSentimentColor } from '../../utils/formatters';

interface CommentsTableProps {
  records: CommentRecord[];
  selectedKeyword: string | null;
  onSelectKeyword: (kw: string | null) => void;
  selectedModalComment: CommentRecord | null;
  onSelectModalComment: (c: CommentRecord | null) => void;
}

export const CommentsTable: React.FC<CommentsTableProps> = ({
  records,
  selectedKeyword,
  onSelectKeyword,
  selectedModalComment,
  onSelectModalComment,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState<'All' | SentimentType>('All');
  const [minConfidence, setMinConfidence] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'index' | 'confidence-desc' | 'confidence-asc' | 'sentiment' | 'length-desc'>('index');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter and Sort Logic
  const filteredRecords = useMemo(() => {
    return records
      .filter((r) => {
        // Sentiment filter
        if (sentimentFilter !== 'All' && r.sentiment !== sentimentFilter) return false;

        // Confidence filter
        if (r.confidence < minConfidence) return false;

        // Keyword filter from WordCloud or tag click
        if (selectedKeyword && !r.keywords.includes(selectedKeyword)) return false;

        // Search query filter across text & keywords
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesText = r.originalText.toLowerCase().includes(q);
          const matchesKeyword = r.keywords.some((k) => k.toLowerCase().includes(q));
          const matchesCategory = (r.category || '').toLowerCase().includes(q);
          const matchesStakeholder = (r.stakeholderType || '').toLowerCase().includes(q);
          if (!matchesText && !matchesKeyword && !matchesCategory && !matchesStakeholder) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'confidence-desc') return b.confidence - a.confidence;
        if (sortBy === 'confidence-asc') return a.confidence - b.confidence;
        if (sortBy === 'length-desc') return b.originalText.length - a.originalText.length;
        if (sortBy === 'sentiment') return a.sentiment.localeCompare(b.sentiment);
        return 0; // Default index
      });
  }, [records, sentimentFilter, minConfidence, selectedKeyword, searchQuery, sortBy]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const resetFilters = () => {
    setSearchQuery('');
    setSentimentFilter('All');
    setMinConfidence(0);
    onSelectKeyword(null);
    setSortBy('index');
    setPage(1);
  };

  return (
    <div className="bg-white rounded-xl p-5 sm:p-6 shadow-card border border-sand-300 space-y-4">
      {/* Table Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-sand-200">
        <div>
          <h3 className="font-display font-bold text-lg text-forest-950 flex items-center space-x-2">
            <span>Granular Comments Explorer</span>
            <span className="text-xs font-mono font-semibold bg-sand-100 text-earth-800 px-2 py-0.5 rounded border border-sand-300">
              {filteredRecords.length} of {records.length} records
            </span>
          </h3>
          <p className="text-xs text-earth-600 mt-0.5">
            Search, filter, and inspect individual stakeholder feedback with confidence and keyword breakdowns.
          </p>
        </div>

        {/* Sentiment Filter Pills */}
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => { setSentimentFilter('All'); setPage(1); }}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              sentimentFilter === 'All'
                ? 'bg-forest-800 text-white shadow-sm'
                : 'bg-sand-100 text-earth-800 hover:bg-sand-200'
            }`}
          >
            All ({records.length})
          </button>
          <button
            type="button"
            onClick={() => { setSentimentFilter('Positive'); setPage(1); }}
            className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              sentimentFilter === 'Positive'
                ? 'bg-forest-800 text-white shadow-sm'
                : 'bg-forest-50 text-forest-900 hover:bg-forest-100 border border-forest-300'
            }`}
          >
            <ThumbsUp className="w-3 h-3 text-forest-700" />
            <span>Favorable</span>
          </button>
          <button
            type="button"
            onClick={() => { setSentimentFilter('Negative'); setPage(1); }}
            className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              sentimentFilter === 'Negative'
                ? 'bg-terracotta-700 text-white shadow-sm'
                : 'bg-terracotta-50 text-terracotta-900 hover:bg-terracotta-100 border border-terracotta-300'
            }`}
          >
            <ThumbsDown className="w-3 h-3 text-terracotta-700" />
            <span>Critical</span>
          </button>
          <button
            type="button"
            onClick={() => { setSentimentFilter('Neutral'); setPage(1); }}
            className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              sentimentFilter === 'Neutral'
                ? 'bg-earth-800 text-white shadow-sm'
                : 'bg-sand-100 text-earth-800 hover:bg-sand-200 border border-sand-300'
            }`}
          >
            <Minus className="w-3 h-3 text-earth-600" />
            <span>Neutral</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 items-center">
        {/* Search Box (5 cols) */}
        <div className="lg:col-span-5 relative">
          <Search className="w-4 h-4 text-earth-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            placeholder="Search in feedback text, keywords, or stakeholder type..."
            className="w-full pl-9 pr-3.5 py-1.5 text-xs rounded-lg border border-sand-300 bg-white text-earth-900 focus:outline-none focus:ring-2 focus:ring-forest-600 shadow-sm"
          />
        </div>

        {/* Sort Dropdown (3 cols) */}
        <div className="lg:col-span-3 flex items-center space-x-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-earth-500 flex-shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-sand-300 bg-white font-medium text-earth-800 focus:outline-none focus:ring-2 focus:ring-forest-600"
          >
            <option value="index">Original Row Order</option>
            <option value="confidence-desc">Highest Confidence First</option>
            <option value="confidence-asc">Lowest Confidence First</option>
            <option value="length-desc">Longest Comment First</option>
            <option value="sentiment">Group by Sentiment</option>
          </select>
        </div>

        {/* Active Filters / Reset (4 cols) */}
        <div className="lg:col-span-4 flex items-center justify-between sm:justify-end space-x-2">
          {selectedKeyword && (
            <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-forest-100 text-forest-900 border border-forest-300 text-xs font-semibold">
              <span>Keyword: {selectedKeyword}</span>
              <button onClick={() => onSelectKeyword(null)} title="Clear keyword filter">
                <X className="w-3 h-3 hover:text-forest-950" />
              </button>
            </div>
          )}

          {(searchQuery || sentimentFilter !== 'All' || minConfidence > 0 || selectedKeyword) && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs text-forest-800 hover:text-forest-950 font-semibold underline"
            >
              Reset
            </button>
          )}

          {/* Page size */}
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="px-2 py-1.5 text-xs rounded-lg border border-sand-300 bg-white text-earth-800 font-medium"
          >
            <option value={10}>10 / page</option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto rounded-lg border border-sand-300">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-forest-800 text-earth-50 font-semibold uppercase tracking-wider text-[10px]">
              <th className="py-2.5 px-3 w-10 text-center">#</th>
              <th className="py-2.5 px-4 min-w-[340px]">Stakeholder Submission</th>
              <th className="py-2.5 px-3 w-28 text-center">Sentiment</th>
              <th className="py-2.5 px-3 w-24 text-center">Confidence</th>
              <th className="py-2.5 px-4 min-w-[180px]">Key Terms</th>
              <th className="py-2.5 px-3 w-14 text-center">Inspect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-200 text-earth-800">
            {paginatedRecords.length > 0 ? (
              paginatedRecords.map((record, index) => {
                const style = getSentimentColor(record.sentiment);
                const globalIndex = (currentPage - 1) * pageSize + index + 1;

                return (
                  <tr
                    key={record.id}
                    className="hover:bg-sand-50/80 transition-colors group"
                  >
                    {/* Index */}
                    <td className="py-2.5 px-3 text-center font-mono text-earth-500 text-[11px]">
                      {globalIndex}
                    </td>

                    {/* Comment Text */}
                    <td className="py-2.5 px-4">
                      <div className="space-y-0.5">
                        <p className="line-clamp-2 text-earth-950 leading-relaxed font-normal">
                          {record.originalText}
                        </p>
                        <div className="flex items-center space-x-1.5 text-[10px] text-earth-600">
                          {record.stakeholderType && (
                            <span className="font-semibold text-earth-800">
                              {record.stakeholderType}
                            </span>
                          )}
                          {record.category && (
                            <>
                              <span>•</span>
                              <span>{record.category}</span>
                            </>
                          )}
                          <span>•</span>
                          <span>{record.length} chars</span>
                        </div>
                      </div>
                    </td>

                    {/* Sentiment Badge */}
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${style.badge}`}
                      >
                        {record.sentiment === 'Positive' && <ThumbsUp className="w-2.5 h-2.5" />}
                        {record.sentiment === 'Negative' && <ThumbsDown className="w-2.5 h-2.5" />}
                        {record.sentiment === 'Neutral' && <Minus className="w-2.5 h-2.5" />}
                        <span>{record.sentiment}</span>
                      </span>
                    </td>

                    {/* Confidence Meter */}
                    <td className="py-2.5 px-3 text-center">
                      <div className="flex flex-col items-center space-y-0.5">
                        <span className="font-mono font-bold text-earth-900 text-[11px]">
                          {formatConfidence(record.confidence)}
                        </span>
                        <div className="w-14 h-1 bg-sand-200 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${record.confidence * 100}%`,
                              backgroundColor: style.hex,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Keywords */}
                    <td className="py-2.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {record.keywords.map((kw) => (
                          <button
                            key={kw}
                            type="button"
                            onClick={() => onSelectKeyword(kw)}
                            className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-sand-100 hover:bg-forest-100 hover:text-forest-900 text-earth-700 text-[10px] font-medium transition-colors border border-sand-300"
                          >
                            <Tag className="w-2 h-2 text-earth-500" />
                            <span>{kw}</span>
                          </button>
                        ))}
                      </div>
                    </td>

                    {/* View Button */}
                    <td className="py-2.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => onSelectModalComment(record)}
                        className="p-1 rounded text-earth-500 hover:text-forest-800 hover:bg-sand-100 transition-colors"
                        title="View Full Submission"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-10 text-center text-earth-500 text-xs italic">
                  No submissions match your search criteria. Try clearing filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs text-earth-600">
        <div>
          Showing{' '}
          <span className="font-semibold font-mono text-earth-900">
            {filteredRecords.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
          </span>{' '}
          to{' '}
          <span className="font-semibold font-mono text-earth-900">
            {Math.min(currentPage * pageSize, filteredRecords.length)}
          </span>{' '}
          of <span className="font-semibold font-mono text-earth-900">{filteredRecords.length}</span> results
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-sand-300 bg-white hover:bg-sand-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-earth-800 text-xs"
          >
            <ChevronLeft className="w-3 h-3" />
            <span>Previous</span>
          </button>

          <span className="px-2 py-0.5 font-semibold text-earth-900 text-xs font-mono">
            Page {currentPage} of {totalPages}
          </span>

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg border border-sand-300 bg-white hover:bg-sand-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-earth-800 text-xs"
          >
            <span>Next</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Comment Detail Modal */}
      {selectedModalComment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#FAF8F3] rounded-2xl shadow-modal max-w-2xl w-full p-6 border border-sand-300 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-sand-200">
              <div className="flex items-center space-x-2.5">
                <span
                  className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded text-xs font-bold border ${
                    getSentimentColor(selectedModalComment.sentiment).badge
                  }`}
                >
                  <span>{selectedModalComment.sentiment} Sentiment</span>
                </span>
                <span className="text-xs text-earth-600 font-mono">
                  Confidence: {formatConfidence(selectedModalComment.confidence)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onSelectModalComment(null)}
                className="p-1 rounded-lg text-earth-500 hover:text-earth-900 hover:bg-sand-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-earth-600">
                Full Stakeholder Submission
              </h4>
              <p className="text-earth-900 text-xs sm:text-sm leading-relaxed bg-white p-4 rounded-xl border border-sand-300 shadow-subtle">
                "{selectedModalComment.originalText}"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-sand-300">
                <span className="text-[10px] font-bold text-earth-500 uppercase block mb-0.5">
                  Stakeholder Type
                </span>
                <span className="font-semibold text-earth-900">
                  {selectedModalComment.stakeholderType || 'Citizen Reviewer'}
                </span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-sand-300">
                <span className="text-[10px] font-bold text-earth-500 uppercase block mb-0.5">
                  Thematic Domain
                </span>
                <span className="font-semibold text-earth-900">
                  {selectedModalComment.category || 'General Consultation'}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-earth-600 mb-1.5">
                Extracted Keyword Tokens
              </h4>
              <div className="flex flex-wrap gap-1">
                {selectedModalComment.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="px-2 py-0.5 rounded bg-forest-50 text-forest-900 border border-forest-200 text-xs font-medium"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => onSelectModalComment(null)}
                className="px-4 py-2 bg-forest-800 hover:bg-forest-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Close Submission View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


