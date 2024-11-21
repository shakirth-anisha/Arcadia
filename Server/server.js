// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const connectDB = require('./db');
const logger = require('./logger');
const User = require('./User');

const app = express();
const PORT = process.env.PORT || 80;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
connectDB();

// Login endpoint with password comparison
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({
            $or: [
                { username: username },
                { email: username }
            ]
        });

        if (!user) {
            logger.warn(`Failed login attempt - user not found: ${username}`);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            logger.warn(`Failed login attempt - incorrect password for user: ${username}`);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        logger.info(`Login successful for user: ${username}`);

        return res.status(200).json({
            message: 'Login successful!'
        });
    } catch (error) {
        logger.error(`Server error on login attempt for user: ${username} - ${error.message}`);
        res.status(500).json({ message: 'Server error' });
    }
});


// Registration endpoint
app.post('/api/register', async (req, res) => {
    const { username, email, password, fullname } = req.body;

    try {
        // Validate username format
        if (!username || username.length < 3 || !/^[a-zA-Z0-9_]+$/.test(username)) {
            return res.status(400).json({ 
                message: 'Username must be at least 3 characters and can only contain letters, numbers, and underscores'
            });
        }

        // Check if username or email already exists
        const existingUser = await User.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        });

        if (existingUser) {
            logger.warn(`Registration failed - user already exists: ${email}`);
            return res.status(400).json({ 
                message: existingUser.email === email ? 
                    'Email already registered' : 
                    'Username already taken'
            });
        }

        // Create new user
        const newUser = new User({
            username,
            email,
            password,
            fullname
        });

        await newUser.save();
        
        logger.info(`New user registered: ${email}`);

        // Return user data (excluding password)
        const userData = newUser.toObject();
        delete userData.password;

        res.status(201).json({
            message: 'Registration successful!',
            user: userData
        });
    } catch (error) {
        logger.error(`Registration error for email ${email}: ${error.message}`);
        res.status(500).json({ 
            message: error.code === 11000 ? 
                'Email or username already exists' : 
                'Server error during registration'
        });
    }
});

app.put('/api/updateHighScore', async (req, res) => {
    const {username, gameName, newScore } = req.body;
    console.log(username , gameName, newScore)
    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    try {
        // Find the user and update their score if it's higher than their current score
        const user = await User.findOneAndUpdate(
            { username },
            { $max: { [gameName]: newScore } },
            { new: true }
        );

        res.status(200).json({
            message: `High score updated for ${gameName}`,
            user
        });
    } catch (error) {
        console.error('Error updating high score:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// app.get('/api/leaderboard', async (req, res) => {
//     try {
//         // Get top scores for each game
//         const games = ['The2048', 'GuessColor', 'MagicMatch', 'RPS', 'ShadowStrike'];
//         const leaderboardData = {};
//
//         for (const game of games) {
//             const topScores = await User.find({ [game]: { $exists: true, $ne: null } })
//                 .sort({ [game]: -1 })
//                 .limit(10)
//                 .select(`username ${game}`);
//
//             leaderboardData[game] = topScores;
//         }
//
//         res.status(200).json({ leaderboard: leaderboardData });
//     } catch (error) {
//         console.error('Error fetching leaderboard:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

app.get('/api/user-scores/:username', async (req, res) => {
    const { username } = req.params;

    try {
        // Find user by username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Extract game scores
        const scores = {
            The2048: user.The2048 || 0,
            GuessColor: user.GuessColor || 0,
            MagicMatch: user.MagicMatch || 0,
            RPS: user.RPS || 0,
            ShadowStrike: user.ShadowStrike || 0,
        };

        res.status(200).json({ scores });
    } catch (error) {
        console.error('Error fetching scores:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/getuser/:username', async (req, res) => {
    const {username} = req.params
    try {
        const users = await User.findOne({username});
        res.json(users);
    } catch (error) {
        res.status(500).send(error.message);
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});