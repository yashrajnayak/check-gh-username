document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('usernameInput');
    const validateBtn = document.getElementById('validateBtn');
    const validResultsList = document.querySelector('#validResults .results-list');
    const invalidResultsList = document.querySelector('#invalidResults .results-list');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    const copyButtons = document.querySelectorAll('.copy-btn');

    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Update active states
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(tabId + 'Results').classList.add('active');
        });
    });

    // Copy functionality
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const textToCopy = Array.from(document.querySelector(`#${targetId} .results-list`).children)
                .map(item => item.querySelector('.username').textContent)
                .join('\n');
            
            navigator.clipboard.writeText(textToCopy).then(() => {
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

        for (const username of usernames) {
            try {
                const response = await fetch(`https://api.github.com/users/${username}`);
                const resultItem = document.createElement('div');
                resultItem.className = 'result-item';

                if (response.ok) {
                    const userData = await response.json();
                    resultItem.classList.add('valid');
                    resultItem.innerHTML = `
                        <img src="${userData.avatar_url}" alt="${username}'s avatar">
                        <div class="result-info">
                            <div class="username">${username}</div>
                            <div class="status valid">✓ Valid username</div>
                        </div>
                    `;
                    validResultsList.appendChild(resultItem);
                } else {
                    resultItem.classList.add('invalid');
                    resultItem.innerHTML = `
                        <div class="result-info">
                            <div class="username">${username}</div>
                            <div class="status invalid">✕ Invalid username</div>
                        </div>
                    `;
                    invalidResultsList.appendChild(resultItem);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }

        validateBtn.disabled = false;
    });
});