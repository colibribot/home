const fetch = require('node-fetch');
require('dotenv').config(); // Make sure you have this line if you are using environment variables

export default async function handler(req, res) {
    // Allow requests from your front-end origin
    res.setHeader('Access-Control-Allow-Origin', 'https://home-git-main-colibribots-projects.vercel.app'); // Replace with your front-end URL
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS'); // Allow these methods

    if (req.method === 'OPTIONS') {
        // Preflight request
        return res.status(200).end();
    }

    const botToken = process.env.TOKEN;

    if (!botToken) {
        return res.status(500).json({ error: 'Bot token not found. Make sure to set DISCORD_BOT_TOKEN in your .env file.' });
    }

    try {
        const response = await fetch('https://discord.com/api/v9/users/@me/guilds', {
            headers: {
                Authorization: `Bot ${botToken}`
            }
        });

        if (response.ok) {
            const botGuilds = await response.json();
            res.status(200).json(botGuilds);
        } else {
            console.error('Error fetching bot guilds:', response.statusText);
            res.status(500).json({ error: 'Failed to fetch bot guilds' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
