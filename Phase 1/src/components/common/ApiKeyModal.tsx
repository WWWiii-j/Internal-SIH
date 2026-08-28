import React, { useState } from 'react';
import { X, Sparkles, KeyRound, Check, Shield, Cpu, Bot, Server, Lock } from 'lucide-react';
import { getAiConfig, saveAiConfig, AiConfig } from '../../services/aiService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onConfigSaved }) => {
  const currentConfig = getAiConfig();
  const [provider, setProvider] = useState<'local' | 'gemini' | 'openai' | 'custom_api'>(
    currentConfig.provider || 'local'
  );
  const [apiKey, setApiKey] = useState(currentConfig.apiKey || '');
  const [endpointUrl, setEndpointUrl] = useState(currentConfig.endpointUrl || '');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    const newConfig: AiConfig = {
      provider,
      apiKey: apiKey.trim() ? apiKey.trim() : undefined,
      endpointUrl: endpointUrl.trim() ? endpointUrl.trim() : undefined,
      modelName: provider === 'gemini' ? 'gemini-1.5-flash' : provider === 'openai' ? 'gpt-4o-mini' : undefined,
    };
    saveAiConfig(newConfig);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onConfigSaved();
      onClose();
    }, 600);
  };

  const handleClear = () => {
    localStorage.removeItem('sih_ai_config');
    setProvider('local');
    setApiKey('');
    setEndpointUrl('');
    saveAiConfig({ provider: 'local' });
    onConfigSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#FAF8F3] rounded-2xl shadow-modal max-w-lg w-full overflow-hidden border border-sand-300">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-forest-900 bg-forest-800 text-white">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-forest-700 text-sage-300 border border-forest-600">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">AI Engine & Model Settings</h3>
              <p className="text-[11px] text-sage-300/80">Configure Local VADER or External LLM</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-sage-300 hover:text-white hover:bg-forest-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-xs text-earth-800">
          {/* Provider Selector */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-earth-800 mb-2">
              Select Inference Architecture
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setProvider('local')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  provider === 'local'
                    ? 'border-forest-700 bg-forest-50/80 text-forest-900 ring-2 ring-forest-600'
                    : 'border-sand-300 bg-white hover:bg-sand-50 text-earth-700'
                }`}
              >
                <div className="font-bold flex items-center space-x-1.5 text-xs text-forest-900">
                  <span>Local VADER NLP</span>
                  <span className="text-[9px] bg-forest-200 text-forest-800 px-1.5 py-0.2 rounded font-semibold">Active</span>
                </div>
                <div className="text-[10px] text-earth-600 mt-1">Rule-based scoring, zero-latency, 100% offline.</div>
              </button>

              <button
                type="button"
                onClick={() => setProvider('gemini')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  provider === 'gemini'
                    ? 'border-forest-700 bg-forest-50/80 text-forest-900 ring-2 ring-forest-600'
                    : 'border-sand-300 bg-white hover:bg-sand-50 text-earth-700'
                }`}
              >
                <div className="font-bold text-xs text-earth-900 flex items-center space-x-1">
                  <span>Google Gemini</span>
                  <Sparkles className="w-3 h-3 text-terracotta-500" />
                </div>
                <div className="text-[10px] text-earth-600 mt-1">Gemini 1.5 Flash policy summary enhancement.</div>
              </button>

              <button
                type="button"
                onClick={() => setProvider('openai')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  provider === 'openai'
                    ? 'border-forest-700 bg-forest-50/80 text-forest-900 ring-2 ring-forest-600'
                    : 'border-sand-300 bg-white hover:bg-sand-50 text-earth-700'
                }`}
              >
                <div className="font-bold text-xs text-earth-900">OpenAI GPT-4o</div>
                <div className="text-[10px] text-earth-600 mt-1">GPT-4o-mini structured analysis.</div>
              </button>

              <button
                type="button"
                onClick={() => setProvider('custom_api')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  provider === 'custom_api'
                    ? 'border-forest-700 bg-forest-50/80 text-forest-900 ring-2 ring-forest-600'
                    : 'border-sand-300 bg-white hover:bg-sand-50 text-earth-700'
                }`}
              >
                <div className="font-bold text-xs text-earth-900">Custom FastAPI</div>
                <div className="text-[10px] text-earth-600 mt-1">Dedicated Python backend microservice.</div>
              </button>
            </div>
          </div>

          {/* Conditional Input Fields */}
          {provider === 'gemini' && (
            <div className="space-y-1.5 animate-fade-in p-3.5 bg-sand-100/60 rounded-xl border border-sand-200">
              <label className="block text-xs font-semibold text-earth-800">
                Google Gemini API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-sand-300 bg-white focus:outline-none focus:ring-2 focus:ring-forest-600 font-mono"
              />
              <p className="text-[10px] text-earth-600">
                Can also be set in <code className="bg-sand-200 px-1 py-0.5 rounded text-earth-800">.env</code> as <code className="bg-sand-200 px-1 py-0.5 rounded text-earth-800">VITE_GEMINI_API_KEY</code>.
              </p>
            </div>
          )}

          {provider === 'openai' && (
            <div className="space-y-1.5 animate-fade-in p-3.5 bg-sand-100/60 rounded-xl border border-sand-200">
              <label className="block text-xs font-semibold text-earth-800">
                OpenAI API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-sand-300 bg-white focus:outline-none focus:ring-2 focus:ring-forest-600 font-mono"
              />
              <p className="text-[10px] text-earth-600">
                Can also be set in <code className="bg-sand-200 px-1 py-0.5 rounded text-earth-800">.env</code> as <code className="bg-sand-200 px-1 py-0.5 rounded text-earth-800">VITE_OPENAI_API_KEY</code>.
              </p>
            </div>
          )}

          {provider === 'custom_api' && (
            <div className="space-y-1.5 animate-fade-in p-3.5 bg-sand-100/60 rounded-xl border border-sand-200">
              <label className="block text-xs font-semibold text-earth-800">
                Custom FastAPI / REST Endpoint URL
              </label>
              <input
                type="text"
                value={endpointUrl}
                onChange={(e) => setEndpointUrl(e.target.value)}
                placeholder="http://localhost:8000/api/analyze"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-sand-300 bg-white focus:outline-none focus:ring-2 focus:ring-forest-600 font-mono"
              />
              <p className="text-[10px] text-earth-600">
                Directs comment payloads to your local RoBERTa / IndicBERT microservice.
              </p>
            </div>
          )}

          {provider === 'local' && (
            <div className="p-3.5 rounded-xl bg-white border border-sand-200 text-xs text-earth-700 flex items-start space-x-2.5 shadow-subtle">
              <Shield className="w-4 h-4 text-forest-700 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Zero Configuration Needed:</strong> The built-in client-side NLP engine processes feedback completely offline with instant response time and zero external dependencies.
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2 text-[11px] text-earth-600 bg-sand-50 p-3 rounded-lg border border-sand-200">
            <Lock className="w-3.5 h-3.5 text-forest-700 flex-shrink-0" />
            <span>API keys are stored exclusively in your browser's LocalStorage and are never retained on any server.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-sand-200 bg-sand-100/50 flex items-center justify-between">
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-earth-600 hover:text-earth-800 underline font-medium"
          >
            Reset to Default
          </button>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-sand-300 bg-white text-earth-800 hover:bg-sand-50 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-forest-800 hover:bg-forest-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              {isSaved ? (
                <>
                  <Check className="w-3.5 h-3.5 text-sage-300" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Configuration</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


