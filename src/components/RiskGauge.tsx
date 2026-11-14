import React, { useEffect, useState } from 'react';
import { RiskLevel } from '../types';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

interface RiskGaugeProps {
  score: number; // 0 - 100
  riskLevel: RiskLevel;
  verdictTitle: string;
  source: 'gemini-live' | 'heuristic-demo';
  modelName?: string;
  processingTimeMs?: number;
}

export const RiskGauge: React.FC<RiskGaugeProps> = ({
  score,
  riskLevel,
  verdictTitle,
  source,
  modelName,
  processingTimeMs
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = score / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // Color mappings
  const getColorScheme = () => {
    switch (riskLevel) {
      case 'CRITICAL':
        return {
          stroke: '#EF4444',
          glow: 'rgba(239, 68, 68, 0.4)',
          bg: 'bg-red-500/10',
          border: 'border-red-500/30',
          text: 'text-red-400',
          badgeText: 'CRITICAL SCAM RISK',
          icon: ShieldAlert,
        };
      case 'SUSPICIOUS':
        return {
          stroke: '#F59E0B',
          glow: 'rgba(245, 158, 11, 0.4)',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          text: 'text-amber-400',
          badgeText: 'SUSPICIOUS / ELEVATED RISK',
          icon: AlertTriangle,
        };
      case 'SAFE':
      default:
        return {
          stroke: '#10B981',
          glow: 'rgba(16, 185, 129, 0.4)',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/30',
          text: 'text-emerald-400',
          badgeText: 'VERIFIED LOW RISK',
          icon: ShieldCheck,
        };
    }
  };

  const scheme = getColorScheme();
  const Icon = scheme.icon;

  // SVG Gauge calculations
  // Radius = 85, Circumference = 2 * Math.PI * 85 = 534.07
  // Arc angle = 260 degrees -> Arc length = 534.07 * (260 / 360) = 385.7
  const radius = 80;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const totalArc = circumference * (240 / 360); // 240 degrees sweep
  const strokeDashoffset = totalArc - (totalArc * (animatedScore / 100));

  return (
    <div className={`p-6 rounded-2xl cyber-card border ${scheme.border} relative overflow-hidden transition-all duration-500 shadow-xl`}>
      {/* Background glow orb */}
      <div
        className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-40 transition-colors duration-700"
        style={{ backgroundColor: scheme.stroke }}
      />

      <div className="flex flex-col md:flex-row items-center gap-6">
        
        {/* SVG Circular Gauge */}
        <div className="relative flex items-center justify-center flex-shrink-0">
          <svg className="w-52 h-52 transform -rotate-120" viewBox="0 0 200 200">
            {/* Background Track */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="transparent"
              stroke="#1E293B"
              strokeWidth={strokeWidth}
              strokeDasharray={`${totalArc} ${circumference}`}
              strokeLinecap="round"
            />
            {/* Animated Risk Arc */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="transparent"
              stroke={scheme.stroke}
              strokeWidth={strokeWidth}
              strokeDasharray={`${totalArc} ${circumference}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-300 ease-out"
              style={{
                filter: `drop-shadow(0 0 8px ${scheme.glow})`
              }}
            />
          </svg>

          {/* Center Digital Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-extrabold font-mono tracking-tight text-white">
              {animatedScore}
              <span className="text-sm font-sans text-slate-400 font-normal">/100</span>
            </span>
            <span className="text-[11px] font-mono tracking-wider uppercase text-slate-400 mt-1">
              Threat Score
            </span>
          </div>
        </div>

        {/* Verdict & Details */}
        <div className="flex-1 text-center md:text-left space-y-3">
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide border ${scheme.bg} ${scheme.border} ${scheme.text}`}>
              <Icon className="w-4 h-4" />
              {scheme.badgeText}
            </span>

            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-slate-800/80 border border-slate-700 text-slate-300">
              {source === 'gemini-live' ? '⚡ Google Gemini AI' : '🛡️ Demonstration Engine'}
            </span>

            {processingTimeMs && (
              <span className="text-[11px] font-mono text-slate-400">
                {processingTimeMs}ms
              </span>
            )}
          </div>

          <h3 className="text-xl font-bold text-white tracking-tight">
            {verdictTitle}
          </h3>

          <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
            {riskLevel === 'CRITICAL' && (
              'High probability of customer support impersonation. The message attempts credential theft or directs you to malicious third-party links.'
            )}
            {riskLevel === 'SUSPICIOUS' && (
              'Elevated anomalies detected. Unofficial contact handles or manipulative incentives require independent verification before taking any action.'
            )}
            {riskLevel === 'SAFE' && (
              'No fraudulent signals detected. Message aligns with standard official communication practices from Deriv.'
            )}
          </p>

          {modelName && (
            <div className="text-xs font-mono text-slate-400 pt-1">
              Engine: <span className="text-slate-300">{modelName}</span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
