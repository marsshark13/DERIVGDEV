import React, { useState } from 'react';
import { Search, Globe, CheckCircle2, AlertOctagon, HelpCircle, X } from 'lucide-react';
import { OFFICIAL_DERIV_DOMAINS } from '../data/officialDerivChannels';

interface DomainCheckerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DomainChecker: React.FC<DomainCheckerProps> = ({ isOpen, onClose }) => {
  const [inputUrl, setInputUrl] = useState('');
  const [result, setResult] = useState<{
    domain: string;
    status: 'official' | 'phishing' | 'external' | null;
    message: string;
    details: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleCheck = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = inputUrl.trim().toLowerCase();
    if (!query) return;

    let clean = query
      .replace(/^https?:\/\//i, '')
      .replace(/^www\./i, '')
      .split('/')[0]
      .split('?')[0];

    const isOfficial = OFFICIAL_DERIV_DOMAINS.some(
      (d) => clean === d.domain || clean.endsWith('.' + d.domain)
    );

    const containsDeriv = clean.includes('deriv');

    if (isOfficial) {
      setResult({
        domain: clean,
        status: 'official',
        message: 'VERIFIED OFFICIAL DERIV DOMAIN',
        details: `"${clean}" is an authentic, authorized web domain owned and operated by Deriv.`
      });
    } else if (containsDeriv) {
      setResult({
        domain: clean,
        status: 'phishing',
        message: 'CRITICAL WARNING: FAKE / LOOKALIKE DOMAIN',
        details: `"${clean}" contains the word "deriv" but is NOT on the official whitelist. This is almost certainly a credential-harvesting phishing site or clone.`
      });
    } else {
      setResult({
        domain: clean,
        status: 'external',
        message: 'EXTERNAL THIRD-PARTY DOMAIN',
        details: `"${clean}" is an external site unrelated to Deriv. Deriv Support will never ask you to authenticate or transfer deposits to external services.`
      });
    }
  };

  const sampleDomains = [
    { name: 'deriv.com', legit: true },
    { name: 'app.deriv.com', legit: true },
    { name: 'deriv-support-desk.online', legit: false },
    { name: 'deriv-bonus-claim.net', legit: false },
    { name: 'deriv.me', legit: true }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl rounded-2xl cyber-card border border-slate-700 p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-2.5 mb-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Deriv Domain & Link Verifier</h3>
            <p className="text-xs text-slate-400">Instantly test if a URL or website is genuine or a phishing trap</p>
          </div>
        </div>

        {/* Input */}
        <form onSubmit={handleCheck} className="my-5 flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="e.g. deriv-support-desk.online or deriv.com"
              className="w-full bg-[#080C14] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Verify</span>
          </button>
        </form>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4 text-xs font-mono">
          <span className="text-slate-400 text-[11px]">Quick test:</span>
          {sampleDomains.map((sample, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setInputUrl(sample.name);
                setTimeout(() => {
                  const clean = sample.name;
                  const isOfficial = OFFICIAL_DERIV_DOMAINS.some(
                    (d) => clean === d.domain || clean.endsWith('.' + d.domain)
                  );
                  const containsDeriv = clean.includes('deriv');
                  if (isOfficial) {
                    setResult({
                      domain: clean,
                      status: 'official',
                      message: 'VERIFIED OFFICIAL DERIV DOMAIN',
                      details: `"${clean}" is an authentic, authorized web domain owned and operated by Deriv.`
                    });
                  } else if (containsDeriv) {
                    setResult({
                      domain: clean,
                      status: 'phishing',
                      message: 'CRITICAL WARNING: FAKE / LOOKALIKE DOMAIN',
                      details: `"${clean}" contains the word "deriv" but is NOT on the official whitelist. This is almost certainly a credential-harvesting phishing site or clone.`
                    });
                  }
                }, 50);
              }}
              className={`px-2 py-0.5 rounded border text-[11px] ${
                sample.legit
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                  : 'bg-red-950/40 border-red-500/30 text-red-300'
              }`}
            >
              {sample.name}
            </button>
          ))}
        </div>

        {/* Result Display */}
        {result && (
          <div
            className={`p-4 rounded-xl border mb-4 animate-fadeIn ${
              result.status === 'official'
                ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                : result.status === 'phishing'
                ? 'bg-red-950/30 border-red-500/50 text-red-200'
                : 'bg-amber-950/30 border-amber-500/50 text-amber-200'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5 font-bold text-sm">
              {result.status === 'official' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : result.status === 'phishing' ? (
                <AlertOctagon className="w-5 h-5 text-red-400" />
              ) : (
                <HelpCircle className="w-5 h-5 text-amber-400" />
              )}
              <span>{result.message}</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-300 font-sans">{result.details}</p>
          </div>
        )}

        <div className="text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
