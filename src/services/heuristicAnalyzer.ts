import { AnalysisResult, ThreatIndicator, DetectedUrl, RiskLevel } from '../types';
import { OFFICIAL_DERIV_DOMAINS } from '../data/officialDerivChannels';

interface Rule {
  id: string;
  category: ThreatIndicator['category'];
  severity: ThreatIndicator['severity'];
  pattern: RegExp;
  title: string;
  explanation: string;
  advice: string;
  scoreImpact: number;
}

const RULES: Rule[] = [
  // 1. Credential & OTP Theft
  {
    id: 'otp-request',
    category: 'credential_theft',
    severity: 'critical',
    pattern: /\b(?:6-digit|sms|one-time|email)?\s*(?:otp|code|pin|token|2fa|authenticator)\s*(?:code)?\b/i,
    title: 'Direct Request for Verification Code / OTP',
    explanation: 'The message asks for an OTP or verification code. Deriv support staff NEVER request your one-time passwords, 2FA codes, or SMS pins for any reason.',
    advice: 'Never share codes with anyone. Deriv employees can neither see nor need your OTP to service your account.',
    scoreImpact: 40
  },
  {
    id: 'password-request',
    category: 'credential_theft',
    severity: 'critical',
    pattern: /\b(?:password|passcode|secret phrase|seed phrase|private key)\b/i,
    title: 'Account Password or Key Reference',
    explanation: 'Scammers frequently ask for passwords or mention passwords to bait credentials.',
    advice: 'Your password is strictly confidential. Deriv support will never ask you to disclose or change your password via chat.',
    scoreImpact: 35
  },

  // 2. High Urgency & Threats
  {
    id: 'urgency-timer',
    category: 'urgency_coercion',
    severity: 'high',
    pattern: /\b(?:within \d+ hours?|within 24 hours?|immediate(?:ly)?|urgent notice|act immediately|failure to act|do not delay|immediately or|account restriction|suspended due to)\b/i,
    title: 'Artificial Time Pressure & Threats of Closure',
    explanation: 'The sender uses artificial urgency (countdown timers, threats of immediate suspension) to cause panic and bypass critical thinking.',
    advice: 'Official compliance notices are accessible directly on your Deriv web dashboard with reasonable formal timelines, never arbitrary countdowns.',
    scoreImpact: 25
  },
  {
    id: 'balance-forfeiture',
    category: 'urgency_coercion',
    severity: 'critical',
    pattern: /\b(?:forfeiture|loss of funds|confiscated?|permanent termination|permanent closure|locked funds)\b/i,
    title: 'Threat of Balance Forfeiture or Permanent Loss',
    explanation: 'Threatening that you will lose your trading balance if you do not comply immediately is a classic psychological coercion tactic.',
    advice: 'Deriv adheres to strict client-fund protection regulations and will never confiscate client funds via instant chat threats.',
    scoreImpact: 30
  },

  // 3. Unofficial Channels & Impersonation
  {
    id: 'whatsapp-support',
    category: 'impersonation',
    severity: 'critical',
    pattern: /\b(?:whatsapp|\+\d{1,3}\s*\d{3,}|\+44\s*7911)\b/i,
    title: 'Unofficial Support Channel (WhatsApp)',
    explanation: 'The message provides or requests communication via WhatsApp. Deriv does NOT resolve account verification, compliance, or financial disputes over WhatsApp.',
    advice: 'Block the sender on WhatsApp. Always initiate contact yourself exclusively via the official Live Chat on deriv.com.',
    scoreImpact: 35
  },
  {
    id: 'telegram-support',
    category: 'impersonation',
    severity: 'high',
    pattern: /\b(?:telegram|@deriv_[a-z0-9_]+|t\.me\/)\b/i,
    title: 'Impersonation via Telegram Handle',
    explanation: 'The sender directs you to a Telegram handle or channel. Fake Telegram support channels and imposter admins are one of the most common scam vectors.',
    advice: 'Deriv does not offer private 1-on-1 account support on Telegram. Do not message alleged account officers or VIP managers on Telegram.',
    scoreImpact: 30
  },
  {
    id: 'fake-officer-title',
    category: 'impersonation',
    severity: 'medium',
    pattern: /\b(?:Senior (?:Compliance|Account) Officer|VIP Support Specialist|VIP Rewards Team|Deriv Support Desk)\b/i,
    title: 'Unverified Official Persona or Title',
    explanation: 'Scammers invent authoritative-sounding titles such as "Senior Compliance Officer" or "VIP Specialist" to establish false credibility.',
    advice: 'Deriv staff communicate through ticket threads in the official Help Centre or verified agents inside the official web chat.',
    scoreImpact: 15
  },

  // 4. Financial & Bonus Lures
  {
    id: 'deposit-bonus-lure',
    category: 'unauthorized_payment',
    severity: 'high',
    pattern: /\b(?:100% deposit match|deposit match bonus|\$\d+ bonus|bonus credit|loyalty activation|coupon code|claim your bonus)\b/i,
    title: 'Unsolicited Deposit Bonus or Reward Lure',
    explanation: 'The message lures you with unsolicited deposit match bonuses or free cash incentives to bait you into sending funds or visiting fake portals.',
    advice: 'Legitimate Deriv promotions are listed on the official promotions page at deriv.com. Never transfer deposits to third parties.',
    scoreImpact: 25
  },
  {
    id: 'unlock-withdrawal-fee',
    category: 'unauthorized_payment',
    severity: 'critical',
    pattern: /\b(?:unlock your withdrawal|release fee|activation deposit|tax fee)\b/i,
    title: 'Advance-Fee or Unlocking Requirement',
    explanation: 'Demanding upfront payments, deposits, or special activation to "unlock withdrawals" is a definitive advance-fee fraud marker.',
    advice: 'Never pay any fee outside your official Deriv Cashier. Deriv never requires external deposits to release existing balances.',
    scoreImpact: 40
  }
];

