import React, { useState } from 'react';
import { X, Sparkles, Key, CheckCircle, AlertCircle, Cpu } from 'lucide-react';
import { GeminiConfig } from '../types';
import { testGeminiApiKey } from '../services/geminiService';

interface GeminiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: GeminiConfig;
  onSaveConfig: (config: GeminiConfig) => void;
}

export const GeminiSettingsModal: React.FC<GeminiSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig
}) => {
  const [apiKey, setApiKey] = useState(config.apiKey);
  const [model, setModel] = useState(config.model || 'gemini-1.5-flash');
  const [isEnabled, setIsEnabled] = useState(config.isEnabled);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleTest = async () => {
    if (!apiKey.trim()) {
      setTestStatus('error');
      setTestMessage('Please enter an API key first.');
      return;
    }

    setTestStatus('testing');
    setTestMessage('Connecting to Google Gemini API...');

    const res = await testGeminiApiKey(apiKey.trim(), model);
    if (res.success) {
      setTestStatus('success');
      setTestMessage(res.message);
    } else {
      setTestStatus('error');
      setTestMessage(`Connection failed: ${res.message}`);
    }
  };

  const handleSave = () => {
    onSaveConfig({
      apiKey: apiKey.trim(),
      model,
      isEnabled: Boolean(apiKey.trim() && isEnabled)
    });
    onClose();
  };

  const handleClear = () => {
    setApiKey('');
    setIsEnabled(false);
    onSaveConfig({
      apiKey: '',
      model: 'gemini-1.5-flash',
      isEnabled: false
    });
    setTestStatus('idle');
    setTestMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg rounded-2xl cyber-card border border-slate-700 p-6 shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 text-cyan-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Google Gemini AI Engine</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                Optional
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Deriv Shield operates with a built-in heuristic engine by default. Connect Gemini for advanced semantic reasoning.
            </p>
          </div>
        </div>

        {/* API Key Input */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-bold mb-1.5">
              Gemini API Key
            </label>
            <div className="relative">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  if (e.target.value.trim()) setIsEnabled(true);
                }}
                placeholder="AIzaSy..."
                className="w-full bg-[#080C14] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
              />
              <Key className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">
              Get an API key from Google AI Studio. Your key remains stored only in your local browser session.
            </p>
          </div>

          {/* Model Selection */}
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 font-bold mb-1.5 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Model Selection</span>
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-[#080C14] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="gemini-1.5-flash">Gemini 1.5 Flash (Fast, Recommended)</option>
              <option value="gemini-2.0-flash">Gemini 2.0 Flash (Next-Gen)</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Forensics)</option>
            </select>
          </div>

          {/* Enable Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
            <div>
              <span className="text-xs font-bold text-white block">Enable Live AI Mode</span>
              <span className="text-[11px] text-slate-400">
                When disabled, Deriv Shield uses the built-in offline heuristic scanner.
              </span>
            </div>
            <input
              type="checkbox"
              checked={isEnabled}
              disabled={!apiKey.trim()}
              onChange={(e) => setIsEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-cyan-500 bg-slate-800 border-slate-600 focus:ring-0 cursor-pointer"
            />
          </div>

          {/* Test Status feedback */}
          {testStatus !== 'idle' && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                testStatus === 'success'
                  ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-300'
                  : testStatus === 'error'
                  ? 'bg-red-950/30 border-red-500/50 text-red-300'
                  : 'bg-cyan-950/30 border-cyan-500/50 text-cyan-300'
              }`}
            >
              {testStatus === 'success' ? (
                <CheckCircle className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              ) : testStatus === 'error' ? (
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              ) : (
                <div className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
              )}
              <span className="font-mono">{testMessage}</span>
            </div>
          )}

        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleTest}
              disabled={testStatus === 'testing' || !apiKey.trim()}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-xs font-semibold text-slate-200 transition-colors"
            >
              Test Connection
            </button>
            {apiKey && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 transition-colors"
              >
                Clear Key
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-cyan-600/20"
            >
              Save & Apply
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
