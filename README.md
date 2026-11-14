# 🛡️ Deriv Shield — Anti-Phishing & Support Scam Defense

> **Built for DevFest Vibing Lounge (20-Minute Challenge)**  
> *Real-time anti-impersonation, phishing detection, and credential theft protection for Deriv traders.*

---

## 🚀 Live Demo & Presentation Highlights

- **Local URL:** [http://localhost:3000](http://localhost:3000)
- **Tech Stack:** React 18, TypeScript, Tailwind CSS, Lucide Icons, Canvas Confetti, Google Gemini API
- **Design:** Premium Fintech Cybersecurity Aesthetic (Dark Navy `#070B12`, glowing borders, radar scanning animations, SVG tachometer gauge, mobile responsive)

---

## 🎯 The Problem

Financial trading platforms like **Deriv** (`deriv.com`) are frequent targets of social engineering attacks where scammers pose as "Senior Compliance Officers", "VIP Support Managers", or "Account Help Desks" across WhatsApp, Telegram, SMS, and phishing portals. They exploit urgency, panic regarding account suspensions, or greed via fake deposit matches to steal:
1. **SMS OTPs & 2FA Codes**
2. **Account Passwords**
3. **Cryptocurrency & Fiat Deposits**

**Deriv Shield** acts as a personal cybersecurity firewall for traders, letting them paste any suspicious message to get an instant forensic audit.

---

## 🔑 Core Features

### 1. 🔍 Message Scanner & Sensitive Data Redaction
- **Universal Input:** Accepts raw messages from WhatsApp, Telegram, SMS, and Email.
- **Client-Side Data Sanitizer:** Automatically identifies phone numbers, OTPs, and credit card numbers, providing a one-click **"Redact Sensitive Data"** mask before submitting.
- **3 One-Click Interactive Demos:**
  1. 🚨 **Obvious Scam:** Urgent MT5 KYC suspension threat demanding 6-digit SMS OTP via WhatsApp and lookalike domain (`deriv-support-desk.online`).
  2. ⚠️ **Suspicious Impersonator:** Unofficial Telegram manager `@Deriv_Support_Agent_Alex` offering a $500 VIP bonus match on `deriv-bonus-claim.net`.
  3. 🛡️ **Legitimate Support:** Authentic ticket resolution email directing users exclusively to `https://deriv.com` with official security advisories.

### 2. ⚡ Dual-Core Analysis Engine (Gemini AI + Offline Heuristics)
- **Google Gemini AI (Live Mode):** Connects to `gemini-1.5-flash`, `gemini-2.0-flash`, or `gemini-1.5-pro` using structured JSON schemas and strict untrusted-data boundary prompt defense.
- **Built-in Local Heuristic Engine (Demonstration Mode):** Operates 100% offline with zero dependencies or keys required. Recognizes urgency coercion, lookalike domains (typosquatting), credential exfiltration, and contextual negative advisories ("Deriv staff will never ask...").
- **Transparent Mode Labeling:** Always displays whether an audit was produced by **Google Gemini AI** or the **Built-in Demonstration Engine**.

### 3. 📊 Visual Forensic Breakdown & In-Message Highlighter
- **Animated SVG Circular Risk Gauge:** Speedometer arc dynamically styled by threat level with glowing needle and real-time score counter (0–100).
- **Interactive Threat Highlighter:** Highlights suspicious phrases directly inside the message text. Users can click tokens for deep forensic threat explanations.
- **Link & Domain Forensics:** Distinguishes genuine `deriv.com` domains from phishing lookalikes.

### 4. 🌐 Domain & Link Verifier Tool
- Dedicated instant checker accessible from the header where users can test any URL or domain (e.g. `deriv-desk.online` vs `deriv.com`) against Deriv's official asset registry.

### 5. 🛡️ Safety Protocols & Deriv Rules of Engagement
- Step-by-step containment checklists (e.g., blocking senders, resetting credentials, reporting to security).
- Deriv's **4 Golden Rules of Engagement** clearly visible.
- Transparent educational disclaimer that results are indicators, not legal guarantees.

### 6. 🔒 Zero-Storage Privacy Architecture
- Messages are processed strictly in-memory during the browser session.
- No remote database persistence, tracking cookies, or server-side logging.

---

## 🧪 Quick Commands

```bash
# Start dev server (running on port 3000)
npm run dev

# Run TypeScript typecheck and production build
npm run build

# Preview production build
npm run preview
```
