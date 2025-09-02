import * as naive from '../src/naive.js';
import * as optimized from '../src/optimized.js';
import { generateUsers, generateOrders } from '../src/data.js';

function runTests() {
  let passed = 0;
  let failed = 0;

  function test(name, fn) {
    try {
      fn();
      console.log(`✅ ${name}`);
      passed++;
    } catch (error) {
      console.log(`❌ ${name}: ${error.message}`);
      failed++;
    }
  }

  function deepEqual(a, b) {
    if (a === b) return true;
    if (!a || !b) return false;
    if (typeof a !== typeof b) return false;
    
    if (Array.isArray(a)) {
      if (!Array.isArray(b) || a.length !== b.length) return false;
      return a.every((item, i) => deepEqual(item, b[i]));
    }
    
    if (typeof a === 'object') {
      const keysA = Object.keys(a).sort();
      const keysB = Object.keys(b).sort();
      
      if (!deepEqual(keysA, keysB)) return false;
      return keysA.every(key => deepEqual(a[key], b[key]));
    }
    
    return false;
  }

  // Test data
  const users = generateUsers(50);
  const orders = generateOrders(50, 2);

  // Test filtering
  test('filterUsers produces same results', () => {
    const condition = { age: { $gte: 30 }, city: 'NYC' };
    
    const naiveResult = naive.filterUsers(users, condition);
    const optimizedResult = optimized.filterUsers(users, condition);
    
    if (naiveResult.length !== optimizedResult.length) {
      throw new Error(`Length mismatch: naive ${naiveResult.length} vs optimized ${optimizedResult.length}`);
    }
    
    // Sort both results for comparison (order might differ)
    naiveResult.sort((a, b) => a.id - b.id);
    optimizedResult.sort((a, b) => a.id - b.id);
    
    if (!deepEqual(naiveResult, optimizedResult)) {
      throw new Error('Results do not match');
    }
  });

  test('filterUsers with simple equality', () => {
    const condition = { city: 'SF' };
    
    const naiveResult = naive.filterUsers(users, condition);
    const optimizedResult = optimized.filterUsers(users, condition);
    
    if (naiveResult.length !== optimizedResult.length) {
      throw new Error('Simple equality filter results do not match');
    }
  });

  // Test sorting
  test('sortUsers produces same results', () => {
    const sortFields = [{ field: 'age', order: 'asc' }, { field: 'name', order: 'desc' }];
    
    const naiveResult = naive.sortUsers(users, sortFields);
    const optimizedResult = optimized.sortUsers(users, sortFields);
    
    if (naiveResult.length !== optimizedResult.length) {
      throw new Error('Sort results length mismatch');
    }
    
    // Check if sorting order is the same
    for (let i = 0; i < naiveResult.length; i++) {
      if (naiveResult[i].id !== optimizedResult[i].id) {
        throw new Error(`Sort order mismatch at index ${i}`);
      }
    }
  });

  test('sortUsers with single field', () => {
    const sortFields = [{ field: 'age', order: 'desc' }];
    
    const naiveResult = naive.sortUsers(users, sortFields);
    const optimizedResult = optimized.sortUsers(users, sortFields);
    
    if (naiveResult.length !== optimizedResult.length) {
      throw new Error('Single field sort results do not match');
    }
  });

  // Test joins
  test('joinUsersOrders produces same results', () => {
    const naiveResult = naive.joinUsersOrders(users, orders, 'id', 'userId');
    const optimizedResult = optimized.joinUsersOrders(users, orders, 'id', 'userId');
    
    if (naiveResult.length !== optimizedResult.length) {
      throw new Error('Join results length mismatch');
    }
    
    // Sort both results by user id for comparison
    naiveResult.sort((a, b) => a.id - b.id);
    optimizedResult.sort((a, b) => a.id - b.id);
    
    for (let i = 0; i < naiveResult.length; i++) {
      if (naiveResult[i].id !== optimizedResult[i].id) {
        throw new Error('Join user ID mismatch');
      }
      
      if (naiveResult[i].totalAmount !== optimizedResult[i].totalAmount) {
        throw new Error('Join totalAmount mismatch');
      }
      
      if (naiveResult[i].orders.length !== optimizedResult[i].orders.length) {
        throw new Error('Join orders count mismatch');
      }
    }
  });

  // Test aggregation
  test('aggregateOrders produces same results', () => {
    const naiveResult = naive.aggregateOrders(orders, { groupBy: 'userId', sum: 'amount' });
    const optimizedResult = optimized.aggregateOrders(orders, { groupBy: 'userId', sum: 'amount' });
    
    if (naiveResult.length !== optimizedResult.length) {
      throw new Error('Aggregation results length mismatch');
    }
    
    // Sort both results by userId for comparison
    naiveResult.sort((a, b) => a.userId - b.userId);
    optimizedResult.sort((a, b) => a.userId - b.userId);
    
    for (let i = 0; i < naiveResult.length; i++) {
      if (naiveResult[i].userId !== optimizedResult[i].userId) {
        throw new Error('Aggregation userId mismatch');
      }
      
      if (naiveResult[i].amount !== optimizedResult[i].amount) {
        throw new Error('Aggregation amount mismatch');
      }
    }
  });

  // Test lookup
  test('findUserById produces same results', () => {
    const testId = users[Math.floor(users.length / 2)].id;
    
    const naiveResult = naive.findUserById(users, testId);
    const optimizedResult = optimized.findUserById(users, testId);
    
    if (!deepEqual(naiveResult, optimizedResult)) {
      throw new Error('findUserById results do not match');
    }
  });

  test('findUserById handles non-existent ID', () => {
    const nonExistentId = Math.max(...users.map(u => u.id)) + 1;
    
    const naiveResult = naive.findUserById(users, nonExistentId);
    const optimizedResult = optimized.findUserById(users, nonExistentId);
    
    if (naiveResult !== optimizedResult) {
      throw new Error('Non-existent ID handling mismatch');
    }
  });

  // Test unique values
  test('getUniqueValues produces same results', () => {
    const naiveResult = naive.getUniqueValues(users, 'city');
    const optimizedResult = optimized.getUniqueValues(users, 'city');
    
    // Sort both arrays for comparison
    naiveResult.sort();
    optimizedResult.sort();
    
    if (!deepEqual(naiveResult, optimizedResult)) {
      throw new Error('getUniqueValues results do not match');
    }
  });

  // Test edge cases
  test('handles empty datasets', () => {
    const emptyResult1 = optimized.filterUsers([], { age: 25 });
    const emptyResult2 = optimized.sortUsers([], [{ field: 'age', order: 'asc' }]);
    
    if (emptyResult1.length !== 0 || emptyResult2.length !== 0) {
      throw new Error('Empty dataset handling failed');
    }
  });

  console.log(`\nTest Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('\n✅ All correctness tests passed!');
    console.log('Now run `npm run bench` to check performance improvements.');
  } else {
    console.log('\n❌ Some tests failed. Fix correctness issues before benchmarking.');
    process.exit(1);
  }
}

runTests();