import { CommentRecord, KeywordMetric, SentimentType, ThematicCluster } from '../types';

// Domain-aware sentiment lexicon with calibrated sentiment weights (-4 to +4)
const SENTIMENT_LEXICON: Record<string, number> = {
  // Strongly Positive
  excellent: 3.5,
  outstanding: 3.8,
  superb: 3.6,
  breakthrough: 3.4,
  praiseworthy: 3.2,
  commendable: 3.0,
  progressive: 2.8,
  visionary: 3.0,
  revolutionary: 3.2,
  masterpiece: 3.5,
  flawless: 3.5,
  invaluable: 3.2,
  transformative: 3.4,
  exemplary: 3.2,
  streamlined: 2.6,
  empowering: 2.8,
  robust: 2.5,
  sustainable: 2.4,
  inclusive: 2.5,
  efficient: 2.5,
  effective: 2.4,
  transparent: 2.6,
  transparency: 2.6,
  welcomed: 2.5,
  welcome: 2.4,
  beneficial: 2.6,
  benefits: 2.4,
  benefit: 2.3,
  crucial: 2.0,
  positive: 2.2,
  good: 1.8,
  great: 2.5,
  favorable: 2.2,
  innovative: 2.6,
  innovation: 2.4,
  promising: 2.1,
  support: 2.2,
  supported: 2.2,
  supports: 2.2,
  appreciate: 2.4,
  appreciated: 2.4,
  constructive: 2.2,
  pragmatic: 2.0,
  balanced: 2.0,
  helpful: 2.2,
  valuable: 2.2,
  advantage: 2.0,
  strengthen: 2.2,
  strengthens: 2.2,
  simplified: 2.4,
  simplify: 2.3,
  simplifies: 2.3,
  easier: 2.5,
  easy: 2.2,
  improve: 2.4,
  improves: 2.4,
  improved: 2.4,
  improving: 2.4,
  relief: 2.2,
  incentive: 2.0,
  incentives: 2.0,
  fair: 1.8,
  clarity: 2.2,
  clear: 2.0,
  clearly: 2.2,
  success: 2.5,
  successful: 2.5,
  satisfactory: 1.8,
  encourage: 2.0,
  encouraging: 2.1,
  modernized: 2.2,
  optimized: 2.3,

  // Strongly Negative
  terrible: -3.6,
  disastrous: -3.8,
  unacceptable: -3.5,
  draconian: -3.8,
  oppressive: -3.6,
  catastrophic: -3.9,
  horrible: -3.5,
  abysmal: -3.7,
  flawed: -2.8,
  burdensome: -3.0,
  burden: -2.5,
  burdens: -2.5,
  punitive: -3.2,
  arbitrary: -3.0,
  vague: -2.2,
  ambiguous: -2.0,
  confusing: -2.2,
  unclear: -2.2,
  unrealistic: -2.8,
  impractical: -2.8,
  unfeasible: -2.9,
  infeasible: -2.9,
  bureaucratic: -2.6,
  redundant: -2.2,
  harmful: -3.0,
  detrimental: -3.2,
  costly: -2.4,
  expensive: -2.2,
  excessive: -2.5,
  delay: -1.8,
  delayed: -2.0,
  delays: -2.0,
  bottleneck: -2.5,
  bottlenecks: -2.5,
  harassment: -3.5,
  unjust: -3.2,
  unfair: -2.6,
  hurdle: -2.0,
  hurdles: -2.2,
  barrier: -2.2,
  barriers: -2.4,
  overburden: -2.8,
  overburdened: -2.8,
  cripple: -3.4,
  crippling: -3.4,
  fails: -2.8,
  failed: -2.8,
  failure: -3.0,
  disappointing: -2.6,
  disappointed: -2.6,
  poor: -2.4,
  bad: -2.2,
  worst: -3.5,
  reject: -2.8,
  rejected: -2.8,
  oppose: -2.8,
  opposed: -2.8,
  opposition: -2.6,
  ineffective: -2.6,
  inefficient: -2.6,
  lack: -1.8,
  lacking: -2.0,
  omission: -1.8,
  disregard: -2.6,
  ignored: -2.2,
  shortage: -2.0,
  deficit: -2.0,
  overreach: -3.0,
  penalize: -2.8,
  penalties: -2.2,
  friction: -2.0,
  complicated: -2.2,
  unworkable: -3.0,
  hazardous: -2.8,
  risky: -2.2,
  severe: -2.5,
  unnecessary: -2.0,
  paperwork: -1.0,

  // Contextual Neutral / Policy Terms
  suggest: 0.1,
  recommend: 0.2,
  propose: 0.1,
  review: 0.0,
  consider: 0.1,
  specify: 0.0,
  update: 0.0,
  clause: 0.0,
  section: 0.0,
  amendment: 0.0,
  timeline: 0.0,
  framework: 0.1,
  guideline: 0.0,
  standard: 0.1,
};

