document.addEventListener('DOMContentLoaded', () => {
    const checkbox = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme');

    // This function changes arrow colors
    function updateArrowIcons(theme) {
        const arrows = document.querySelectorAll('.theme-arrow');
        arrows.forEach(img => {
            img.src = theme === 'dark'
                ?  '/images/arrow-up-right-light.svg'
                :  '/images/arrow-up-right.svg';
        });
    }

    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        checkbox.checked = true;
        updateArrowIcons('dark');
    } else {
        checkbox.checked = false;
        updateArrowIcons('light');
    }

    window.toggleTheme = function () {
        const isDark = checkbox.checked;
        document.body.classList.toggle('dark-mode', isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateArrowIcons(isDark ? 'dark' : 'light');
    };
});