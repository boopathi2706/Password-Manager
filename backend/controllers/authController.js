// backend/controllers/authController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper function to create JWT and set cookie
const createSendToken = (user, statusCode, res) => {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '90d', // Token expires in 90 days
    });

    // Set the token in an HTTP-only cookie for security
    const cookieOptions = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
        httpOnly: true, // Prevents client-side JS from accessing the cookie
        secure: process.env.NODE_ENV === 'production', // Use 'true' in production with HTTPS
    };

    res.cookie('jwt', token, cookieOptions);

    // Remove sensitive fields before sending response
    user.passwordHash = undefined;
    user.answerHash1 = undefined;
    // ... remove other answer hashes

    res.status(statusCode).json({
        status: 'success',
        token,
        user,
    });
};

// --- 1. SIGNUP LOGIC ---
exports.signup = async (req, res) => {
    try {
        const { username, password, answer1, answer2, answer3 } = req.body;
        
        // 1. Hash the login password
        const passwordHash = await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS));

        // 2. Hash the three security answers
        const answerHash1 = await bcrypt.hash(answer1.toLowerCase().trim(), parseInt(process.env.SALT_ROUNDS));
        const answerHash2 = await bcrypt.hash(answer2.toLowerCase().trim(), parseInt(process.env.SALT_ROUNDS));
        const answerHash3 = await bcrypt.hash(answer3.toLowerCase().trim(), parseInt(process.env.SALT_ROUNDS));

        const newUser = await User.create({
            username,
            passwordHash,
            answerHash1,
            answerHash2,
            answerHash3,
        });

        createSendToken(newUser, 201, res);

    } catch (err) {
        if (err.code === 11000) { // MongoDB duplicate key error (username already exists)
            return res.status(400).json({ status: 'fail', message: 'Username already exists.' });
        }
        res.status(500).json({ status: 'error', message: err.message });
    }
};


// --- 2. LOGIN LOGIC ---
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ status: 'fail', message: 'Please provide username and password.' });
        }

        // 1. Check if user exists
        const user = await User.findOne({ username: username.toLowerCase() });

        if (!user) {
            return res.status(401).json({ status: 'fail', message: 'Incorrect username or password' });
        }

        // 2. Compare the provided password with the stored hash
        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
            return res.status(401).json({ status: 'fail', message: 'Incorrect username or password' });
        }

        // 3. User is authenticated, send JWT
        createSendToken(user, 200, res);

    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// --- 3. LOGOUT LOGIC ---
exports.logout = (req, res) => {
    // Clear the JWT cookie
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000), // Expire immediately
        httpOnly: true,
    });
    res.status(200).json({ status: 'success', message: 'Logged out successfully' });
};