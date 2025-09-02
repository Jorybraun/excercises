# Database: Query Optimizer

## Overview
Optimize database query performance by improving algorithms for filtering, sorting, and joining operations on large in-memory datasets.

## Problem Description
You are given a naive implementation of common database operations that work correctly but perform poorly on large datasets. Your task is to optimize these operations while maintaining correctness.

## Operations to Optimize

### 1. Filtering
```javascript
// Find all users over 25 in NYC
filterUsers(users, { age: { $gte: 25 }, city: 'NYC' })
```

### 2. Sorting  
```javascript
// Sort users by age, then by name
sortUsers(users, [{ field: 'age', order: 'asc' }, { field: 'name', order: 'asc' }])
```

### 3. Joining
```javascript
// Join users with their orders and calculate total amount
joinUsersOrders(users, orders, 'id', 'userId')
```

### 4. Aggregation
```javascript
// Group orders by userId and sum amounts
aggregateOrders(orders, { groupBy: 'userId', sum: 'amount' })
```

## Performance Targets
- **Small datasets** (< 1,000 records): 2x improvement
- **Medium datasets** (1,000 - 10,000 records): 5x improvement  
- **Large datasets** (10,000+ records): 10x improvement

## Files Structure
- `src/naive.js` - Original inefficient implementation (DO NOT MODIFY)
- `src/optimized.js` - Your optimized implementation
- `src/data.js` - Test data generator
- `src/bench.js` - Performance benchmarking script
- `test/optimizer.test.js` - Correctness tests

## Data Schema
```javascript
// Users table
{
  id: number,
  name: string,
  age: number,
  city: string,
  department: string
}

// Orders table  
{
  id: number,
  userId: number,
  amount: number,
  date: string,
  status: string
}
```

## Running Benchmarks
```bash
npm run bench
```

This will compare your optimized implementation against the naive version and show performance improvements.

## Testing
```bash
npm test
```

## Optimization Strategies
1. **Indexing**: Pre-build indexes on commonly queried fields
2. **Hash Maps**: Use hash maps for O(1) lookups instead of O(n) scans
3. **Sorting**: Implement efficient sorting algorithms (QuickSort, MergeSort)
4. **Memory Management**: Avoid unnecessary object creation and copying
5. **Early Termination**: Stop processing when possible (e.g., LIMIT clauses)

## Evaluation
Your implementation will be evaluated on:
- **Correctness**: Results must match the naive implementation exactly
- **Performance**: Significant improvement on benchmark tests
- **Code Quality**: Clean, readable, and maintainable code
- **Memory Efficiency**: Reasonable memory usage patterns