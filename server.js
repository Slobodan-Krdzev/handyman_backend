const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// Mock users (in production, use a database)
const users = [
    { id: 1, username: 'user1', password: 'password1' },
    { id: 2, username: 'user2', password: 'password2' },
];

// Login endpoint (generate token)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return res.json({ token });
    }
    return res.status(401).json({ error: 'Invalid credentials' });
});

// Token validation endpoint
app.post('/api/validate-token', (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'Token is required' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return res.json({ valid: true, user: decoded });
    } catch (err) {
        return res.status(401).json({ valid: false, error: 'Invalid or expired token' });
    }
});

// Start server
app.listen(process.env.PORT, () => {
    console.log(`Backend running on port ${process.env.PORT}`);
});