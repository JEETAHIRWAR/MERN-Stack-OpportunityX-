import { rateLimit } from "express-rate-limit";

const minutes = (value) => value * 60 * 1000;

const numericEnv = (name, fallback) => {
  const parsed = Number(process.env[name]);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const createLimiter = ({ windowEnv, limitEnv, windowMinutes, limit, message }) =>
  rateLimit({
    windowMs: minutes(numericEnv(windowEnv, windowMinutes)),
    limit: numericEnv(limitEnv, limit),
    standardHeaders: "draft-8",
    legacyHeaders: false,
    // Automated integration tests validate behavior, not in-memory quotas.
    skip: () => process.env.NODE_ENV === "test",
    message: { message },
  });

// Authentication endpoints use separate quotas so a password-reset campaign
// cannot consume the login allowance for the same IP address.
export const loginLimiter = createLimiter({
  windowEnv: "RATE_LIMIT_AUTH_WINDOW_MINUTES",
  limitEnv: "RATE_LIMIT_LOGIN_MAX",
  windowMinutes: 15,
  limit: 10,
  message: "Too many login attempts. Please try again later.",
});

export const registrationLimiter = createLimiter({
  windowEnv: "RATE_LIMIT_AUTH_WINDOW_MINUTES",
  limitEnv: "RATE_LIMIT_REGISTER_MAX",
  windowMinutes: 60,
  limit: 5,
  message: "Too many registration attempts. Please try again later.",
});

export const forgotPasswordLimiter = createLimiter({
  windowEnv: "RATE_LIMIT_PASSWORD_WINDOW_MINUTES",
  limitEnv: "RATE_LIMIT_FORGOT_PASSWORD_MAX",
  windowMinutes: 60,
  limit: 5,
  message: "Too many password reset requests. Please try again later.",
});

export const resetPasswordLimiter = createLimiter({
  windowEnv: "RATE_LIMIT_PASSWORD_WINDOW_MINUTES",
  limitEnv: "RATE_LIMIT_RESET_PASSWORD_MAX",
  windowMinutes: 60,
  limit: 10,
  message: "Too many password reset attempts. Please try again later.",
});

export const applicationLimiter = createLimiter({
  windowEnv: "RATE_LIMIT_APPLICATION_WINDOW_MINUTES",
  limitEnv: "RATE_LIMIT_APPLICATION_MAX",
  windowMinutes: 15,
  limit: 20,
  message: "Too many application attempts. Please try again later.",
});

export const viewCountLimiter = createLimiter({
  windowEnv: "RATE_LIMIT_VIEW_WINDOW_MINUTES",
  limitEnv: "RATE_LIMIT_VIEW_MAX",
  windowMinutes: 5,
  limit: 120,
  message: "Too many view updates. Please try again later.",
});

export const aiLimiter = createLimiter({
  windowEnv: "RATE_LIMIT_AI_WINDOW_MINUTES",
  limitEnv: "RATE_LIMIT_AI_MAX",
  windowMinutes: 15,
  limit: 20,
  message: "Too many AI requests. Please try again later.",
});
