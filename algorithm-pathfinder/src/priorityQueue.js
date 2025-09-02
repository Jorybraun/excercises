// Priority Queue implementation for pathfinding algorithms
export class PriorityQueue {
  constructor() {
    this.items = [];
  }

  // TODO: Implement efficient priority queue
  // For now, using simple array-based approach
  enqueue(item, priority) {
    const queueElement = { item, priority };
    let added = false;
    
    for (let i = 0; i < this.items.length; i++) {
      if (queueElement.priority < this.items[i].priority) {
        this.items.splice(i, 0, queueElement);
        added = true;
        break;
      }
    }
    
    if (!added) {
      this.items.push(queueElement);
    }
  }

  dequeue() {
    if (this.isEmpty()) return null;
    return this.items.shift().item;
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }
}

// TODO: Optimize with binary heap for better performance
// Current implementation is O(n) for enqueue, should be O(log n)