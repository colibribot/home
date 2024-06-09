document.addEventListener('DOMContentLoaded', () => {
    const profilePic = document.getElementById('profile-pic');
    const dropdownContent = document.getElementById('dropdown-content');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.navb-links');

    profilePic.addEventListener('click', function(event) {
        event.stopPropagation();
        dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
    });

    window.addEventListener('click', function(event) {
        if (!event.target.closest('.profile')) {
            dropdownContent.style.display = 'none';
        }
    });

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Fetch bot information and display it
    fetch('/api/bot-info')
        .then(response => response.json())
        .then(data => {
            const botInfoDiv = document.getElementById('bot-info');
            botInfoDiv.innerHTML = `
                <h2>${data.botName}</h2>
                <img src="${data.botAvatar}" alt="${data.botName}" width="100">
                <p>Guild: ${data.guildName}</p>
                <p>Members: ${data.memberCount}</p>
            `;
        })
        .catch(error => console.error('Error fetching bot info:', error));
});
