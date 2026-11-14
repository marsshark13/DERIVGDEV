import { DemoMessage } from '../types';

export const DEMO_MESSAGES: DemoMessage[] = [
  {
    id: 'scam-urgent-kyc',
    title: 'Critical Threat: Urgent KYC Suspension & OTP Theft',
    label: 'Obvious Scam',
    type: 'obvious_scam',
    channel: 'WhatsApp',
    senderDisplay: '+44 7911 123456 (Deriv Support Desk - Alex)',
    summaryNote: 'Aggressive urgency, fake lookalike domain (.online), and direct request for 6-digit SMS OTP.',
    content: `⚠️ URGENT NOTICE from Deriv Support Desk:
Your MT5 trading account #82910 has been temporarily suspended due to pending KYC compliance verification under international AML regulations.

To avoid permanent account termination and forfeiture of your current available balance ($4,250.00 USD), you must complete immediate verification within 2 hours:
👉 Verify your identity here: https://deriv-support-desk.online/kyc-verify

Alternatively, reply with your 6-digit SMS OTP code directly to our Senior Compliance Officer on this WhatsApp (+44 7911 123456) so we can manually unlock your withdrawal facility.

Failure to act immediately will result in total account restriction.
— Deriv Financial Services Ltd.`
  },
  {
    id: 'suspicious-bonus-telegram',
    title: 'Elevated Risk: VIP Bonus Lure & Telegram Contact',
    label: 'Suspicious Impersonator',
    type: 'suspicious',
    channel: 'Telegram',
    senderDisplay: '@Deriv_VIP_Rewards_Team',
    summaryNote: 'Unofficial Telegram channel, unofficial bonus claim URL (.net), and false reassurance trick.',
    content: `Hello valued trader! 🎁
Congratulations! Your trading volume has qualified your Deriv account for our Exclusive Q4 VIP 100% Deposit Match Bonus ($500 USD).

To claim your bonus credit, visit our loyalty activation portal:
https://deriv-bonus-claim.net/claim?id=99281

Or direct message our VIP Support Specialist @Deriv_Support_Agent_Alex on Telegram with your registered email and transfer reference to activate the coupon code 'DERIV500'.

Note: Deriv will never ask for your account password. Offer valid for the next 4 hours only.`
  },
  {
    id: 'legitimate-ticket-update',
    title: 'Verified Safe: Official Support Ticket Resolution',
    label: 'Legitimate Support',
    type: 'legitimate',
    channel: 'Email',
    senderDisplay: 'support@deriv.com (Ticket #CS-994120)',
    summaryNote: 'Authentic deriv.com domain, zero pressure, references official portal, contains standard security warning.',
    content: `Dear Customer,

Thank you for reaching out to Deriv Customer Support. This is an update regarding your inquiry (Ticket #CS-994120) regarding payment method verification.

Our verification team has completed the review of your submitted documents. Your payment profile is now fully approved and ready for transactions.

To review your updated account status or manage your settings, please sign in securely to your account through our official website:
https://deriv.com

Or through our official mobile applications: Deriv GO or Deriv Bot.

SECURITY REMINDER:
Deriv staff will never contact you via private Telegram or WhatsApp messages asking for your login password, 2FA authenticator codes, SMS OTPs, or requesting you to transfer funds to third-party accounts or personal crypto addresses.

Warm regards,
Deriv Customer Support Team
https://community.deriv.com`
  }
];
