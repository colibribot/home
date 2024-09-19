document.addEventListener('DOMContentLoaded', () => {
    const profilePic = document.getElementById('profile-pic');
    const profileName = document.getElementById('profile-name');
    const profileNameSpan = document.getElementById('profileName'); // Reference to the welcome span
    const dropdownContent = document.getElementById('dropdown-content');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.navbar-links');
    const guildsContainer = document.getElementById('guilds');
    const darkModeToggle = document.getElementById('dark-mode-toggle');

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
        try {
            const response = await fetch('https://discord.com/api/users/@me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Invalid token');
            }
        } catch (error) {
            return null;
        }
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
            if (user) {
                displayProfile(user);
            } else {
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
        navLinks.classList.toggle('open');
        hamburger.classList.toggle('toggle');
    });

    // Dark mode toggle function
    function myFunction() {
        var element = document.body;
        element.classList.toggle("dark-mode");
    }

    // Add event listener for dark mode toggle button
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', myFunction);
    }
})
