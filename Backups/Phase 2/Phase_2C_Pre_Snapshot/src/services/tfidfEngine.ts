import { SentimentLabel, TfidfTerm } from '../types';

// English + Regulatory & Legislative procedural stop words
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and',
  'any', 'are', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below',
  'between', 'both', 'but', 'by', 'could', 'did', 'do', 'does', 'doing', 'down',
  'during', 'each', 'few', 'for', 'from', 'further', 'had', 'has', 'have',
  'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his',
  'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me',
  'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'now', 'of', 'off', 'on',
  'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out',
  'over', 'own', 'same', 'she', 'should', 'so', 'some', 'such', 'than', 'that',
  'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these',
  'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up',
  'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who',
  'whom', 'why', 'with', 'would', 'you', 'your', 'yours', 'yourself',
  'yourselves', 'also', 'etc', 'shall', 'may', 'will', 'must', 'can', 'one',
  'two', 'like', 'even', 'new', 'well', 'many', 'much', 'please', 'regarding',
  'respect', 'terms', 'case', 'given', 'need', 'needs', 'take', 'made', 'get',
  'make', 'draft', 'bill', 'act', 'rule', 'rules', 'clause', 'section',
  'government', 'consultation', 'believe', 'proposal', 'proposed', 'suggest',
  'suggested', 'submission', 'feedback', 'comment', 'input', 'statement', 'view',
  'current', 'overall', 'strongly', 'alongside', 'under', 'within', 'across', 'per'
]);

/**
 * Tokenizes text into lowercase words, stripping non-alphanumeric punctuation
 */
export function tokenizeText(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !/^\d+$/.test(w));
}

/**
 * Extracts unigrams, bigrams, and trigrams from a text token sequence
 */
export function extractNgrams(tokens: string[]): {
  unigrams: string[];
  bigrams: string[];
  trigrams: string[];
} {
  const unigrams: string[] = [];
  const bigrams: string[] = [];
  const trigrams: string[] = [];

  // Unigrams
  for (const t of tokens) {
    if (!STOP_WORDS.has(t) && t.length > 3) {
      unigrams.push(t);
    }
  }

  // Bigrams
  for (let i = 0; i < tokens.length - 1; i++) {
    const w1 = tokens[i];
    const w2 = tokens[i + 1];
    if (
      !STOP_WORDS.has(w1) &&
      !STOP_WORDS.has(w2) &&
      w1.length > 2 &&
      w2.length > 2 &&
      w1 !== w2
    ) {
      bigrams.push(`${w1} ${w2}`);
    }
  }

  // Trigrams
  for (let i = 0; i < tokens.length - 2; i++) {
    const w1 = tokens[i];
    const w2 = tokens[i + 1];
    const w3 = tokens[i + 2];
    if (
      !STOP_WORDS.has(w1) &&
      !STOP_WORDS.has(w3) &&
      w1.length > 2 &&
      w2.length > 1 &&
      w3.length > 2 &&
      w1 !== w2 &&
      w2 !== w3
    ) {
      trigrams.push(`${w1} ${w2} ${w3}`);
    }
  }

  return { unigrams, bigrams, trigrams };
}

/**
 * Computes TF-IDF vector representations across an array of documents
 */
