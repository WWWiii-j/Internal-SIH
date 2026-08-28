import {
  AnalysisStatistics,
  CommentRecord,
  ExecutiveSummary,
  KeywordMetric,
  ThematicCluster,
} from '../types';

/**
 * Computes high-level statistics across all analyzed comments
 */
export function computeAnalysisStatistics(records: CommentRecord[]): AnalysisStatistics {
  const total = records.length;
  if (total === 0) {
    return {
      totalComments: 0,
      positiveCount: 0,
      negativeCount: 0,
      neutralCount: 0,
      positivePercentage: 0,
      negativePercentage: 0,
      neutralPercentage: 0,
      averageConfidence: 0,
      averageWordCount: 0,
      publicStanceScore: 0,
    };
  }

  let posCount = 0;
  let negCount = 0;
  let neuCount = 0;
  let totalConf = 0;
  let totalWords = 0;

  for (const r of records) {
    if (r.sentiment === 'Positive') posCount++;
    else if (r.sentiment === 'Negative') negCount++;
    else neuCount++;

    totalConf += r.confidence;
    totalWords += r.originalText.split(/\s+/).length;
  }

  const posPct = Number(((posCount / total) * 100).toFixed(1));
  const negPct = Number(((negCount / total) * 100).toFixed(1));
  const neuPct = Number(((neuCount / total) * 100).toFixed(1));
  const avgConf = Number((totalConf / total).toFixed(2));
  const avgWords = Math.round(totalWords / total);

  // Public Stance Score: (pos - neg) scaled between -100 and +100
  const stanceScore = Math.round(posPct - negPct);

  return {
    totalComments: total,
    positiveCount: posCount,
    negativeCount: negCount,
    neutralCount: neuCount,
    positivePercentage: posPct,
    negativePercentage: negPct,
    neutralPercentage: neuPct,
    averageConfidence: avgConf,
    averageWordCount: avgWords,
    publicStanceScore: stanceScore,
  };
}

/**
 * Generates an executive briefing tailored for policy makers and review committees
 */
