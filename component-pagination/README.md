# Component: Pagination

## Overview
Build a reusable pagination component that manages state and provides navigation controls for paginated data.

## Problem Description
Create a pagination component that can handle large datasets by breaking them into manageable pages. The component should provide intuitive navigation and maintain consistent state.

## Core Features
- **State Management**: Track current page, total items, and items per page
- **Navigation Controls**: First, previous, next, last page navigation  
- **Boundary Handling**: Disable controls appropriately at first/last pages
- **Direct Navigation**: Jump to specific page numbers
- **Flexible Display**: Support different items per page configurations

## API Design

### createPaginator(options)
Creates a paginator instance with the specified configuration.

```javascript
const paginator = createPaginator({
  totalItems: 150,
  itemsPerPage: 10,
  currentPage: 1
});
```

### Paginator State
```javascript
{
  currentPage: 3,
  totalPages: 15,
  totalItems: 150,
  itemsPerPage: 10,
  hasNext: true,
  hasPrevious: true,
  startIndex: 20,  // 0-based index of first item on current page
  endIndex: 29     // 0-based index of last item on current page
}
```

### Navigation Methods
- `goToPage(pageNumber)` - Navigate to specific page
- `nextPage()` - Go to next page (if available)
- `previousPage()` - Go to previous page (if available)
- `firstPage()` - Go to first page
- `lastPage()` - Go to last page

## Files
- `src/pagination.js` - Main pagination logic
- `test/pagination.test.js` - Test suite

## Usage Example
```javascript
import { createPaginator, renderControls } from './src/pagination.js';

const paginator = createPaginator({ totalItems: 100, itemsPerPage: 10 });
console.log(renderControls(paginator.getState()));
// Output: "◀ First | ← Prev | [1] 2 3 4 5 6 7 8 9 10 | Next → | Last ▶"

paginator.nextPage();
console.log(renderControls(paginator.getState()));  
// Output: "◀ First | ← Prev | 1 [2] 3 4 5 6 7 8 9 10 | Next → | Last ▶"
```

## Testing
```bash
npm test
```

## Implementation Notes
- Handle edge cases gracefully (empty datasets, invalid pages)
- Ensure state immutability for predictable behavior
- Consider performance implications for large datasets
- Make the component framework-agnostic