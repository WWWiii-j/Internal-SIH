import React from 'react';
import { ThumbsUp, AlertTriangle, Lightbulb, MessageSquare, Quote } from 'lucide-react';
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 1. Key Positive Feedback */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border border-emerald-100 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-8 -mt-8 pointer-events-none" />
        <div>
          <div className="flex items-center space-x-2.5 mb-4">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <ThumbsUp className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-display font-bold text-emerald-950 text-base">
                Key Positive Feedback
              </h4>
              <p className="text-[11px] text-emerald-700">Representative supportive submissions</p>
            </div>
          </div>

          <div className="space-y-3">
            {positiveComments.length > 0 ? (
              positiveComments.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectComment?.(item)}
                  className="p-3.5 rounded-2xl bg-emerald-50/60 hover:bg-emerald-100/60 border border-emerald-100 text-xs transition-colors cursor-pointer"
                >
                  <p className="text-emerald-950 italic leading-relaxed">
                    "{item.originalText}"
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-emerald-200/60 text-[10px] text-emerald-800">
                    <span className="font-semibold">{item.stakeholderType || item.category || 'Citizen'}</span>
                    <span className="font-mono bg-emerald-200/60 px-1.5 py-0.5 rounded font-bold">
                      {formatConfidence(item.confidence)} conf
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No positive comments recorded.</p>
            )}
          </div>
        </div>
      </div>

      {/* 2. Key Concerns */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border border-rose-100 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-full -mr-8 -mt-8 pointer-events-none" />
        <div>
          <div className="flex items-center space-x-2.5 mb-4">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-800">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-display font-bold text-rose-950 text-base">
                Key Concerns & Friction
              </h4>
              <p className="text-[11px] text-rose-700">Major objections and critical pushback</p>
            </div>
          </div>

          <div className="space-y-3">
            {negativeComments.length > 0 ? (
              negativeComments.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectComment?.(item)}
                  className="p-3.5 rounded-2xl bg-rose-50/60 hover:bg-rose-100/60 border border-rose-100 text-xs transition-colors cursor-pointer"
                >
                  <p className="text-rose-950 italic leading-relaxed">
                    "{item.originalText}"
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-rose-200/60 text-[10px] text-rose-800">
                    <span className="font-semibold">{item.stakeholderType || item.category || 'Stakeholder'}</span>
                    <span className="font-mono bg-rose-200/60 px-1.5 py-0.5 rounded font-bold">
                      {formatConfidence(item.confidence)} conf
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No severe negative comments recorded.</p>
            )}
          </div>
        </div>
      </div>

      {/* 3. Common Suggestions */}
      <div className="bg-white rounded-3xl p-6 shadow-xl border border-blue-100 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-8 -mt-8 pointer-events-none" />
        <div>
          <div className="flex items-center space-x-2.5 mb-4">
            <div className="p-2 rounded-xl bg-blue-100 text-blue-800">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-display font-bold text-blue-950 text-base">
                Common Suggestions
              </h4>
              <p className="text-[11px] text-blue-700">Frequently occurring policy recommendations</p>
            </div>
          </div>

          <div className="space-y-3">
            {suggestionComments.length > 0 ? (
              suggestionComments.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectComment?.(item)}
                  className="p-3.5 rounded-2xl bg-blue-50/60 hover:bg-blue-100/60 border border-blue-100 text-xs transition-colors cursor-pointer"
                >
                  <p className="text-blue-950 italic leading-relaxed">
                    "{item.originalText}"
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-blue-200/60 text-[10px] text-blue-800">
                    <span className="font-semibold">{item.stakeholderType || item.category || 'Policy Idea'}</span>
                    <span className="font-mono bg-blue-200/60 px-1.5 py-0.5 rounded font-bold">
                      {formatConfidence(item.confidence)} conf
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No specific suggestions found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
