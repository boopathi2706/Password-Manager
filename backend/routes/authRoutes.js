// backend/routes/authRoutes.js

const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// Apply rate limiting to all auth routes for security
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests, please try again after 15 minutes'
});

router.post('/signup', limiter, authController.signup);
router.post('/login', limiter, authController.login);
router.get('/logout', authController.logout);

module.exports = router;