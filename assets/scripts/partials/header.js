document.addEventListener('DOMContentLoaded', () => {
    const fetchUserInfo = async (token) => {
        try {
            const response = await fetch('https://discord.com/api/v10/users/@me', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                return await response.json();
            } else {
                throw new Error('Failed to fetch user info');
            }
        } catch (error) {
            console.error(error);
            return {};
        }
    };

    const fetchProfileInfo = async () => {
        const token = localStorage.getItem('discord_access_token');
        if (!token) {
            displayLoginButton(); // Show login button if no token
            return;
        }

        const userInfo = await fetchUserInfo(token);
        const navbarProfile = document.getElementById('circuit-navbar-profile');
   		const dropdownMenu = document.getElementById('dropdown-menu');
        const usernameElement = document.getElementById('circuit-dropdown-username');
        const displaynameElement = document.getElementById('circuit-dropdown-displayname');

        // Check if userInfo is empty (indicating invalid token)
        if (!userInfo.id) {
            localStorage.removeItem('discord_access_token'); // Remove invalid token
            displayLoginButton(); // Show login button if token is invalid
            return;
        }

        // Set profile info if token is valid
        navbarProfile.innerHTML = `
            <img src="https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.png" alt="Profile Picture">
            <span class="circuit-username">${userInfo.global_name}</span><span class="circuit-arrow-down" id="circuit-arrow-down">▼</span>`;
        usernameElement.textContent = userInfo.username;
        displaynameElement.textContent = userInfo.global_name;

        const arrow = document.getElementById('circuit-arrow-down');
		
		     const avatarElement = document.getElementById('circuit-dropdown-avatar');
            avatarElement.src = `https://cdn.discordapp.com/avatars/${userInfo.id}/${userInfo.avatar}.png`;

        // Toggle dropdown visibility and profile highlight
        navbarProfile.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent the click from propagating to the document
            dropdownMenu.classList.toggle('show');
            const profile = document.getElementById('circuit-navbar-profile');
            profile.classList.toggle('highlighted');
            arrow.classList.toggle('rotate');
        });

        // Close dropdown when clicking outside of the profile or dropdown
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.circuit-navbar-profile') && !e.target.closest('.dropdown-menu')) {
                dropdownMenu.classList.remove('show');
                const profile = document.getElementById('circuit-navbar-profile');
                profile.classList.remove('highlighted');
                arrow.classList.remove('rotate');
            }
        });

        const logoutButton = document.getElementById('logout-btn');
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('discord_access_token');
            window.location.reload();
        });
    };

    const displayLoginButton = () => {
        const navbarProfile = document.getElementById('circuit-navbar-profile');
        navbarProfile.innerHTML = `
            <button id="login-button" class="circuit-login-button">Login</button>`;
        
        const loginButton = document.getElementById('login-button');
        loginButton.addEventListener('click', () => {
            window.location.href = 'https://api.circuitbot.xyz/oauth';
        });
    };

    fetchProfileInfo();
});
