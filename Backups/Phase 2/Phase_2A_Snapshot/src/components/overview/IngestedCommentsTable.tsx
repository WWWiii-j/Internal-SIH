import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Copy,
  Layers,
  Users,
  FileText,
  AlertTriangle,
  X,
} from 'lucide-react';
import { ConsultationDataset, NormalizedCommentRecord } from '../../types';
import { getStakeholderBadgeClass, truncateText } from '../../utils/formatters';

interface IngestedCommentsTableProps {
  dataset: ConsultationDataset;
}

export const IngestedCommentsTable: React.FC<IngestedCommentsTableProps> = ({ dataset }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStakeholder, setSelectedStakeholder] = useState<string>('All');
  const [selectedSection, setSelectedSection] = useState<string>('All');
  const [filterDuplicatesOnly, setFilterDuplicatesOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'index' | 'length-desc' | 'length-asc' | 'stakeholder'>('index');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [activeModalComment, setActiveModalComment] = useState<NormalizedCommentRecord | null>(null);

  // Distinct Filter Options
  const stakeholderOptions = useMemo(() => {
    const types = new Set<string>();
    dataset.comments.forEach((c) => types.add(c.stakeholder.type));
    return Array.from(types).sort();
  }, [dataset]);

  const sectionOptions = useMemo(() => {
    const sections = new Set<string>();
    dataset.comments.forEach((c) => {
      if (c.policyTarget.section) sections.add(c.policyTarget.section);
    });
    return Array.from(sections).sort();
  }, [dataset]);

  // Filtered & Sorted Comments
  const filteredComments = useMemo(() => {
    return dataset.comments
      .filter((c) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesText = c.cleanedText.toLowerCase().includes(q);
          const matchesId = c.submissionId.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
          const matchesOrg = c.stakeholder.organization?.toLowerCase().includes(q) || false;
          if (!matchesText && !matchesId && !matchesOrg) return false;
        }

        // Stakeholder filter
        if (selectedStakeholder !== 'All' && c.stakeholder.type !== selectedStakeholder) {
          return false;
        }

        // Section filter
        if (selectedSection !== 'All' && c.policyTarget.section !== selectedSection) {
          return false;
        }

        // Duplicate filter
        if (filterDuplicatesOnly && !c.isDuplicate) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'length-desc') return b.wordCount - a.wordCount;
        if (sortBy === 'length-asc') return a.wordCount - b.wordCount;
        if (sortBy === 'stakeholder') return a.stakeholder.type.localeCompare(b.stakeholder.type);
        return 0;
      });
  }, [dataset, searchQuery, selectedStakeholder, selectedSection, filterDuplicatesOnly, sortBy]);

  const totalPages = Math.ceil(filteredComments.length / pageSize) || 1;
  const paginatedComments = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredComments.slice(start, start + pageSize);
  }, [filteredComments, page, pageSize]);

  return (
    <div className="bg-white rounded-xl border border-sand-300 shadow-card overflow-hidden space-y-4 p-5 sm:p-6">
      {/* Table Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-sand-200">
        <div>
          <h3 className="font-display font-bold text-base text-forest-950 flex items-center space-x-2">
            <span>Normalized Submissions Explorer</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-900 border border-forest-300">
              {filteredComments.length} of {dataset.comments.length} Submissions
            </span>
          </h3>
          <p className="text-xs text-earth-600 mt-0.5">
            Search, filter, and inspect cleaned consultation inputs with full submission traceability
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-earth-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search comments, IDs, orgs..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-sand-300 bg-sand-50/50 focus:bg-white text-earth-900 focus:outline-none focus:ring-2 focus:ring-forest-600 transition-colors"
          />
        </div>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        {/* Stakeholder Filter */}
        <div>
          <label className="block text-[11px] font-bold text-earth-700 mb-1">
            Stakeholder Segment
          </label>
          <select
            value={selectedStakeholder}
            onChange={(e) => {
              setSelectedStakeholder(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-1.5 rounded-lg border border-sand-300 bg-white text-earth-900 focus:ring-2 focus:ring-forest-600"
          >
            <option value="All">All Stakeholders ({dataset.comments.length})</option>
            {stakeholderOptions.map((st) => (
              <option key={st} value={st}>
                {st} ({dataset.comments.filter((c) => c.stakeholder.type === st).length})
              </option>
            ))}
          </select>
        </div>

        {/* Policy Section Filter */}
        <div>
          <label className="block text-[11px] font-bold text-earth-700 mb-1">
            Policy Section / Clause
          </label>
          <select
            value={selectedSection}
            onChange={(e) => {
              setSelectedSection(e.target.value);
              setPage(1);
            }}
            className="w-full px-3 py-1.5 rounded-lg border border-sand-300 bg-white text-earth-900 focus:ring-2 focus:ring-forest-600"
          >
            <option value="All">All Sections ({dataset.comments.length})</option>
            {sectionOptions.map((sec) => (
              <option key={sec} value={sec}>
                {sec} ({dataset.comments.filter((c) => c.policyTarget.section === sec).length})
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-[11px] font-bold text-earth-700 mb-1">
            Sort Order
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full px-3 py-1.5 rounded-lg border border-sand-300 bg-white text-earth-900 focus:ring-2 focus:ring-forest-600"
          >
            <option value="index">Original Sequence</option>
            <option value="length-desc">Length: Longest First</option>
            <option value="length-asc">Length: Shortest First</option>
            <option value="stakeholder">Stakeholder Type</option>
          </select>
        </div>

        {/* Duplicate Toggle */}
        <div className="flex items-end">
          <label className="flex items-center space-x-2 p-2 rounded-lg border border-sand-300 bg-sand-50/70 hover:bg-sand-100 cursor-pointer w-full select-none">
            <input
              type="checkbox"
              checked={filterDuplicatesOnly}
              onChange={(e) => {
                setFilterDuplicatesOnly(e.target.checked);
                setPage(1);
              }}
              className="rounded text-forest-700 focus:ring-forest-600"
            />
            <span className="text-[11px] font-semibold text-earth-800">
              Duplicates Only ({dataset.diagnostics.exactDuplicateRows + dataset.diagnostics.nearDuplicateRows})
            </span>
          </label>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto border border-sand-300 rounded-xl">
        <table className="min-w-full divide-y divide-sand-200 text-xs">
          <thead className="bg-sand-100 text-earth-800 font-bold uppercase tracking-wider text-[10px]">
            <tr>
              <th className="px-3 py-2.5 text-left w-20">ID</th>
              <th className="px-3 py-2.5 text-left w-44">Stakeholder</th>
              <th className="px-3 py-2.5 text-left w-36">Policy Section</th>
              <th className="px-3 py-2.5 text-left">Cleaned Comment Text</th>
              <th className="px-3 py-2.5 text-center w-20">Words</th>
              <th className="px-3 py-2.5 text-right w-16">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-100 bg-white">
            {paginatedComments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-earth-500 italic">
                  No submissions matched your search and filter criteria.
                </td>
              </tr>
            ) : (
              paginatedComments.map((comment) => (
                <tr
                  key={comment.id}
                  onClick={() => setActiveModalComment(comment)}
                  className="hover:bg-sand-50/90 cursor-pointer transition-colors"
                >
                  <td className="px-3 py-2.5 font-mono font-bold text-forest-950 text-[11px]">
                    {comment.submissionId}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="space-y-1">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${getStakeholderBadgeClass(comment.stakeholder.type)}`}>
                        {comment.stakeholder.type}
                      </span>
                      {comment.stakeholder.organization && (
                        <p className="text-[10px] text-earth-600 font-medium truncate max-w-[150px]">
                          {comment.stakeholder.organization}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="font-semibold text-forest-900 text-[11px] block">
                      {comment.policyTarget.section || 'General'}
                    </span>
                    {comment.policyTarget.category && (
                      <span className="text-[10px] text-earth-500 block truncate max-w-[130px]">
                        {comment.policyTarget.category}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="space-y-1">
                      <p className="text-earth-900 text-xs leading-relaxed line-clamp-2">
                        {comment.cleanedText}
                      </p>
                      {comment.isDuplicate && (
                        <span className="inline-flex items-center space-x-1 text-[10px] text-terracotta-800 bg-terracotta-50 px-1.5 py-0.2 rounded border border-terracotta-200 font-medium">
                          <Copy className="w-3 h-3 text-terracotta-600" />
                          <span>Repeated submission</span>
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-center font-mono text-[11px] text-earth-600">
                    {comment.wordCount}
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveModalComment(comment);
                      }}
                      className="p-1 rounded-md text-earth-600 hover:text-forest-900 hover:bg-sand-200 transition-colors"
                      title="Inspect full submission details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-earth-600">
        <div className="flex items-center space-x-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="px-2 py-1 rounded border border-sand-300 bg-white text-earth-900"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>
            Showing {(page - 1) * pageSize + 1} -{' '}
            {Math.min(page * pageSize, filteredComments.length)} of {filteredComments.length}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg border border-sand-300 bg-white hover:bg-sand-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-semibold text-earth-900">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-lg border border-sand-300 bg-white hover:bg-sand-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Comment Detail Modal */}
      {activeModalComment && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#FAF8F3] rounded-2xl max-w-2xl w-full overflow-hidden shadow-modal border border-sand-300 flex flex-col animate-fade-in">
            <div className="bg-forest-800 p-4 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <FileText className="w-4 h-4 text-sage-300" />
                <h4 className="font-display font-bold text-sm">
                  Submission Detail · {activeModalComment.submissionId}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalComment(null)}
                className="p-1 rounded-lg text-sage-300 hover:text-white hover:bg-forest-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-earth-900 max-h-[75vh] overflow-y-auto">
              {/* Metadata Pills */}
              <div className="flex flex-wrap gap-2">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${getStakeholderBadgeClass(activeModalComment.stakeholder.type)}`}>
                  Stakeholder: {activeModalComment.stakeholder.type}
                </span>
                {activeModalComment.policyTarget.section && (
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-forest-100 text-forest-900 border border-forest-300">
                    Target: {activeModalComment.policyTarget.section}
                  </span>
                )}
                {activeModalComment.stakeholder.organization && (
                  <span className="px-2.5 py-1 rounded-lg text-xs bg-white text-earth-800 border border-sand-300">
                    Org: {activeModalComment.stakeholder.organization}
                  </span>
                )}
                {activeModalComment.stakeholder.region && (
                  <span className="px-2.5 py-1 rounded-lg text-xs bg-white text-earth-800 border border-sand-300">
                    Region: {activeModalComment.stakeholder.region}
                  </span>
                )}
              </div>

              {/* Full Text */}
              <div className="p-4 rounded-xl bg-white border border-sand-300 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-earth-500 block">
                  Verbatim Cleaned Feedback Text
                </span>
                <p className="text-earth-950 text-sm leading-relaxed whitespace-pre-wrap">
                  "{activeModalComment.cleanedText}"
                </p>
                <div className="flex items-center space-x-4 pt-2 border-t border-sand-200 text-[11px] text-earth-500">
                  <span>Word count: <strong>{activeModalComment.wordCount}</strong></span>
                  <span>Character count: <strong>{activeModalComment.charCount}</strong></span>
                  {activeModalComment.timestamp && <span>Date: <strong>{activeModalComment.timestamp}</strong></span>}
                </div>
              </div>

              {/* Duplicate Notice if any */}
              {activeModalComment.isDuplicate && (
                <div className="p-3.5 rounded-xl bg-terracotta-50 border border-terracotta-200 text-terracotta-900 text-xs flex items-start space-x-2">
                  <Copy className="w-4 h-4 text-terracotta-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Repeated Submission Detected</span>
                    <p className="text-[11px] text-terracotta-800 mt-0.5">
                      This input matches or near-duplicates an earlier submission in this consultation round ({activeModalComment.duplicateOfId || 'Earlier ID'}).
                    </p>
                  </div>
                </div>
              )}

              {/* Raw CSV Row JSON */}
              <div className="p-3 rounded-xl bg-sand-100 border border-sand-300 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-earth-500 block">
                  Raw CSV Row Metadata
                </span>
                <pre className="text-[10px] font-mono text-earth-800 overflow-x-auto p-2 bg-white rounded border border-sand-200">
                  {JSON.stringify(activeModalComment.rawRow, null, 2)}
                </pre>
              </div>
            </div>

            <div className="p-3 bg-sand-100 border-t border-sand-300 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModalComment(null)}
                className="px-4 py-1.5 rounded-lg bg-forest-800 hover:bg-forest-700 text-white font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
