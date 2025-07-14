// Rate limiting middleware
const RATE_LIMIT = {
  windowMs: 1000, // 1 second
  max: 5,         // max 5 requests per second
  dailyLimit: 100 // max 100 requests per day
};

const ipRequests = {};

const rateLimiter = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  console.log('ip:', req.ip, req.headers['x-forwarded-for']);
  if (!ipRequests[ip]) {
    ipRequests[ip] = {
      requests: [],
      dailyCount: 0,
      lastReset: now
    };
  }

  if (now - ipRequests[ip].lastReset > 24 * 60 * 60 * 1000) {
    ipRequests[ip].dailyCount = 0;
    ipRequests[ip].lastReset = now;
  }

  if (ipRequests[ip].dailyCount >= RATE_LIMIT.dailyLimit) {
    return res.status(429).json({ error: 'Daily upload limit reached' });
  }

  ipRequests[ip].requests = ipRequests[ip].requests.filter(
    time => now - time < RATE_LIMIT.windowMs
  );

  if (ipRequests[ip].requests.length >= RATE_LIMIT.max) {
    return res.status(429).json({ error: 'Too many requests, please try again later' });
  }

  ipRequests[ip].requests.push(now);
  ipRequests[ip].dailyCount++;

  next();
};

module.exports = rateLimiter; 