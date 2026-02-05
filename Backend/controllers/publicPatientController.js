/**
 * Public patient registration controller
 * - Reuses the same `User` model as admin flow.
 * - Keeps OTP optional and non-blocking; record is created even if OTP send fails.
 * - Sets `source: 'public'` (or 'qr' if provided) and `submittedAt`.
 */

const User = require('../models/user.model');
const { sendOTP, verifyOTP } = require('../services/otpService');

module.exports = {
  // POST /api/patients/public/register
  registerPublicPatient: async (req, res) => {
    try {
      const { Name, MobileNo, Email, RegNo, source, sendEmailOtp,
        otpIdEmail, otpCodeEmail } = req.body;

      if (!Name || !MobileNo || !Email || !RegNo) {
        return res.status(400).json({ error: 'Name, MobileNo, Email and RegNo are required' });
      }

      // Reject duplicate emails early
      const existing = await User.findOne({ Email });
      if (existing) {
        return res.status(409).json({ error: 'User with this email already exists' });
      }

      // Create using same User model; add source and submittedAt metadata
      const user = await User.create({
        Name,
        MobileNo,
        Email,
        RegNo: RegNo || undefined,
        isMobileVerified: false, // mobile verification disabled for now
        isEmailVerified: false,
        source: source || 'public',
        submittedAt: new Date()
      });

      // Attempt to send OTP to email only if requested. OTP failure does NOT block creation.
      const otpResults = {};
      if (sendEmailOtp && Email) {
        try {
          otpResults.email = await sendOTP({ to: Email, via: 'email' });
        } catch (err) {
          otpResults.email = { success: false, error: String(err) };
        }
      }

      // If an email OTP id/code were supplied, verify them now and persist the flag.
      const updates = {};
      if (otpIdEmail && otpCodeEmail) {
        const v2 = await verifyOTP(otpIdEmail, otpCodeEmail);
        if (v2.success) updates.isEmailVerified = true;
        otpResults.emailVerify = v2;
      }

      if (Object.keys(updates).length) {
        await User.findByIdAndUpdate(user._id, updates);
      }

      // Send a confirmation email to the patient email provided in the form (if any).
      // Use sendEmail so the recipient is the entered address (Email), not the admin env recipient.
      if (Email) {
        try {
          const emailService = require('../utils/emailService');
          const subject = 'Registration received - Akshay Mahore Clinic';
          const html = `<p>Dear ${Name},</p><p>Thank you for registering at Akshay Mahore Homoeo Clinic.</p><p>Your registration number: <strong>${RegNo || 'N/A'}</strong></p>`;
          await emailService.sendEmail({ to: Email, subject, html });
        } catch (err) {
          console.error('Failed to send confirmation email to patient:', err && err.message ? err.message : err);
        }
      }

      res.status(201).json({ message: 'Patient created', userId: user._id, otp: otpResults });
    } catch (err) {
      console.error('Public register error:', err);
      res.status(500).json({ error: 'Failed to register patient' });
    }
  },

  // POST /api/patients/public/verify-otp
  // Body: { userId (optional), method: 'email', otpId, code }
  // Only email verification is supported; mobile verification is disabled.
  verifyOtp: async (req, res) => {
    try {
      const { userId, method, otpId, code } = req.body;
      if (!method || !otpId || !code) {
        return res.status(400).json({ error: 'method, otpId and code are required' });
      }

      if (method !== 'email') return res.status(400).json({ success: false, error: 'mobile_otp_disabled', message: 'Only email OTP verification is supported' });

      const v = await verifyOTP(otpId, code);
      if (!v.success) return res.status(400).json({ success: false, reason: v.reason });

      // If userId supplied, persist email verification on the user document.
      if (userId) {
        await User.findByIdAndUpdate(userId, { isEmailVerified: true });
      }

      res.json({ success: true });
    } catch (err) {
      console.error('Verify OTP error:', err);
      res.status(500).json({ error: 'Failed to verify OTP' });
    }
  },

  // POST /api/patients/public/send-otp
  // Body: { via: 'mobile'|'email', to }
  sendOtp: async (req, res) => {
    try {
      const { via, to } = req.body;
      if (!via || !to) return res.status(400).json({ error: 'via and to are required' });
      // Mobile OTPs are disabled for now; only email OTP supported
      if (via !== 'email') return res.status(400).json({ success: false, error: 'mobile_otp_disabled', message: 'Only email OTP is supported at this time' });
      const result = await sendOTP({ to, via: 'email' });
      res.json(result);
    } catch (err) {
      console.error('sendOtp error:', err);
      res.status(500).json({ error: 'Failed to send OTP' });
    }
  }
  ,

  // POST /api/patients/public/check-otp
  // Non-consuming OTP check: verifies code but does not delete OTP entry.
  checkOtp: async (req, res) => {
    try {
      const { otpId, code } = req.body;
      if (!otpId || !code) return res.status(400).json({ error: 'otpId and code required' });
      const v = await verifyOTP(otpId, code, { consume: false });
      if (!v.success) return res.status(400).json({ success: false, reason: v.reason });
      res.json({ success: true });
    } catch (err) {
      console.error('checkOtp error:', err);
      res.status(500).json({ error: 'Failed to check OTP' });
    }
  }
};
