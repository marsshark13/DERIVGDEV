import React from 'react';
import { ThreatIndicator, DetectedUrl } from '../types';
import {
  AlertOctagon,
  AlertTriangle,
  Globe,
  KeyRound,
  Clock,
  ShieldCheck,
  Gift,
  Info
} from 'lucide-react';

interface IndicatorsListProps {
  indicators: ThreatIndicator[];
  detectedUrls: DetectedUrl[];
  selectedIndicatorId?: string;
  onSelectIndicator?: (indicator: ThreatIndicator) => void;
}

export const IndicatorsList: React.FC<IndicatorsListProps> = ({
  indicators,
  detectedUrls,
  selectedIndicatorId,
  onSelectIndicator
}) => {
  const getCategoryIcon = (category: ThreatIndicator['category']) => {
    switch (category) {
      case 'credential_theft':
        return <KeyRound className="w-4 h-4 text-red-400" />;
      case 'suspicious_url':
        return <Globe className="w-4 h-4 text-rose-400" />;
      case 'impersonation':
        return <AlertOctagon className="w-4 h-4 text-orange-400" />;
      case 'urgency_coercion':
        return <Clock className="w-4 h-4 text-amber-400" />;
      case 'unauthorized_payment':
      case 'manipulation':
        return <Gift className="w-4 h-4 text-yellow-400" />;
      case 'official_pattern':
      default:
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getSeverityBadge = (severity: ThreatIndicator['severity']) => {
    switch (severity) {
      case 'critical':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider bg-red-500/15 text-red-400 border border-red-500/30">
            CRITICAL SEVERITY
          </span>
        );
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider bg-rose-500/15 text-rose-400 border border-rose-500/30">
            HIGH SEVERITY
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
            ELEVATED RISK
          </span>
        );
      case 'safe':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            VERIFIED SAFE
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono tracking-wider bg-slate-500/15 text-slate-300 border border-slate-500/30">
            INFORMATIONAL
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Detected URLs Analysis Section */}
      {detectedUrls && detectedUrls.length > 0 && (
        <div className="rounded-2xl cyber-card p-5 border border-slate-800">
          <div className="flex items-center space-x-2 pb-3 mb-4 border-b border-slate-800">
            <Globe className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Link & Domain Forensics ({detectedUrls.length})
            </h4>
          </div>

          <div className="space-y-3">
            {detectedUrls.map((item, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border transition-all ${
                  item.status === 'phishing'
                    ? 'bg-red-950/20 border-red-500/40 text-red-200'
                    : item.status === 'safe'
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                    : 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 font-mono text-xs">
                    <span className="text-slate-400">Target:</span>
                    <span className="font-semibold underline break-all">{item.url}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      item.status === 'phishing'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                        : item.status === 'safe'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                    }`}
                  >
                    {item.status === 'phishing' ? '🚨 Phishing Fake' : item.status === 'safe' ? '🛡️ Official Deriv' : '⚠️ Unverified'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-2 font-sans leading-relaxed">
                  {item.reason}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detected Indicators List */}
      <div className="rounded-2xl cyber-card p-5 border border-slate-800">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Detected Threat Signals ({indicators.length})
            </h4>
          </div>
          <span className="text-xs text-slate-400">Click a signal to highlight</span>
        </div>

        {indicators.length === 0 ? (
          <div className="p-6 text-center rounded-xl bg-slate-900/50 border border-slate-800">
            <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-300">No malicious indicators detected.</p>
            <p className="text-xs text-slate-400 mt-1">This message conforms to genuine Deriv messaging patterns.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {indicators.map((ind) => {
              const isSelected = selectedIndicatorId === ind.id;
              return (
                <div
                  key={ind.id}
                  onClick={() => onSelectIndicator?.(ind)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/90 border-cyan-500 shadow-lg ring-1 ring-cyan-500/50'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                    <div className="flex items-center space-x-2.5">
                      <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700">
                        {getCategoryIcon(ind.category)}
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-white">{ind.title}</h5>
                        <div className="text-[11px] font-mono text-cyan-400 mt-0.5">
                          Snippet: <span className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">"{ind.phrase}"</span>
                        </div>
                      </div>
                    </div>
                    {getSeverityBadge(ind.severity)}
                  </div>

                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    {ind.explanation}
                  </p>

                  {ind.advice && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-start gap-1.5 text-xs text-amber-300 font-medium">
                      <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-400" />
                      <span>{ind.advice}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
