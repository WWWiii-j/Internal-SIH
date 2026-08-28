import {
  DynamicTopic,
  NormalizedCommentRecord,
  SentimentLabel,
  TopicAnalysisResult,
} from '../types';
import { analyzeCommentSentiment } from './sentimentEngine';
import { computeTfidfVectors } from './tfidfEngine';

/**
 * Capitalizes words in a topic label
 */
function toTitleCase(str: string): string {
  return str
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Dynamically discovers thematic topics from normalized comments using unsupervised TF-IDF clustering
 */
export function discoverDynamicTopics(
  comments: NormalizedCommentRecord[]
): {
  enrichedComments: NormalizedCommentRecord[];
  analysisResult: TopicAnalysisResult;
} {
  if (comments.length === 0) {
    return {
      enrichedComments: [],
      analysisResult: {
        topics: [],
        globalKeywords: [],
        totalTopics: 0,
        totalCommentsAnalyzed: 0,
        sentimentSummary: {
          positiveCount: 0,
          neutralCount: 0,
          negativeCount: 0,
          positivePercentage: 0,
          neutralPercentage: 0,
          negativePercentage: 0,
          averageConfidence: 0,
          netStanceScore: 0,
        },
      },
    };
  }

  // Step 1: Execute sentiment and stance analysis on every comment
  const enrichedComments: NormalizedCommentRecord[] = comments.map((comm) => {
    const analysis = analyzeCommentSentiment(comm.cleanedText);
    return {
      ...comm,
      sentiment: {
        label: analysis.sentiment,
        confidence: analysis.confidence,
        polarityScore: analysis.polarityScore,
      },
      stance: {
        label: analysis.stance,
        confidence: analysis.confidence,
      },
    };
  });

  // Step 2: Compute TF-IDF vectors across all comments
  const docInputs = enrichedComments.map((c) => ({
    id: c.id,
    text: c.cleanedText,
    sentiment: c.sentiment!.label,
  }));

  const { docNgramsMap, docTfidfMap, globalTerms } = computeTfidfVectors(docInputs);

  // Attach top 4 TF-IDF keywords to each comment
  for (const comm of enrichedComments) {
    const tfidfScores = docTfidfMap.get(comm.id);
    if (tfidfScores) {
      const sortedDocTerms = Array.from(tfidfScores.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([term]) => term);
      comm.extractedKeywords = sortedDocTerms;
    }
  }

  // Step 3: Unsupervised Dynamic Topic Clustering (No hard-coded list)
  // Find key anchor terms (prioritizing bigrams and trigrams with highest distinctiveness)
  const candidateAnchors = globalTerms
    .filter((t) => (t.nGramType !== 'unigram' || t.docCount >= 2) && t.docCount >= 1)
    .slice(0, Math.min(30, Math.max(10, Math.round(comments.length / 2))));

  // Group comments into dynamic clusters based on shared salient n-grams
  const topicClusterMap = new Map<
    string,
    {
      seedTerms: Set<string>;
      commentIds: Set<string>;
    }
  >();

  // Map each comment to its best matching topic cluster
  const assignedClusterIdPerComment = new Map<string, string>();

  for (const comm of enrichedComments) {
    const commNgrams = docNgramsMap.get(comm.id)?.allNgrams || [];
    const commTfidf = docTfidfMap.get(comm.id) || new Map<string, number>();

    let bestAnchor: string | null = null;
    let maxMatchScore = 0;

    for (const anchor of candidateAnchors) {
      if (commNgrams.includes(anchor.term)) {
        const score = (commTfidf.get(anchor.term) || 1) * (anchor.nGramType === 'trigram' ? 1.5 : anchor.nGramType === 'bigram' ? 1.2 : 1.0);
        if (score > maxMatchScore) {
          maxMatchScore = score;
          bestAnchor = anchor.term;
        }
      }
    }

    // Fallback: if no multi-word anchor matched, use highest TF-IDF term from the document
    if (!bestAnchor && commNgrams.length > 0) {
      bestAnchor = commNgrams[0];
    }

    const clusterKey = bestAnchor || 'general feedback';

    let cluster = topicClusterMap.get(clusterKey);
    if (!cluster) {
      cluster = { seedTerms: new Set([clusterKey]), commentIds: new Set() };
      topicClusterMap.set(clusterKey, cluster);
    }
    cluster.commentIds.add(comm.id);
    assignedClusterIdPerComment.set(comm.id, clusterKey);
  }

  // Step 4: Merge small/overlapping clusters into 4 - 8 cohesive high-level dynamic topics
  const rawClusters = Array.from(topicClusterMap.entries())
    .map(([key, data]) => ({
      key,
      seedTerms: Array.from(data.seedTerms),
      commentIds: Array.from(data.commentIds),
    }))
    .sort((a, b) => b.commentIds.length - a.commentIds.length);

  // If we have more than 7 clusters, merge singleton clusters into closest parent
  const targetTopicCount = Math.min(8, Math.max(3, Math.round(comments.length / 8)));
  const finalTopicsRaw: Array<{ titleSeed: string; commentIds: Set<string>; keywords: Set<string> }> = [];

  for (let i = 0; i < rawClusters.length; i++) {
    const cluster = rawClusters[i];
    if (finalTopicsRaw.length < targetTopicCount || cluster.commentIds.length >= 3) {
      finalTopicsRaw.push({
        titleSeed: cluster.key,
        commentIds: new Set(cluster.commentIds),
        keywords: new Set(cluster.seedTerms),
      });
    } else {
      // Find best existing topic to merge with (shared word overlap)
      const clusterWords = cluster.key.split(' ');
      let bestMergeIdx = 0;
      let maxOverlap = 0;

      for (let j = 0; j < finalTopicsRaw.length; j++) {
        const targetWords = finalTopicsRaw[j].titleSeed.split(' ');
        const overlap = clusterWords.filter((w) => targetWords.includes(w)).length;
        if (overlap > maxOverlap) {
          maxOverlap = overlap;
          bestMergeIdx = j;
        }
      }

      for (const id of cluster.commentIds) {
        finalTopicsRaw[bestMergeIdx].commentIds.add(id);
      }
      finalTopicsRaw[bestMergeIdx].keywords.add(cluster.key);
    }
  }

  // Step 5: Construct detailed DynamicTopic objects with full statistics
  const dynamicTopics: DynamicTopic[] = finalTopicsRaw.map((ft, idx) => {
    const topicCommentIds = Array.from(ft.commentIds);
    const topicComments = enrichedComments.filter((c) => topicCommentIds.includes(c.id));

    // Tag each comment with this dynamic topic title
    // Topic Title formatting: dynamically derive from top 2-3 constituent TF-IDF phrases
    const clusterTermFreq = new Map<string, number>();
    for (const c of topicComments) {
      const ngrams = docNgramsMap.get(c.id)?.allNgrams || [];
      for (const t of ngrams) {
        clusterTermFreq.set(t, (clusterTermFreq.get(t) || 0) + 1);
      }
    }

    const topDistinctiveTerms = Array.from(clusterTermFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([t]) => t);

    const primaryTerm = topDistinctiveTerms[0] || ft.titleSeed;
    const secondaryTerm = topDistinctiveTerms.find((t) => t !== primaryTerm && !primaryTerm.includes(t) && !t.includes(primaryTerm));

    let dynamicTitle = toTitleCase(primaryTerm);
    if (secondaryTerm && secondaryTerm.length > 3) {
      dynamicTitle = `${toTitleCase(primaryTerm)} & ${toTitleCase(secondaryTerm)}`;
    }

    // Sentiment breakdown
    let posCount = 0;
    let neuCount = 0;
    let negCount = 0;
    let totalPolarity = 0;

    const stakeholderCounts: Record<string, number> = {};
    const sectionCounts: Record<string, number> = {};

    for (const c of topicComments) {
      if (c.sentiment?.label === 'Positive') posCount++;
      else if (c.sentiment?.label === 'Negative') negCount++;
      else neuCount++;

      totalPolarity += c.sentiment?.polarityScore || 0;

      const st = c.stakeholder.type;
      stakeholderCounts[st] = (stakeholderCounts[st] || 0) + 1;

      if (c.policyTarget.section) {
        const sec = c.policyTarget.section;
        sectionCounts[sec] = (sectionCounts[sec] || 0) + 1;
      }

      // Assign topic name to comment record
      c.topics = [dynamicTitle];
    }

    const topicTotal = topicComments.length || 1;
    const posPct = Number(((posCount / topicTotal) * 100).toFixed(1));
    const neuPct = Number(((neuCount / topicTotal) * 100).toFixed(1));
    const negPct = Number(((negCount / topicTotal) * 100).toFixed(1));
    const avgPol = Number((totalPolarity / topicTotal).toFixed(3));

    let dominantSentiment: SentimentLabel = 'Neutral';
    if (posCount > negCount && posCount >= neuCount) dominantSentiment = 'Positive';
    else if (negCount > posCount && negCount >= neuCount) dominantSentiment = 'Negative';

    // Representative quotes (up to 3, diverse polarity)
    const sortedByConf = [...topicComments].sort((a, b) => (b.sentiment?.confidence || 0) - (a.sentiment?.confidence || 0));
    const representativeQuotes = sortedByConf.slice(0, 3).map((c) => c.originalText);

    // Top Stakeholders
    const topStakeholders = Array.from(Object.entries(stakeholderCounts))
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    // Top Sections
    const topSections = Array.from(Object.entries(sectionCounts))
      .map(([section, count]) => ({ section, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    return {
      id: `topic-${idx + 1}`,
      title: dynamicTitle,
      keywords: topDistinctiveTerms.slice(0, 4),
      commentCount: topicComments.length,
      commentPercentage: Number(((topicComments.length / comments.length) * 100).toFixed(1)),
      sentimentBreakdown: {
        positive: posCount,
        neutral: neuCount,
        negative: negCount,
      },
      sentimentPercentages: {
        positive: posPct,
        neutral: neuPct,
        negative: negPct,
      },
      dominantSentiment,
      averagePolarity: avgPol,
      supportingCommentIds: topicCommentIds,
      topStakeholders,
      topSections,
      representativeQuotes,
    };
  }).sort((a, b) => b.commentCount - a.commentCount);

  // Overall dataset sentiment summary
  let totalPos = 0;
  let totalNeu = 0;
  let totalNeg = 0;
  let totalConf = 0;

  for (const c of enrichedComments) {
    if (c.sentiment?.label === 'Positive') totalPos++;
    else if (c.sentiment?.label === 'Negative') totalNeg++;
    else totalNeu++;
    totalConf += c.sentiment?.confidence || 0.5;
  }

  const N = enrichedComments.length;
  const positivePercentage = Number(((totalPos / N) * 100).toFixed(1));
  const neutralPercentage = Number(((totalNeu / N) * 100).toFixed(1));
  const negativePercentage = Number(((totalNeg / N) * 100).toFixed(1));
  const averageConfidence = Number((totalConf / N).toFixed(2));
  const netStanceScore = Math.round(positivePercentage - negativePercentage);

  const topicAnalysisResult: TopicAnalysisResult = {
    topics: dynamicTopics,
    globalKeywords: globalTerms.slice(0, 24),
    totalTopics: dynamicTopics.length,
    totalCommentsAnalyzed: N,
    sentimentSummary: {
      positiveCount: totalPos,
      neutralCount: totalNeu,
      negativeCount: totalNeg,
      positivePercentage,
      neutralPercentage,
      negativePercentage,
      averageConfidence,
      netStanceScore,
    },
  };

  return {
    enrichedComments,
    analysisResult: topicAnalysisResult,
  };
}
