# API: Weather Data Aggregator

## Overview
Build a REST API service that aggregates weather data from multiple sources with caching and rate limiting.

## Problem Description
Create an HTTP server that provides weather information by combining data from multiple weather APIs. The service should handle concurrent requests efficiently and cache responses to minimize external API calls.

## API Specification

### Endpoint
```
GET /weather?city={cityName}
```

### Response Format
```json
{
  "city": "London",
  "temperature": 18.5,
  "humidity": 65,
  "description": "Partly cloudy",
  "sources": ["openweather", "weatherapi"],
  "cached": false,
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## Requirements
1. **Multiple Data Sources**: Integrate at least 2 weather APIs
2. **Rate Limiting**: Maximum 5 concurrent requests
3. **Caching**: 10-minute TTL to reduce API calls
4. **Error Handling**: Graceful fallback when APIs are unavailable
5. **Native Node.js**: Use only built-in modules

## Configuration
Copy `.env.example` to `.env` and add your API keys:
```
OPENWEATHER_API_KEY=your_key_here
WEATHERAPI_KEY=your_key_here
```

## Files Structure
- `src/server.js` - Main HTTP server
- `src/weatherService.js` - Weather data aggregation logic
- `src/lib/cache.js` - In-memory TTL cache
- `src/lib/limit.js` - Concurrent request limiter
- `test/weather.test.js` - Test cases

## Running the Server
```bash
npm start
```

Server will start on port 3000.

## Testing
```bash
npm test
```

## Implementation Tips
- Use `Promise.allSettled()` for concurrent API calls
- Implement circuit breaker pattern for failed APIs  
- Consider data normalization between different API responses
- Handle edge cases like invalid city names