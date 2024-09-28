document.addEventListener('DOMContentLoaded', () => {
    const profilePic = document.getElementById('profile-pic');
    const profileName = document.getElementById('profile-name');
    const profileNameSpan = document.getElementById('profileName'); // Reference to the welcome span
    const dropdownContent = document.getElementById('dropdown-content');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const guildsContainer = document.getElementById('guilds');

    const CLIENT_ID = '1156663455399563289';
    const REDIRECT_URI = 'https://colibribot.github.io/home/';
    const AUTHORIZATION_ENDPOINT = 'https://discord.com/api/oauth2/authorize';
    const RESPONSE_TYPE = 'token';
    const SCOPE = 'identify guilds email';

    const getLoginURL = () => {
        const params = new URLSearchParams({
            client_id: CLIENT_ID,
            redirect_uri: REDIRECT_URI,
            response_type: RESPONSE_TYPE,
            scope: SCOPE
        });
        return `${AUTHORIZATION_ENDPOINT}?${params.toString()}`;
    };

    const handleLogin = () => {
        const url = getLoginURL();
        window.location.href = url;
    };

    const handleLogout = () => {
        localStorage.removeItem('discord_access_token');
        location.reload();
    };

    // Fetch blocked users from a JSON file (e.g., hosted on your website)
    const getBlockedUsers = async () => {
        try {
            const response = await fetch('https://colibribot.github.io/home/api/blocked-users.json'); // Replace with actual URL of the JSON file
            if (response.ok) {
                return response.json();
            } else {
                console.error('Failed to fetch blocked users list:', response.status);
                return { blocked: [] }; // Return an empty list if there is an error
            }
        } catch (error) {
            console.error('Error fetching blocked users:', error);
            return { blocked: [] }; // Handle fetch errors
        }
    };

    const getUserInfo = async (token) => {
        try {
            const response = await fetch('https://discord.com/api/users/@me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.ok) {
                return response.json();
            } else {
                console.error('Failed to fetch user info:', response.status);
                throw new Error('Invalid token');
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
            return null;
        }
    };

    const getUserGuilds = async (token) => {
        try {
            const response = await fetch('https://discord.com/api/users/@me/guilds', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.ok) {
                return response.json();
            } else {
                console.error('Failed to fetch guilds:', response.status);
                throw new Error('Failed to fetch guilds');
            }
        } catch (error) {
            console.error('Error fetching guilds:', error);
            return [];
        }
    };

    const getBotGuilds = async () => {
        try {
            const response = await fetch('https://home-vert-tau.vercel.app/api/bot-guilds'); // Adjust URL if necessary
            if (response.ok) {
                return response.json();
            } else {
                console.error('Failed to fetch bot guilds:', response.status);
                throw new Error('Failed to fetch bot guilds');
            }
        } catch (error) {
            console.error('Error fetching bot guilds:', error);
            return [];
        }
    };

    const displayProfile = (user) => {
        loginBtn.style.display = 'none';
        profilePic.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
        profileName.textContent = user.username;
        profileNameSpan.textContent = user.username; // Display username in welcome span
        profilePic.style.display = 'block';
    };

    const displayGuilds = (guilds) => {
        guildsContainer.innerHTML = ''; // Clear any existing guilds
        console.log('Guilds:', guilds); // Debugging information

        if (guilds.length === 0) {
            guildsContainer.innerHTML = '<p>No common guilds found.</p>';
        }

        guilds.forEach(guild => {
            const guildElement = document.createElement('div');
            guildElement.classList.add('guild');

            const guildIcon = guild.icon ? 
                `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : 
                'default-icon.png'; // Use a default icon if the guild doesn't have one

            guildElement.innerHTML = `
                <img src="${guildIcon}" alt="${guild.name}">
                <p>${guild.name}</p>
            `;
            guildsContainer.appendChild(guildElement);
        });
    };

    loginBtn.addEventListener('click', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);

    const initialize = async () => {
        const params = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = params.get('access_token');

        if (accessToken) {
            localStorage.setItem('discord_access_token', accessToken);
            window.location.hash = '';
        }

        const storedToken = localStorage.getItem('discord_access_token');
        console.log('Stored Token:', storedToken); // Debugging information

        if (storedToken) {
            const user = await getUserInfo(storedToken);
            const blockedUsers = await getBlockedUsers(); // Fetch blocked users from the external JSON file

            if (user) {
                // Check if the user is blocked
                if (blockedUsers.blocked.includes(user.id)) {
                    alert('You are blocked from using this service.');
                    return;
                }

                displayProfile(user);
                const userGuilds = await getUserGuilds(storedToken);
                const botGuilds = await getBotGuilds();
                const commonGuilds = userGuilds.filter(userGuild => botGuilds.some(botGuild => botGuild.id === userGuild.id));
                displayGuilds(commonGuilds);
            } else {
                console.error('User info fetch failed');
                localStorage.removeItem('discord_access_token');
                loginBtn.style.display = 'block';
                profilePic.style.display = 'none';
            }
        } else {
            loginBtn.style.display = 'block';
            profilePic.style.display = 'none';
        }
    };

    initialize();
});
