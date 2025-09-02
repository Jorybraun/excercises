import { PriorityQueue } from './priorityQueue.js';

/**
 * Find the shortest path from start to goal in a 2D grid with weighted terrain and portals
 * @param {string[][]} grid - 2D array representing the grid
 * @returns {number[][]} Array of [row, col] coordinates representing the shortest path
 */
export function findPath(grid) {
  // TODO: Implement Dijkstra's algorithm with portal support
  
  if (!grid || grid.length === 0 || grid[0].length === 0) {
    return [];
  }

  const rows = grid.length;
  const cols = grid[0].length;
  
  // Find start and goal positions
  let start = null;
  let goal = null;
  const portals = new Map(); // Map portal letters to their positions
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const cell = grid[row][col];
      if (cell === 'S') {
        start = [row, col];
      } else if (cell === 'G') {
        goal = [row, col];
      } else if (cell.match(/[A-Z]/)) {
        // Portal detected
        if (!portals.has(cell)) {
          portals.set(cell, []);
        }
        portals.get(cell).push([row, col]);
      }
    }
  }
  
  if (!start || !goal) {
    return []; // No valid start or goal found
  }
  
  // TODO: Implement Dijkstra's algorithm
  // 1. Initialize distances and previous nodes
  // 2. Use priority queue for efficient node selection
  // 3. Handle regular movement (up, down, left, right)
  // 4. Handle portal teleportation (zero cost)
  // 5. Reconstruct path from goal to start
  
  // For now, return empty path - this should be implemented
  console.warn('findPath not yet implemented - please implement Dijkstra\'s algorithm');
  return [];
}

// Helper function to get movement cost for a cell
function getMovementCost(cell) {
  if (cell === '#') return Infinity; // Wall
  if (cell === 'S' || cell === 'G') return 1;
  if (cell.match(/[A-Z]/)) return 1; // Portal
  if (cell.match(/[1-9]/)) return parseInt(cell);
  return 1; // Default cost
}

// Helper function to get valid neighbors
function getNeighbors(row, col, rows, cols) {
  const neighbors = [];
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]; // up, down, left, right
  
  for (const [dr, dc] of directions) {
    const newRow = row + dr;
    const newCol = col + dc;
    if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
      neighbors.push([newRow, newCol]);
    }
  }
  
  return neighbors;
}