// Negation triggers that invert polarity
const NEGATION_WORDS = new Set([
  'not', 'no', 'never', "n't", 'hardly', 'scarcely', 'barely', 'without', 'lack', 'lacks', 'neither', 'nor', 'cannot', 'cant', "won't", "don't", "doesn't", "didn't", 'reduce', 'reduces', 'reduced', 'reducing', 'eliminate', 'eliminates', 'eliminated'
]);

// Intensifiers that amplify polarity
const INTENSIFIERS: Record<string, number> = {
  extremely: 1.5,
  very: 1.35,
  highly: 1.4,
  deeply: 1.3,
  completely: 1.4,
  totally: 1.4,
  severely: 1.5,
  immensely: 1.45,
  significantly: 1.35,
  greatly: 1.35,
  particularly: 1.25,
  exceptionally: 1.5,
  absolutely: 1.45,
  much: 1.3,
  strongly: 1.4,
  somewhat: 0.7,
  slightly: 0.6,
  barely: 0.5,
};

// Common English + Legislative stop words to filter from keywords
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'could', 'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me', 'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves', 'also', 'etc', 'shall', 'may', 'will', 'must', 'can', 'one', 'two', 'like', 'even', 'new', 'well', 'many', 'much', 'please', 'regarding', 'respect', 'terms', 'case', 'given', 'need', 'needs', 'take', 'made', 'get', 'make', 'draft', 'bill', 'act', 'rule', 'rules', 'clause', 'section', 'government', 'consultation', 'believe', 'proposal', 'proposed'
]);

// Topic category heuristics
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  'Compliance & Governance': ['compliance', 'audit', 'licensing', 'filing', 'reporting', 'officer', 'penalty', 'penalties', 'bureaucracy', 'draconian', 'mandate', 'regulatory', 'regulations', 'paperwork'],
  'Financial & Cost Impact': ['cost', 'costs', 'expensive', 'fee', 'fees', 'tax', 'taxation', 'subsidy', 'incentive', 'funding', 'budget', 'msme', 'financial', 'burden', 'investment', 'businesses'],
  'Timelines & Deadlines': ['timeline', 'deadline', 'extension', 'delayed', 'transition', 'grace period', 'days', 'months', 'urgency', 'schedule', 'timeframe'],
  'Definitions & Clarity': ['unclear', 'vague', 'definition', 'ambiguous', 'clarity', 'scope', 'clarify', 'interpretation', 'confusion', 'explicit', 'explained', 'understand'],
  'Technical & Operational': ['technical', 'infrastructure', 'portal', 'digital', 'system', 'capacity', 'implementation', 'testing', 'standard', 'interoperability', 'technology'],
  'Public & Stakeholder Rights': ['rights', 'citizen', 'privacy', 'transparency', 'protection', 'consumer', 'inclusive', 'access', 'welfare', 'public', 'stakeholder']
};

/**
 * Clean and tokenize text
 */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

/**
 * Detailed sentence-level Sentiment Analysis with VADER-style logic
 */
