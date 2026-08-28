import { PriorityLevel } from '../types';

/**
 * Stakeholder category color badges matching earthy palette
 */
export function getStakeholderBadgeClass(type?: string): string {
  if (!type) return 'bg-sand-100 text-earth-800 border-sand-300';

  const lower = type.toLowerCase();
  if (lower.includes('citizen') || lower.includes('public')) {
    return 'bg-forest-100 text-forest-900 border-forest-300';
  }
  if (lower.includes('msme') || lower.includes('startup')) {
    return 'bg-olive-100 text-olive-900 border-olive-300';
  }
  if (lower.includes('industry') || lower.includes('enterprise')) {
    return 'bg-sand-200 text-earth-900 border-sand-400';
  }
  if (lower.includes('academic') || lower.includes('research')) {
    return 'bg-sage-100 text-sage-900 border-sage-300';
  }
  if (lower.includes('legal') || lower.includes('law')) {
    return 'bg-terracotta-100 text-terracotta-900 border-terracotta-300';
  }
  if (lower.includes('ngo') || lower.includes('civil') || lower.includes('thinktank')) {
    return 'bg-forest-50 text-forest-800 border-forest-200';
  }
  if (lower.includes('government') || lower.includes('regulator')) {
    return 'bg-sand-100 text-earth-900 border-sand-300';
  }
  if (lower.includes('finance') || lower.includes('investor')) {
    return 'bg-olive-50 text-olive-800 border-olive-200';
  }

  return 'bg-sand-100 text-earth-800 border-sand-300';
}

/**
 * Sentiment color badges adhering to frozen Earthy visual palette
 * Positive: Deep Forest / Warm Sage
 * Neutral: Olive Stone / Warm Sand
 * Negative: Terracotta Rust
 */
export function getSentimentBadgeClass(sentiment?: string): string {
  if (!sentiment) return 'bg-sand-100 text-earth-800 border-sand-300';

  const lower = sentiment.toLowerCase();
  if (lower === 'positive') {
    return 'bg-forest-100 text-forest-900 border-forest-300';
  }
  if (lower === 'negative') {
    return 'bg-terracotta-100 text-terracotta-900 border-terracotta-300';
  }
  return 'bg-sand-100 text-earth-900 border-sand-300';
}

/**
 * Stance color badges matching earthy palette
 */
export function getStanceBadgeClass(stance?: string): string {
  if (!stance) return 'bg-sand-100 text-earth-800 border-sand-300';

  const lower = stance.toLowerCase();
  if (lower.includes('support') && !lower.includes('conditional')) {
    return 'bg-forest-100 text-forest-900 border-forest-300';
  }
  if (lower.includes('conditional')) {
    return 'bg-sage-100 text-sage-900 border-sage-300';
  }
  if (lower.includes('oppose')) {
    return 'bg-terracotta-100 text-terracotta-900 border-terracotta-300';
  }
  if (lower.includes('amendment')) {
    return 'bg-olive-100 text-olive-900 border-olive-300';
  }
  return 'bg-sand-100 text-earth-800 border-sand-300';
}

/**
 * Priority Level Badges matching Earthy Theme
 * HIGH: Terracotta Rust (70-100)
 * MEDIUM: Olive Stone (40-69)
 * LOW: Forest Green (0-39)
 */
export function getPriorityBadgeClass(level?: PriorityLevel | string): string {
  if (!level) return 'bg-sand-100 text-earth-800 border-sand-300';

  const upper = level.toUpperCase();
  if (upper === 'HIGH') {
    return 'bg-terracotta-100 text-terracotta-900 border-terracotta-400 font-bold';
  }
  if (upper === 'MEDIUM') {
    return 'bg-olive-100 text-olive-900 border-olive-400 font-bold';
  }
  return 'bg-forest-100 text-forest-900 border-forest-400 font-bold';
}

/**
 * Priority score color styles
 */
export function getPriorityScoreColor(score: number): {
  text: string;
  bg: string;
  bar: string;
} {
  if (score >= 70) {
    return {
      text: 'text-terracotta-800',
      bg: 'bg-terracotta-50 border-terracotta-300',
      bar: 'bg-terracotta-600',
    };
  }
  if (score >= 40) {
    return {
      text: 'text-olive-800',
      bg: 'bg-olive-50 border-olive-300',
      bar: 'bg-olive-600',
    };
  }
  return {
    text: 'text-forest-800',
    bg: 'bg-forest-50 border-forest-300',
    bar: 'bg-forest-600',
  };
}

/**
 * Truncates string with ellipsis
 */
export function truncateText(str: string, maxLen = 100): string {
  if (!str) return '';
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 3) + '...';
}

/**
 * Formats a number with comma separators
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}
