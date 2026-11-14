import React from 'react';
import { Shield, Sparkles, Settings, CheckCircle2, AlertTriangle, ExternalLink } from 'lucide-react';
import { GeminiConfig } from '../types';

interface HeaderProps {
  geminiConfig: GeminiConfig;
  onOpenSettings: () => void;
  onOpenVerificationGuide: () => void;
  onOpenDomainChecker: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  geminiConfig,
  onOpenSettings,
  onOpenVerificationGuide,
  onOpenDomainChecker
}) => {
  const isAILive = Boolean(geminiConfig.apiKey && geminiConfig.isEnabled);

  return (
    <header className="border-b border-slate-800/80 bg-[#0B0F19]/90 backdrop-blur-md sticky top-0 z-40 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand identity */}
        <div className="flex items-center space-x-3.5">
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#FF444F] via-[#D42D38] to-[#991B1B] flex items-center justify-center shadow-lg shadow-[#FF444F]/25 border border-[#FF6B75]/30">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#0B0F19]"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                Deriv <span className="text-[#FF444F] font-extrabold">Shield</span>
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
                v1.0 • DevFest
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              Anti-Impersonation & Phishing Defense for Deriv Traders
            </p>
          </div>
        </div>

        {/* Status Mode Badge & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Engine indicator */}
          <button
            onClick={onOpenSettings}
            className={`hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
              isAILive
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
            }`}
            title="Click to configure Gemini API"
          >
            {isAILive ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>AI Live: {geminiConfig.model}</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Demo: Heuristic Engine</span>
                <span className="text-[10px] opacity-75 underline ml-1">Connect API</span>
              </>
            )}
          </button>

          {/* Quick Tools */}
          <button
            onClick={onOpenDomainChecker}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-slate-600 text-xs font-medium text-slate-300 hover:text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Check Domain</span>
          </button>

          <button
            onClick={onOpenVerificationGuide}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-slate-600 text-xs font-medium text-slate-300 hover:text-white transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Official Channels</span>
          </button>

          {/* Settings modal trigger */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white transition-colors relative"
            title="Gemini AI & Security Settings"
          >
            <Settings className="w-4 h-4" />
            {isAILive && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0B0F19]"></span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
