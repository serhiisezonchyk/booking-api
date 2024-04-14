import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 mins
  max: 5,
  message: {error:'Too many attempts.'},
  standardHeaders: true,
  legacyHeaders: false,
});
