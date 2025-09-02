import { findPath } from '../src/pathfinder.js';

// Simple test runner
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

  // Test 1: Function exists and can be called
  test('findPath function exists', () => {
    if (typeof findPath !== 'function') {
      throw new Error('findPath is not a function');
    }
    
    const result = findPath([]);
    if (!Array.isArray(result)) {
      throw new Error('findPath should return an array');
    }
  });

  // Test 2: Empty grid
  test('handles empty grid', () => {
    const result = findPath([]);
    if (result.length !== 0) {
      throw new Error('Empty grid should return empty path');
    }
  });

  // Test 3: Invalid grid
  test('handles invalid input', () => {
    const result = findPath(null);
    if (result.length !== 0) {
      throw new Error('Invalid input should return empty path');
    }
  });

  // TODO: Add more comprehensive tests once pathfinding is implemented
  test('TODO: simple path test (currently skipped)', () => {
    // Skip this test for now since pathfinding is not implemented
    // const grid = [
    //   ['S', '1', 'G']
    // ];
    // const result = findPath(grid);
    // Expected: [[0, 0], [0, 1], [0, 2]]
    console.log('Skipping - pathfinding not yet implemented');
  });

  test('TODO: portal test (currently skipped)', () => {
    // Skip this test for now since pathfinding is not implemented
    // const grid = [
    //   ['S', '1', '1', '#'],
    //   ['1', '#', 'A', '1'],
    //   ['2', 'A', '1', 'G']
    // ];
    // const result = findPath(grid);
    // Expected path using portal A
    console.log('Skipping - pathfinding not yet implemented');
  });

  console.log(`\nTest Results: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();