document.addEventListener('DOMContentLoaded', () => {
    const profilePic = document.getElementById('profile-pic');
    const profileName = document.getElementById('profile-name');
    const profileNameSpan = document.getElementById('profileName');
    const dropdownContent = document.getElementById('dropdown-content');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const guildsContainer = document.getElementById('guilds');
    const commonGuildsContainer = document.getElementById('common-guilds');

    const CLIENT_ID = '1156663455399563289';
    const REDIRECT_URI = 'https://colibribot.github.io/home/';
    const AUTHORIZATION_ENDPOINT = 'https://discord.com/api/oauth2/authorize';
    const RESPONSE_TYPE = 'token';
    const SCOPE = 'identify guilds gdm.join guilds.join email connections';

    // Get login URL
    const getLoginURL = () => {
        const params = new URLSearchParams({
            client_id: CLIENT_ID,
            redirect_uri: REDIRECT_URI,
            response_type: RESPONSE_TYPE,
            scope: SCOPE
        });
        return `${AUTHORIZATION_ENDPOINT}?${params.toString()}`;
    };

    // Login
    const handleLogin = () => {
        const url = getLoginURL();
        window.location.href = url;
    };

    // Logout
    const handleLogout = () => {
        localStorage.removeItem('discord_access_token');
        location.reload();
    };

    // Fetch bot guilds from the API (hosted on your server)
    const getBotGuilds = async () => {
        const accessToken = localStorage.getItem('discord_access_token');
        if (!accessToken) {
            console.error('No access token found');
            return [];
        }

        try {
            const response = await fetch('https://home-vert-tau.vercel.app/api/bot-guilds.js', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

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

    // Fetch user info from Discord
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

    // Fetch user's guilds
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

    // Display profile info
    const displayProfile = (user) => {
        loginBtn.style.display = 'none';
        profilePic.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
        profileName.textContent = user.username;
        profileNameSpan.textContent = user.username;
        profilePic.style.display = 'block';
    };

    // Display all user's guilds
    const displayAllGuilds = (userGuilds) => {
        guildsContainer.innerHTML = '';
        if (userGuilds.length === 0) {
            guildsContainer.innerHTML = '<p>No guilds found.</p>';
            return;
        }

        userGuilds.forEach(guild => {
            const guildElement = document.createElement('div');
            guildElement.classList.add('guild');
            const guildIcon = guild.icon ?
                `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` :
                'default-icon.png';
            guildElement.innerHTML = `<img src="${guildIcon}" alt="${guild.name}"><p>${guild.name}</p>`;
            guildsContainer.appendChild(guildElement);
        });
    };

    // Display common guilds
    const displayCommonGuilds = (commonGuilds) => {
        commonGuildsContainer.innerHTML = '';
        if (commonGuilds.length === 0) {
            commonGuildsContainer.innerHTML = '<p>No common guilds with the bot found.</p>';
            return;
        }

        commonGuilds.forEach(guild => {
            const guildElement = document.createElement('div');
            guildElement.classList.add('guild', 'common-guild');
            const guildIcon = guild.icon ?
                `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` :
                'default-icon.png';
            guildElement.innerHTML = `<img src="${guildIcon}" alt="${guild.name}"><p>${guild.name}</p>`;
            commonGuildsContainer.appendChild(guildElement);
        });
    };

    loginBtn.addEventListener('click', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);

    // Initialization
    const initialize = async () => {
        const params = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = params.get('access_token');

        if (accessToken) {
            localStorage.setItem('discord_access_token', accessToken);
            window.location.hash = '';
        }

        const storedToken = localStorage.getItem('discord_access_token');

        if (storedToken) {
            const user = await getUserInfo(storedToken);
            if (user) {
                displayProfile(user);
                const userGuilds = await getUserGuilds(storedToken);
                const botGuilds = await getBotGuilds();
                const commonGuilds = userGuilds.filter(userGuild => botGuilds.some(botGuild => botGuild.id === userGuild.id));
                displayAllGuilds(userGuilds);
                displayCommonGuilds(commonGuilds);
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
