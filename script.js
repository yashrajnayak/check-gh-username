document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('usernameInput');
    const validateBtn = document.getElementById('validateBtn');
    const validResultsList = document.querySelector('#validResults .results-list');
    const invalidResultsList = document.querySelector('#invalidResults .results-list');
    const progressContainer = document.getElementById('progress');
    const resultsSection = document.getElementById('resultsSection');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(tabId + 'Results').classList.add('active');
        });
    });

    // Copy functionality for active tab only
    document.querySelectorAll('.copy-btn').forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const usernames = Array.from(document.querySelector(`#${targetId} .results-list`).children)
                .map(item => item.querySelector('.username').textContent.trim())
                .join('\n');
            
            navigator.clipboard.writeText(usernames).then(() => {
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = originalText;
                }, 2000);
            });
        });
    });

    validateBtn.addEventListener('click', async () => {
        const usernames = usernameInput.value
            .split(/[,\n]/)
            .map(username => username.trim())
            .filter(username => username.length > 0);

        if (usernames.length === 0) return;

        validateBtn.disabled = true;
        validResultsList.innerHTML = '';
        invalidResultsList.innerHTML = '';
        
        progressContainer.style.display = 'block';
        resultsSection.style.display = 'none';

        for (const username of usernames) {
            try {
                const response = await fetch(`https://api.github.com/users/${username}`);
                const resultItem = document.createElement('div');
                resultItem.className = 'result-item';

                if (response.ok) {
                    const userData = await response.json();
                    resultItem.innerHTML = `
                        <img src="${userData.avatar_url}" alt="${username}'s avatar">
                        <div class="username">${username}</div>
                        <div class="status valid">✓ Valid</div>
                    `;
                    validResultsList.appendChild(resultItem);
                } else {
                    resultItem.innerHTML = `
                        <div class="username">${username}</div>
                        <div class="status invalid">✕ Invalid</div>
                    `;
                    invalidResultsList.appendChild(resultItem);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        progressContainer.style.display = 'none';
        resultsSection.style.display = 'block';
        validateBtn.disabled = false;

        // Switch to the tab that has results
        if (validResultsList.children.length > 0) {
            document.querySelector('[data-tab="valid"]').click();
        } else if (invalidResultsList.children.length > 0) {
            document.querySelector('[data-tab="invalid"]').click();
        }
    });
});