export function computeTfidfVectors(
  documents: Array<{ id: string; text: string; sentiment: SentimentLabel }>
): {
  docNgramsMap: Map<string, { unigrams: string[]; bigrams: string[]; trigrams: string[]; allNgrams: string[] }>;
  docTfidfMap: Map<string, Map<string, number>>;
  globalTerms: TfidfTerm[];
} {
  const N = documents.length;
  const docNgramsMap = new Map<string, { unigrams: string[]; bigrams: string[]; trigrams: string[]; allNgrams: string[] }>();
  const docFrequencyMap = new Map<string, number>(); // term -> number of docs containing it
  const termTotalCountMap = new Map<string, number>(); // term -> total occurrences
  const termSentimentCounts = new Map<string, { positive: number; neutral: number; negative: number }>();
  const termTypeMap = new Map<string, 'unigram' | 'bigram' | 'trigram'>();

  // Pass 1: Extract n-grams per doc and compute Document Frequency
  for (const doc of documents) {
    const tokens = tokenizeText(doc.text);
    const { unigrams, bigrams, trigrams } = extractNgrams(tokens);
    const allNgrams = [...trigrams, ...bigrams, ...unigrams];
    docNgramsMap.set(doc.id, { unigrams, bigrams, trigrams, allNgrams });

    const seenInDoc = new Set<string>();
    for (const term of allNgrams) {
      termTotalCountMap.set(term, (termTotalCountMap.get(term) || 0) + 1);

      if (!seenInDoc.has(term)) {
        seenInDoc.add(term);
        docFrequencyMap.set(term, (docFrequencyMap.get(term) || 0) + 1);

        // Track sentiment breakdown
        const sentCounts = termSentimentCounts.get(term) || { positive: 0, neutral: 0, negative: 0 };
        if (doc.sentiment === 'Positive') sentCounts.positive++;
        else if (doc.sentiment === 'Negative') sentCounts.negative++;
        else sentCounts.neutral++;
        termSentimentCounts.set(term, sentCounts);
      }

      // Record n-gram type
      if (!termTypeMap.has(term)) {
        const wordsCount = term.split(' ').length;
        if (wordsCount === 3) termTypeMap.set(term, 'trigram');
        else if (wordsCount === 2) termTypeMap.set(term, 'bigram');
        else termTypeMap.set(term, 'unigram');
      }
    }
  }

  // Pass 2: Calculate TF-IDF per document
  const docTfidfMap = new Map<string, Map<string, number>>();
  const termAccumulatedScoreMap = new Map<string, number>();

  for (const doc of documents) {
    const ngrams = docNgramsMap.get(doc.id)?.allNgrams || [];
    const docTermFreq = new Map<string, number>();
    for (const term of ngrams) {
      docTermFreq.set(term, (docTermFreq.get(term) || 0) + 1);
    }

    const docVector = new Map<string, number>();
    const totalTermsInDoc = ngrams.length || 1;

    for (const [term, count] of docTermFreq.entries()) {
      const tf = count / totalTermsInDoc;
      const df = docFrequencyMap.get(term) || 1;
      const idf = Math.log((1 + N) / (1 + df)) + 1; // Smoothed IDF
      // Boost multi-word phrases for higher semantic precision
      const phraseWeight = termTypeMap.get(term) === 'trigram' ? 1.4 : termTypeMap.get(term) === 'bigram' ? 1.25 : 1.0;
      const tfidf = tf * idf * phraseWeight;

      docVector.set(term, tfidf);
      termAccumulatedScoreMap.set(term, (termAccumulatedScoreMap.get(term) || 0) + tfidf);
    }

    docTfidfMap.set(doc.id, docVector);
  }

  // Build sorted Global TfidfTerm array
  const globalTerms: TfidfTerm[] = Array.from(docFrequencyMap.keys())
    .map((term) => {
      const docCount = docFrequencyMap.get(term) || 0;
      const totalCount = termTotalCountMap.get(term) || 0;
      const totalScore = termAccumulatedScoreMap.get(term) || 0;
      const avgTfidfScore = Number((totalScore / (docCount || 1)).toFixed(3));
      const sCounts = termSentimentCounts.get(term) || { positive: 0, neutral: 0, negative: 0 };

      let dominantSentiment: SentimentLabel = 'Neutral';
      if (sCounts.positive > sCounts.negative && sCounts.positive >= sCounts.neutral) {
        dominantSentiment = 'Positive';
      } else if (sCounts.negative > sCounts.positive && sCounts.negative >= sCounts.neutral) {
        dominantSentiment = 'Negative';
      }

      return {
        term,
        nGramType: termTypeMap.get(term) || 'unigram',
        docCount,
        totalCount,
        avgTfidfScore,
        dominantSentiment,
      };
    })
    .filter((t) => t.docCount >= 1 && (t.nGramType !== 'unigram' || t.term.length > 3))
    .sort((a, b) => b.docCount - a.docCount || b.avgTfidfScore - a.avgTfidfScore);

  return { docNgramsMap, docTfidfMap, globalTerms };
}
