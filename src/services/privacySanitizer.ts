export interface SensitiveDetection {
  type: 'otp' | 'credit_card' | 'phone' | 'email';
  match: string;
  count: number;
}

export function detectSensitiveData(text: string): SensitiveDetection[] {
  const detections: SensitiveDetection[] = [];

  // OTP detection: 4 to 8 digits explicitly preceded or followed by otp/code/verification
  const otpRegex = /\b(?:otp|code|pin|verification)\s*(?:is|:)?\s*([0-9]{4,8})\b/gi;
  const otpMatches = [...text.matchAll(otpRegex)];
  if (otpMatches.length > 0) {
    detections.push({
      type: 'otp',
      match: otpMatches[0][0],
      count: otpMatches.length,
    });
  }

  // Credit card detection: 13-19 digits with optional spaces or hyphens
  const ccRegex = /\b(?:\d{4}[ -]?){3}\d{4}\b/g;
  const ccMatches = [...text.matchAll(ccRegex)];
  if (ccMatches.length > 0) {
    detections.push({
      type: 'credit_card',
      match: ccMatches[0][0],
      count: ccMatches.length,
    });
  }

  // Phone numbers (international format e.g. +44 7911 123456)
  const phoneRegex = /\+?[0-9]{1,3}[-.\s]?(?:\(?[0-9]{2,4}\)?[-.\s]?)?[0-9]{3,4}[-.\s]?[0-9]{3,4}\b/g;
  const phoneMatches = [...text.matchAll(phoneRegex)].filter(m => m[0].replace(/\D/g, '').length >= 9);
  if (phoneMatches.length > 0) {
    detections.push({
      type: 'phone',
      match: phoneMatches[0][0],
      count: phoneMatches.length,
    });
  }

  // Email address detection
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const emailMatches = [...text.matchAll(emailRegex)];
  if (emailMatches.length > 0) {
    detections.push({
      type: 'email',
      match: emailMatches[0][0],
      count: emailMatches.length,
    });
  }

  return detections;
}

export function sanitizeMessageContent(text: string): { sanitizedText: string; redactedCount: number } {
  let result = text;
  let count = 0;

  // Redact OTPs
  result = result.replace(/(\b(?:otp|code|pin|verification)\s*(?:is|:)?\s*)([0-9]{4,8})\b/gi, (_, prefix) => {
    count++;
    return `${prefix}[REDACTED_OTP]`;
  });

  // Redact Credit cards
  result = result.replace(/\b(?:\d{4}[ -]?){3}\d{4}\b/g, () => {
    count++;
    return '[REDACTED_CARD_NUMBER]';
  });

  // Redact standalone 6-digit codes often requested by attackers
  result = result.replace(/\b([0-9]{6})\b/g, () => {
    count++;
    return '[REDACTED_CODE]';
  });

  return { sanitizedText: result, redactedCount: count };
}

/**
 * Ensures message content is safely treated as pure untrusted text for LLMs.
 * Removes dangerous shell/markdown escapings and wraps inside strict boundary tags.
 */
export function wrapUntrustedMessageForAI(text: string): string {
  // Strip null bytes and control chars
  const clean = text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
  return `<untrusted_user_message_to_analyze>\n${clean}\n</untrusted_user_message_to_analyze>`;
}
