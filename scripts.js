document.addEventListener('DOMContentLoaded', () => {
    const profilePic = document.getElementById('profile-pic');
    const profileName = document.getElementById('profile-name');
    const dropdownContent = document.getElementById('dropdown-content');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.navb-links');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');

    const CLIENT_ID = '1156663455399563289';
    const REDIRECT_URI = 'https://colibribot.github.io/home/';
    const AUTHORIZATION_ENDPOINT = 'https://discord.com/api/oauth2/authorize';
    const RESPONSE_TYPE = 'token';
    const SCOPE = 'identify guilds gdm.join guilds.join email connections';

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

    const getUserInfo = async (token) => {
        const response = await fetch('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.json();
    };

    const displayProfile = (user) => {
        loginBtn.style.display = 'none';
        profilePic.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
        profileName.textContent = user.username;
        profilePic.style.display = 'block';
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

        if (storedToken) {
            const user = await getUserInfo(storedToken);
            displayProfile(user);
        } else {
            loginBtn.style.display = 'block';
            profilePic.style.display = 'none';
        }
    };

    initialize();

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


})

const express = require('express');
const axios = require('axios');
const app = express();

const CLIENT_ID = '1156663455399563289';
const CLIENT_SECRET = 'g7nFyPLlXPJN_eX0TP3Zgehb7BhPZQz1';
const REDIRECT_URI = 'https://colibribot.github.io/home/dashboard.html';

app.get('/login', (req, res) => {
    const oauthUrl = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify%20guilds`;
    res.redirect(oauthUrl);
});

app.get('/callback', async (req, res) => {
    const code = req.query.code;
    const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: REDIRECT_URI
    }), {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    const accessToken = tokenResponse.data.access_token;
    const guildsResponse = await axios.get('https://discord.com/api/users/@me/guilds', {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });

    res.json(guildsResponse.data);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('/callback'); // Adjust the endpoint as necessary
    const guilds = await response.json();

    const guildsContainer = document.getElementById('guilds');

    guilds.forEach(guild => {
        const guildCard = document.createElement('div');
        guildCard.className = 'guild-card';

        const guildIcon = guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : 'placeholder.png'; // Provide a placeholder image URL

        guildCard.innerHTML = `
            <img src="${guildIcon}" alt="${guild.name}">
            <h3>${guild.name}</h3>
        `;

        guildsContainer.appendChild(guildCard);
    });
});
