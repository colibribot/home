const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config(); // To load .env variables

const app = express();
const PORT = process.env.PORT || 3000;

// Route for fetching bot guilds (similar to Vercel's API route)
app.get('/api/bot-guilds', async (req, res) => {
    const botToken = process.env.TOKEN;

    if (!botToken) {
        return res.status(500).json({ error: 'Bot token not found. Make sure to set TOKEN in your .env file.' });
    }

    try {
        const response = await fetch('https://discord.com/api/v10/users/@me/guilds', {
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
});

// Fallback route for other paths
app.get('*', (req, res) => {
    res.send('Discord Guilds API is running.');
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
