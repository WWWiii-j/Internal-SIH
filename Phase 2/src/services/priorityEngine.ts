import {
  DynamicTopic,
  KeyIssue,
  NormalizedCommentRecord,
  PriorityAnalysisResult,
  PriorityLevel,
  PriorityScoreBreakdown,
} from '../types';

// Severity indicators: terms denoting harsh, punitive, disruptive, or damaging consequences
const SEVERITY_TERMS = [
  'draconian', 'punitive', 'cripple', 'crippling', 'bankrupt', 'disastrous',
  'catastrophic', 'unfeasible', 'infeasible', 'unworkable', 'arbitrary',
  'severe', 'severely', 'deplete', 'depleting', 'harassment', 'unjust',
  'overreach', 'paralysis', 'fatal', 'ruinous', 'excessive', 'penalize',
  'penalties', 'burdensome', 'burden', 'unfair', 'damage'
];

// Urgency and Risk indicators: terms denoting time-sensitivity, systemic risks, bottlenecks, or statutory conflicts
const URGENCY_RISK_TERMS = [
  'urgent', 'urgently', 'immediate', 'immediately', 'deadline', 'deadlines',
  'delay', 'delayed', 'delays', 'bottleneck', 'bottlenecks', 'risk',
  'risky', 'threat', 'hazard', 'hazardous', 'critical', 'emergency',
  'non-negotiable', 'conflict', 'conflicts', 'litigation', 'shortage',
  'dispute', 'backlog', 'grace period', 'timeframe', 'tight', 'friction',
  'unscheduled', 'unviable', 'unsustainable', 'ambiguous', 'vague'
];

/**
 * Scans text for indicator terms and returns matched tokens
 */
function extractMatchingIndicators(text: string, termList: string[]): string[] {
  const lower = text.toLowerCase();
  const matched = new Set<string>();

  for (const term of termList) {
    // Check word boundary match
    const regex = new RegExp(`\\b${term}\\b`, 'i');
    if (regex.test(lower)) {
      matched.add(term);
    }
  }

  return Array.from(matched);
}

/**
 * Evaluates priority score and generates explainable breakdown for a dynamic topic
 */
