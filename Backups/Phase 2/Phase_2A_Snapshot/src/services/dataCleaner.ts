/**
 * Strips HTML entities, control codes, and trims redundant whitespace
 */
export function sanitizeCommentText(text: string): string {
  if (!text) return '';

  return text
    // Replace non-printable ASCII control characters (except newline/tab)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Replace unescaped HTML entities
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    // Normalize unicode quotes and dashes
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    // Normalize multiple spaces into single space
    .replace(/[ \t]+/g, ' ')
    .trim();
}

/**
 * Generates a normalized signature of a text string for similarity comparison
 */
export function getNormalizedSignature(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter((w) => w.length > 2)
    .sort()
    .join(' ');
}

/**
 * Determines whether a comment is too short to extract substantive policy signals
 */
export function isTrivialSubmission(text: string): boolean {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length < 4) {
    const lower = text.toLowerCase().trim();
    const trivialPhrases = ['ok', 'yes', 'no', 'agree', 'disagree', 'good', 'bad', 'thanks', 'n/a', 'none', 'supported', 'opposed'];
    return trivialPhrases.includes(lower) || words.length <= 2;
  }
  return false;
}

/**
 * Standardizes stakeholder group labels into formal governance taxonomy
 */
export function standardizeStakeholderGroup(raw?: string): string {
  if (!raw || !raw.trim()) return 'Citizen / General Public';

  const norm = raw.toLowerCase().trim();

  if (norm.includes('citizen') || norm.includes('public') || norm.includes('individual') || norm.includes('consumer') || norm.includes('resident')) {
    return 'Citizen / Public';
  }
  if (norm.includes('msme') || norm.includes('small business') || norm.includes('startup') || norm.includes('tier-2')) {
    return 'MSME & Startups';
  }
  if (norm.includes('conglomerate') || norm.includes('industry') || norm.includes('manufacturer') || norm.includes('developer') || norm.includes('enterprise') || norm.includes('oem') || norm.includes('firm')) {
    return 'Industry & Enterprises';
  }
  if (norm.includes('academic') || norm.includes('university') || norm.includes('research') || norm.includes('scientist') || norm.includes('scholar') || norm.includes('professor')) {
    return 'Academia & Research';
  }
  if (norm.includes('legal') || norm.includes('law') || norm.includes('advocate') || norm.includes('consultant') || norm.includes('arbitration')) {
    return 'Legal & Policy Experts';
  }
  if (norm.includes('ngo') || norm.includes('thinktank') || norm.includes('civil') || norm.includes('activist') || norm.includes('union') || norm.includes('foundation') || norm.includes('society')) {
    return 'Civil Society & NGOs';
  }
  if (norm.includes('utility') || norm.includes('regulator') || norm.includes('state') || norm.includes('ministry') || norm.includes('agency') || norm.includes('authority') || norm.includes('nodal') || norm.includes('corporation')) {
    return 'Government & Regulators';
  }
  if (norm.includes('bank') || norm.includes('investor') || norm.includes('finance') || norm.includes('analyst') || norm.includes('trader')) {
    return 'Finance & Investors';
  }

  // Capitalize title words if not categorized
  return raw.trim().replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

/**
 * Standardizes policy section/clause references
 */
export function standardizePolicySection(raw?: string): string {
  if (!raw || !raw.trim()) return 'General / Entire Policy';

  const trimmed = raw.trim();
  // Extract standard patterns like Section 4, Clause 3.2, Rule 17, Chapter 2
  const secMatch = trimmed.match(/(section|sec\.?|clause|rule|article|chapter|para)\s*([\d\.]+)/i);
  if (secMatch) {
    const type = secMatch[1].charAt(0).toUpperCase() + secMatch[1].slice(1).toLowerCase();
    return `${type} ${secMatch[2]}`;
  }

  return trimmed;
}