// Helper to extract URLs
function extractUrls(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9-]+\.(?:com|online|net|xyz|org|live|io|app|info|biz|tk|cc)\b[^\s]*)/gi;
  const matches = text.match(urlRegex) || [];
  return [...new Set(matches.map(u => u.replace(/[.,;:)]$/, '')))];
}

// Check URL legitimacy against official Deriv domains
function evaluateUrl(rawUrl: string): DetectedUrl {
  let normalized = rawUrl.toLowerCase();
  if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
    normalized = 'https://' + normalized;
  }

  let domain = '';
  try {
    const parsed = new URL(normalized);
    domain = parsed.hostname;
  } catch {
    domain = rawUrl.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0];
  }

  // Check if it's an official Deriv domain
  const isOfficial = OFFICIAL_DERIV_DOMAINS.some(d => domain === d.domain || domain.endsWith('.' + d.domain));

  // Check if it's an impersonation attempt using 'deriv' keyword in unauthorized domain
  const containsDerivName = domain.includes('deriv');

  if (isOfficial) {
    return {
      url: rawUrl,
      domain,
      isOfficial: true,
      status: 'safe',
      reason: `Authentic official Deriv domain (${domain}). Verified genuine.`
    };
  }

  if (containsDerivName) {
    return {
      url: rawUrl,
      domain,
      isOfficial: false,
      status: 'phishing',
      reason: `CRITICAL PHISHING: Unauthorized lookalike domain (${domain}) mimicking Deriv. This is NOT an official Deriv website!`
    };
  }

  return {
    url: rawUrl,
    domain,
    isOfficial: false,
    status: 'suspicious',
    reason: `External third-party link (${domain}). Official Deriv support will not direct you to arbitrary external websites.`
  };
}

