import React from 'react';
import { X, ShieldCheck, CheckCircle, ExternalLink, AlertTriangle, LifeBuoy, Smartphone } from 'lucide-react';
import { OFFICIAL_SUPPORT_CHANNELS, OFFICIAL_DERIV_DOMAINS } from '../data/officialDerivChannels';

interface OfficialVerificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfficialVerificationDrawer: React.FC<OfficialVerificationDrawerProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl h-full bg-[#0B0F19] border-l border-slate-800 p-6 sm:p-8 flex flex-col shadow-2xl overflow-y-auto">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Official Deriv Channels</h3>
              <p className="text-xs text-slate-400">Authorized endpoints, apps, and verified touchpoints</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="space-y-6 flex-1">
          
          {/* Key Rule Warning */}
          <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/40 text-xs text-red-200">
            <div className="flex items-center gap-2 font-bold text-red-300 text-sm mb-1">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <span>Official Deriv Zero-Trust Policy</span>
            </div>
            <p className="leading-relaxed">
              Deriv will <strong className="text-white underline">never</strong> reach out to you via personal WhatsApp messages, Telegram DMs, or unofficial phone calls asking for passwords, one-time passwords (OTPs), or deposit transfers to personal addresses.
            </p>
          </div>

          {/* Official Touchpoints */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-3 flex items-center gap-1.5">
              <LifeBuoy className="w-3.5 h-3.5 text-cyan-400" />
              <span>Verified Support Channels</span>
            </h4>
            <div className="space-y-2.5">
              {OFFICIAL_SUPPORT_CHANNELS.map((channel, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      {channel.name}
                    </span>
                    <a
                      href={channel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-mono"
                    >
                      <span>Visit</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 font-sans">{channel.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Official Domains */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Whitelisted Web Domains</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {OFFICIAL_DERIV_DOMAINS.map((item, i) => (
                <div key={i} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <span className="text-xs font-mono font-semibold text-emerald-400">{item.domain}</span>
                  <div className="text-[11px] text-slate-400 mt-0.5">{item.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Apps */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-3 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-purple-400" />
              <span>Authentic Mobile Applications</span>
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300 space-y-2">
              <p>Only install mobile trading applications from verified publishers:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-400 font-mono text-[11px]">
                <li><strong className="text-white">Deriv GO:</strong> Published by Deriv Investments (Europe) Ltd or Deriv (FX) Ltd</li>
                <li><strong className="text-white">Deriv Bot:</strong> Web browser based at app.deriv.com/bot</li>
                <li><strong className="text-white">MetaTrader 5:</strong> Connect to broker server "Deriv-Server" or "Deriv-Demo"</li>
              </ul>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-slate-800 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