export function analyzeSentiment(text: string): {
  sentiment: SentimentType;
  confidence: number;
  polarityScore: number;
} {
  if (!text || text.trim().length === 0) {
    return { sentiment: 'Neutral', confidence: 0.5, polarityScore: 0 };
  }

  // Handle specific policy phrases directly
  const lowerText = text.toLowerCase();
  let bonusScore = 0;
  if (lowerText.includes('increase') && (lowerText.includes('cost') || lowerText.includes('burden') || lowerText.includes('compliance costs'))) {
    bonusScore -= 1.8;
  }
  if (lowerText.includes('reduce') && (lowerText.includes('paperwork') || lowerText.includes('burden') || lowerText.includes('cost') || lowerText.includes('friction') || lowerText.includes('unnecessary'))) {
    bonusScore += 2.0;
  }

  // Split into clauses and sentences
  const clauses = text.split(/[,;.!?\n]+/).filter((c) => c.trim().length > 0);
  let totalScore = bonusScore;
  let wordCountMatched = bonusScore !== 0 ? 1 : 0;

  for (const clause of clauses) {
    const words = clause.toLowerCase().split(/\s+/).filter(Boolean);
    let clauseScore = 0;

    for (let i = 0; i < words.length; i++) {
      const rawWord = words[i].replace(/[^\w]/g, '');
      if (!rawWord) continue;

      let score = SENTIMENT_LEXICON[rawWord] || 0;

      if (score !== 0) {
        wordCountMatched++;

        // Check for preceding intensifier (e.g., "very burdensome", "much easier", "strongly support")
        if (i > 0) {
          const prev1 = words[i - 1].replace(/[^\w]/g, '');
          if (INTENSIFIERS[prev1]) {
            score *= INTENSIFIERS[prev1];
          }
        }
        if (i > 1) {
          const prev2 = words[i - 2].replace(/[^\w]/g, '');
          if (INTENSIFIERS[prev2]) {
            score *= INTENSIFIERS[prev2];
          }
        }

        // Check for preceding negation within window of 3 words (e.g., "not very effective", "reduce unnecessary")
        let isNegated = false;
        for (let j = Math.max(0, i - 3); j < i; j++) {
          const checkWord = words[j].replace(/[^\w]/g, '');
          if (NEGATION_WORDS.has(checkWord) || checkWord.endsWith("n't")) {
            isNegated = true;
            break;
          }
        }

        if (isNegated) {
          score = -score * 0.9; // Invert and scale
        }

        clauseScore += score;
      }
    }

    // Check for contrastive transitions (e.g. "..., but it creates bottlenecks")
    const lowerClause = clause.toLowerCase();
    if (lowerClause.includes(' but ') || lowerClause.includes(' however ') || lowerClause.includes(' yet ')) {
      clauseScore *= 1.3;
    }

    totalScore += clauseScore;
  }

  // Punctuation emphasis check
  const exclamationCount = (text.match(/!/g) || []).length;
  if (exclamationCount > 0 && Math.abs(totalScore) > 0.5) {
    totalScore += Math.sign(totalScore) * Math.min(exclamationCount * 0.3, 0.9);
  }

  // Normalize score between -1.0 and 1.0 using standard hyperbolic tangent curve
  const normalizedPolarity = Math.tanh(totalScore / 3.0);

  // Determine sentiment category and confidence score
  let sentiment: SentimentType = 'Neutral';
  let confidence = 0.5;

  if (normalizedPolarity >= 0.12) {
    sentiment = 'Positive';
    confidence = Math.min(0.98, 0.68 + Math.abs(normalizedPolarity) * 0.28 + (wordCountMatched > 1 ? 0.05 : 0));
  } else if (normalizedPolarity <= -0.12) {
    sentiment = 'Negative';
    confidence = Math.min(0.99, 0.70 + Math.abs(normalizedPolarity) * 0.28 + (wordCountMatched > 1 ? 0.05 : 0));
  } else {
    sentiment = 'Neutral';
    confidence = Math.max(0.65, 0.92 - Math.abs(normalizedPolarity) * 2.5);
  }

  return {
    sentiment,
    confidence: Number(confidence.toFixed(2)),
    polarityScore: Number(normalizedPolarity.toFixed(3)),
  };
}

/**
 * Extract meaningful unigrams and domain bigrams from a text
 */
export function extractKeywordsFromText(text: string, maxKeywords = 5): string[] {
  const tokens = tokenize(text);
  const candidates: string[] = [];

  // Extract valid bigrams first (e.g. "compliance costs", "small businesses")
  for (let i = 0; i < tokens.length - 1; i++) {
    const w1 = tokens[i];
    const w2 = tokens[i + 1];
    if (
      !STOP_WORDS.has(w1) &&
      !STOP_WORDS.has(w2) &&
      w1.length > 2 &&
      w2.length > 2 &&
      !/^\d+$/.test(w1) &&
      !/^\d+$/.test(w2)
    ) {
      candidates.push(`${w1} ${w2}`);
    }
  }

  // Extract significant unigrams
  for (const token of tokens) {
    if (
      !STOP_WORDS.has(token) &&
      token.length > 3 &&
      !/^\d+$/.test(token) &&
      (SENTIMENT_LEXICON[token] !== undefined || token.length > 4)
    ) {
      candidates.push(token);
    }
  }

  // Deduplicate and select top
  const uniqueCandidates = Array.from(new Set(candidates));
  return uniqueCandidates.slice(0, maxKeywords);
}

/**
 * Categorize comment into governance domains
 */
export function inferCategory(text: string): string {
  const lower = text.toLowerCase();
  let bestCategory = 'General Feedback';
  let maxScore = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        score++;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestCategory = category;
    }
  }

  return bestCategory;
}

