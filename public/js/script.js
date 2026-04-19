document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const searchButton = document.getElementById('search-button');

    if (searchForm && searchButton) {
        searchForm.addEventListener('submit', () => {
            searchButton.disabled = true;
            searchButton.dataset.originalText = searchButton.innerText;
            searchButton.innerText = 'Searching... 🤖';
        });
    }

    window.addEventListener('pageshow', (event) => {
        if (event.persisted && searchButton) {
            searchButton.disabled = false;
            if (searchButton.dataset.originalText) {
                searchButton.innerText = searchButton.dataset.originalText;
            }
        }
    });

    console.log('R2 Bro scripts loaded.');
});
