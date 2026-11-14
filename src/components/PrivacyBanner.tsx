import React from 'react';
import { ShieldCheck, EyeOff, Lock, Database } from 'lucide-react';

export const PrivacyBanner: React.FC = () => {
  return (
    <div className="rounded-2xl cyber-card p-4 sm:p-5 border border-slate-800/80 mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex-shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-white flex items-center gap-2">
              <span>Zero-Storage & Privacy Architecture</span>
              <span className="text-[10px] px-2 py-0.2 rounded bg-emerald-500/15 text-emerald-300 font-semibold border border-emerald-500/20">
                Active
              </span>
            </h4>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              Your messages are processed in-memory during this browser session only. No message text, account numbers, or chat history are ever stored on external databases or logged.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 flex-shrink-0 border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0 sm:pl-4">
          <span className="flex items-center gap-1">
            <EyeOff className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ephemeral</span>
          </span>
          <span className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Untrusted Sandboxing</span>
          </span>
          <span className="flex items-center gap-1">
            <Database className="w-3.5 h-3.5 text-purple-400" />
            <span>No DB Persistence</span>
          </span>
        </div>

      </div>
    </div>
  );
};
