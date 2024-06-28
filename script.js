document.addEventListener('DOMContentLoaded', () => {
    const profilePic = document.getElementById('profile-pic');
    const profileName = document.getElementById('profile-name');
    const dropdownContent = document.getElementById('dropdown-content');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');

    const CLIENT_ID = '1156663455399563289';
    const REDIRECT_URI = 'https://colibribot.github.io/home/';
    const AUTHORIZATION_ENDPOINT = 'https://discord.com/api/oauth2/authorize';
    const RESPONSE_TYPE = 'token';
    const SCOPE = 'identify guilds gdm.join guilds.join email connections';

const BACKEND_URL = 'https://colibribot.github.io/home/beta.html/log-user';

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

    const logUserToBackend = async (user, ip) => {
        const payload = {
            username: user.username,
            email: user.email,
            id: user.id,
            avatar: user.avatar,
            ip: ip
        };

        try {
            await fetch(BACKEND_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
        } catch (error) {
            console.error('Error logging user to backend:', error);
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
            window.location.hash = '';
        }

        if (accessToken) {
            const user = await getUserInfo(accessToken);
            if (user) {
                displayProfile(user);
                const ip = await getIP();
                logUserToBackend(user, ip);
            } else {
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
});
