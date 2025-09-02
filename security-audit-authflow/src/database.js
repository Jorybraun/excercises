// ⚠️ INTENTIONALLY VULNERABLE DATABASE MODULE ⚠️
// This module contains deliberate security vulnerabilities for educational purposes
// DO NOT USE IN PRODUCTION

// In-memory user database (simulates database operations)
const users = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin', email: 'admin@example.com' },
  { id: 2, username: 'user1', password: 'password', role: 'user', email: 'user1@example.com' },
  { id: 3, username: 'test', password: '123456', role: 'user', email: 'test@example.com' }
];

// Active sessions (simulates session storage)
const sessions = {};

export class Database {
  // VULNERABILITY #1: SQL Injection Simulation
  // In a real app, this would be vulnerable to SQL injection
  findUser(username, password) {
    // Simulating direct string concatenation (vulnerable pattern)
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    console.log(`Executing query: ${query}`); // Information disclosure
    
    // For simulation, just do direct comparison
    return users.find(user => user.username === username && user.password === password);
  }

  // VULNERABILITY #2: Information Disclosure
  // Returns too much information about why login failed
  authenticateUser(username, password) {
    const user = users.find(u => u.username === username);
    
    if (!user) {
      throw new Error(`User '${username}' does not exist in the system`);
    }
    
    if (user.password !== password) {
      throw new Error(`Invalid password for user '${username}'. Password should be at least 8 characters.`);
    }
    
    return user;
  }

  // VULNERABILITY #3: No Input Validation
  createUser(userData) {
    const { username, password, email, role = 'user' } = userData;
    
    // No validation of input data
    const newUser = {
      id: users.length + 1,
      username,
      password, // VULNERABILITY: Storing plain text password
      email,
      role
    };
    
    users.push(newUser);
    return newUser;
  }

  // VULNERABILITY #4: Insecure Session Management  
  createSession(user) {
    // VULNERABILITY: Predictable session token
    const token = `session_${user.id}_${Date.now()}`;
    
    sessions[token] = {
      userId: user.id,
      username: user.username,
      role: user.role,
      createdAt: new Date(),
      // VULNERABILITY: No session expiration
    };
    
    return token;
  }

  // VULNERABILITY #5: No Session Security
  validateSession(token) {
    const session = sessions[token];
    
    if (!session) {
      return null;
    }
    
    // VULNERABILITY: No session expiration check
    // VULNERABILITY: No session rotation
    
    return {
      userId: session.userId,
      username: session.username,
      role: session.role
    };
  }

  // VULNERABILITY #6: No Secure Session Cleanup
  destroySession(token) {
    // Simply delete the session (no secure cleanup)
    delete sessions[token];
    return true;
  }

  // VULNERABILITY #7: Password Change Without Verification
  changePassword(username, newPassword) {
    const user = users.find(u => u.username === username);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // VULNERABILITY: No current password verification
    // VULNERABILITY: No password strength validation
    user.password = newPassword; // Still plain text
    
    return true;
  }

  // VULNERABILITY #8: Information Disclosure
  getAllUsers() {
    // Returns all user data including passwords
    return users;
  }

  // VULNERABILITY #9: No Access Control
  deleteUser(username) {
    const index = users.findIndex(u => u.username === username);
    
    if (index === -1) {
      throw new Error('User not found');
    }
    
    // No authorization check - anyone can delete users
    users.splice(index, 1);
    return true;
  }

  // Debug method that exposes internal state
  getDebugInfo() {
    return {
      users: users, // VULNERABILITY: Exposes all user data
      sessions: sessions, // VULNERABILITY: Exposes all sessions
      sessionCount: Object.keys(sessions).length
    };
  }
}

// Export singleton instance
export const database = new Database();