import React, { useState } from 'react';
import { ThreatIndicator } from '../types';
import { Eye, Code, AlertCircle, Info, ShieldCheck } from 'lucide-react';

interface HighlightedMessageProps {
  rawMessage: string;
  indicators: ThreatIndicator[];
  onSelectIndicator?: (indicator: ThreatIndicator) => void;
}

export const HighlightedMessage: React.FC<HighlightedMessageProps> = ({
  rawMessage,
  indicators,
  onSelectIndicator
}) => {
  const [viewMode, setViewMode] = useState<'highlighted' | 'raw'>('highlighted');
  const [activeTooltip, setActiveTooltip] = useState<ThreatIndicator | null>(null);

  // Helper to segment raw message into safe and flagged slices
  const renderHighlightedText = () => {
    if (!indicators || indicators.length === 0) {
      return <span className="whitespace-pre-wrap">{rawMessage}</span>;
    }

    // Collect all valid matches with start and end indices
    interface Slice {
      start: number;
      end: number;
      indicator: ThreatIndicator;
    }

    const slices: Slice[] = [];

    indicators.forEach(ind => {
      if (!ind.phrase || ind.phrase.trim().length === 0) return;
      const needle = ind.phrase.trim();
      let index = 0;
      const lowerRaw = rawMessage.toLowerCase();
      const lowerNeedle = needle.toLowerCase();

      while ((index = lowerRaw.indexOf(lowerNeedle, index)) !== -1) {
        slices.push({
          start: index,
          end: index + needle.length,
          indicator: ind
        });
        index += needle.length;
      }
    });

    // Sort slices by start index; filter overlaps
    slices.sort((a, b) => a.start - b.start);
    const nonOverlapping: Slice[] = [];
    let lastEnd = 0;

    for (const s of slices) {
      if (s.start >= lastEnd) {
        nonOverlapping.push(s);
        lastEnd = s.end;
      }
    }

    // Build React nodes
    const nodes: React.ReactNode[] = [];
    let currentIdx = 0;

    nonOverlapping.forEach((slice, idx) => {
      // Add plain text before match
      if (slice.start > currentIdx) {
        nodes.push(
          <span key={`text-${currentIdx}`} className="whitespace-pre-wrap text-slate-300">
            {rawMessage.slice(currentIdx, slice.start)}
          </span>
        );
      }

      // Add highlighted match
      const matchedText = rawMessage.slice(slice.start, slice.end);
      const ind = slice.indicator;

      let badgeClasses = 'bg-red-500/20 text-red-300 border-b-2 border-red-500';
      if (ind.severity === 'safe') {
        badgeClasses = 'bg-emerald-500/20 text-emerald-300 border-b-2 border-emerald-500';
      } else if (ind.severity === 'medium' || ind.severity === 'low') {
        badgeClasses = 'bg-amber-500/20 text-amber-300 border-b-2 border-amber-500';
      }

      nodes.push(
        <mark
          key={`highlight-${idx}`}
          onClick={() => {
            setActiveTooltip(ind);
            onSelectIndicator?.(ind);
          }}
          className={`px-1.5 py-0.5 rounded font-mono text-[13px] font-semibold cursor-pointer transition-all hover:scale-105 inline-block mx-0.5 ${badgeClasses}`}
          title={`${ind.title}: ${ind.explanation}`}
        >
          {matchedText}
        </mark>
      );

      currentIdx = slice.end;
    });

    // Remainder
    if (currentIdx < rawMessage.length) {
      nodes.push(
        <span key={`text-end`} className="whitespace-pre-wrap text-slate-300">
          {rawMessage.slice(currentIdx)}
        </span>
      );
    }

    return nodes;
  };

  return (
    <div className="rounded-2xl cyber-card p-5 border border-slate-800">
      <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-slate-800/80 gap-2">
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-cyan-400" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Message Forensic Breakdown
          </h4>
        </div>

        {/* View toggle */}
        <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setViewMode('highlighted')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded transition-all ${
              viewMode === 'highlighted'
                ? 'bg-slate-800 text-cyan-300 font-semibold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Threat Highlighter</span>
          </button>
          <button
            onClick={() => setViewMode('raw')}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded transition-all ${
              viewMode === 'raw'
                ? 'bg-slate-800 text-cyan-300 font-semibold shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Raw Text</span>
          </button>
        </div>
      </div>

      {/* Highlighter Legend */}
      {viewMode === 'highlighted' && (
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pb-3 mb-3 border-b border-slate-800/50">
          <span className="text-[11px] font-mono uppercase text-slate-400 font-semibold">Legend:</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Critical Danger (OTP/Phishing/Impersonation)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Caution (Urgency/Lure)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Authentic Official Pattern
          </span>
        </div>
      )}

      {/* Message Content View */}
      <div className="p-4 rounded-xl bg-[#080C14]/90 border border-slate-800/80 font-mono text-sm leading-relaxed max-h-80 overflow-y-auto selection:bg-[#FF444F]/40">
        {viewMode === 'highlighted' ? renderHighlightedText() : <pre className="whitespace-pre-wrap text-slate-300 font-mono text-xs">{rawMessage}</pre>}
      </div>

      {/* Active Selected Tooltip Banner */}
      {activeTooltip && (
        <div className="mt-4 p-3.5 rounded-xl bg-slate-900 border border-cyan-500/30 flex items-start justify-between gap-3 animate-fadeIn">
          <div className="flex items-start gap-2.5">
            {activeTooltip.severity === 'critical' ? (
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            ) : activeTooltip.severity === 'safe' ? (
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>{activeTooltip.title}</span>
                <span className="font-mono text-[10px] text-cyan-400">"{activeTooltip.phrase}"</span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">{activeTooltip.explanation}</p>
              {activeTooltip.advice && (
                <p className="text-[11px] text-amber-300 font-medium mt-1">Advice: {activeTooltip.advice}</p>
              )}
            </div>
          </div>
          <button
            onClick={() => setActiveTooltip(null)}
            className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
          >
            ✕
          </button>
        </div>
      )}

    </div>
  );
};
