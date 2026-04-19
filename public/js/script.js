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

    const copyButton = document.getElementById('copy-ally-code');
    const allyCodeSpan = document.getElementById('player-ally-code');

    if (copyButton && allyCodeSpan) {
        copyButton.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(allyCodeSpan.innerText);
                const originalText = copyButton.innerText;
                copyButton.innerText = 'Copied! ✅';
                copyButton.disabled = true;
                setTimeout(() => {
                    copyButton.innerText = originalText;
                    copyButton.disabled = false;
                }, 2000);
            } catch (err) {
                console.error('Failed to copy: ', err);
            }
        });
    }

    console.log('R2 Bro scripts loaded.');
});
