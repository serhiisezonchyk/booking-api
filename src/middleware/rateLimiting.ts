import rateLimit from 'express-rate-limit';

export const rateLimiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 mins
  max: 10,
  message: 'You have exceeded the 10 requests in 2 minutes limit!',
  standardHeaders: true,
  legacyHeaders: false,
});
