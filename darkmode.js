document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-icon');
    const userThemePreference = localStorage.getItem('theme');
    const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Set initial theme based on user or system preference
    if (userThemePreference === 'dark' || (!userThemePreference && systemDarkMode)) {
        document.body.classList.add('dark-mode');
        themeToggleBtn.textContent = 'brightness_7'; // Sun icon
    } else {
        document.body.classList.remove('dark-mode');
        themeToggleBtn.textContent = 'brightness_4'; // Moon icon
    }

    // Toggle dark mode on button click
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            themeToggleBtn.textContent = 'brightness_7'; // Sun icon
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggleBtn.textContent = 'brightness_4'; // Moon icon
            localStorage.setItem('theme', 'light');
        }
    });
});
