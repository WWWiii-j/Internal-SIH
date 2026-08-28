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
        bg: 'bg-forest-50 text-forest-800',
        text: 'text-forest-700',
        border: 'border-forest-200',
        badge: 'bg-forest-100/90 text-forest-800 border-forest-300 font-medium',
        hex: '#345E3D', // Muted Deep Forest Green
      };
    case 'Negative':
      return {
        bg: 'bg-terracotta-50 text-terracotta-900',
        text: 'text-terracotta-700',
        border: 'border-terracotta-200',
        badge: 'bg-terracotta-100/90 text-terracotta-800 border-terracotta-300 font-medium',
        hex: '#B86B4B', // Muted Terracotta Rust
      };
    case 'Neutral':
    default:
      return {
        bg: 'bg-sand-100 text-earth-800',
        text: 'text-earth-700',
        border: 'border-sand-300',
        badge: 'bg-sand-200/90 text-earth-800 border-sand-400 font-medium',
        hex: '#66735A', // Muted Olive Stone
      };
  }
}

export function formatPercentage(val: number): string {
  return `${val.toFixed(1)}%`;
}

export function formatConfidence(score: number): string {
  return `${Math.round(score * 100)}%`;
}