export function generateExecutiveSummary(
  records: CommentRecord[],
  stats: AnalysisStatistics,
  keywords: KeywordMetric[],
  themes: ThematicCluster[]
): ExecutiveSummary {
  if (records.length === 0) {
    return {
      overallStance: 'No Data Available',
      publicSentimentDistribution: 'N/A',
      executiveBrief: 'No feedback comments available for analysis.',
      majorPositiveHighlights: [],
      majorConcerns: [],
      actionableRecommendations: [],
      criticalRiskAreas: [],
      stakeholderBreakdownText: 'No stakeholder data.',
    };
  }

  // 1. Overall Stance descriptor
  let stanceLabel = 'Balanced & Deliberative';
  if (stats.publicStanceScore >= 35) {
    stanceLabel = `Overwhelmingly Favorable (+${stats.publicStanceScore}% Net Stance)`;
  } else if (stats.publicStanceScore >= 12) {
    stanceLabel = `Constructive & Generally Supportive (+${stats.publicStanceScore}% Net Stance)`;
  } else if (stats.publicStanceScore <= -35) {
    stanceLabel = `Critical & Strongly Opposed (${stats.publicStanceScore}% Net Stance)`;
  } else if (stats.publicStanceScore <= -12) {
    stanceLabel = `Substantial Stakeholder Friction (${stats.publicStanceScore}% Net Stance)`;
  } else {
    stanceLabel = `Divided & Nuanced Feedback (${stats.publicStanceScore >= 0 ? '+' : ''}${stats.publicStanceScore}% Net Stance)`;
  }

  const sentimentDist = `${stats.positivePercentage}% Favorable (${stats.positiveCount}) | ${stats.neutralPercentage}% Neutral/Procedural (${stats.neutralCount}) | ${stats.negativePercentage}% Critical (${stats.negativeCount})`;

  // 2. Synthesize Major Positive Highlights
  const positiveRecords = records
    .filter((r) => r.sentiment === 'Positive')
    .sort((a, b) => b.confidence - a.confidence);

  const topPositiveKeywords = keywords
    .filter((k) => k.dominantSentiment === 'Positive')
    .slice(0, 4)
    .map((k) => k.text);

  const majorPositiveHighlights: string[] = [];
  if (positiveRecords.length > 0) {
    // Pick diverse representative positive points
    const seenPosTokens = new Set<string>();
    for (const r of positiveRecords) {
      const firstKw = r.keywords[0] || '';
      if (!seenPosTokens.has(firstKw) || majorPositiveHighlights.length < 2) {
        seenPosTokens.add(firstKw);
        majorPositiveHighlights.push(
          r.originalText.length > 130 ? `${r.originalText.slice(0, 127)}...` : r.originalText
        );
      }
      if (majorPositiveHighlights.length >= 4) break;
    }
  } else {
    majorPositiveHighlights.push('Stakeholders did not highlight significant commendations in this consultation round.');
  }

  // 3. Synthesize Major Concerns
  const negativeRecords = records
    .filter((r) => r.sentiment === 'Negative')
    .sort((a, b) => b.confidence - a.confidence);

  const topNegativeKeywords = keywords
    .filter((k) => k.dominantSentiment === 'Negative')
    .slice(0, 4)
    .map((k) => k.text);

  const majorConcerns: string[] = [];
  if (negativeRecords.length > 0) {
    const seenNegTokens = new Set<string>();
    for (const r of negativeRecords) {
      const firstKw = r.keywords[0] || '';
      if (!seenNegTokens.has(firstKw) || majorConcerns.length < 2) {
        seenNegTokens.add(firstKw);
        majorConcerns.push(
          r.originalText.length > 130 ? `${r.originalText.slice(0, 127)}...` : r.originalText
        );
      }
      if (majorConcerns.length >= 4) break;
    }
  } else {
    majorConcerns.push('No severe negative pushback or systemic objections were identified.');
  }

  // 4. Synthesize Actionable Recommendations / Suggestions
  const actionableRecommendations: string[] = [];
  const suggestionRecords = records.filter(
    (r) =>
      r.originalText.toLowerCase().includes('suggest') ||
      r.originalText.toLowerCase().includes('recommend') ||
      r.originalText.toLowerCase().includes('should') ||
      r.originalText.toLowerCase().includes('propose') ||
      r.originalText.toLowerCase().includes('need') ||
      r.originalText.toLowerCase().includes('extend') ||
      r.originalText.toLowerCase().includes('clarify')
  );

  if (suggestionRecords.length > 0) {
    for (const s of suggestionRecords.slice(0, 4)) {
      actionableRecommendations.push(
        s.originalText.length > 140 ? `${s.originalText.slice(0, 137)}...` : s.originalText
      );
    }
  } else {
    // Generate derived policy recommendations based on top themes
    if (themes.length > 0) {
      themes.slice(0, 3).forEach((t) => {
        actionableRecommendations.push(
          `Review policy provisions regarding "${t.theme}" to address specific operational constraints reported by stakeholders.`
        );
      });
    }
  }

  // 5. Critical Risk Areas
  const criticalRiskAreas: string[] = [];
  themes
    .filter((t) => t.sentiment === 'Negative')
    .slice(0, 3)
    .forEach((t) => {
      criticalRiskAreas.push(
        `High friction detected in ${t.theme} with ${t.count} related stakeholder submission(s).`
      );
    });

  if (criticalRiskAreas.length === 0 && topNegativeKeywords.length > 0) {
    criticalRiskAreas.push(
      `Scrutiny required around terms: ${topNegativeKeywords.join(', ')}.`
    );
  }

  // 6. Stakeholder Breakdown Text
  const stakeholderTypes = new Set(records.map((r) => r.stakeholderType).filter(Boolean));
  let stakeholderBreakdownText = `Analysis synthesized across ${stats.totalComments} stakeholder submissions.`;
  if (stakeholderTypes.size > 0) {
    stakeholderBreakdownText += ` Representation identified from: ${Array.from(stakeholderTypes).join(', ')}.`;
  }

  // 7. Executive Brief Paragraph
  const topKeyList = keywords.slice(0, 6).map((k) => `"${k.text}"`).join(', ');
  const executiveBrief = `The consultation dataset comprises ${stats.totalComments} stakeholder inputs with an overall public sentiment stance classified as ${stanceLabel}. Analysis indicates ${stats.positivePercentage}% positive endorsements, ${stats.neutralPercentage}% neutral or procedural inquiries, and ${stats.negativePercentage}% critical or oppositional inputs. Key recurring subjects center around ${topKeyList || 'core policy guidelines'}. Stakeholders express broad enthusiasm for progressive modernization, while expressing concentrated operational concerns regarding compliance burden, transition timelines, and definitional ambiguities.`;

  return {
    overallStance: stanceLabel,
    publicSentimentDistribution: sentimentDist,
    executiveBrief,
    majorPositiveHighlights,
    majorConcerns,
    actionableRecommendations,
    criticalRiskAreas,
    stakeholderBreakdownText,
  };
}