/**
 * Aggregate all comments and produce high-level keywords and theme metrics
 */
export function computeGlobalKeywordMetrics(
  records: CommentRecord[],
  topN = 25
): { keywords: KeywordMetric[]; themes: ThematicCluster[] } {
  const keywordMap = new Map<
    string,
    {
      count: number;
      positive: number;
      negative: number;
      neutral: number;
    }
  >();

  // Process all comments
  for (const record of records) {
    const seenInComment = new Set<string>();

    for (const kw of record.keywords) {
      if (!seenInComment.has(kw)) {
        seenInComment.add(kw);
        const existing = keywordMap.get(kw) || { count: 0, positive: 0, negative: 0, neutral: 0 };
        existing.count++;
        if (record.sentiment === 'Positive') existing.positive++;
        else if (record.sentiment === 'Negative') existing.negative++;
        else existing.neutral++;
        keywordMap.set(kw, existing);
      }
    }
  }

  // Convert to KeywordMetric array
  const sortedKeywords: KeywordMetric[] = Array.from(keywordMap.entries())
    .map(([text, data]) => {
      let dominantSentiment: SentimentType = 'Neutral';
      if (data.positive > data.negative && data.positive >= data.neutral) {
        dominantSentiment = 'Positive';
      } else if (data.negative > data.positive && data.negative >= data.neutral) {
        dominantSentiment = 'Negative';
      }

      const total = data.count;
      const relevanceScore = total * (1 + Math.abs(data.positive - data.negative) / (total || 1));

      return {
        text,
        count: data.count,
        sentimentBreakdown: {
          positive: data.positive,
          negative: data.negative,
          neutral: data.neutral,
        },
        dominantSentiment,
        relevanceScore: Number(relevanceScore.toFixed(2)),
      };
    })
    .sort((a, b) => b.count - a.count || b.relevanceScore - a.relevanceScore)
    .slice(0, topN);

  // Group into thematic clusters
  const themeMap = new Map<string, { comments: CommentRecord[]; sentimentCounts: Record<SentimentType, number> }>();

  for (const record of records) {
    const category = record.category || 'General Feedback';
    const group = themeMap.get(category) || {
      comments: [],
      sentimentCounts: { Positive: 0, Negative: 0, Neutral: 0 }
    };
    group.comments.push(record);
    group.sentimentCounts[record.sentiment]++;
    themeMap.set(category, group);
  }

  const themes: ThematicCluster[] = Array.from(themeMap.entries())
    .map(([theme, group]) => {
      let dominant: SentimentType = 'Neutral';
      if (group.sentimentCounts.Positive > group.sentimentCounts.Negative && group.sentimentCounts.Positive >= group.sentimentCounts.Neutral) {
        dominant = 'Positive';
      } else if (group.sentimentCounts.Negative > group.sentimentCounts.Positive && group.sentimentCounts.Negative >= group.sentimentCounts.Neutral) {
        dominant = 'Negative';
      }

      // Select up to 3 crisp representative quotes
      const quotes = group.comments
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 3)
        .map((c) => c.originalText);

      return {
        theme,
        count: group.comments.length,
        sentiment: dominant,
        representativeQuotes: quotes
      };
    })
    .sort((a, b) => b.count - a.count);

  return { keywords: sortedKeywords, themes };
}

/**
 * Process a collection of raw comment strings into full CommentRecords
 */
export function processRawComments(
  rawRows: Record<string, string>[],
  commentColumnKey: string
): CommentRecord[] {
  const records: CommentRecord[] = [];

  for (let idx = 0; idx < rawRows.length; idx++) {
    const row = rawRows[idx];
    const text = (row[commentColumnKey] || '').trim();
    if (!text) continue;

    const { sentiment, confidence, polarityScore } = analyzeSentiment(text);
    const keywords = extractKeywordsFromText(text, 5);
    const category = inferCategory(text);

    // Look for optional stakeholder metadata in other columns
    let stakeholderType: string | undefined = undefined;
    for (const key of Object.keys(row)) {
      const lowerKey = key.toLowerCase();
      if (
        lowerKey.includes('stakeholder') ||
        lowerKey.includes('category') ||
        lowerKey.includes('type') ||
        lowerKey.includes('role') ||
        lowerKey.includes('designation')
      ) {
        stakeholderType = row[key];
        break;
      }
    }

    records.push({
      id: `comment-${idx + 1}`,
      originalText: text,
      sentiment,
      confidence,
      polarityScore,
      keywords,
      category,
      stakeholderType,
      length: text.length,
    });
  }

  return records;
}
