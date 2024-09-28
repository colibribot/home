const fetch = require('node-fetch');
require('dotenv').config();

const blockedUsers = ['1107732982581690428']; // Example list of blocked user IDs

export default async function handler(req, res) {
    // Allow CORS (Cross-Origin Resource Sharing)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const accessToken = req.headers.authorization?.split(' ')[1]; // Assuming you use a Bearer token for authentication

    try {
        // Fetch user info from Discord
        const userResponse = await fetch('https://discord.com/api/v9/users/@me', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!userResponse.ok) {
            return res.status(401).json({ error: 'Invalid token or failed to fetch user info' });
        }

        const user = await userResponse.json();

        // Check if the user is in the blocked list
        if (blockedUsers.includes(user.id)) {
            return res.status(403).json({ error: 'Access denied: You are blocked from this service' });
        }

        // Fetch guilds (if the user is not blocked)
        const response = await fetch('https://discord.com/api/v9/users/@me/guilds', {
            headers: {
                Authorization: `Bearer ${process.env.TOKEN}`
            }
        });

        if (response.ok) {
            const guilds = await response.json();
            res.status(200).json(guilds);
        } else {
            res.status(response.status).json({ error: response.statusText });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
