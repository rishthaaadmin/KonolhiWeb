/**
 * Tiny in-memory rate limiter for form endpoints.
 * Allows `max` requests per `windowMs` per IP.
 */
function rateLimiter({ windowMs = 60_000, max = 5 } = {}) {
  const hits = new Map(); // ip -> [timestamps]

  return (req, res, next) => {
    const now = Date.now();
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const recent = (hits.get(ip) || []).filter((t) => now - t < windowMs);

    if (recent.length >= max) {
      return res.status(429).json({
        ok: false,
        error: 'Too many requests. Please wait a minute and try again.'
      });
    }

    recent.push(now);
    hits.set(ip, recent);

    // occasional cleanup so the map doesn't grow forever
    if (hits.size > 1000) {
      for (const [key, times] of hits) {
        if (times.every((t) => now - t >= windowMs)) hits.delete(key);
      }
    }
    next();
  };
}

module.exports = rateLimiter;
