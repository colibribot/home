const { Client, GatewayIntentBits } = require('discord.js');

// Initialize Discord Bot Client
const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

const BOT_TOKEN = process.env.TOKEN;

client.login(BOT_TOKEN);

// Main API handler
module.exports = async (req, res) => {
    try {
        if (!client.user) {
            return res.status(500).json({ error: 'Bot is not ready' });
        }

        // Fetch the bot's guilds
        const guilds = client.guilds.cache.map(guild => ({
            id: guild.id,
            name: guild.name,
            icon: guild.icon
        }));

        res.json(guilds);
    } catch (error) {
        console.error('Error fetching bot guilds:', error);
        res.status(500).json({ error: 'Failed to fetch bot guilds' });
    }
};
