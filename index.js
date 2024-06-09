require('dotenv').config();
const express = require('express');
const { Client, Intents } = require('discord.js');

const app = express();
const port = 3000;

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.DISCORD_TOKEN);

app.get('/api/bot-info', async (req, res) => {
    try {
        const guild = client.guilds.cache.first(); // Assume bot is in only one guild for simplicity
        const botInfo = {
            guildName: guild.name,
            memberCount: guild.memberCount,
            botName: client.user.username,
            botAvatar: client.user.displayAvatarURL()
        };
        res.json(botInfo);
    } catch (error) {
        console.error('Error fetching bot info:', error);
        res.status(500).json({ error: 'Failed to fetch bot info' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
