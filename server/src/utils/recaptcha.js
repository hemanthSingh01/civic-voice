const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

export async function verifyRecaptchaToken(token) {
  if (!token) {
    return { success: false, error: "No reCAPTCHA token provided" };
  }

  if (!RECAPTCHA_SECRET_KEY) {
    console.warn("RECAPTCHA_SECRET_KEY not configured - skipping reCAPTCHA verification");
    return { success: true }; // Skip validation in development
  }

  try {
    const response = await fetch(RECAPTCHA_VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: RECAPTCHA_SECRET_KEY,
        response: token,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      console.error("reCAPTCHA verification failed:", data["error-codes"]);
      return { success: false, error: "reCAPTCHA verification failed" };
    }

    // Optionally check the score (for v3) - not applicable for v2 Checkbox
    // But we can still log it for debugging
    if (data.score !== undefined) {
      console.log(`reCAPTCHA score: ${data.score}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error);
    return { success: false, error: error.message };
  }
}
