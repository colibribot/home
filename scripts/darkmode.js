document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const storedTheme = localStorage.getItem('theme');
    const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Set the initial theme based on stored preference or system preference
    if (storedTheme === 'dark' || (!storedTheme && systemDarkMode)) {
        document.body.classList.add('dark-mode');
        document.querySelector('.navbar').classList.toggle('dark-mode');
        document.querySelector('.hero-section').classList.add('dark-mode');
        document.querySelector('.about').classList.add('dark-mode');
        document.querySelector('.features-section').classList.add('dark-mode');
        document.querySelector('.cta').classList.add('dark-mode');
        document.querySelectorAll('.navbar-links a').forEach(link => {
            link.classList.add('dark-mode');
        });
    }

    // Toggle dark mode on button click
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        document.querySelector('.navbar').classList.toggle('dark-mode');
        document.querySelector('.hero-section').classList.toggle('dark-mode');
        document.querySelector('.about').classList.toggle('dark-mode');
        document.querySelector('.features-section').classList.toggle('dark-mode');
        document.querySelector('.cta').classList.toggle('dark-mode');
        document.querySelectorAll('.navbar-links a').forEach(link => {
            link.classList.toggle('dark-mode');
        });

        // Save user preference in localStorage
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }
    });
});
