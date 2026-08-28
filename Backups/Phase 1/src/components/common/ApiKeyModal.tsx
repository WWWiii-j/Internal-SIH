import React, { useState } from 'react';
import { X, Sparkles, KeyRound, Check, Shield, AlertCircle } from 'lucide-react';
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
    }, 900);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/30">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base">AI Engine Configuration</h3>
              <p className="text-xs text-slate-400">Configure LLM / NLP Provider for SIH Analysis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-sm text-slate-700">
          {/* Provider Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
              Select NLP / AI Processing Engine
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setProvider('local')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  provider === 'local'
                    ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-semibold text-slate-900 text-xs">Built-in Local NLP</div>
                <div className="text-[11px] text-slate-500 mt-0.5">High-speed VADER & N-gram engine (No key needed)</div>
              </button>

              <button
                type="button"
                onClick={() => setProvider('gemini')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  provider === 'gemini'
                    ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-semibold text-slate-900 text-xs flex items-center space-x-1">
                  <span>Google Gemini</span>
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Gemini 1.5 Flash deep synthesis</div>
              </button>

              <button
                type="button"
                onClick={() => setProvider('openai')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  provider === 'openai'
                    ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-semibold text-slate-900 text-xs">OpenAI GPT-4o</div>
                <div className="text-[11px] text-slate-500 mt-0.5">GPT-4o-mini policy reasoning</div>
              </button>

              <button
                type="button"
                onClick={() => setProvider('custom_api')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  provider === 'custom_api'
                    ? 'border-amber-600 bg-amber-50/70 ring-2 ring-amber-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="font-semibold text-slate-900 text-xs">Custom Backend</div>
                <div className="text-[11px] text-slate-500 mt-0.5">Python FastAPI / HuggingFace RoBERTa URL</div>
              </button>
            </div>
          </div>

          {/* Conditional Input Fields */}
          {provider === 'gemini' && (
            <div className="space-y-1.5 animate-fade-in">
              <label className="block text-xs font-semibold text-slate-800">
                Google Gemini API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
              />
              <p className="text-[11px] text-slate-500">
                Stored strictly in your local browser storage or configured via <code className="bg-slate-100 px-1 py-0.5 rounded">.env</code> as <code className="bg-slate-100 px-1 py-0.5 rounded">VITE_GEMINI_API_KEY</code>.
              </p>
            </div>
          )}

          {provider === 'openai' && (
            <div className="space-y-1.5 animate-fade-in">
              <label className="block text-xs font-semibold text-slate-800">
                OpenAI API Key
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
              <p className="text-[11px] text-slate-500">
                Can also be set in <code className="bg-slate-100 px-1 py-0.5 rounded">.env</code> as <code className="bg-slate-100 px-1 py-0.5 rounded">VITE_OPENAI_API_KEY</code>.
              </p>
            </div>
          )}

          {provider === 'custom_api' && (
            <div className="space-y-1.5 animate-fade-in">
              <label className="block text-xs font-semibold text-slate-800">
                Custom FastAPI / REST Endpoint URL
              </label>
              <input
                type="text"
                value={endpointUrl}
                onChange={(e) => setEndpointUrl(e.target.value)}
                placeholder="http://localhost:8000/api/analyze"
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
              <p className="text-[11px] text-slate-500">
                Point to your local PyTorch / HuggingFace RoBERTa microservice.
              </p>
            </div>
          )}

          {provider === 'local' && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start space-x-2.5">
              <Shield className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Zero Configuration Needed:</strong> The built-in client-side NLP engine processes feedback completely offline with instant response time and zero external dependencies.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={handleClear}
            className="text-xs text-slate-500 hover:text-slate-700 underline font-medium"
          >
            Reset to Default
          </button>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm"
            >
              {isSaved ? (
                <>
                  <Check className="w-3.5 h-3.5" />
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
