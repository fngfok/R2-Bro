document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const searchButton = document.getElementById('search-button');

    if (searchForm && searchButton) {
        searchForm.addEventListener('submit', () => {
            // Store original text if not already stored
            if (!searchButton.dataset.originalText) {
                searchButton.dataset.originalText = searchButton.textContent;
            }

            searchButton.disabled = true;
            searchButton.textContent = 'Searching...';
        });
    }

    // Re-enable button on BFCache navigation
    window.addEventListener('pageshow', (event) => {
        if (event.persisted && searchButton) {
            searchButton.disabled = false;
            if (searchButton.dataset.originalText) {
                searchButton.textContent = searchButton.dataset.originalText;
            }
        }
    });
});
