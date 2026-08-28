import { SentimentLabel, StanceLabel } from '../types';

// Policy-calibrated sentiment lexicon (-4.0 to +4.0)
const SENTIMENT_LEXICON: Record<string, number> = {
  // Strongly Positive / Commendations
  excellent: 3.5,
  outstanding: 3.8,
  superb: 3.6,
  breakthrough: 3.5,
  praiseworthy: 3.3,
  commendable: 3.2,
  progressive: 2.9,
  visionary: 3.2,
  revolutionary: 3.3,
  transformative: 3.4,
  invaluable: 3.2,
  exemplary: 3.2,
  streamlined: 2.7,
  empowering: 2.8,
  robust: 2.6,
  sustainable: 2.5,
  inclusive: 2.5,
  efficient: 2.6,
  effective: 2.5,
  transparent: 2.7,
  transparency: 2.7,
  welcomed: 2.6,
  welcome: 2.5,
  beneficial: 2.6,
  benefit: 2.4,
  benefits: 2.4,
  crucial: 2.0,
  positive: 2.2,
  favorable: 2.4,
  innovative: 2.7,
  innovation: 2.5,
  promising: 2.2,
  support: 2.3,
  supported: 2.3,
  supports: 2.3,
  appreciate: 2.5,
  appreciated: 2.5,
  constructive: 2.2,
  pragmatic: 2.1,
  balanced: 2.1,
  helpful: 2.2,
  valuable: 2.3,
  advantage: 2.1,
  strengthen: 2.3,
  strengthens: 2.3,
  simplified: 2.5,
  simplify: 2.4,
  simplifies: 2.4,
  easier: 2.5,
  easy: 2.2,
  improve: 2.4,
  improves: 2.4,
  improved: 2.4,
  relief: 2.3,
  incentive: 2.1,
  incentives: 2.1,
  fair: 1.9,
  clarity: 2.3,
  clear: 2.1,
  clearly: 2.3,
  success: 2.6,
  successful: 2.6,
  satisfactory: 1.9,
  encourage: 2.1,
  encouraging: 2.2,
  modernized: 2.3,
  optimized: 2.4,
  proactive: 2.2,
  viable: 2.0,
  viability: 2.1,

  // Strongly Critical / Objections / Friction
  terrible: -3.6,
  disastrous: -3.8,
  unacceptable: -3.6,
  draconian: -3.8,
  oppressive: -3.6,
  catastrophic: -3.9,
  horrible: -3.5,
  abysmal: -3.7,
  flawed: -2.9,
  burdensome: -3.1,
  burden: -2.6,
  burdens: -2.6,
  punitive: -3.3,
  arbitrary: -3.1,
  vague: -2.3,
  ambiguous: -2.1,
  confusing: -2.3,
  unclear: -2.3,
  unrealistic: -2.9,
  impractical: -2.9,
  unfeasible: -3.0,
  infeasible: -3.0,
  bureaucratic: -2.7,
  redundant: -2.3,
  harmful: -3.1,
  detrimental: -3.3,
  costly: -2.5,
  expensive: -2.3,
  excessive: -2.6,
  delay: -1.9,
  delayed: -2.1,
  delays: -2.1,
  bottleneck: -2.6,
  bottlenecks: -2.6,
  harassment: -3.6,
  unjust: -3.3,
  unfair: -2.7,
  hurdle: -2.1,
  hurdles: -2.3,
  barrier: -2.3,
  barriers: -2.5,
  overburden: -2.9,
  overburdened: -2.9,
  cripple: -3.5,
  crippling: -3.5,
  fails: -2.9,
  failed: -2.9,
  failure: -3.1,
  disappointing: -2.7,
  disappointed: -2.7,
  poor: -2.5,
  bad: -2.3,
  worst: -3.6,
  reject: -2.9,
  rejected: -2.9,
  oppose: -2.9,
  opposed: -2.9,
  opposition: -2.7,
  ineffective: -2.7,
  inefficient: -2.7,
  lack: -1.9,
  lacking: -2.1,
  lacks: -2.1,
  omission: -1.9,
  disregard: -2.7,
  ignored: -2.3,
  shortage: -2.1,
  deficit: -2.1,
  overreach: -3.1,
  penalize: -2.9,
  penalties: -2.3,
  friction: -2.1,
  complicated: -2.3,
  unworkable: -3.1,
  hazardous: -2.9,
  risky: -2.3,
  severe: -2.6,
  severely: -2.8,
  unnecessary: -2.1,
  deplete: -2.8,
  depleting: -2.9,
  paralysis: -3.2,
  bankrupt: -3.5,
};

const NEGATION_WORDS = new Set([
  'not', 'no', 'never', "n't", 'hardly', 'scarcely', 'barely', 'without',
  'lack', 'lacks', 'neither', 'nor', 'cannot', 'cant', "won't", "don't",
  "doesn't", "didn't", 'reduce', 'reduces', 'reduced', 'reducing',
  'eliminate', 'eliminates', 'eliminated', 'prevent', 'prevents'
]);

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

/**
 * Analyzes comment sentiment using multi-clause VADER-style logic
 */
