import { WeatherService } from '../src/weatherService.js';
import { TTLCache } from '../src/lib/cache.js';
import { ConcurrencyLimiter } from '../src/lib/limit.js';

// Mock fetch for testing
const originalFetch = global.fetch;

function runTests() {
  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    return new Promise(async (resolve) => {
      try {
        await fn();
        console.log(`✅ ${name}`);
        passed++;
      } catch (error) {
        console.log(`❌ ${name}: ${error.message}`);
        failed++;
      }
      resolve();
    });
  }

  async function runAllTests() {
    // Test TTLCache
    await test('TTLCache stores and retrieves values', async () => {
      const cache = new TTLCache();
      cache.set('test', { data: 'value' }, 1000);
      
      const result = cache.get('test');
      if (!result || result.data !== 'value') {
        throw new Error('Cache did not store/retrieve correctly');
      }
    });

    await test('TTLCache expires values after TTL', async () => {
      const cache = new TTLCache();
      cache.set('test', { data: 'value' }, 50); // 50ms TTL
      
      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (cache.has('test')) {
        throw new Error('Cache value should have expired');
      }
    });

    // Test ConcurrencyLimiter
    await test('ConcurrencyLimiter limits concurrent executions', async () => {
      const limiter = new ConcurrencyLimiter(2);
      let concurrent = 0;
      let maxConcurrent = 0;

      const task = () => new Promise(resolve => {
        concurrent++;
        maxConcurrent = Math.max(maxConcurrent, concurrent);
        setTimeout(() => {
          concurrent--;
          resolve();
        }, 50);
      });

      await Promise.all([
        limiter.execute(task),
        limiter.execute(task),
        limiter.execute(task),
        limiter.execute(task)
      ]);

      if (maxConcurrent > 2) {
        throw new Error(`Expected max 2 concurrent, got ${maxConcurrent}`);
      }
    });

    // Test WeatherService
    await test('WeatherService returns structured data', async () => {
      // Mock fetch to avoid external API calls
      global.fetch = async () => ({
        ok: true,
        json: async () => ({ temp: 20 })
      });

      const service = new WeatherService();
      const result = await service.getWeatherData('London');

      if (!result.city || !result.temperature || !result.timestamp) {
        throw new Error('Weather service should return structured data');
      }
    });

    await test('WeatherService handles caching', async () => {
      const service = new WeatherService();
      
      // First call
      const result1 = await service.getWeatherData('TestCity');
      if (result1.cached !== false) {
        throw new Error('First call should not be cached');
      }

      // Second call should be cached
      const result2 = await service.getWeatherData('TestCity');
      if (result2.cached !== true) {
        throw new Error('Second call should be cached');
      }
    });

    // Restore original fetch
    global.fetch = originalFetch;

    console.log(`\nTest Results: ${passed} passed, ${failed} failed`);
    if (failed > 0) {
      process.exit(1);
    }
  }

  return runAllTests();
}

runTests();