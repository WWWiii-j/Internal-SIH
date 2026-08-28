import React from 'react';
import { ThumbsUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { CommentRecord } from '../../types';
import { formatConfidence } from '../../utils/formatters';

interface InsightsCardsProps {
  records: CommentRecord[];
  onSelectComment?: (comment: CommentRecord) => void;
}

export const InsightsCards: React.FC<InsightsCardsProps> = ({ records, onSelectComment }) => {
  // Top positive comments by confidence
  const positiveComments = records
    .filter((r) => r.sentiment === 'Positive')
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3);

  // Top negative concerns by confidence
  const negativeComments = records
    .filter((r) => r.sentiment === 'Negative')
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3);

  // Top suggestions & proposals
  const suggestionComments = records
    .filter(
      (r) =>
        r.originalText.toLowerCase().includes('suggest') ||
        r.originalText.toLowerCase().includes('recommend') ||
        r.originalText.toLowerCase().includes('should') ||
        r.originalText.toLowerCase().includes('propose') ||
        r.originalText.toLowerCase().includes('must') ||
        r.originalText.toLowerCase().includes('extend') ||
        r.originalText.toLowerCase().includes('provide')
    )
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* 1. Key Positive Feedback */}
      <div className="bg-white rounded-xl p-5 sm:p-6 shadow-card border border-sand-300 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2.5 mb-4">
            <div className="p-1.5 rounded-lg bg-forest-100 text-forest-800">
              <ThumbsUp className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-display font-bold text-forest-950 text-sm">
                Key Positive Submissions
              </h4>
              <p className="text-[11px] text-earth-600">Representative supportive stakeholder comments</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {positiveComments.length > 0 ? (
              positiveComments.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectComment?.(item)}
                  className="p-3 rounded-lg bg-forest-50/70 hover:bg-forest-100/70 border border-forest-200/80 text-xs transition-colors cursor-pointer"
                >
                  <p className="text-forest-950 italic leading-relaxed">
                    "{item.originalText}"
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-forest-200/60 text-[10px] text-forest-900">
                    <span className="font-semibold">{item.stakeholderType || item.category || 'Citizen Reviewer'}</span>
                    <span className="font-mono bg-forest-100 px-1.5 py-0.2 rounded font-semibold text-forest-800 border border-forest-300">
                      {formatConfidence(item.confidence)} conf
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-earth-500 italic">No positive comments recorded.</p>
            )}
          </div>
        </div>
      </div>

      {/* 2. Key Concerns */}
      <div className="bg-white rounded-xl p-5 sm:p-6 shadow-card border border-sand-300 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2.5 mb-4">
            <div className="p-1.5 rounded-lg bg-terracotta-100 text-terracotta-800">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-display font-bold text-forest-950 text-sm">
                Key Concerns & Friction
              </h4>
              <p className="text-[11px] text-earth-600">Major objections and critical pushback</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {negativeComments.length > 0 ? (
              negativeComments.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectComment?.(item)}
                  className="p-3 rounded-lg bg-terracotta-50/70 hover:bg-terracotta-100/70 border border-terracotta-200/80 text-xs transition-colors cursor-pointer"
                >
                  <p className="text-terracotta-950 italic leading-relaxed">
                    "{item.originalText}"
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-terracotta-200/60 text-[10px] text-terracotta-900">
                    <span className="font-semibold">{item.stakeholderType || item.category || 'Stakeholder'}</span>
                    <span className="font-mono bg-terracotta-100 px-1.5 py-0.2 rounded font-semibold text-terracotta-800 border border-terracotta-300">
                      {formatConfidence(item.confidence)} conf
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-earth-500 italic">No severe negative comments recorded.</p>
            )}
          </div>
        </div>
      </div>

      {/* 3. Common Suggestions */}
      <div className="bg-white rounded-xl p-5 sm:p-6 shadow-card border border-sand-300 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2.5 mb-4">
            <div className="p-1.5 rounded-lg bg-sand-200 text-earth-800">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-display font-bold text-forest-950 text-sm">
                Common Policy Suggestions
              </h4>
              <p className="text-[11px] text-earth-600">Frequently occurring policy recommendations</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {suggestionComments.length > 0 ? (
              suggestionComments.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectComment?.(item)}
                  className="p-3 rounded-lg bg-sand-50 hover:bg-sand-100 border border-sand-300 text-xs transition-colors cursor-pointer"
                >
                  <p className="text-earth-900 italic leading-relaxed">
                    "{item.originalText}"
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-sand-200 text-[10px] text-earth-700">
                    <span className="font-semibold">{item.stakeholderType || item.category || 'Policy Idea'}</span>
                    <span className="font-mono bg-sand-200 px-1.5 py-0.2 rounded font-semibold text-earth-800 border border-sand-300">
                      {formatConfidence(item.confidence)} conf
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-earth-500 italic">No specific suggestions found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


