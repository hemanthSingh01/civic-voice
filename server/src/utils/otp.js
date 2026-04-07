/**
 * Simple in-memory OTP storage and generation utility.
 * In production, consider Redis for distributed systems.
 */

const otpStore = new Map(); // { identifier -> { code, expiresAt, attempts } }
const OTP_EXPIRY_MINUTES = 10;
const MAX_ATTEMPTS = 3;

/**
 * Generate a random 6-digit OTP.
 */
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send OTP to a user (stub: in production, integrate SMS/email service).
 * @param {string} identifier - Phone number or email
 * @param {string} otp - OTP code to send
 * @returns {Promise<boolean>} true if sent successfully
 */
export async function sendOtp(identifier, otp) {
  // In production, call SMS (Twilio, AWS SNS) or email service here
  console.log(`[OTP] Sending OTP ${otp} to ${identifier}`);
  // For demo/dev, just log and return true
  return true;
}

/**
 * Generate and send OTP to user.
 * @param {string} identifier - Phone number or email
 * @returns {Promise<{ code: string }>} OTP code (for testing only; remove in production)
 */
export async function generateAndSendOtp(identifier) {
  const code = generateOtp();
  const expiresAt = Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000;

  otpStore.set(identifier, {
    code,
    expiresAt,
    attempts: 0,
  });

  const sent = await sendOtp(identifier, code);
  if (!sent) {
    otpStore.delete(identifier);
    throw new Error("Failed to send OTP. Try again.");
  }

  // Return code for testing; remove in production
  return { code };
}

/**
 * Verify OTP for a user.
 * @param {string} identifier - Phone number or email
 * @param {string} code - OTP code to verify
 * @returns {boolean} true if valid and not expired
 */
export function verifyOtp(identifier, code) {
  const stored = otpStore.get(identifier);

  if (!stored) {
    return false;
  }

  // Check expiry
  if (Date.now() > stored.expiresAt) {
    otpStore.delete(identifier);
    return false;
  }

  // Check max attempts
  if (stored.attempts >= MAX_ATTEMPTS) {
    otpStore.delete(identifier);
    return false;
  }

  // Check code
  if (stored.code !== code) {
    stored.attempts += 1;
    return false;
  }

  // Valid: clear and return true
  otpStore.delete(identifier);
  return true;
}

/**
 * Clear OTP for a user (optional cleanup).
 */
export function clearOtp(identifier) {
  otpStore.delete(identifier);
}
