import React from 'react';
import { RiskLevel } from '../types';
import {
  ShieldAlert,
  Lock,
  ExternalLink,
  Ban,
  FileWarning
} from 'lucide-react';
import { DERIV_GOLDEN_RULES } from '../data/officialDerivChannels';

interface SafetyGuidanceProps {
  riskLevel: RiskLevel;
  recommendedActions: string[];
  onOpenVerificationGuide: () => void;
}

export const SafetyGuidance: React.FC<SafetyGuidanceProps> = ({
  riskLevel,
  recommendedActions,
  onOpenVerificationGuide
}) => {
  return (
    <div className="space-y-6">
      
      {/* Recommended Action Checklist */}
      <div className="rounded-2xl cyber-card p-5 border border-slate-800">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-[#FF444F]" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Actionable Security Protocols
            </h4>
          </div>
          <span className="text-xs font-mono text-slate-400">Immediate Steps</span>
        </div>

        <div className="space-y-2.5">
          {recommendedActions.map((action, idx) => (
            <div
              key={idx}
              className="flex items-start space-x-3 p-3 rounded-xl bg-slate-900/70 border border-slate-800/80"
            >
              <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-mono font-bold text-cyan-400">
                {idx + 1}
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {action}
              </p>
            </div>
          ))}
        </div>

        {/* Warning callout: NEVER click links or call numbers */}
        {riskLevel !== 'SAFE' && (
          <div className="mt-4 p-3.5 rounded-xl bg-red-950/20 border border-red-500/40 flex items-start gap-3">
            <Ban className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-red-200 leading-relaxed">
              <strong className="text-red-300 font-bold block mb-0.5">CRITICAL SAFETY DIRECTIVE:</strong>
              Never dial phone numbers, click links, or message Telegram handles supplied inside suspicious messages. Always initiate communication independently by typing <span className="font-mono bg-red-950 px-1 py-0.5 rounded text-white font-bold">deriv.com</span> directly into your browser.
            </div>
          </div>
        )}
      </div>

      {/* Deriv 4 Golden Rules */}
      <div className="rounded-2xl cyber-card p-5 border border-slate-800">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Deriv Security Rules of Engagement
            </h4>
          </div>
          <button
            onClick={onOpenVerificationGuide}
            className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
          >
            <span>Full Guide</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DERIV_GOLDEN_RULES.map((rule, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-white">{rule.title}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {rule.badge}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {rule.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Official Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 flex items-start gap-3">
        <FileWarning className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
          <strong className="text-slate-300">DISCLAIMER & ADVISORY NOTICE:</strong> Deriv Shield is an automated security scanner designed to assist traders in identifying common impersonation and phishing heuristics. Threat scores and classifications are indicators based on pattern algorithms and AI heuristics, not legal or absolute guarantees. If you suspect your trading account has been compromised, immediately change your password at <a href="https://deriv.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline font-mono">deriv.com</a> and contact Deriv Customer Support via official live chat.
        </p>
      </div>

    </div>
  );
};
