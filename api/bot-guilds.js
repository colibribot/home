const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const botToken = process.env.TOKEN;  // Access token from Vercel env vars

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
            res.status(500).json({ error: 'Failed to fetch bot guilds' });
        }
    } catch (error) {
        console.error('Error fetching bot guilds:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
