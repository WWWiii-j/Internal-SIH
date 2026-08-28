import React, { useState, useMemo } from 'react';
import { X, Search, FileText, Sparkles, Filter, ExternalLink } from 'lucide-react';
import { DynamicTopic, NormalizedCommentRecord } from '../../types';
import {
  getSentimentBadgeClass,
  getStakeholderBadgeClass,
  getStanceBadgeClass,
} from '../../utils/formatters';

interface TopicCommentsModalProps {
  topic: DynamicTopic | null;
  allComments: NormalizedCommentRecord[];
  onClose: () => void;
}

export const TopicCommentsModal: React.FC<TopicCommentsModalProps> = ({
  topic,
  allComments,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('All');

  if (!topic) return null;

  // Retrieve all supporting comments
  const supportingComments = useMemo(() => {
    return allComments.filter((c) => topic.supportingCommentIds.includes(c.id));
  }, [topic, allComments]);

  // Filtered supporting comments
  const filteredComments = useMemo(() => {
    return supportingComments.filter((c) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesText = c.cleanedText.toLowerCase().includes(q);
        const matchesId = c.submissionId.toLowerCase().includes(q);
        const matchesOrg = c.stakeholder.organization?.toLowerCase().includes(q) || false;
        if (!matchesText && !matchesId && !matchesOrg) return false;
      }

      if (selectedSentiment !== 'All' && c.sentiment?.label !== selectedSentiment) {
        return false;
      }

      return true;
    });
  }, [supportingComments, searchQuery, selectedSentiment]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF8F3] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-modal border border-sand-300 flex flex-col animate-fade-in">
        {/* Header */}
        <div className="bg-forest-800 p-5 text-white flex items-center justify-between border-b border-forest-900">
          <div className="space-y-1">
            <div className="flex items-center space-x-2.5">
              <span className="p-1.5 rounded-lg bg-forest-700 text-sage-300 border border-forest-600">
                <FileText className="w-4 h-4" />
              </span>
              <h3 className="font-display font-bold text-lg text-white">
                Supporting Evidence: {topic.title}
              </h3>
            </div>
            <p className="text-xs text-sage-300">
              {topic.commentCount} stakeholder submissions ({topic.commentPercentage}% of consultation) · Net Polarity: {topic.averagePolarity >= 0 ? '+' : ''}{topic.averagePolarity}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-sage-300 hover:text-white hover:bg-forest-700 transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Strip */}
        <div className="p-4 bg-sand-100/80 border-b border-sand-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-earth-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search supporting comments for this topic..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-sand-300 bg-white text-earth-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-earth-600 font-medium">Filter Sentiment:</span>
            <select
              value={selectedSentiment}
              onChange={(e) => setSelectedSentiment(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-sand-300 bg-white text-earth-900 font-medium focus:ring-2 focus:ring-forest-600"
            >
              <option value="All">All ({supportingComments.length})</option>
              <option value="Positive">Positive ({topic.sentimentBreakdown.positive})</option>
              <option value="Neutral">Neutral ({topic.sentimentBreakdown.neutral})</option>
              <option value="Negative">Critical ({topic.sentimentBreakdown.negative})</option>
            </select>
          </div>
        </div>

        {/* Comments List */}
        <div className="p-6 overflow-y-auto space-y-4 max-h-[60vh] text-xs text-earth-900">
          {filteredComments.length === 0 ? (
            <div className="p-8 text-center text-earth-500 italic bg-white rounded-xl border border-sand-200">
              No supporting comments matched the filter criteria.
            </div>
          ) : (
            filteredComments.map((comment) => (
              <div
                key={comment.id}
                className="p-4 rounded-xl bg-white border border-sand-300 shadow-subtle space-y-2.5 hover:border-forest-600/60 transition-colors"
              >
                {/* Meta Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-mono font-bold text-forest-950 bg-sand-100 px-2 py-0.5 rounded border border-sand-300 text-[11px]">
                      {comment.submissionId}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getStakeholderBadgeClass(comment.stakeholder.type)}`}>
                      {comment.stakeholder.type}
                    </span>
                    {comment.stakeholder.organization && (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-sand-50 text-earth-800 border border-sand-200">
                        {comment.stakeholder.organization}
                      </span>
                    )}
                    {comment.policyTarget.section && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-forest-50 text-forest-900 border border-forest-200">
                        {comment.policyTarget.section}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-1.5">
                    {comment.stance && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getStanceBadgeClass(comment.stance.label)}`}>
                        {comment.stance.label}
                      </span>
                    )}
                    {comment.sentiment && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSentimentBadgeClass(comment.sentiment.label)}`}>
                        {comment.sentiment.label} ({comment.sentiment.polarityScore >= 0 ? '+' : ''}{comment.sentiment.polarityScore})
                      </span>
                    )}
                  </div>
                </div>

                {/* Verbatim Text */}
                <p className="text-earth-950 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                  "{comment.cleanedText}"
                </p>

                {/* Keywords Tags */}
                {comment.extractedKeywords && comment.extractedKeywords.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1 pt-1">
                    <span className="text-[10px] text-earth-500 font-bold uppercase mr-1">
                      Salient terms:
                    </span>
                    {comment.extractedKeywords.map((kw, i) => (
                      <span
                        key={i}
                        className="px-1.5 py-0.2 rounded text-[10px] bg-sand-100 text-earth-800 border border-sand-300 font-mono"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-sand-100 border-t border-sand-300 flex items-center justify-between text-xs">
          <span className="text-earth-600">
            Showing {filteredComments.length} of {supportingComments.length} verified submissions
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-forest-800 hover:bg-forest-700 text-white font-semibold transition-colors"
          >
            Close Evidence Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
