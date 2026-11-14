export interface OfficialDomain {
  domain: string;
  category: 'primary' | 'community' | 'academy' | 'regional';
  description: string;
  isAllowed: boolean;
}

export const OFFICIAL_DERIV_DOMAINS: OfficialDomain[] = [
  { domain: 'deriv.com', category: 'primary', description: 'Main official portal & trading platforms', isAllowed: true },
  { domain: 'app.deriv.com', category: 'primary', description: 'Deriv Trader web application', isAllowed: true },
  { domain: 'community.deriv.com', category: 'community', description: 'Official Deriv trader community forum', isAllowed: true },
  { domain: 'academy.deriv.com', category: 'academy', description: 'Official education and learning portal', isAllowed: true },
  { domain: 'deriv.me', category: 'regional', description: 'Official alternative domain for specific regions', isAllowed: true },
  { domain: 'deriv.be', category: 'regional', description: 'Official regional domain for European clients', isAllowed: true },
];

export const DERIV_GOLDEN_RULES = [
  {
    title: 'Never Share 2FA or OTP Codes',
    description: 'Deriv support staff will NEVER ask for your 6-digit SMS OTP, Google Authenticator 2FA code, or password.',
    icon: 'KeyRound',
    badge: 'Critical Rule'
  },
  {
    title: 'No Direct Support on WhatsApp or Telegram',
    description: 'Deriv does not conduct individual account verification, KYC, or dispute resolution via Telegram DMs or WhatsApp.',
    icon: 'MessageSquareOff',
    badge: 'Scam Vector'
  },
  {
    title: 'Only Transact Inside the Official Cashier',
    description: 'Never send cryptocurrency or bank transfers to personal accounts, agent wallets, or addresses given in chat messages.',
    icon: 'ShieldAlert',
    badge: 'Financial Safety'
  },
  {
    title: 'Always Check the URL Suffix',
    description: 'Ensure you are strictly on *.deriv.com or *.deriv.me. Lookalike domains like deriv-desk.online or deriv-claims.net are phishing clones.',
    icon: 'GlobeLock',
    badge: 'Phishing Defense'
  }
];

export const OFFICIAL_SUPPORT_CHANNELS = [
  {
    name: 'Deriv Official Website Live Chat',
    url: 'https://deriv.com',
    details: 'Click the Red Chat widget in the bottom-right corner of deriv.com (available 24/7).',
    isSafe: true
  },
  {
    name: 'Deriv Help Centre',
    url: 'https://deriv.com/help-centre',
    details: 'Official FAQ, verification guides, and ticket submissions.',
    isSafe: true
  },
  {
    name: 'Official Deriv Community',
    url: 'https://community.deriv.com',
    details: 'Community forum monitored by verified Deriv moderators.',
    isSafe: true
  },
  {
    name: 'Deriv GO Mobile App',
    url: 'https://deriv.com/deriv-go',
    details: 'Download only from Google Play Store or Apple App Store.',
    isSafe: true
  }
];
