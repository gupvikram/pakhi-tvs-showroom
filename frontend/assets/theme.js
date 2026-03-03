// theme.js - Global Dark Mode Toggle System
(function () {
    const THEME_KEY = 'pakhitvs_theme';
    let currentTheme = localStorage.getItem(THEME_KEY) || 'light';

    // Apply on load instantly
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }

    applyTheme(currentTheme);

    // Expose toggle globally
    window.toggleTheme = function () {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem(THEME_KEY, currentTheme);
        applyTheme(currentTheme);
        renderThemeBtn();
    };

    // Inject floating button when DOM is ready
    function renderThemeBtn() {
        let btn = document.getElementById('theme-toggle-btn');
        if (!btn) {
            btn = document.createElement('button');
            btn.id = 'theme-toggle-btn';
            btn.className = 'theme-toggle-btn';
            btn.onclick = window.toggleTheme;
            document.body.appendChild(btn);
        }
        btn.innerHTML = currentTheme === 'light' ? '🌙' : '☀️';
        btn.title = currentTheme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode';
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderThemeBtn);
    } else {
        renderThemeBtn();
    }
})();
