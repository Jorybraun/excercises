// Performance benchmarking script

import * as naive from './naive.js';
import * as optimized from './optimized.js';
import { testDatasets } from './data.js';

function benchmark(name, naiveFunc, optimizedFunc, ...args) {
  console.log(`\n=== ${name} ===`);
  
  // Warm up
  naiveFunc(...args);
  optimizedFunc(...args);
  
  // Benchmark naive implementation
  const naiveStart = performance.now();
  const naiveResult = naiveFunc(...args);
  const naiveEnd = performance.now();
  const naiveTime = naiveEnd - naiveStart;
  
  // Benchmark optimized implementation
  const optimizedStart = performance.now();
  const optimizedResult = optimizedFunc(...args);
  const optimizedEnd = performance.now();
  const optimizedTime = optimizedEnd - optimizedStart;
  
  // Calculate improvement
  const improvement = naiveTime / optimizedTime;
  const percentage = ((naiveTime - optimizedTime) / naiveTime * 100).toFixed(1);
  
  console.log(`Naive:     ${naiveTime.toFixed(2)}ms (${naiveResult.length} results)`);
  console.log(`Optimized: ${optimizedTime.toFixed(2)}ms (${optimizedResult.length} results)`);
  console.log(`Improvement: ${improvement.toFixed(2)}x faster (${percentage}% reduction)`);
  
  // Verify correctness (basic check)
  if (naiveResult.length !== optimizedResult.length) {
    console.log(`⚠️  WARNING: Result count mismatch! Naive: ${naiveResult.length}, Optimized: ${optimizedResult.length}`);
  }
  
  return {
    naiveTime,
    optimizedTime,
    improvement,
    resultCount: naiveResult.length
  };
}

function runBenchmarks() {
  console.log('Database Query Optimizer Benchmarks');
  console.log('====================================');
  
  const results = {};
  
  // Test with different dataset sizes
  for (const [size, { users, orders }] of Object.entries(testDatasets)) {
    console.log(`\n🔍 Dataset: ${size} (${users.length} users, ${orders.length} orders)`);
    
    results[size] = {};
    
    // Filter benchmarks
    results[size].filterAge = benchmark(
      'Filter Users by Age >= 40',
      naive.filterUsers,
      optimized.filterUsers,
      users,
      { age: { $gte: 40 } }
    );
    
    results[size].filterCity = benchmark(
      'Filter Users by City',
      naive.filterUsers,
      optimized.filterUsers,
      users,
      { city: 'NYC' }
    );
    
    // Sort benchmarks
    results[size].sortAge = benchmark(
      'Sort Users by Age',
      naive.sortUsers,
      optimized.sortUsers,
      users,
      [{ field: 'age', order: 'asc' }]
    );
    
    results[size].sortMultiple = benchmark(
      'Sort Users by Age then Name',
      naive.sortUsers,
      optimized.sortUsers,
      users,
      [{ field: 'age', order: 'asc' }, { field: 'name', order: 'asc' }]
    );
    
    // Join benchmarks
    results[size].join = benchmark(
      'Join Users with Orders',
      naive.joinUsersOrders,
      optimized.joinUsersOrders,
      users,
      orders,
      'id',
      'userId'
    );
    
    // Aggregation benchmarks
    results[size].aggregate = benchmark(
      'Aggregate Orders by User',
      naive.aggregateOrders,
      optimized.aggregateOrders,
      orders,
      { groupBy: 'userId', sum: 'amount' }
    );
    
    // Lookup benchmarks
    const middleUserId = Math.floor(users.length / 2);
    results[size].findById = benchmark(
      'Find User by ID',
      naive.findUserById,
      optimized.findUserById,
      users,
      middleUserId
    );
    
    // Unique values benchmark
    results[size].unique = benchmark(
      'Get Unique Cities',
      naive.getUniqueValues,
      optimized.getUniqueValues,
      users,
      'city'
    );
  }
  
  // Summary
  console.log('\n📊 Performance Summary');
  console.log('=====================');
  
  for (const [size, sizeResults] of Object.entries(results)) {
    console.log(`\n${size.toUpperCase()} Dataset:`);
    
    let totalImprovement = 0;
    let count = 0;
    
    for (const [operation, result] of Object.entries(sizeResults)) {
      console.log(`  ${operation}: ${result.improvement.toFixed(2)}x improvement`);
      totalImprovement += result.improvement;
      count++;
    }
    
    const avgImprovement = totalImprovement / count;
    console.log(`  Average: ${avgImprovement.toFixed(2)}x improvement`);
    
    // Performance targets
    let target;
    switch (size) {
      case 'small': target = 2; break;
      case 'medium': target = 5; break;
      case 'large': target = 10; break;
    }
    
    const status = avgImprovement >= target ? '✅' : '❌';
    console.log(`  Target: ${target}x - ${status} ${avgImprovement >= target ? 'ACHIEVED' : 'NOT MET'}`);
  }
  
  console.log('\n🎯 Optimization Tips:');
  console.log('- Use Map/Set data structures for faster lookups');
  console.log('- Build indexes on frequently queried fields'); 
  console.log('- Implement hash joins for better join performance');
  console.log('- Use single-pass algorithms where possible');
  console.log('- Consider memory vs. speed tradeoffs');
}

runBenchmarks();