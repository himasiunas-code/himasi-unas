/**
 * Simple in-memory cache untuk mengurangi database queries
 * Cache akan expired setelah waktu tertentu
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number // Time to live dalam milidetik
}

class SimpleCache {
  private cache: Map<string, CacheEntry<any>> = new Map()

  /**
   * Set cache dengan key dan TTL (default 30 detik)
   */
  set<T>(key: string, data: T, ttl: number = 30000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  /**
   * Get cache by key, return null jika expired atau tidak ada
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }

    const now = Date.now()
    const age = now - entry.timestamp

    // Check apakah sudah expired
    if (age > entry.ttl) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  /**
   * Clear specific key
   */
  clear(key: string): void {
    this.cache.delete(key)
  }

  /**
   * Clear all cache
   */
  clearAll(): void {
    this.cache.clear()
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size
  }

  /**
   * Clear expired entries
   */
  clearExpired(): void {
    const now = Date.now()
    
    for (const [key, entry] of this.cache.entries()) {
      const age = now - entry.timestamp
      if (age > entry.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

// Export singleton instance
export const cache = new SimpleCache()

// Auto-cleanup setiap 5 menit
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    cache.clearExpired()
  }, 5 * 60 * 1000)
}
