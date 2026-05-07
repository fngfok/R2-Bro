document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const searchButton = document.getElementById('search-button');
    const allyCodeInput = document.getElementById('allyCode');
    const charCounter = document.getElementById('allyCode-counter');

    if (allyCodeInput && charCounter) {
        const updateCounter = () => {
            const digits = allyCodeInput.value.replace(/\D/g, '').length;
            charCounter.innerText = `${digits} / 9 digits`;
            if (digits === 9) {
                charCounter.classList.add('valid');
            } else {
                charCounter.classList.remove('valid');
            }
        };

        allyCodeInput.addEventListener('input', updateCounter);
        // Initialize on load in case of browser autofill
        updateCounter();
    }

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
                const textToCopy = allyCodeSpan.dataset.rawAllyCode || allyCodeSpan.innerText;
                await navigator.clipboard.writeText(textToCopy);
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
