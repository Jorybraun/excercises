// ⚠️ INTENTIONALLY VULNERABLE AUTHENTICATION MODULE ⚠️
// This module contains deliberate security vulnerabilities for educational purposes
// DO NOT USE IN PRODUCTION

import { database } from './database.js';
import { createHash, randomBytes } from 'crypto';

// VULNERABILITY #1: Weak token generation
function generateToken() {
  // VULNERABILITY: Using predictable token generation
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// VULNERABILITY #2: Insecure password hashing (actually no hashing)
function hashPassword(password) {
  // VULNERABILITY: This doesn't actually hash - just returns plain text
  console.log('Hashing password...'); // Information disclosure
  return password; // Plain text storage!
}

export class AuthService {
  
  // VULNERABILITY #3: No rate limiting or brute force protection
  async login(username, password) {
    try {
      // VULNERABILITY: No input validation or sanitization
      if (!username || !password) {
        throw new Error('Username and password are required');
      }
      
      // VULNERABILITY: Database method is vulnerable to injection
      const user = database.authenticateUser(username, password);
      
      if (!user) {
        // VULNERABILITY: Information disclosure about why login failed
        throw new Error(`Login failed for user: ${username}. Invalid credentials provided.`);
      }
      
      // VULNERABILITY: Insecure session token generation
      const token = database.createSession(user);
      
      // VULNERABILITY: Logging sensitive information
      console.log(`User ${username} logged in successfully with token: ${token}`);
      
      return {
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          email: user.email // VULNERABILITY: Exposing email in response
        }
      };
      
    } catch (error) {
      // VULNERABILITY: Detailed error messages expose system information
      console.error('Login error details:', error.message);
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  // VULNERABILITY #4: No token validation or expiration
  async refresh(token) {
    // VULNERABILITY: No validation of token format
    // VULNERABILITY: No rate limiting on refresh attempts
    
    const session = database.validateSession(token);
    
    if (!session) {
      // VULNERABILITY: Information disclosure
      throw new Error(`Invalid or expired token: ${token}`);
    }
    
    // VULNERABILITY: No token rotation - reuses same token
    return {
      success: true,
      token: token, // Same token returned
      user: session
    };
  }

  // VULNERABILITY #5: No proper authorization checks
  async getProfile(token) {
    // VULNERABILITY: No input validation
    if (!token) {
      throw new Error('Token is required');
    }
    
    const session = database.validateSession(token);
    
    if (!session) {
      // VULNERABILITY: Detailed error message
      throw new Error(`Session not found for token: ${token}`);
    }
    
    // VULNERABILITY: Exposing all user data
    const users = database.getAllUsers();
    const user = users.find(u => u.id === session.userId);
    
    return {
      success: true,
      user: user // VULNERABILITY: Returns password and all data
    };
  }

  // VULNERABILITY #6: No secure session cleanup
  async logout(token) {
    // VULNERABILITY: No validation that user owns this session
    database.destroySession(token);
    
    return {
      success: true,
      message: 'Logged out successfully'
    };
  }

  // VULNERABILITY #7: No password strength requirements
  async register(userData) {
    const { username, password, email } = userData;
    
    // VULNERABILITY: No input validation or sanitization
    // VULNERABILITY: No duplicate username checking
    // VULNERABILITY: No email format validation
    
    try {
      const hashedPassword = hashPassword(password); // Actually plain text
      
      const newUser = database.createUser({
        username,
        password: hashedPassword,
        email,
        role: userData.role || 'user' // VULNERABILITY: User can set their own role
      });
      
      // VULNERABILITY: Auto-login after registration without email verification
      const token = database.createSession(newUser);
      
      return {
        success: true,
        message: 'User registered successfully',
        token,
        user: newUser
      };
      
    } catch (error) {
      // VULNERABILITY: Exposing detailed error information
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  // VULNERABILITY #8: No current password verification
  async changePassword(token, newPassword) {
    const session = database.validateSession(token);
    
    if (!session) {
      throw new Error('Invalid session');
    }
    
    // VULNERABILITY: No current password verification
    // VULNERABILITY: No password strength validation
    // VULNERABILITY: Password stored in plain text
    
    database.changePassword(session.username, newPassword);
    
    return {
      success: true,
      message: 'Password changed successfully'
    };
  }

  // VULNERABILITY #9: Admin functionality without proper authorization
  async getDebugInfo(token) {
    // VULNERABILITY: No admin role checking
    // VULNERABILITY: Exposes all system data
    
    const debugInfo = database.getDebugInfo();
    
    return {
      success: true,
      debug: debugInfo // VULNERABILITY: Exposes all users and sessions
    };
  }
}

// Export singleton instance  
export const authService = new AuthService();