document.addEventListener('DOMContentLoaded', () => {
    console.log('R2 Bro scripts loaded.');

    const searchForm = document.getElementById('search-form');
    const searchButton = document.getElementById('search-button');

    if (searchForm && searchButton) {
        searchForm.addEventListener('submit', () => {
            searchButton.disabled = true;
            searchButton.textContent = 'Searching...';
            searchButton.style.opacity = '0.7';
            searchButton.style.cursor = 'not-allowed';
        });
    }
});
