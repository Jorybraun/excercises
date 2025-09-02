// Concurrent request limiter
export class ConcurrencyLimiter {
  constructor(maxConcurrent = 5) {
    this.maxConcurrent = maxConcurrent;
    this.running = new Set();
    this.queue = [];
  }

  async execute(asyncFn) {
    return new Promise((resolve, reject) => {
      const task = { asyncFn, resolve, reject };
      
      if (this.running.size < this.maxConcurrent) {
        this.runTask(task);
      } else {
        this.queue.push(task);
      }
    });
  }

  async runTask(task) {
    const { asyncFn, resolve, reject } = task;
    const taskId = Symbol('task');
    
    this.running.add(taskId);
    
    try {
      const result = await asyncFn();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.running.delete(taskId);
      this.processQueue();
    }
  }

  processQueue() {
    if (this.queue.length > 0 && this.running.size < this.maxConcurrent) {
      const nextTask = this.queue.shift();
      this.runTask(nextTask);
    }
  }

  get activeCount() {
    return this.running.size;
  }

  get queuedCount() {
    return this.queue.length;
  }
}

// TODO: Add priority queue support for different task priorities
// TODO: Implement timeout handling for long-running tasks