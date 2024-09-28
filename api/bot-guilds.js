const fetch = require('node-fetch');
const fs = require('fs'); // Import the file system module to read files
const path = require('path');
require('dotenv').config();

// Define the path to the blocked users file
const blockedUsersFilePath = path.join(__dirname, '..', 'blocked-users.json');

export default async function handler(req, res) {
    // Set CORS headers (update for your domain)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Read the blocked users file
    const blockedUsersData = fs.readFileSync(blockedUsersFilePath, 'utf8');
    const blockedUsers = JSON.parse(blockedUsersData).blocked; // Parse the JSON file to get the blocked list

    const accessToken = req.headers.authorization?.split(' ')[1];

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

        // Fetch user's guilds if they are not blocked
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
