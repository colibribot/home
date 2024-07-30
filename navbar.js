document.addEventListener('DOMContentLoaded', () => {
    const profilePic = document.querySelector('.profile-pic');
    const profileDropdown = document.querySelector('.profile-dropdown');
    const hamburger = document.querySelector('.hamburger');
    const navbarLinks = document.querySelector('.navbar-links');

    profilePic.addEventListener('click', () => {
        profileDropdown.style.display = profileDropdown.style.display === 'block' ? 'none' : 'block';
    });

    window.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar-profile')) {
            profileDropdown.style.display = 'none';
        }
    });

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navbarLinks.classList.toggle('open');
    });
});
