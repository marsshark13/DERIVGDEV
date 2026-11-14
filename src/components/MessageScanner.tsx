import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Trash2,
  Lock,
  Sparkles,
  Clipboard,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { DEMO_MESSAGES } from '../data/demoMessages';
import { DemoMessage } from '../types';
import { detectSensitiveData, sanitizeMessageContent } from '../services/privacySanitizer';

interface MessageScannerProps {
  onAnalyze: (message: string) => void;
  isAnalyzing: boolean;
  activeDemoId?: string;
  onSelectDemo: (demo: DemoMessage) => void;
}

export const MessageScanner: React.FC<MessageScannerProps> = ({
  onAnalyze,
  isAnalyzing,
  activeDemoId,
  onSelectDemo
}) => {
  const [messageText, setMessageText] = useState<string>('');
  const [privacyWarning, setPrivacyWarning] = useState<string | null>(null);

  // Check for sensitive data whenever text changes
  useEffect(() => {
    if (!messageText.trim()) {
      setPrivacyWarning(null);
      return;
    }

    const detections = detectSensitiveData(messageText);
    if (detections.length > 0) {
      const types = detections.map(d => d.type.toUpperCase()).join(', ');
      setPrivacyWarning(
        `Sensitive data detected (${types}). For your privacy, consider clicking "Redact Sensitive Data" before submitting.`
      );
    } else {
      setPrivacyWarning(null);
    }
  }, [messageText]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setMessageText(text);
      }
    } catch {
      // ignore
    }
  };

  const handleSanitize = () => {
    const { sanitizedText } = sanitizeMessageContent(messageText);
    setMessageText(sanitizedText);
    setPrivacyWarning(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim() && !isAnalyzing) {
      onAnalyze(messageText.trim());
    }
  };

  const handleDemoClick = (demo: DemoMessage) => {
    setMessageText(demo.content);
    onSelectDemo(demo);
    onAnalyze(demo.content);
  };

  const charCount = messageText.length;
  const wordCount = messageText.trim() ? messageText.trim().split(/\s+/).length : 0;

  return (
    <div className="rounded-2xl cyber-card p-6 border border-slate-800 shadow-2xl relative overflow-hidden">
      
      {/* Decorative cyber grid accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-b from-[#FF444F]/5 to-transparent pointer-events-none rounded-full blur-2xl"></div>

      {/* Preset Demo Selector Bar */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <label className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Interactive Demo Scenarios:</span>
          </label>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Click an example to test instant analysis
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {DEMO_MESSAGES.map((demo) => {
            const isSelected = activeDemoId === demo.id;
            const isScam = demo.type === 'obvious_scam';
            const isSuspicious = demo.type === 'suspicious';

            return (
              <button
                key={demo.id}
                type="button"
                onClick={() => handleDemoClick(demo)}
                className={`p-3 rounded-xl text-left border transition-all relative ${
                  isSelected
                    ? isScam
                      ? 'bg-red-500/15 border-red-500 shadow-md shadow-red-500/20'
                      : isSuspicious
                      ? 'bg-amber-500/15 border-amber-500 shadow-md shadow-amber-500/20'
                      : 'bg-emerald-500/15 border-emerald-500 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full border ${
                      isScam
                        ? 'bg-red-500/20 text-red-300 border-red-500/40'
                        : isSuspicious
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}
                  >
                    {demo.label}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{demo.channel}</span>
                </div>
                <div className="text-xs font-semibold text-slate-200 truncate">
                  {demo.title}
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">
                  {demo.summaryNote}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Text Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="flex items-center justify-between pb-2 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 font-bold text-slate-300 uppercase tracking-wide">
              <span>Paste Message to Inspect</span>
              <span className="text-slate-400 font-normal font-sans">(SMS, WhatsApp, Telegram, or Email)</span>
            </span>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handlePaste}
                className="flex items-center space-x-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Paste from clipboard"
              >
                <Clipboard className="w-3 h-3" />
                <span className="hidden sm:inline text-[11px]">Paste</span>
              </button>

              {messageText && (
                <button
                  type="button"
                  onClick={handleSanitize}
                  className="flex items-center space-x-1 px-2 py-1 rounded bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/80 text-cyan-300 transition-colors"
                  title="Mask passwords, OTP codes, and personal numbers"
                >
                  <Lock className="w-3 h-3 text-cyan-400" />
                  <span className="text-[11px]">Redact Sensitive Data</span>
                </button>
              )}

              {messageText && (
                <button
                  type="button"
                  onClick={() => setMessageText('')}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                  title="Clear text"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Text Area */}
          <div className="relative rounded-xl border border-slate-700/80 bg-[#080C14] focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all">
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Paste suspicious WhatsApp message, Telegram chat, SMS, or email claiming to be from Deriv Support here..."
              rows={6}
              className="w-full bg-transparent px-4 py-3.5 text-sm text-slate-100 placeholder-slate-400 font-mono focus:outline-none resize-none leading-relaxed"
            />

            {/* Scanning radar line animation when analyzing */}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-cyan-500/5 backdrop-blur-[1px] rounded-xl overflow-hidden pointer-events-none flex flex-col justify-center items-center">
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan-line shadow-[0_0_15px_#38BDF8]"></div>
                <div className="flex items-center space-x-2 text-cyan-300 font-mono text-xs font-bold mt-2 bg-slate-900/90 px-3 py-1 rounded-full border border-cyan-500/40">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                  <span>Executing Deep Heuristic & AI Forensics...</span>
                </div>
              </div>
            )}
          </div>

          {/* Metrics bar */}
          <div className="flex items-center justify-between pt-2 px-1 text-xs text-slate-400 font-mono">
            <span>
              {wordCount} words • {charCount} characters
            </span>
            <span className="text-[11px]">
              🔒 Client-side zero storage guarantee
            </span>
          </div>
        </div>

        {/* Privacy Detection Alert Banner */}
        {privacyWarning && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start justify-between gap-3 text-xs text-amber-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>{privacyWarning}</span>
            </div>
            <button
              type="button"
              onClick={handleSanitize}
              className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold flex-shrink-0 transition-colors"
            >
              Redact Now
            </button>
          </div>
        )}

        {/* Action Button */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="submit"
            disabled={!messageText.trim() || isAnalyzing}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center space-x-2.5 transition-all shadow-xl ${
              !messageText.trim() || isAnalyzing
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-[#FF444F] via-[#EF4444] to-[#DC2626] hover:brightness-110 text-white border border-[#FF6B75]/40 cyber-glow-red hover:scale-[1.02] active:scale-[0.99]'
            }`}
          >
            {isAnalyzing ? (
              <>
                <RotateCcw className="w-4 h-4 animate-spin text-white" />
                <span>Analyzing Forensic Signatures...</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-4 h-4 text-white" />
                <span>Analyze Message</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
