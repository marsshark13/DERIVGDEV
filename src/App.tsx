import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Shield,
  Copy,
  Check,
  Sparkles,
  ExternalLink
} from 'lucide-react';

import { Header } from './components/Header';
import { MessageScanner } from './components/MessageScanner';
import { RiskGauge } from './components/RiskGauge';
import { HighlightedMessage } from './components/HighlightedMessage';
import { IndicatorsList } from './components/IndicatorsList';
import { SafetyGuidance } from './components/SafetyGuidance';
import { PrivacyBanner } from './components/PrivacyBanner';
import { GeminiSettingsModal } from './components/GeminiSettingsModal';
import { OfficialVerificationDrawer } from './components/OfficialVerificationDrawer';
import { DomainChecker } from './components/DomainChecker';

import { AnalysisResult, GeminiConfig, ThreatIndicator } from './types';
import { DEMO_MESSAGES } from './data/demoMessages';
import { getStoredGeminiConfig, saveGeminiConfig, analyzeMessageWithGemini } from './services/geminiService';
import { analyzeMessageHeuristically } from './services/heuristicAnalyzer';

export const App: React.FC = () => {
  const [geminiConfig, setGeminiConfig] = useState<GeminiConfig>(getStoredGeminiConfig());
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [activeDemoId, setActiveDemoId] = useState<string>('scam-urgent-kyc');
  const [currentResult, setCurrentResult] = useState<AnalysisResult | null>(null);
  const [selectedIndicator, setSelectedIndicator] = useState<ThreatIndicator | null>(null);
  const [copiedReport, setCopiedReport] = useState<boolean>(false);

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isVerificationGuideOpen, setIsVerificationGuideOpen] = useState<boolean>(false);
  const [isDomainCheckerOpen, setIsDomainCheckerOpen] = useState<boolean>(false);

  // Initialize with the first demo scam on first load for immediate presentation value
  useEffect(() => {
    const defaultDemo = DEMO_MESSAGES[0];
    const initialResult = analyzeMessageHeuristically(defaultDemo.content);
    setCurrentResult(initialResult);
  }, []);

  const handleAnalyze = async (message: string) => {
    setIsAnalyzing(true);
    setSelectedIndicator(null);

    try {
      let result: AnalysisResult;
      if (geminiConfig.apiKey && geminiConfig.isEnabled) {
        result = await analyzeMessageWithGemini(message, geminiConfig);
      } else {
        result = analyzeMessageHeuristically(message);
      }

      setCurrentResult(result);

      // Trigger celebratory confetti if message is verified safe
      if (result.riskLevel === 'SAFE') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10B981', '#34D399', '#059669', '#38BDF8']
        });
      }
    } catch (err) {
      console.error('Analysis failed:', err);
      // Fallback guaranteed
      setCurrentResult(analyzeMessageHeuristically(message));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveConfig = (newConfig: GeminiConfig) => {
    setGeminiConfig(newConfig);
    saveGeminiConfig(newConfig);
  };

  const handleCopyReport = () => {
    if (!currentResult) return;
    const reportText = `[DERIV SHIELD SECURITY AUDIT]
Verdict: ${currentResult.verdictTitle}
Risk Score: ${currentResult.riskScore}/100 (${currentResult.riskLevel})
Engine: ${currentResult.modelName || currentResult.source}
Summary: ${currentResult.summary}
Threat Indicators Detected: ${currentResult.indicators.length}
${currentResult.indicators.map((i, idx) => `  ${idx + 1}. [${i.severity.toUpperCase()}] ${i.title} - "${i.phrase}"`).join('\n')}
Recommended Actions:
${currentResult.recommendedActions.map((a, idx) => `  ${idx + 1}. ${a}`).join('\n')}
------------------------------------------------
Audited with Deriv Shield (DevFest Vibing Lounge)`;

    navigator.clipboard.writeText(reportText);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#070B12] text-slate-100 flex flex-col cyber-grid relative selection:bg-[#FF444F]/30 selection:text-white">
      
      {/* Background ambient lighting */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-[#FF444F]/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <Header
        geminiConfig={geminiConfig}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenVerificationGuide={() => setIsVerificationGuideOpen(true)}
        onOpenDomainChecker={() => setIsDomainCheckerOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 z-10 space-y-8">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700 text-xs font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-[#FF444F] animate-pulse"></span>
            <span>Deriv Trader Security Defense Matrix</span>
            <span className="text-slate-500">|</span>
            <span className="text-cyan-400 font-semibold">DevFest Vibing Lounge</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Stop Support Scams <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Before They Compromise You
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans max-w-2xl mx-auto">
            Analyze suspicious WhatsApp, Telegram, SMS, or email messages impersonating Deriv customer support. Powered by deep forensic heuristics and Google Gemini AI.
          </p>
        </div>

        {/* Privacy Banner */}
        <PrivacyBanner />

        {/* Scanner Component */}
        <MessageScanner
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
          activeDemoId={activeDemoId}
          onSelectDemo={(demo) => setActiveDemoId(demo.id)}
        />

        {/* Analysis Results View */}
        {currentResult && (
          <div className="space-y-8 pt-4 animate-fadeIn">
            
            {/* Results Title & Share Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2.5">
                <div className="p-1.5 rounded-lg bg-[#FF444F]/10 border border-[#FF444F]/30 text-[#FF444F]">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">
                    Forensic Security Audit
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">
                    Audit ID: {currentResult.id} • {new Date(currentResult.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyReport}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors border border-slate-700"
                >
                  {copiedReport ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Audit Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Audit Report</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Risk Gauge Header Card */}
            <RiskGauge
              score={currentResult.riskScore}
              riskLevel={currentResult.riskLevel}
              verdictTitle={currentResult.verdictTitle}
              source={currentResult.source}
              modelName={currentResult.modelName}
              processingTimeMs={currentResult.processingTimeMs}
            />

            {/* Split Grid: Message Highlighter & Indicators */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              
              {/* Left Column: Interactive Highlighter */}
              <div className="space-y-6">
                <HighlightedMessage
                  rawMessage={currentResult.rawMessage}
                  indicators={currentResult.indicators}
                  onSelectIndicator={(ind) => setSelectedIndicator(ind)}
                />

                {/* Summary Box */}
                <div className="rounded-2xl cyber-card p-5 border border-slate-800">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Executive Summary & Plain-Language Assessment</span>
                  </h4>
                  <p className="text-sm text-slate-200 leading-relaxed font-sans">
                    {currentResult.summary}
                  </p>
                </div>
              </div>

              {/* Right Column: Threat Indicators & Links */}
              <div>
                <IndicatorsList
                  indicators={currentResult.indicators}
                  detectedUrls={currentResult.detectedUrls}
                  selectedIndicatorId={selectedIndicator?.id}
                  onSelectIndicator={(ind) => setSelectedIndicator(ind)}
                />
              </div>

            </div>

            {/* Safety Guidance & Countermeasures */}
            <SafetyGuidance
              riskLevel={currentResult.riskLevel}
              recommendedActions={currentResult.recommendedActions}
              onOpenVerificationGuide={() => setIsVerificationGuideOpen(true)}
            />

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0B0F19]/80 py-8 px-4 text-center text-xs text-slate-400 mt-16 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white">Deriv Shield</span>
            <span className="text-slate-500">•</span>
            <span>DevFest Vibing Lounge Presentation App</span>
          </div>

          <div className="flex items-center space-x-4 text-xs font-sans">
            <button
              onClick={() => setIsDomainCheckerOpen(true)}
              className="text-slate-300 hover:text-white transition-colors"
            >
              Verify Domain
            </button>
            <button
              onClick={() => setIsVerificationGuideOpen(true)}
              className="text-slate-300 hover:text-white transition-colors"
            >
              Official Channels
            </button>
            <a
              href="https://deriv.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>deriv.com</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <GeminiSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={geminiConfig}
        onSaveConfig={handleSaveConfig}
      />

      <OfficialVerificationDrawer
        isOpen={isVerificationGuideOpen}
        onClose={() => setIsVerificationGuideOpen(false)}
      />

      <DomainChecker
        isOpen={isDomainCheckerOpen}
        onClose={() => setIsDomainCheckerOpen(false)}
      />

    </div>
  );
};

export default App;
