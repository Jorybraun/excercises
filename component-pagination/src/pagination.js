/**
 * Create a pagination component with state management and navigation controls
 * @param {Object} options - Configuration options
 * @param {number} options.totalItems - Total number of items
 * @param {number} options.itemsPerPage - Items to display per page
 * @param {number} options.currentPage - Initial current page (1-based)
 * @returns {Object} Paginator instance with navigation methods
 */
export function createPaginator({ totalItems = 0, itemsPerPage = 10, currentPage = 1 } = {}) {
  // Validate inputs
  const safeItemsPerPage = Math.max(1, Math.floor(itemsPerPage));
  const totalPages = Math.max(1, Math.ceil(totalItems / safeItemsPerPage));
  let currentPageState = Math.max(1, Math.min(currentPage, totalPages));

  function getState() {
    const hasNext = currentPageState < totalPages;
    const hasPrevious = currentPageState > 1;
    const startIndex = (currentPageState - 1) * safeItemsPerPage;
    const endIndex = Math.min(startIndex + safeItemsPerPage - 1, totalItems - 1);

    return {
      currentPage: currentPageState,
      totalPages,
      totalItems,
      itemsPerPage: safeItemsPerPage,
      hasNext,
      hasPrevious,
      startIndex: totalItems > 0 ? startIndex : 0,
      endIndex: totalItems > 0 ? endIndex : -1
    };
  }

  function goToPage(pageNumber) {
    const targetPage = Math.max(1, Math.min(pageNumber, totalPages));
    currentPageState = targetPage;
    return getState();
  }

  function nextPage() {
    if (currentPageState < totalPages) {
      currentPageState++;
    }
    return getState();
  }

  function previousPage() {
    if (currentPageState > 1) {
      currentPageState--;
    }
    return getState();
  }

  function firstPage() {
    currentPageState = 1;
    return getState();
  }

  function lastPage() {
    currentPageState = totalPages;
    return getState();
  }

  return {
    getState,
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage
  };
}

/**
 * Render basic text-based pagination controls
 * @param {Object} state - Current pagination state
 * @param {Object} options - Rendering options
 * @returns {string} Text representation of pagination controls
 */
export function renderControls(state, options = {}) {
  const { maxVisiblePages = 10, showFirstLast = true } = options;
  
  if (state.totalPages <= 1) {
    return '[1]';
  }

  let parts = [];

  // First/Previous controls
  if (showFirstLast && state.hasPrevious) {
    parts.push('◀ First');
  }
  if (state.hasPrevious) {
    parts.push('← Prev');
  }

  // Page numbers
  const startPage = Math.max(1, state.currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(state.totalPages, startPage + maxVisiblePages - 1);
  
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    if (i === state.currentPage) {
      pageNumbers.push(`[${i}]`);
    } else {
      pageNumbers.push(i.toString());
    }
  }
  parts.push(pageNumbers.join(' '));

  // Next/Last controls
  if (state.hasNext) {
    parts.push('Next →');
  }
  if (showFirstLast && state.hasNext) {
    parts.push('Last ▶');
  }

  return parts.join(' | ');
}

// TODO: Add support for custom templates and styling
// TODO: Implement keyboard navigation handlers
// TODO: Add URL synchronization utilities