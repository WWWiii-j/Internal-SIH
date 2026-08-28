import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  FileText,
  AlertTriangle,
  Flame,
  Clock,
  Users,
  Layers,
  Calculator,
  CheckCircle2,
} from 'lucide-react';
import { KeyIssue, NormalizedCommentRecord } from '../../types';
import {
  getPriorityBadgeClass,
  getPriorityScoreColor,
  getSentimentBadgeClass,
  getStakeholderBadgeClass,
  getStanceBadgeClass,
} from '../../utils/formatters';

interface IssueDetailModalProps {
  issue: KeyIssue | null;
  allComments: NormalizedCommentRecord[];
  onClose: () => void;
}

export const IssueDetailModal: React.FC<IssueDetailModalProps> = ({
  issue,
  allComments,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'evidence' | 'formula'>('evidence');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('All');

  if (!issue) return null;

  const supportingComments = useMemo(() => {
    return allComments.filter((c) => issue.supportingCommentIds.includes(c.id));
  }, [issue, allComments]);

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

  const scoreStyle = getPriorityScoreColor(issue.priorityScore);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF8F3] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-modal border border-sand-300 flex flex-col animate-fade-in">
        {/* Header */}
        <div className="bg-forest-800 p-5 text-white flex items-center justify-between border-b border-forest-900">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-extrabold border ${getPriorityBadgeClass(issue.priorityLevel)}`}>
                {issue.priorityLevel} PRIORITY
              </span>
              <span className="font-mono text-xs font-bold bg-forest-900 text-sage-300 px-2 py-0.5 rounded border border-forest-700">
                Score: {issue.priorityScore} / 100
              </span>
              <span className="text-xs text-sage-300">
                {issue.commentCount} Submissions ({issue.commentPercentage}% of dataset)
              </span>
            </div>
            <h3 className="font-display font-bold text-lg sm:text-xl text-white">
              {issue.title}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-sage-300 hover:text-white hover:bg-forest-700 transition-colors focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-sand-300 bg-sand-100/70 px-6 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('evidence')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'evidence'
                ? 'border-forest-800 text-forest-950 bg-white rounded-t-lg shadow-subtle'
                : 'border-transparent text-earth-600 hover:text-earth-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-forest-700" />
            <span>Supporting Submissions ({supportingComments.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('formula')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'formula'
                ? 'border-forest-800 text-forest-950 bg-white rounded-t-lg shadow-subtle'
                : 'border-transparent text-earth-600 hover:text-earth-900'
            }`}
          >
            <Calculator className="w-3.5 h-3.5 text-forest-700" />
            <span>Explainable Priority Formula & Rationale</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-earth-900 max-h-[60vh]">
          {/* Tab 1: Evidence & Comments */}
          {activeTab === 'evidence' && (
            <div className="space-y-4">
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white rounded-xl border border-sand-300 shadow-subtle">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-earth-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search supporting comments for this key issue..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-sand-300 bg-sand-50/50 focus:bg-white text-earth-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
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
                    <option value="Positive">Positive</option>
                    <option value="Neutral">Neutral</option>
                    <option value="Negative">Critical</option>
                  </select>
                </div>
              </div>

              {/* Submissions List */}
              <div className="space-y-3">
                {filteredComments.length === 0 ? (
                  <div className="p-8 text-center text-earth-500 italic bg-white rounded-xl border border-sand-200">
                    No submissions matched the filter criteria.
                  </div>
                ) : (
                  filteredComments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-4 rounded-xl bg-white border border-sand-300 shadow-subtle space-y-2 hover:border-forest-600/70 transition-colors"
                    >
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

                      <p className="text-earth-950 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                        "{comment.cleanedText}"
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Formula & Explainability */}
          {activeTab === 'formula' && (
            <div className="space-y-6">
              {/* Natural Language Rationale Box */}
              <div className="p-4 rounded-xl bg-forest-50 border-2 border-forest-600/50 shadow-subtle space-y-2">
                <h4 className="font-bold text-forest-950 text-xs flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-forest-700" />
                  <span>Explainable Decision Rationale</span>
                </h4>
                <p className="text-earth-900 text-xs leading-relaxed font-medium">
                  {issue.explanation}
                </p>
              </div>

              {/* 4-Factor Score Composition Breakdown */}
              <div className="bg-white rounded-xl p-5 border border-sand-300 shadow-subtle space-y-4">
                <h4 className="font-display font-bold text-forest-950 text-sm">
                  Multi-Factor Priority Score Composition (0–100 Scale)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Factor 1: Frequency Weight */}
                  <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200 space-y-2">
                    <div className="flex justify-between items-center font-bold text-xs text-forest-950">
                      <span>1. Issue Prevalence & Volume</span>
                      <span className="font-mono text-forest-900">
                        {issue.scoreBreakdown.frequencyScore} / 25 pts
                      </span>
                    </div>
                    <p className="text-[11px] text-earth-600">
                      Calculated from {issue.commentCount} submissions ({issue.commentPercentage}% of consultation).
                    </p>
                    <div className="w-full bg-sand-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-forest-700 h-full rounded-full"
                        style={{ width: `${(issue.scoreBreakdown.frequencyScore / 25) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Factor 2: Negative Sentiment Ratio */}
                  <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200 space-y-2">
                    <div className="flex justify-between items-center font-bold text-xs text-forest-950">
                      <span>2. Critical Sentiment Ratio</span>
                      <span className="font-mono text-terracotta-800">
                        {issue.scoreBreakdown.negativeRatioScore} / 35 pts
                      </span>
                    </div>
                    <p className="text-[11px] text-earth-600">
                      Based on {issue.negativeSentimentPercentage}% critical opposition ratio in this topic cluster.
                    </p>
                    <div className="w-full bg-sand-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-terracotta-600 h-full rounded-full"
                        style={{ width: `${(issue.scoreBreakdown.negativeRatioScore / 35) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Factor 3: Severity Indicators */}
                  <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200 space-y-2">
                    <div className="flex justify-between items-center font-bold text-xs text-forest-950">
                      <span>3. Hardship & Severity Density</span>
                      <span className="font-mono text-terracotta-800">
                        {issue.scoreBreakdown.severityScore} / 20 pts
                      </span>
                    </div>
                    <p className="text-[11px] text-earth-600">
                      Triggers matched: {issue.severityIndicators.length > 0 ? issue.severityIndicators.map((t) => `'${t}'`).join(', ') : 'None detected'}.
                    </p>
                    <div className="w-full bg-sand-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-terracotta-600 h-full rounded-full"
                        style={{ width: `${(issue.scoreBreakdown.severityScore / 20) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Factor 4: Urgency / Risk Indicators */}
                  <div className="p-3.5 rounded-xl bg-sand-50 border border-sand-200 space-y-2">
                    <div className="flex justify-between items-center font-bold text-xs text-forest-950">
                      <span>4. Urgency & Legislative Risk</span>
                      <span className="font-mono text-olive-800">
                        {issue.scoreBreakdown.urgencyRiskScore} / 20 pts
                      </span>
                    </div>
                    <p className="text-[11px] text-earth-600">
                      Triggers matched: {issue.urgencyIndicators.length > 0 ? issue.urgencyIndicators.map((t) => `'${t}'`).join(', ') : 'None detected'}.
                    </p>
                    <div className="w-full bg-sand-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-olive-600 h-full rounded-full"
                        style={{ width: `${(issue.scoreBreakdown.urgencyRiskScore / 20) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Formula Sum Row */}
                <div className="p-3 bg-sand-100 rounded-xl border border-sand-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                  <span className="text-earth-700">
                    Formula: {issue.scoreBreakdown.frequencyScore} (Freq) + {issue.scoreBreakdown.negativeRatioScore} (Neg Ratio) + {issue.scoreBreakdown.severityScore} (Severity) + {issue.scoreBreakdown.urgencyRiskScore} (Urgency)
                  </span>
                  <span className="font-bold text-forest-950 text-sm">
                    = {issue.priorityScore} / 100
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-sand-100 border-t border-sand-300 flex items-center justify-between text-xs">
          <span className="text-earth-600">
            Deterministic Decision Score: {issue.priorityScore}/100 ({issue.priorityLevel} PRIORITY)
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-forest-800 hover:bg-forest-700 text-white font-semibold transition-colors"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
