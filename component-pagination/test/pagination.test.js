import { createPaginator, renderControls } from '../src/pagination.js';

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

  // Test basic pagination creation
  test('creates paginator with default values', () => {
    const paginator = createPaginator();
    const state = paginator.getState();
    
    if (state.currentPage !== 1 || state.totalPages !== 1) {
      throw new Error('Default paginator should start at page 1 with 1 total page');
    }
  });

  test('creates paginator with custom values', () => {
    const paginator = createPaginator({
      totalItems: 100,
      itemsPerPage: 10,
      currentPage: 5
    });
    const state = paginator.getState();
    
    if (state.currentPage !== 5 || state.totalPages !== 10 || state.totalItems !== 100) {
      throw new Error('Custom paginator values not set correctly');
    }
  });

  // Test state calculations
  test('calculates correct start and end indices', () => {
    const paginator = createPaginator({
      totalItems: 25,
      itemsPerPage: 10,
      currentPage: 2
    });
    const state = paginator.getState();
    
    if (state.startIndex !== 10 || state.endIndex !== 19) {
      throw new Error(`Expected indices 10-19, got ${state.startIndex}-${state.endIndex}`);
    }
  });

  test('handles boundary conditions correctly', () => {
    const paginator = createPaginator({
      totalItems: 25,
      itemsPerPage: 10,
      currentPage: 3 // Last page with partial items
    });
    const state = paginator.getState();
    
    if (state.startIndex !== 20 || state.endIndex !== 24) {
      throw new Error(`Expected indices 20-24, got ${state.startIndex}-${state.endIndex}`);
    }
    
    if (state.hasNext !== false || state.hasPrevious !== true) {
      throw new Error('Last page should have no next but have previous');
    }
  });

  // Test navigation
  test('navigates to next page', () => {
    const paginator = createPaginator({
      totalItems: 50,
      itemsPerPage: 10,
      currentPage: 2
    });
    
    const state = paginator.nextPage();
    if (state.currentPage !== 3) {
      throw new Error('Next page navigation failed');
    }
  });

  test('navigates to previous page', () => {
    const paginator = createPaginator({
      totalItems: 50,
      itemsPerPage: 10,
      currentPage: 3
    });
    
    const state = paginator.previousPage();
    if (state.currentPage !== 2) {
      throw new Error('Previous page navigation failed');
    }
  });

  test('respects page boundaries', () => {
    const paginator = createPaginator({
      totalItems: 30,
      itemsPerPage: 10,
      currentPage: 1
    });
    
    // Try to go before first page
    const state1 = paginator.previousPage();
    if (state1.currentPage !== 1) {
      throw new Error('Should not go below page 1');
    }
    
    // Go to last page and try to go beyond
    paginator.goToPage(3);
    const state2 = paginator.nextPage();
    if (state2.currentPage !== 3) {
      throw new Error('Should not go beyond last page');
    }
  });

  test('goes to specific page', () => {
    const paginator = createPaginator({
      totalItems: 100,
      itemsPerPage: 10
    });
    
    const state = paginator.goToPage(7);
    if (state.currentPage !== 7) {
      throw new Error('Direct page navigation failed');
    }
  });

  test('goes to first and last page', () => {
    const paginator = createPaginator({
      totalItems: 100,
      itemsPerPage: 10,
      currentPage: 5
    });
    
    const firstState = paginator.firstPage();
    if (firstState.currentPage !== 1) {
      throw new Error('First page navigation failed');
    }
    
    const lastState = paginator.lastPage();
    if (lastState.currentPage !== 10) {
      throw new Error('Last page navigation failed');
    }
  });

  // Test rendering
  test('renders basic controls', () => {
    const paginator = createPaginator({
      totalItems: 50,
      itemsPerPage: 10,
      currentPage: 3
    });
    
    const state = paginator.getState();
    const controls = renderControls(state);
    
    if (!controls.includes('[3]') || !controls.includes('Prev') || !controls.includes('Next')) {
      throw new Error('Rendered controls should show current page and navigation');
    }
  });

  test('renders single page correctly', () => {
    const paginator = createPaginator({
      totalItems: 5,
      itemsPerPage: 10
    });
    
    const state = paginator.getState();
    const controls = renderControls(state);
    
    if (controls !== '[1]') {
      throw new Error(`Single page should render as '[1]', got '${controls}'`);
    }
  });

  // Test edge cases
  test('handles empty dataset', () => {
    const paginator = createPaginator({
      totalItems: 0,
      itemsPerPage: 10
    });
    
    const state = paginator.getState();
    if (state.totalPages !== 1 || state.currentPage !== 1) {
      throw new Error('Empty dataset should still have 1 page');
    }
  });

  test('handles invalid inputs gracefully', () => {
    const paginator = createPaginator({
      totalItems: 50,
      itemsPerPage: 0, // Invalid
      currentPage: -5  // Invalid
    });
    
    const state = paginator.getState();
    if (state.itemsPerPage <= 0 || state.currentPage <= 0) {
      throw new Error('Invalid inputs should be normalized');
    }
  });

  console.log(`\nTest Results: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests();