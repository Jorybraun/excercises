// In-memory cache with TTL (Time To Live)
export class TTLCache {
  constructor() {
    this.cache = new Map();
    this.timers = new Map();
  }

  set(key, value, ttlMs = 600000) { // Default 10 minutes
    // Clear existing timer if key already exists
    this.clear(key);
    
    // Store the value
    this.cache.set(key, value);
    
    // Set expiration timer
    const timer = setTimeout(() => {
      this.delete(key);
    }, ttlMs);
    
    this.timers.set(key, timer);
  }

  get(key) {
    return this.cache.get(key);
  }

  has(key) {
    return this.cache.has(key);
  }

  delete(key) {
    const timer = this.timers.get(key);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(key);
    }
    return this.cache.delete(key);
  }

  clear(key) {
    if (key) {
      this.delete(key);
    } else {
      // Clear all
      for (const timer of this.timers.values()) {
        clearTimeout(timer);
      }
      this.cache.clear();
      this.timers.clear();
    }
  }

  size() {
    return this.cache.size;
  }

  keys() {
    return this.cache.keys();
  }
}

// TODO: Add cache statistics (hit/miss ratios)
// TODO: Consider LRU eviction policy for memory management