document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('search-form');
  const searchButton = document.getElementById('search-button');

  if (searchForm && searchButton) {
    searchForm.addEventListener('submit', () => {
      // Store original text to restore on BFCache navigation
      searchButton.dataset.originalText = searchButton.textContent;
      searchButton.disabled = true;
      searchButton.textContent = 'Searching...';
    });
  }
});

// Handle BFCache (Back-Forward Cache) navigation
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    const searchButton = document.getElementById('search-button');
    if (searchButton && searchButton.dataset.originalText) {
      searchButton.disabled = false;
      searchButton.textContent = searchButton.dataset.originalText;
    }
  }
});
