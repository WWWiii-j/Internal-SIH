import { SentimentType } from '../types';

export function getSentimentColor(sentiment: SentimentType): {
  bg: string;
  text: string;
  border: string;
  badge: string;
  hex: string;
} {
  switch (sentiment) {
    case 'Positive':
      return {
        bg: 'bg-emerald-50 text-emerald-900',
        text: 'text-emerald-800',
        border: 'border-emerald-200',
        badge: 'bg-emerald-100/80 text-emerald-900 border-emerald-300',
        hex: '#2D6A4F', // Deep Forest Green
      };
    case 'Negative':
      return {
        bg: 'bg-orange-50 text-orange-950',
        text: 'text-amber-900',
        border: 'border-orange-200',
        badge: 'bg-orange-100/80 text-amber-950 border-orange-300',
        hex: '#C2410C', // Earthy Terracotta Rust
      };
    case 'Neutral':
    default:
      return {
        bg: 'bg-stone-100 text-stone-800',
        text: 'text-stone-700',
        border: 'border-stone-200',
        badge: 'bg-stone-200/80 text-stone-800 border-stone-300',
        hex: '#57534E', // Warm Charcoal Stone
      };
  }
}

export function formatPercentage(val: number): string {
  return `${val.toFixed(1)}%`;
}

export function formatConfidence(score: number): string {
  return `${Math.round(score * 100)}%`;
}