export function analyzeCommentSentiment(text: string): {
  sentiment: SentimentLabel;
  stance: StanceLabel;
  confidence: number;
  polarityScore: number;
} {
  if (!text || text.trim().length === 0) {
    return { sentiment: 'Neutral', stance: 'Neutral/Inquiry', confidence: 0.5, polarityScore: 0 };
  }

  const lowerText = text.toLowerCase();
  let bonusScore = 0;

  // Domain phrase handling
  if (lowerText.includes('increase') && (lowerText.includes('cost') || lowerText.includes('burden') || lowerText.includes('friction'))) {
    bonusScore -= 1.8;
  }
  if (lowerText.includes('reduce') && (lowerText.includes('cost') || lowerText.includes('burden') || lowerText.includes('friction') || lowerText.includes('bottleneck'))) {
    bonusScore += 2.0;
  }
  if (lowerText.includes('strongly welcome') || lowerText.includes('strongly support')) {
    bonusScore += 2.2;
  }
  if (lowerText.includes('strongly oppose') || lowerText.includes('unrealistic and unworkable')) {
    bonusScore -= 2.5;
  }

  // Split into clauses
  const clauses = text.split(/[,;.!?\n]+/).filter((c) => c.trim().length > 0);
  let totalScore = bonusScore;
  let matchesCount = bonusScore !== 0 ? 1 : 0;
  let hasContrast = false;

  for (const clause of clauses) {
    const words = clause.toLowerCase().split(/\s+/).filter(Boolean);
    let clauseScore = 0;

    for (let i = 0; i < words.length; i++) {
      const rawWord = words[i].replace(/[^\w]/g, '');
      if (!rawWord) continue;

      let score = SENTIMENT_LEXICON[rawWord] || 0;

      if (score !== 0) {
        matchesCount++;

        // Intensifiers check
        if (i > 0) {
          const prev1 = words[i - 1].replace(/[^\w]/g, '');
          if (INTENSIFIERS[prev1]) score *= INTENSIFIERS[prev1];
        }
        if (i > 1) {
          const prev2 = words[i - 2].replace(/[^\w]/g, '');
          if (INTENSIFIERS[prev2]) score *= INTENSIFIERS[prev2];
        }

        // Negation check (3 word window)
        let isNegated = false;
        for (let j = Math.max(0, i - 3); j < i; j++) {
          const checkWord = words[j].replace(/[^\w]/g, '');
          if (NEGATION_WORDS.has(checkWord) || checkWord.endsWith("n't")) {
            isNegated = true;
            break;
          }
        }

        if (isNegated) {
          score = -score * 0.92;
        }

        clauseScore += score;
      }
    }

    const lowerClause = clause.toLowerCase();
    if (lowerClause.includes(' but ') || lowerClause.includes(' however ') || lowerClause.includes(' yet ') || lowerClause.includes(' although ')) {
      hasContrast = true;
      clauseScore *= 1.35;
    }

    totalScore += clauseScore;
  }

  // Punctuation emphasis
  const exclamations = (text.match(/!/g) || []).length;
  if (exclamations > 0 && Math.abs(totalScore) > 0.4) {
    totalScore += Math.sign(totalScore) * Math.min(exclamations * 0.3, 0.9);
  }

  // Hyperbolic tangent normalization
  const normalizedPolarity = Math.tanh(totalScore / 3.0);

  // Determine sentiment category & confidence
  let sentiment: SentimentLabel = 'Neutral';
  let confidence = 0.5;

  if (normalizedPolarity >= 0.12) {
    sentiment = 'Positive';
    confidence = Math.min(0.98, 0.70 + Math.abs(normalizedPolarity) * 0.25 + (matchesCount > 1 ? 0.05 : 0));
  } else if (normalizedPolarity <= -0.12) {
    sentiment = 'Negative';
    confidence = Math.min(0.99, 0.72 + Math.abs(normalizedPolarity) * 0.25 + (matchesCount > 1 ? 0.05 : 0));
  } else {
    sentiment = 'Neutral';
    confidence = Math.max(0.65, 0.92 - Math.abs(normalizedPolarity) * 2.5);
  }

  // Determine stance
  let stance: StanceLabel = 'Neutral/Inquiry';
  if (sentiment === 'Positive') {
    stance = hasContrast ? 'Conditional Support' : 'Support';
  } else if (sentiment === 'Negative') {
    if (lowerText.includes('should') || lowerText.includes('must be') || lowerText.includes('suggest') || lowerText.includes('recommend') || lowerText.includes('require')) {
      stance = 'Amendment Needed';
    } else {
      stance = 'Oppose';
    }
  } else {
    if (lowerText.includes('suggest') || lowerText.includes('propose') || lowerText.includes('clarify') || lowerText.includes('need')) {
      stance = 'Amendment Needed';
    } else {
      stance = 'Neutral/Inquiry';
    }
  }

  return {
    sentiment,
    stance,
    confidence: Number(confidence.toFixed(2)),
    polarityScore: Number(normalizedPolarity.toFixed(3)),
  };
}
