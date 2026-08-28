import { CommentRecord, ExecutiveSummary, KeywordMetric, ThematicCluster } from '../types';
import { generateExecutiveSummary } from './summaryGenerator';

export interface AiConfig {
  provider: 'local' | 'gemini' | 'openai' | 'custom_api';
  apiKey?: string;
  endpointUrl?: string;
  modelName?: string;
}

/**
 * Get active AI configuration from environment variables or localStorage override
 */
export function getAiConfig(): AiConfig {
  const localSaved = localStorage.getItem('sih_ai_config');
  if (localSaved) {
    try {
      return JSON.parse(localSaved);
    } catch {
      // fallback
    }
  }

  // Check Vite environment variables (never exposed in backend or production bundles if unset)
  const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const openAiKey = import.meta.env.VITE_OPENAI_API_KEY;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  if (geminiKey) {
    return { provider: 'gemini', apiKey: geminiKey, modelName: 'gemini-1.5-flash' };
  }
  if (openAiKey) {
    return { provider: 'openai', apiKey: openAiKey, modelName: 'gpt-4o-mini' };
  }
  if (backendUrl) {
    return { provider: 'custom_api', endpointUrl: backendUrl };
  }

  return { provider: 'local' };
}

/**
 * Save user API configuration in browser storage (for live demo evaluation)
 */
export function saveAiConfig(config: AiConfig) {
  localStorage.setItem('sih_ai_config', JSON.stringify(config));
}

/**
 * Check if external AI provider is configured
 */
export function isExternalAiConfigured(): boolean {
  const config = getAiConfig();
  return config.provider !== 'local' && (!!config.apiKey || !!config.endpointUrl);
}

/**
 * Generate advanced AI Executive Summary via Gemini or fallback
 */
export async function enhanceSummaryWithAi(
  records: CommentRecord[],
  stats: any,
  keywords: KeywordMetric[],
  themes: ThematicCluster[]
): Promise<ExecutiveSummary> {
  const config = getAiConfig();
  const baseSummary = generateExecutiveSummary(records, stats, keywords, themes);

  if (config.provider === 'gemini' && config.apiKey) {
    try {
      // Direct call to Google Gemini 1.5 Flash endpoint
      const prompt = `You are a senior policy analyst advising a high-level government legislative committee on public consultation feedback.
Analyze these ${records.length} comments (Positive: ${stats.positiveCount}, Negative: ${stats.negativeCount}, Neutral: ${stats.neutralCount}).
Top Keywords: ${keywords.slice(0, 8).map((k) => k.text).join(', ')}.

Sample comments:
${records.slice(0, 15).map((r) => `[${r.sentiment}] ${r.originalText}`).join('\n')}

Generate a JSON response with this exact structure:
{
  "overallStance": "string concise stance headline",
  "executiveBrief": "string 2-3 formal policy briefing sentences",
  "majorPositiveHighlights": ["3-4 specific concise positive points"],
  "majorConcerns": ["3-4 specific concise negative concerns"],
  "actionableRecommendations": ["3-4 clear policy amendments or administrative measures"],
  "criticalRiskAreas": ["2-3 specific policy implementation risks"]
}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${config.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const jsonText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (jsonText) {
          const parsed = JSON.parse(jsonText);
          return {
            ...baseSummary,
            overallStance: parsed.overallStance || baseSummary.overallStance,
            executiveBrief: parsed.executiveBrief || baseSummary.executiveBrief,
            majorPositiveHighlights: parsed.majorPositiveHighlights || baseSummary.majorPositiveHighlights,
            majorConcerns: parsed.majorConcerns || baseSummary.majorConcerns,
            actionableRecommendations: parsed.actionableRecommendations || baseSummary.actionableRecommendations,
            criticalRiskAreas: parsed.criticalRiskAreas || baseSummary.criticalRiskAreas,
          };
        }
      }
    } catch (err) {
      console.warn('External Gemini API call failed, falling back to built-in NLP engine:', err);
    }
  }

  // High quality local NLP engine output is returned seamlessly
  return baseSummary;
}
