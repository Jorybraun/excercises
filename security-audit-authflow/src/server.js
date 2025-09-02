// ⚠️ INTENTIONALLY VULNERABLE HTTP SERVER ⚠️
// This server contains deliberate security vulnerabilities for educational purposes
// DO NOT USE IN PRODUCTION

import { createServer } from 'http';
import { parse } from 'url';
import { authService } from './auth.js';

const PORT = process.env.PORT || 3000;

// VULNERABILITY #1: No security headers
// VULNERABILITY #2: No HTTPS enforcement
// VULNERABILITY #3: No CORS protection
const server = createServer(async (req, res) => {
  // VULNERABILITY: No security headers set
  res.setHeader('Content-Type', 'application/json');
  
  // VULNERABILITY: Allows all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  
  try {
    const { pathname, query } = parse(req.url, true);
    const method = req.method;
    
    // VULNERABILITY #4: No rate limiting
    // VULNERABILITY #5: No request size limiting
    
    if (method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }
    
    // Route handling
    if (method === 'POST' && pathname === '/auth/login') {
      await handleLogin(req, res);
    } else if (method === 'POST' && pathname === '/auth/register') {
      await handleRegister(req, res);
    } else if (method === 'POST' && pathname === '/auth/refresh') {
      await handleRefresh(req, res);
    } else if (method === 'GET' && pathname === '/auth/profile') {
      await handleProfile(req, res);
    } else if (method === 'POST' && pathname === '/auth/logout') {
      await handleLogout(req, res);
    } else if (method === 'PUT' && pathname === '/auth/change-password') {
      await handleChangePassword(req, res);
    } else if (method === 'GET' && pathname === '/auth/debug') {
      // VULNERABILITY: Debug endpoint exposed in production
      await handleDebug(req, res);
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Not found' }));
    }
    
  } catch (error) {
    console.error('Server error:', error);
    // VULNERABILITY: Exposing internal error details
    res.writeHead(500);
    res.end(JSON.stringify({ 
      error: 'Internal server error',
      details: error.message, // VULNERABILITY: Exposing error details
      stack: error.stack      // VULNERABILITY: Exposing stack trace
    }));
  }
});

// VULNERABILITY #6: No input validation helper
async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    
    // VULNERABILITY: No size limit on request body
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        // VULNERABILITY: No JSON parsing error handling
        resolve(JSON.parse(body || '{}'));
      } catch (error) {
        // VULNERABILITY: Detailed parsing error
        reject(new Error(`JSON parsing failed: ${error.message}`));
      }
    });
    
    // VULNERABILITY: No timeout handling
  });
}

// VULNERABILITY #7: No token extraction security
function extractToken(req) {
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  
  // VULNERABILITY: Also accept token from query parameters (insecure)
  const { query } = parse(req.url, true);
  if (query.token) {
    return query.token;
  }
  
  return null;
}

async function handleLogin(req, res) {
  try {
    const { username, password } = await parseBody(req);
    
    // VULNERABILITY: No input validation
    const result = await authService.login(username, password);
    
    res.writeHead(200);
    res.end(JSON.stringify(result));
    
  } catch (error) {
    // VULNERABILITY: Exposing detailed login errors
    res.writeHead(401);
    res.end(JSON.stringify({ 
      error: error.message,
      timestamp: new Date().toISOString(),
      endpoint: '/auth/login'
    }));
  }
}

async function handleRegister(req, res) {
  try {
    const userData = await parseBody(req);
    
    // VULNERABILITY: No input validation or sanitization
    const result = await authService.register(userData);
    
    res.writeHead(201);
    res.end(JSON.stringify(result));
    
  } catch (error) {
    res.writeHead(400);
    res.end(JSON.stringify({ error: error.message }));
  }
}

async function handleRefresh(req, res) {
  try {
    const token = extractToken(req);
    
    if (!token) {
      throw new Error('Token is required for refresh');
    }
    
    const result = await authService.refresh(token);
    
    res.writeHead(200);
    res.end(JSON.stringify(result));
    
  } catch (error) {
    res.writeHead(401);
    res.end(JSON.stringify({ error: error.message }));
  }
}

async function handleProfile(req, res) {
  try {
    const token = extractToken(req);
    
    if (!token) {
      throw new Error('Authentication token is required');
    }
    
    const result = await authService.getProfile(token);
    
    res.writeHead(200);
    res.end(JSON.stringify(result));
    
  } catch (error) {
    res.writeHead(401);
    res.end(JSON.stringify({ error: error.message }));
  }
}

async function handleLogout(req, res) {
  try {
    const token = extractToken(req);
    
    if (!token) {
      throw new Error('Token is required for logout');
    }
    
    const result = await authService.logout(token);
    
    res.writeHead(200);
    res.end(JSON.stringify(result));
    
  } catch (error) {
    res.writeHead(400);
    res.end(JSON.stringify({ error: error.message }));
  }
}

async function handleChangePassword(req, res) {
  try {
    const token = extractToken(req);
    const { newPassword } = await parseBody(req);
    
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const result = await authService.changePassword(token, newPassword);
    
    res.writeHead(200);
    res.end(JSON.stringify(result));
    
  } catch (error) {
    res.writeHead(400);
    res.end(JSON.stringify({ error: error.message }));
  }
}

// VULNERABILITY: Debug endpoint exposed
async function handleDebug(req, res) {
  try {
    const token = extractToken(req);
    
    // VULNERABILITY: No authentication required for debug info
    const result = await authService.getDebugInfo(token);
    
    res.writeHead(200);
    res.end(JSON.stringify(result));
    
  } catch (error) {
    res.writeHead(500);
    res.end(JSON.stringify({ error: error.message }));
  }
}

server.listen(PORT, () => {
  console.log(`🚨 VULNERABLE Authentication Server running on http://localhost:${PORT}`);
  console.log('⚠️  This server is intentionally insecure for educational purposes');
  console.log('⚠️  DO NOT USE IN PRODUCTION');
  console.log('\nEndpoints:');
  console.log('  POST /auth/login - User login');
  console.log('  POST /auth/register - User registration');
  console.log('  POST /auth/refresh - Refresh token');
  console.log('  GET /auth/profile - Get user profile');
  console.log('  POST /auth/logout - User logout');
  console.log('  PUT /auth/change-password - Change password');
  console.log('  GET /auth/debug - Debug information (VULNERABLE!)');
});

export { server };