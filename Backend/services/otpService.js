/**
 * OTP Service abstraction
 * - Mode controlled by process.env.OTP_MODE: 'mock' | 'email' | 'sms'
 * - In 'mock' mode the OTP is stored in an in-memory map and returned in response (dev only).
 * - In 'email' mode the service will attempt to send OTP via existing emailService.
 * - In 'sms' mode this is a placeholder to plug in an SMS provider later.
 *
 * Notes:
 * - OTP is OPTIONAL for public flow and NON-BLOCKING; we don't enforce verification on create.
 * - This module is intentionally small and pluggable so providers can be added later.
 */

const { sendEmailNotification } = require('../utils/emailService');
const crypto = require('crypto');
let twilioClient = null;
try {
  const twilio = require('twilio');
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }
} catch (e) {
  // twilio not installed or not configured; we'll fallback
}

const OTP_MODE = (process.env.OTP_MODE || 'mock').toLowerCase();

// In-memory store for mock mode: { otpId: { code, to, expiresAt } }
const store = new Map();

function generateCode() {
  // 6 digit numeric code
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateId() {
  return crypto.randomBytes(12).toString('hex');
}

async function sendOTP({ to, via = 'mobile', ttlSeconds = 300 }) {
  const mode = OTP_MODE;

  const otp = generateCode();
  const otpId = generateId();
  const expiresAt = Date.now() + ttlSeconds * 1000;

  // Helper to store and return mock debug response
  const storeAndReturnMock = () => {
    store.set(otpId, { code: otp, to, expiresAt, via });
    return { success: true, otpId, expiresIn: ttlSeconds, debugCode: otp, mode: 'mock' };
  };

  // Mock mode: always return debug code for dev convenience
  if (mode === 'mock') return storeAndReturnMock();

  // Email mode: attempt to send via sendEmail utility. Do NOT fall back to mock.
  if (mode === 'email' && via === 'email') {
    try {
      const subject = 'Your verification code';
      const html = `<p>Your verification code is <strong>${otp}</strong>. It expires in ${ttlSeconds} seconds.</p>`;
      const emailService = require('../utils/emailService');
      const result = await emailService.sendEmail({ to, subject, html });
      if (result && result.success) {
        store.set(otpId, { code: otp, to, expiresAt, via });
        return { success: true, otpId, expiresIn: ttlSeconds, mode: 'email' };
      }
      console.error('Email send failed:', result && result.error);
      return { success: false, error: result && result.error ? result.error : 'email_send_failed', mode: 'email' };
    } catch (err) {
      console.error('Email send failed:', err && err.message ? err.message : err);
      return { success: false, error: err && err.message ? err.message : String(err), mode: 'email' };
    }
  }

  // SMS mode: attempt Twilio if available, otherwise fallback to mock
  if (mode === 'sms' || via === 'mobile') {
    if (twilioClient && process.env.TWILIO_FROM) {
      try {
        await twilioClient.messages.create({ body: `Your verification code is ${otp}`, from: process.env.TWILIO_FROM, to });
        store.set(otpId, { code: otp, to, expiresAt, via: 'sms' });
        return { success: true, otpId, expiresIn: ttlSeconds, mode: 'sms' };
      } catch (err) {
        console.error('Twilio send failed:', err && err.message ? err.message : err);
        return { success: false, error: err && err.message ? err.message : String(err), mode: 'sms' };
      }
    }
    // Twilio not configured - return failure instead of falling back to mock
    const msg = 'twilio_not_configured';
    console.error(msg);
    return { success: false, error: msg, mode: 'sms' };
  }

  // Unknown mode - return explicit error
  return { success: false, error: 'unsupported_otp_mode', mode };
}

async function verifyOTP(otpId, code, options = { consume: true }) {
  const entry = store.get(otpId);
  if (!entry) return { success: false, reason: 'not_found' };
  if (Date.now() > entry.expiresAt) {
    store.delete(otpId);
    return { success: false, reason: 'expired' };
  }
  if (entry.code !== String(code)) return { success: false, reason: 'invalid' };
  // successful - remove to prevent reuse if consume is true
  if (options.consume !== false) store.delete(otpId);
  return { success: true };
}

module.exports = { sendOTP, verifyOTP };
