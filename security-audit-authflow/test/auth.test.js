import { authService } from '../src/auth.js';

// Basic functionality tests (NOT security tests)
// These tests verify the vulnerable system works as expected

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
    console.log('🧪 Testing Authentication Functionality');
    console.log('⚠️  These tests verify the vulnerable system works (NOT security)');
    console.log('========================================\n');

    // Test user registration
    await test('User registration works', async () => {
      const result = await authService.register({
        username: 'testuser',
        password: 'testpass',
        email: 'test@example.com'
      });
      
      if (!result.success || !result.token) {
        throw new Error('Registration should return success and token');
      }
    });

    // Test user login
    await test('User login works', async () => {
      const result = await authService.login('admin', 'admin123');
      
      if (!result.success || !result.token) {
        throw new Error('Login should return success and token');
      }
    });

    // Test profile retrieval
    await test('Profile retrieval works', async () => {
      const loginResult = await authService.login('admin', 'admin123');
      const profileResult = await authService.getProfile(loginResult.token);
      
      if (!profileResult.success || !profileResult.user) {
        throw new Error('Profile retrieval should return user data');
      }
    });

    // Test token refresh
    await test('Token refresh works', async () => {
      const loginResult = await authService.login('admin', 'admin123');
      const refreshResult = await authService.refresh(loginResult.token);
      
      if (!refreshResult.success || !refreshResult.token) {
        throw new Error('Token refresh should return new token');
      }
    });

    // Test password change
    await test('Password change works', async () => {
      const loginResult = await authService.login('user1', 'password');
      const changeResult = await authService.changePassword(loginResult.token, 'newpassword');
      
      if (!changeResult.success) {
        throw new Error('Password change should succeed');
      }
      
      // Verify old password no longer works
      try {
        await authService.login('user1', 'password');
        throw new Error('Old password should not work after change');
      } catch (error) {
        // Expected - old password should fail
      }
      
      // Verify new password works
      const newLoginResult = await authService.login('user1', 'newpassword');
      if (!newLoginResult.success) {
        throw new Error('New password should work after change');
      }
    });

    // Test logout
    await test('User logout works', async () => {
      const loginResult = await authService.login('admin', 'admin123');
      const logoutResult = await authService.logout(loginResult.token);
      
      if (!logoutResult.success) {
        throw new Error('Logout should succeed');
      }
    });

    // Test invalid credentials
    await test('Invalid credentials are rejected', async () => {
      try {
        await authService.login('nonexistent', 'wrongpassword');
        throw new Error('Invalid credentials should be rejected');
      } catch (error) {
        // Expected behavior
        if (!error.message.includes('Authentication failed')) {
          throw new Error('Should return authentication error');
        }
      }
    });

    // Test invalid token
    await test('Invalid token is rejected', async () => {
      try {
        await authService.getProfile('invalid-token');
        throw new Error('Invalid token should be rejected');
      } catch (error) {
        // Expected behavior
        if (!error.message.includes('Session not found')) {
          throw new Error('Should return session error');
        }
      }
    });

    // Test debug endpoint (demonstrates vulnerability)
    await test('Debug endpoint exposes data (VULNERABILITY DEMO)', async () => {
      const debugResult = await authService.getDebugInfo('any-token');
      
      if (!debugResult.success || !debugResult.debug) {
        throw new Error('Debug endpoint should return system information');
      }
      
      // This demonstrates the vulnerability
      if (!debugResult.debug.users || !debugResult.debug.sessions) {
        throw new Error('Debug should expose users and sessions (vulnerability)');
      }
    });

    console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
    
    if (failed === 0) {
      console.log('\n✅ All functionality tests passed!');
      console.log('\n🔐 Now your task is to:');
      console.log('1. Identify security vulnerabilities in the code');
      console.log('2. Document them in SECURITY_AUDIT.md');
      console.log('3. Implement secure fixes');
      console.log('4. Re-run tests to ensure functionality still works');
    } else {
      console.log('\n❌ Some basic functionality is broken');
      process.exit(1);
    }

    console.log('\n⚠️  SECURITY REMINDER:');
    console.log('These tests only verify basic functionality.');
    console.log('The system is intentionally vulnerable and needs security fixes!');
  }

  return runAllTests();
}

runTests();