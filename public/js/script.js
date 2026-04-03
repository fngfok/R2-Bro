document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.querySelector('form[action="/player-search"]');
    if (searchForm) {
        searchForm.addEventListener('submit', () => {
            const submitButton = searchForm.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Searching...';
            }
        });
    }
});
