# Algorithm: Pathfinder with Portals

## Overview
Implement a pathfinding algorithm that navigates through a 2D grid with weighted terrain and portal teleportation.

## Problem Description
You need to find the shortest path from start ('S') to goal ('G') in a grid that contains:
- **Walls** (`#`): Impassable terrain
- **Weighted terrain** (`1-9`): Numbers represent movement cost
- **Portals** (`A-Z`): Letters represent bidirectional teleportation points

## Grid Legend
- `S` - Start position
- `G` - Goal position  
- `#` - Wall (impassable)
- `1-9` - Terrain with movement cost
- `A-Z` - Portal pairs (A connects to A, B to B, etc.)

## Example
```
S 1 1 #
1 # A 1  
2 A 1 G
```

Shortest path: S → (2,1) via portal A → (1,2) → G
Cost: 0 + 2 + 0 + 1 + 1 = 4

## Implementation Notes
- Use Dijkstra's algorithm or A* for optimal pathfinding
- Portal teleportation has zero cost
- Return path as array of [row, col] coordinates
- Handle edge cases: no path exists, start equals goal

## Files
- `src/pathfinder.js` - Main implementation
- `src/priorityQueue.js` - Priority queue utility
- `test/pathfinder.test.js` - Test cases

## Testing
```bash
npm test
```

## Tips
- Build a graph representation of the grid
- Track portal locations during grid parsing
- Use a priority queue for efficient shortest path calculation
- Consider all possible moves including portal teleportation