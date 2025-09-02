import { createServer } from 'http';
import { parse } from 'url';
import { WeatherService } from './weatherService.js';

const PORT = process.env.PORT || 3000;
const weatherService = new WeatherService();

// Simple HTTP server using native Node.js
const server = createServer(async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Content-Type', 'application/json');

  try {
    const { pathname, query } = parse(req.url, true);

    if (req.method === 'GET' && pathname === '/weather') {
      await handleWeatherRequest(req, res, query);
    } else if (req.method === 'GET' && pathname === '/health') {
      await handleHealthCheck(req, res);
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Not found' }));
    }
  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
});

async function handleWeatherRequest(req, res, query) {
  const { city } = query;

  if (!city) {
    res.writeHead(400);
    res.end(JSON.stringify({ error: 'City parameter is required' }));
    return;
  }

  try {
    const weatherData = await weatherService.getWeatherData(city);
    res.writeHead(200);
    res.end(JSON.stringify(weatherData));
  } catch (error) {
    console.error('Weather service error:', error);
    res.writeHead(503);
    res.end(JSON.stringify({ 
      error: 'Weather service unavailable',
      message: error.message 
    }));
  }
}

async function handleHealthCheck(req, res) {
  res.writeHead(200);
  res.end(JSON.stringify({ 
    status: 'healthy', 
    timestamp: new Date().toISOString() 
  }));
}

server.listen(PORT, () => {
  console.log(`Weather API server running on http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log(`  GET /weather?city=<cityname> - Get weather data`);
  console.log(`  GET /health - Health check`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  server.close(() => {
    process.exit(0);
  });
});

export { server };