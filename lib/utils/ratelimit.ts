type Bucket = {
  tokens: number;
  lastRefill: number;
};

const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, capacity = 10, refillPerSec = 1) {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { tokens: capacity, lastRefill: now };
  const elapsed = (now - bucket.lastRefill) / 1000;
  const refill = Math.floor(elapsed * refillPerSec);
  if (refill > 0) {
    bucket.tokens = Math.min(capacity, bucket.tokens + refill);
    bucket.lastRefill = now;
  }
  if (bucket.tokens <= 0) {
    buckets.set(key, bucket);
    return false;
  }
  bucket.tokens -= 1;
  buckets.set(key, bucket);
  return true;
}
