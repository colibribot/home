const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config();

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const accessToken = req.headers.authorization?.split(' ')[1];
    if (!accessToken) {
        return res.status(401).json({ error: 'Missing Authorization token' });
    }

    try {
        const blockedUsersData = fs.readFileSync(path.join(__dirname, 'blocked-users.json'), 'utf8');
        const blockedUsers = JSON.parse(blockedUsersData).blocked;

        // Fetch user info
        const userResponse = await fetch('https://discord.com/api/v9/users/@me', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (!userResponse.ok) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        const user = await userResponse.json();
        if (blockedUsers.includes(user.id)) {
            return res.status(403).json({ error: 'Access denied: You are blocked from this service' });
        }

        // Fetch bot guilds
        const botGuildsResponse = await fetch('https://discord.com/api/v9/users/@me/guilds', {
            headers: { Authorization: `Bearer ${process.env.BOT_TOKEN}` }
        });

        if (botGuildsResponse.ok) {
            const guilds = await botGuildsResponse.json();
            return res.status(200).json(guilds);
        } else {
            return res.status(botGuildsResponse.status).json({ error: botGuildsResponse.statusText });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
