document.addEventListener('DOMContentLoaded', () => {

    // get both desktop and mobile toggles from HTML
    const toggles = [
        document.getElementById('themeToggle'),
        document.getElementById('mobileThemeToggle')
    ];

    // get theme from localStorage. If there is nothing saved, it will be light
    const savedTheme = localStorage.getItem('theme') || 'light';

    function applyTheme(theme) {
        // if it is already dark, it will remove the class
        document.body.classList.toggle('dark-mode', theme === 'dark');
        localStorage.setItem('theme', theme);
        updateArrowIcons(theme);
        // if the theme is dark it will check the toggles
        toggles.forEach(toggle => {
            toggle.checked = theme === 'dark';
        });
    }

    // Updates arrow sources as there are two different color images
    function updateArrowIcons(theme) {
        document.querySelectorAll('.theme-arrow').forEach(img => {
            img.src = theme === 'dark'
                ? '/images/arrow-up-right-light.svg'
                : '/images/arrow-up-right.svg';
        });
    }

    // applies saved theme on a page load
    applyTheme(savedTheme);

    // Toggle function
    window.toggleTheme = () => {
        const current = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
    };
});