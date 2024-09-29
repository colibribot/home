const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Define the path to the blocked users file
const blockedUsersFilePath = path.join(__dirname, '..', 'api', 'blocked-users.json');

export default async function handler(req, res) {
    // Set CORS headers (update for your domain)
    res.setHeader('Access-Control-Allow-Origin', 'https://home-vert-tau.vercel.app/');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const accessToken = req.headers.authorization?.split(' ')[1];
    
    // If the token is missing
    if (!accessToken) {
        return res.status(401).json({ error: 'Missing Authorization token' });
    }

    try {
        // Read the blocked users file safely
        let blockedUsers = [];
        try {
            const blockedUsersData = fs.readFileSync(blockedUsersFilePath, 'utf8');
            blockedUsers = JSON.parse(blockedUsersData).blocked || [];
        } catch (err) {
            console.error('Failed to read blocked users file:', err);
            return res.status(500).json({ error: 'Failed to read blocked users file' });
        }

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

        // Fetch bot's guilds (using bot token from environment variable)
        const response = await fetch('https://discord.com/api/v9/users/@me/guilds', {
            headers: {
                Authorization: `Bearer ${process.env.TOKEN}` // Bot token
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
