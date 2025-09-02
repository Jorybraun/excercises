// Test data generation utilities

export function generateUsers(count) {
  const cities = ['NYC', 'SF', 'LA', 'Chicago', 'Austin', 'Seattle', 'Boston'];
  const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'];
  const firstNames = ['Alice', 'Bob', 'Carol', 'David', 'Eve', 'Frank', 'Grace', 'Henry'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller'];
  
  const users = [];
  
  for (let i = 1; i <= count; i++) {
    users.push({
      id: i,
      name: `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`,
      age: 22 + (i % 43), // Ages 22-64
      city: cities[i % cities.length],
      department: departments[i % departments.length]
    });
  }
  
  return users;
}

export function generateOrders(userCount, ordersPerUser = 3) {
  const statuses = ['pending', 'completed', 'cancelled', 'refunded'];
  const orders = [];
  let orderId = 1;
  
  for (let userId = 1; userId <= userCount; userId++) {
    const numOrders = Math.floor(Math.random() * ordersPerUser) + 1;
    
    for (let j = 0; j < numOrders; j++) {
      orders.push({
        id: orderId++,
        userId: userId,
        amount: Math.floor(Math.random() * 1000) + 10, // $10-$1010
        date: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
        status: statuses[Math.floor(Math.random() * statuses.length)]
      });
    }
  }
  
  return orders;
}

export function generateTestData(userCount = 1000) {
  const users = generateUsers(userCount);
  const orders = generateOrders(userCount);
  
  return { users, orders };
}

// Predefined test datasets for consistent benchmarking
export const testDatasets = {
  small: generateTestData(100),
  medium: generateTestData(5000),
  large: generateTestData(20000)
};

// Helper to create custom test queries
export function createTestQueries(users, orders) {
  return {
    // Filter queries
    filterOldUsers: () => users.filter(u => u.age >= 50),
    filterByCity: (city) => users.filter(u => u.city === city),
    filterAgeRange: (min, max) => users.filter(u => u.age >= min && u.age <= max),
    
    // Sort queries
    sortByAge: () => [...users].sort((a, b) => a.age - b.age),
    sortByNameAndAge: () => [...users].sort((a, b) => {
      const nameCompare = a.name.localeCompare(b.name);
      return nameCompare === 0 ? a.age - b.age : nameCompare;
    }),
    
    // Join queries
    usersWithOrders: () => {
      const result = [];
      const ordersByUser = {};
      
      // Group orders by userId
      for (const order of orders) {
        if (!ordersByUser[order.userId]) {
          ordersByUser[order.userId] = [];
        }
        ordersByUser[order.userId].push(order);
      }
      
      // Join with users
      for (const user of users) {
        result.push({
          ...user,
          orders: ordersByUser[user.id] || [],
          totalAmount: (ordersByUser[user.id] || []).reduce((sum, o) => sum + o.amount, 0)
        });
      }
      
      return result;
    },
    
    // Aggregation queries
    ordersByCity: () => {
      const groups = {};
      
      for (const user of users) {
        if (!groups[user.city]) {
          groups[user.city] = { city: user.city, userCount: 0, orders: [] };
        }
        groups[user.city].userCount++;
      }
      
      for (const order of orders) {
        const user = users.find(u => u.id === order.userId);
        if (user && groups[user.city]) {
          groups[user.city].orders.push(order);
        }
      }
      
      return Object.values(groups).map(g => ({
        ...g,
        orderCount: g.orders.length,
        totalAmount: g.orders.reduce((sum, o) => sum + o.amount, 0)
      }));
    }
  };
}