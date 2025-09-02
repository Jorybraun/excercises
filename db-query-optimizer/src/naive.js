// Naive implementations - DO NOT MODIFY
// These serve as baseline for performance comparison

export function filterUsers(users, conditions) {
  return users.filter(user => {
    for (const [field, condition] of Object.entries(conditions)) {
      const userValue = user[field];
      
      if (typeof condition === 'object' && condition !== null) {
        // Handle operators like $gte, $lt, etc.
        for (const [op, value] of Object.entries(condition)) {
          switch (op) {
            case '$gte':
              if (userValue < value) return false;
              break;
            case '$lte':
              if (userValue > value) return false;
              break;
            case '$gt':
              if (userValue <= value) return false;
              break;
            case '$lt':
              if (userValue >= value) return false;
              break;
            case '$eq':
              if (userValue !== value) return false;
              break;
            case '$ne':
              if (userValue === value) return false;
              break;
          }
        }
      } else {
        // Direct equality check
        if (userValue !== condition) return false;
      }
    }
    return true;
  });
}

export function sortUsers(users, sortFields) {
  // Naive implementation using multiple passes
  let result = [...users];
  
  // Sort by each field in reverse order (least important first)
  for (let i = sortFields.length - 1; i >= 0; i--) {
    const { field, order = 'asc' } = sortFields[i];
    
    result = result.sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];
      
      let comparison = 0;
      if (aVal < bVal) comparison = -1;
      else if (aVal > bVal) comparison = 1;
      
      return order === 'desc' ? -comparison : comparison;
    });
  }
  
  return result;
}

export function joinUsersOrders(users, orders, userKey, orderKey) {
  const result = [];
  
  // Nested loop join (O(n*m) complexity)
  for (const user of users) {
    const userOrders = [];
    for (const order of orders) {
      if (user[userKey] === order[orderKey]) {
        userOrders.push(order);
      }
    }
    
    result.push({
      ...user,
      orders: userOrders,
      totalAmount: userOrders.reduce((sum, order) => sum + order.amount, 0)
    });
  }
  
  return result;
}

export function aggregateOrders(orders, { groupBy, sum: sumField }) {
  const groups = {};
  
  // Naive grouping - scan all records for each group
  for (const order of orders) {
    const groupKey = order[groupBy];
    
    if (!groups[groupKey]) {
      groups[groupKey] = {
        [groupBy]: groupKey,
        count: 0,
        [sumField]: 0
      };
    }
    
    groups[groupKey].count++;
    groups[groupKey][sumField] += order[sumField];
  }
  
  return Object.values(groups);
}

// Additional naive operations
export function findUserById(users, id) {
  // Linear search O(n)
  for (const user of users) {
    if (user.id === id) {
      return user;
    }
  }
  return null;
}

export function getUniqueValues(records, field) {
  // Naive approach with nested loops
  const unique = [];
  for (const record of records) {
    const value = record[field];
    let found = false;
    for (const existing of unique) {
      if (existing === value) {
        found = true;
        break;
      }
    }
    if (!found) {
      unique.push(value);
    }
  }
  return unique;
}