export type RiskLevel = 'SAFE' | 'SUSPICIOUS' | 'CRITICAL';

export type IndicatorCategory =
  | 'impersonation'
  | 'suspicious_url'
  | 'credential_theft'
  | 'urgency_coercion'
  | 'unauthorized_payment'
  | 'manipulation'
  | 'official_pattern';

export type IndicatorSeverity = 'critical' | 'high' | 'medium' | 'low' | 'safe';

export interface ThreatIndicator {
  id: string;
  category: IndicatorCategory;
  severity: IndicatorSeverity;
  phrase: string;
  title: string;
  explanation: string;
  advice?: string;
}

export interface DetectedUrl {
  url: string;
  domain: string;
  isOfficial: boolean;
  status: 'safe' | 'phishing' | 'suspicious' | 'unknown';
  reason: string;
}

export interface AnalysisResult {
  id: string;
  timestamp: string;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  verdictTitle: string;
  summary: string;
  indicators: ThreatIndicator[];
  detectedUrls: DetectedUrl[];
  recommendedActions: string[];
  source: 'gemini-live' | 'heuristic-demo';
  modelName?: string;
  rawMessage: string;
  processingTimeMs: number;
}

export interface DemoMessage {
  id: string;
  title: string;
  label: string;
  type: 'obvious_scam' | 'suspicious' | 'legitimate';
  channel: 'WhatsApp' | 'Telegram' | 'SMS' | 'Email';
  senderDisplay: string;
  content: string;
  summaryNote: string;
}

export interface GeminiConfig {
  apiKey: string;
  model: string;
  isEnabled: boolean;
}
