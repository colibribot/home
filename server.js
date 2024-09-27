const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Discord API URL
const DISCORD_API_BASE_URL = 'https://discord.com/api';

// Fetch bot's guilds (Your bot must be running and logged in)
app.get('/api/bot-guilds', async (req, res) => {
    try {
        const response = await axios.get(`${DISCORD_API_BASE_URL}/users/@me/guilds`, {
            headers: {
                Authorization: `Bot ${process.env.TOKEN}`
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching bot guilds:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch bot guilds' });
    }
});

// Launch the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
