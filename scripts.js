document.addEventListener('DOMContentLoaded', () => {
    const profilePic = document.getElementById('profile-pic');
    const profileName = document.getElementById('profile-name');
    const dropdownContent = document.getElementById('dropdown-content');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.navb-links');
    const loginBtn = document.getElementById('login-btn');
    const logoutBtn = document.getElementById('logout-btn');

    const CLIENT_ID = '1156663455399563289';
    const REDIRECT_URI = 'https://colibribot.github.io/home/';
    const AUTHORIZATION_ENDPOINT = 'https://discord.com/api/oauth2/authorize';
    const RESPONSE_TYPE = 'token';
    const SCOPE = 'identify guilds gdm.join guilds.join email connections';

    const getLoginURL = () => {
        const params = new URLSearchParams({
            client_id: CLIENT_ID,
            redirect_uri: REDIRECT_URI,
            response_type: RESPONSE_TYPE,
            scope: SCOPE
        });
        return `${AUTHORIZATION_ENDPOINT}?${params.toString()}`;
    };

    const handleLogin = () => {
        const url = getLoginURL();
        window.location.href = url;
    };

    const handleLogout = () => {
        localStorage.removeItem('discord_access_token');
        location.reload();
    };

    const getUserInfo = async (token) => {
        const response = await fetch('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.json();
    };

    const displayProfile = (user) => {
        loginBtn.style.display = 'none';
        profilePic.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`;
        profileName.textContent = user.username;
        profilePic.style.display = 'block';
    };

    loginBtn.addEventListener('click', handleLogin);
    logoutBtn.addEventListener('click', handleLogout);

    const initialize = async () => {
        const params = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = params.get('access_token');

        if (accessToken) {
            localStorage.setItem('discord_access_token', accessToken);
            window.location.hash = '';
        }

        const storedToken = localStorage.getItem('discord_access_token');

        if (storedToken) {
            const user = await getUserInfo(storedToken);
            displayProfile(user);
        } else {
            loginBtn.style.display = 'block';
            profilePic.style.display = 'none';
        }
    };

    initialize();

        profilePic.addEventListener('click', function(event) {
        event.stopPropagation();
        dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
    });

    window.addEventListener('click', function(event) {
        if (!event.target.closest('.profile')) {
            dropdownContent.style.display = 'none';
        }
    });

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });


})

const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/submit-form', upload.array('attachments'), (req, res) => {
  const { email, issueType, subject, description } = req.body;
  const files = req.files;

  // Configure nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password'
    }
  });

  // Create email options
  let mailOptions = {
    from: email,
    to: 'lacrp.managment@gmail.com',
    subject: subject,
    html: `
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Issue Type:</strong> ${issueType}</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Description:</strong> ${description}</p>
    `,
    attachments: files.map(file => {
      return {
        filename: file.originalname,
        path: path.join(__dirname, file.path)
      };
    })
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    // Remove uploaded files after sending email
    files.forEach(file => fs.unlinkSync(path.join(__dirname, file.path)));

    if (error) {
      return res.status(500).send('Failed to send email.');
    }
    res.send('Email sent successfully.');
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
