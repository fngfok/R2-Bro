document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const searchButton = document.getElementById('search-button');

    if (searchForm && searchButton) {
        searchForm.addEventListener('submit', () => {
            searchButton.disabled = true;
            searchButton.textContent = 'Searching...';
        });
    }

    // Handle BFCache (Back-Forward Cache) to re-enable button when navigating back
    window.addEventListener('pageshow', (event) => {
        if (event.persisted && searchButton) {
            searchButton.disabled = false;
            searchButton.textContent = 'Search Player';
        }
    });
});
