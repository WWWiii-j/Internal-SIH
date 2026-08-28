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