export function evaluateTopicPriority(
  topic: DynamicTopic,
  topicComments: NormalizedCommentRecord[],
  totalDatasetComments: number
): { issue: KeyIssue; breakdown: PriorityScoreBreakdown } {
  const commentCount = topic.commentCount;
  const negCount = topic.sentimentBreakdown.negative;
  const neuCount = topic.sentimentBreakdown.neutral;
  const posCount = topic.sentimentBreakdown.positive;

  // 1. Frequency Score (0 - 25 points)
  const prevalenceRatio = totalDatasetComments > 0 ? commentCount / totalDatasetComments : 0;
  const frequencyScore = Math.min(25, Math.round(prevalenceRatio * 100 * 1.25));

  // 2. Negative Sentiment Ratio Score (0 - 35 points)
  const negRatio = commentCount > 0 ? negCount / commentCount : 0;
  const negativeRatioScore = Math.min(35, Math.round(negRatio * 35));

  // 3. Severity Indicators (0 - 20 points)
  const severityFound = new Set<string>();
  let severityOccurrences = 0;

  for (const c of topicComments) {
    const matches = extractMatchingIndicators(c.cleanedText, SEVERITY_TERMS);
    matches.forEach((m) => {
      severityFound.add(m);
      severityOccurrences++;
    });
  }

  const severityScore = Math.min(20, Math.round(severityOccurrences * 4 + severityFound.size * 3));

  // 4. Urgency / Risk Indicators (0 - 20 points)
  const urgencyFound = new Set<string>();
  let urgencyOccurrences = 0;

  for (const c of topicComments) {
    const matches = extractMatchingIndicators(c.cleanedText, URGENCY_RISK_TERMS);
    matches.forEach((m) => {
      urgencyFound.add(m);
      urgencyOccurrences++;
    });
  }

  const urgencyRiskScore = Math.min(20, Math.round(urgencyOccurrences * 3.5 + urgencyFound.size * 2.5));

  // Total Score (0 - 100)
  const totalScore = Math.min(100, Math.max(0, frequencyScore + negativeRatioScore + severityScore + urgencyRiskScore));

  // Priority Level
  let level: PriorityLevel = 'LOW';
  if (totalScore >= 70) level = 'HIGH';
  else if (totalScore >= 40) level = 'MEDIUM';
  else level = 'LOW';

  const severityTriggers = Array.from(severityFound);
  const urgencyTriggers = Array.from(urgencyFound);

  // Generate transparent rationale explanation
  let explanation = '';
  const freqDesc = `${topic.commentPercentage}% of total submissions (${commentCount} comments)`;
  const negDesc = `${topic.sentimentPercentages.negative}% critical feedback`;

  if (level === 'HIGH') {
    explanation = `High priority (${totalScore}/100) because this issue appears frequently (${freqDesc}), carries a high negative-sentiment ratio (${negDesc}), and contains ${severityTriggers.length} severity flags (${severityTriggers.slice(0, 3).map((t) => `'${t}'`).join(', ') || 'high pushback'}) alongside urgency/risk factors (${urgencyTriggers.slice(0, 3).map((t) => `'${t}'`).join(', ') || 'immediate risk'}).`;
  } else if (level === 'MEDIUM') {
    explanation = `Medium priority (${totalScore}/100) due to moderate prevalence (${freqDesc}) with mixed sentiment (${negDesc}, ${topic.sentimentPercentages.positive}% favorable) requiring administrative clarity or targeted adjustments.`;
  } else {
    explanation = `Low priority (${totalScore}/100) as this issue reflects predominantly favorable or procedural commentary (${topic.sentimentPercentages.positive}% favorable) with minimal operational severity indicators.`;
  }

  const breakdown: PriorityScoreBreakdown = {
    frequencyScore,
    negativeRatioScore,
    severityScore,
    urgencyRiskScore,
    totalScore,
    level,
    severityTriggers,
    urgencyTriggers,
  };

  const issue: KeyIssue = {
    id: `issue-${topic.id.replace('topic-', '')}`,
    topicId: topic.id,
    title: topic.title,
    priorityScore: totalScore,
    priorityLevel: level,
    scoreBreakdown: breakdown,
    commentCount,
    commentPercentage: topic.commentPercentage,
    negativeSentimentPercentage: topic.sentimentPercentages.negative,
    neutralSentimentPercentage: topic.sentimentPercentages.neutral,
    positiveSentimentPercentage: topic.sentimentPercentages.positive,
    severityIndicators: severityTriggers,
    urgencyIndicators: urgencyTriggers,
    explanation,
    supportingCommentIds: topic.supportingCommentIds,
    affectedStakeholders: topic.topStakeholders,
    targetedSections: topic.topSections,
    representativeQuotes: topic.representativeQuotes,
  };

  return { issue, breakdown };
}

/**
 * Evaluates all discovered topics and computes the full Key Issues & Priority Analysis Result
 */
export function analyzeKeyIssuesAndPriorities(
  topics: DynamicTopic[],
  allComments: NormalizedCommentRecord[]
): PriorityAnalysisResult {
  const issues: KeyIssue[] = [];
  const totalComments = allComments.length;

  for (const topic of topics) {
    const topicComments = allComments.filter((c) => topic.supportingCommentIds.includes(c.id));
    const { issue } = evaluateTopicPriority(topic, topicComments, totalComments);
    issues.push(issue);

    // Attach priorityScore to comments in this topic
    for (const c of topicComments) {
      c.priorityScore = issue.priorityScore;
    }
  }

  // Sort issues: HIGH priority first, then descending by priority score
  issues.sort((a, b) => b.priorityScore - a.priorityScore);

  const highPriorityCount = issues.filter((i) => i.priorityLevel === 'HIGH').length;
  const mediumPriorityCount = issues.filter((i) => i.priorityLevel === 'MEDIUM').length;
  const lowPriorityCount = issues.filter((i) => i.priorityLevel === 'LOW').length;

  const totalScoreSum = issues.reduce((acc, curr) => acc + curr.priorityScore, 0);
  const averagePriorityScore = issues.length > 0 ? Math.round(totalScoreSum / issues.length) : 0;
  const topUrgentIssues = issues.filter((i) => i.priorityLevel === 'HIGH' || i.priorityScore >= 60).slice(0, 3);

  return {
    issues,
    highPriorityCount,
    mediumPriorityCount,
    lowPriorityCount,
    averagePriorityScore,
    topUrgentIssues,
  };
}
