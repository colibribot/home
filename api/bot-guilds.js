const fetch = require('node-fetch');
require('dotenv').config(); // Use dotenv to load environment variables

export default async function handler(req, res) {
    // Allow CORS (Cross-Origin Resource Sharing)
    res.setHeader('Access-Control-Allow-Origin', '*'); // Replace with your actual front-end URL
    res.setHeader('Access-Control-Allow-Methods', '*'); // Allowed methods

    if (req.method === 'OPTIONS') {
        return res.status(200).end(); // Handle preflight requests
    }

    const botToken = process.env.TOKEN; // Get your bot token from environment variables

    // Check if the bot token is available
    if (!botToken) {
        console.error('Bot token is not defined'); // Log an error
        return res.status(500).json({ error: 'Bot token not found. Make sure to set DISCORD_BOT_TOKEN in your environment variables.' });
    }

    try {
        const response = await fetch('https://discord.com/api/v9/users/@me/guilds', {
            headers: {
                Authorization: `Bot ${botToken}`
            }
        });

        if (response.ok) {
            const guilds = await response.json();
            res.status(200).json(guilds); // Return the guilds in the response
        } else {
            console.error('Error fetching bot guilds:', response.statusText);
            res.status(response.status).json({ error: response.statusText });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
