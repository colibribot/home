const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

const BOT_TOKEN = 'TOKEN';

app.get('/api/bot-guilds', async (req, res) => {
    try {
        const response = await axios.get('https://discord.com/api/v9/users/@me/guilds', {
            headers: {
                Authorization: `Bot ${BOT_TOKEN}`
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching bot guilds:', error);
        res.status(500).send('Error fetching bot guilds');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
