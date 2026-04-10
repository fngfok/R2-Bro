document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const searchButton = document.getElementById('search-button');

    if (searchForm && searchButton) {
        searchForm.addEventListener('submit', () => {
            searchButton.disabled = true;
            searchButton.innerText = 'Searching...';
        });
    }

    // Re-enable button on BFCache navigation
    window.addEventListener('pageshow', (event) => {
        if (event.persisted && searchButton) {
            searchButton.disabled = false;
            searchButton.innerText = 'Search Player';
        }
    });
});
