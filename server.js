require('dotenv').config(); // Load environment variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Use CORS to allow requests from the frontend
app.use(cors());

// Connect to MongoDB using the URI from the environment variables
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

// Define the user schema
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    id: String,
    avatar: String,
    ip: String
});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.json());

// Endpoint to log user data
app.post('/log-user', async (req, res) => {
    const { username, email, id, avatar, ip } = req.body;
    const user = new User({ username, email, id, avatar, ip });
    try {
        await user.save();
        res.status(200).send('User data logged successfully');
    } catch (error) {
        res.status(500).send('Error logging user data');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