export function analyzeMessageHeuristically(message: string): AnalysisResult {
  const startTime = performance.now();
  const trimmed = message.trim();

  const detectedIndicators: ThreatIndicator[] = [];
  let scoreAcc = 0;

  // 1. Check URL threats
  const extracted = extractUrls(trimmed);
  const detectedUrls: DetectedUrl[] = extracted.map(evaluateUrl);

  for (const urlObj of detectedUrls) {
    if (urlObj.status === 'phishing') {
      detectedIndicators.push({
        id: `url-phishing-${urlObj.domain}`,
        category: 'suspicious_url',
        severity: 'critical',
        phrase: urlObj.url,
        title: `Phishing Lookalike Domain: ${urlObj.domain}`,
        explanation: `The link directs to "${urlObj.domain}", an unauthorized domain attempting to impersonate Deriv. Official sites only use *.deriv.com or *.deriv.me.`,
        advice: 'DO NOT CLICK THIS LINK. Visiting it could lead to a credential-harvesting phishing page or malware.'
      });
      scoreAcc += 45;
    } else if (urlObj.status === 'suspicious') {
      detectedIndicators.push({
        id: `url-suspicious-${urlObj.domain}`,
        category: 'suspicious_url',
        severity: 'medium',
        phrase: urlObj.url,
        title: `Unverified External Domain: ${urlObj.domain}`,
        explanation: `The link leads to an external domain not associated with Deriv official services.`,
        advice: 'Never click unexpected external links in messages claiming to come from support.'
      });
      scoreAcc += 20;
    } else if (urlObj.status === 'safe') {
      // Safe official domain found
      detectedIndicators.push({
        id: `url-safe-${urlObj.domain}`,
        category: 'official_pattern',
        severity: 'safe',
        phrase: urlObj.url,
        title: `Official Domain: ${urlObj.domain}`,
        explanation: `This link directs to an official, authenticated Deriv web asset.`,
        advice: 'Always verify the padlock and domain spelling in your browser address bar.'
      });
    }
  }

  // 2. Evaluate rule patterns with negation/advisory awareness
  for (const rule of RULES) {
    const regex = new RegExp(rule.pattern.source, 'gi');
    const match = regex.exec(trimmed);

    if (match) {
      const matchIndex = match.index;
      // Look for negative warning or advisory context in the surrounding paragraph/clause
      const lastParagraphStart = Math.max(0, trimmed.lastIndexOf('\n\n', matchIndex), matchIndex - 250);
      const sectionSnippet = trimmed.substring(lastParagraphStart, Math.min(trimmed.length, matchIndex + 150)).toLowerCase();
      const isNegatedWarning = /\b(?:will never|staff will never|deriv will never|never share|never ask|never contact|warning:|security reminder:|never request|do not share)\b/i.test(sectionSnippet);

      if (isNegatedWarning) {
        // This is an authentic security warning from Deriv, NOT an attack!
        detectedIndicators.push({
          id: `safety-${rule.id}`,
          category: 'official_pattern',
          severity: 'safe',
          phrase: match[0],
          title: `Authentic Security Advisory: "${match[0]}"`,
          explanation: `The sender explicitly cautions you against sharing credentials or using unofficial channels. This conforms to Deriv's official client-safety protocol.`,
          advice: 'Genuine Deriv support communications regularly include this verified security disclaimer.'
        });
      } else {
        // Threat pattern
        detectedIndicators.push({
          id: rule.id,
          category: rule.category,
          severity: rule.severity,
          phrase: match[0],
          title: rule.title,
          explanation: rule.explanation,
          advice: rule.advice
        });
        scoreAcc += rule.scoreImpact;
      }
    }
  }

  // 3. Detect legitimate safety disclaimers and official domain posture
  const hasOfficialSecurityNotice = /\b(?:Deriv staff will never contact you via private|never ask for your login password|2FA authenticator codes)\b/i.test(trimmed);
  const onlyOfficialUrls = detectedUrls.length > 0 && detectedUrls.every(u => u.isOfficial);
  const hasCriticalScamThreats = detectedIndicators.some(i => i.severity === 'critical' || i.severity === 'high');

  if (hasOfficialSecurityNotice && onlyOfficialUrls && !hasCriticalScamThreats) {
    // Verified authentic support communication
    scoreAcc = 8;
  }

  // Normalize final score between 5 and 99
  let riskScore = Math.min(99, Math.max(5, scoreAcc));
  if (hasOfficialSecurityNotice && onlyOfficialUrls && !hasCriticalScamThreats) {
    riskScore = 8;
  }

  // Determine Risk Level
  let riskLevel: RiskLevel = 'SAFE';
  let verdictTitle = 'Verified Safe Support Message';
  let summary = 'No high-risk impersonation or phishing patterns detected. This message adheres to official Deriv communication guidelines.';

  if (riskScore >= 66) {
    riskLevel = 'CRITICAL';
    verdictTitle = 'CRITICAL RISK: Highly Probable Support Scam';
    summary = 'This message contains severe red flags indicative of customer support impersonation. Attackers are attempting to steal credentials, 2FA codes, or lure you to phishing websites.';
  } else if (riskScore >= 26) {
    riskLevel = 'SUSPICIOUS';
    verdictTitle = 'ELEVATED RISK: Suspicious Communication';
    summary = 'This message exhibits several anomalies such as unofficial contact channels or questionable promotional urgency. Exercise extreme caution.';
  }

  // Recommended actions
  const recommendedActions: string[] = [];
  if (riskLevel === 'CRITICAL') {
    recommendedActions.push('Do NOT click any links, open attachments, or reply to this message.');
    recommendedActions.push('Never reveal SMS OTPs, 2FA codes, or passwords to anyone claiming to be Deriv staff.');
    recommendedActions.push('Block and report the sender immediately in your messaging application.');
    recommendedActions.push('If you already entered your password or OTP on a linked page, immediately change your password on the official https://deriv.com website and contact official Live Chat.');
    recommendedActions.push('Forward a screenshot of the scam to Deriv security via the official Help Centre.');
  } else if (riskLevel === 'SUSPICIOUS') {
    recommendedActions.push('Do not follow instructions given in this message without direct verification.');
    recommendedActions.push('Avoid using any phone numbers or links provided in the text.');
    recommendedActions.push('Open a new browser tab, go directly to https://deriv.com, and verify current promotions or ticket statuses via the official Live Chat widget.');
    recommendedActions.push('Ensure 2-Factor Authentication (2FA) is enabled on your Deriv trading account.');
  } else {
    recommendedActions.push('This message appears legitimate, but always stay vigilant.');
    recommendedActions.push('Always navigate to Deriv services by typing "deriv.com" directly into your browser or opening the official app.');
    recommendedActions.push('Remember that genuine Deriv staff will never request your passwords or 2FA codes.');
  }

  const processingTimeMs = Math.round(performance.now() - startTime + 80); // add small realistic UI tick

  return {
    id: `scan-${Date.now()}`,
    timestamp: new Date().toISOString(),
    riskScore,
    riskLevel,
    verdictTitle,
    summary,
    indicators: detectedIndicators,
    detectedUrls,
    recommendedActions,
    source: 'heuristic-demo',
    modelName: 'Deriv Shield Heuristic Core v2.4 (Offline/Demo)',
    rawMessage: message,
    processingTimeMs
  };
}
