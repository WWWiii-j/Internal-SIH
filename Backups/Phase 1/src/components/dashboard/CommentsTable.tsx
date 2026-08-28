import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Sparkles,
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
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/90 space-y-6">
      {/* Table Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-display font-bold text-xl text-slate-900 flex items-center space-x-2">
            <span>Granular Comments Explorer</span>
            <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full">
              {filteredRecords.length} of {records.length} comments
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Search, filter, and inspect individual stakeholder feedback with confidence and keyword breakdowns.
          </p>
        </div>

        {/* Sentiment Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => { setSentimentFilter('All'); setPage(1); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              sentimentFilter === 'All'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({records.length})
          </button>
          <button
            onClick={() => { setSentimentFilter('Positive'); setPage(1); }}
            className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              sentimentFilter === 'Positive'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
            }`}
          >
            <ThumbsUp className="w-3 h-3" />
            <span>Positive</span>
          </button>
          <button
            onClick={() => { setSentimentFilter('Negative'); setPage(1); }}
            className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              sentimentFilter === 'Negative'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
            }`}
          >
            <ThumbsDown className="w-3 h-3" />
            <span>Negative</span>
          </button>
          <button
            onClick={() => { setSentimentFilter('Neutral'); setPage(1); }}
            className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              sentimentFilter === 'Neutral'
                ? 'bg-slate-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Minus className="w-3 h-3" />
            <span>Neutral</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
        {/* Search Box (5 cols) */}
        <div className="lg:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            placeholder="Search within comments, keywords, or stakeholder type..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        {/* Sort Dropdown (3 cols) */}
        <div className="lg:col-span-3 flex items-center space-x-2">
          <ArrowUpDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="index">Original Order</option>
            <option value="confidence-desc">Highest Confidence First</option>
            <option value="confidence-asc">Lowest Confidence First</option>
            <option value="length-desc">Longest Comment First</option>
            <option value="sentiment">Group by Sentiment</option>
          </select>
        </div>

        {/* Active Filters / Reset (4 cols) */}
        <div className="lg:col-span-4 flex items-center justify-between sm:justify-end space-x-2">
          {selectedKeyword && (
            <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 text-xs font-semibold">
              <span>Tag: {selectedKeyword}</span>
              <button onClick={() => onSelectKeyword(null)}>
                <X className="w-3 h-3 hover:text-blue-950" />
              </button>
            </div>
          )}

          {(searchQuery || sentimentFilter !== 'All' || minConfidence > 0 || selectedKeyword) && (
            <button
              onClick={resetFilters}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline"
            >
              Reset Filters
            </button>
          )}

          {/* Page size */}
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-700"
          >
            <option value={10}>10 / page</option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
          </select>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4 w-12 text-center">#</th>
              <th className="py-3 px-4 min-w-[340px]">Original Comment</th>
              <th className="py-3 px-4 w-28 text-center">Sentiment</th>
              <th className="py-3 px-4 w-28 text-center">Confidence</th>
              <th className="py-3 px-4 min-w-[200px]">Extracted Keywords</th>
              <th className="py-3 px-3 w-16 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {paginatedRecords.length > 0 ? (
              paginatedRecords.map((record, index) => {
                const style = getSentimentColor(record.sentiment);
                const globalIndex = (currentPage - 1) * pageSize + index + 1;

                return (
                  <tr
                    key={record.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Index */}
                    <td className="py-3 px-4 text-center font-mono text-slate-400">
                      {globalIndex}
                    </td>

                    {/* Comment Text */}
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <p className="line-clamp-2 text-slate-800 leading-relaxed font-normal">
                          {record.originalText}
                        </p>
                        <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                          {record.stakeholderType && (
                            <span className="font-semibold text-slate-500">
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
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${style.badge}`}
                      >
                        {record.sentiment === 'Positive' && <ThumbsUp className="w-3 h-3" />}
                        {record.sentiment === 'Negative' && <ThumbsDown className="w-3 h-3" />}
                        {record.sentiment === 'Neutral' && <Minus className="w-3 h-3" />}
                        <span>{record.sentiment}</span>
                      </span>
                    </td>

                    {/* Confidence Meter */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex flex-col items-center space-y-1">
                        <span className="font-mono font-bold text-slate-800 text-xs">
                          {formatConfidence(record.confidence)}
                        </span>
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
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
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {record.keywords.map((kw) => (
                          <button
                            key={kw}
                            onClick={() => onSelectKeyword(kw)}
                            className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-slate-100 hover:bg-blue-100 hover:text-blue-800 text-slate-600 text-[10px] font-medium transition-colors"
                          >
                            <Tag className="w-2.5 h-2.5 text-slate-400" />
                            <span>{kw}</span>
                          </button>
                        ))}
                      </div>
                    </td>

                    {/* View Button */}
                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => onSelectModalComment(record)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="View Full Submission"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400 text-xs italic">
                  No comments match your search criteria. Try clearing filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-slate-500">
        <div>
          Showing{' '}
          <span className="font-semibold text-slate-800">
            {filteredRecords.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}
          </span>{' '}
          to{' '}
          <span className="font-semibold text-slate-800">
            {Math.min(currentPage * pageSize, filteredRecords.length)}
          </span>{' '}
          of <span className="font-semibold text-slate-800">{filteredRecords.length}</span> results
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-slate-700"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          <span className="px-3 py-1 font-semibold text-slate-700">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-slate-700"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Comment Detail Modal */}
      {selectedModalComment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 border border-slate-200 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <span
                  className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                    getSentimentColor(selectedModalComment.sentiment).badge
                  }`}
                >
                  <span>{selectedModalComment.sentiment} Sentiment</span>
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  Confidence: {formatConfidence(selectedModalComment.confidence)}
                </span>
              </div>
              <button
                onClick={() => onSelectModalComment(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Full Stakeholder Submission
              </h4>
              <p className="text-slate-800 text-sm leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                "{selectedModalComment.originalText}"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Stakeholder Type
                </span>
                <span className="font-semibold text-slate-800">
                  {selectedModalComment.stakeholderType || 'Citizen Reviewer'}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  Category / Domain
                </span>
                <span className="font-semibold text-slate-800">
                  {selectedModalComment.category || 'General Feedback'}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Identified Keywords
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedModalComment.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-xs font-medium"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => onSelectModalComment(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
