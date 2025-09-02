# Security: Authentication Security Audit

## Overview
Audit and secure an intentionally vulnerable authentication system by identifying security flaws and implementing proper security measures.

## Problem Description
You are provided with a working but highly insecure authentication system. Your task is to identify security vulnerabilities and implement fixes while maintaining the core functionality.

## Baseline Insecurities
The provided baseline implementation contains several intentional security vulnerabilities:

1. **Plain Text Passwords**: Passwords are stored in plain text without hashing
2. **Weak Session Management**: Session tokens are predictable and easily guessable  
3. **SQL Injection Vulnerability**: User input is directly concatenated into queries
4. **No Rate Limiting**: No protection against brute force attacks
5. **Insufficient Input Validation**: No validation or sanitization of user inputs
6. **Information Disclosure**: Error messages reveal sensitive system information
7. **Insecure Token Generation**: Authentication tokens use weak randomization
8. **No HTTPS Enforcement**: System allows insecure HTTP connections

## Your Mission
1. **Audit Phase**: Identify and document all security vulnerabilities
2. **Fix Phase**: Implement secure alternatives for each vulnerability
3. **Test Phase**: Verify that fixes work correctly and don't break functionality

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `POST /auth/refresh` - Refresh authentication token
- `GET /auth/profile` - Get user profile (requires authentication)
- `POST /auth/logout` - User logout

### User Management  
- `POST /auth/register` - User registration
- `PUT /auth/change-password` - Change user password

## Expected Security Improvements

### Must Fix (Required)
- [ ] Hash passwords with proper salt (bcrypt, scrypt, or Argon2)
- [ ] Generate cryptographically secure session tokens  
- [ ] Implement proper input validation and sanitization
- [ ] Add rate limiting for authentication attempts
- [ ] Secure error handling (no information leakage)

### Should Fix (Recommended)
- [ ] Implement session expiration and refresh
- [ ] Add CSRF protection tokens
- [ ] Implement account lockout after failed attempts
- [ ] Add security headers (HSTS, CSP, etc.)
- [ ] Implement audit logging for security events

### Could Fix (Nice to Have)  
- [ ] Multi-factor authentication (MFA)
- [ ] Password strength requirements
- [ ] OAuth2/OpenID Connect integration
- [ ] IP-based access controls

## Files Structure
- `src/auth.js` - Main authentication logic ⚠️ VULNERABLE
- `src/server.js` - HTTP server ⚠️ VULNERABLE  
- `src/database.js` - User data storage ⚠️ VULNERABLE
- `test/auth.test.js` - Basic functionality tests
- `SECURITY_AUDIT.md` - Document your findings here

## Running the Server
```bash
npm start
```

Server runs on http://localhost:3000

## Testing
```bash
npm test
```

## Deliverables
1. **Fixed Implementation**: Secure versions of all source files
2. **Security Audit Report**: Document each vulnerability and fix in `SECURITY_AUDIT.md`
3. **Working Tests**: Ensure all functionality still works after security fixes

## Evaluation Criteria
- **Vulnerability Identification**: How many security issues did you find?
- **Fix Quality**: Are the implemented fixes actually secure?
- **Documentation**: Are vulnerabilities well documented with explanations?
- **Functionality**: Does the system still work after security improvements?

⚠️ **Important**: The baseline implementation is intentionally insecure for educational purposes. DO NOT use it in production!