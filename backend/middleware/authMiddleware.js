// backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    let token;

    // 1. Check if token exists in the HTTP-only cookie
    if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        // If no token is present, user is not logged in
        return res.status(401).json({ 
            status: 'fail', 
            message: 'You are not logged in! Please log in to get access.' 
        });
    }

    try {
        // 2. Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Check if user still exists
        const freshUser = await User.findById(decoded.id);

        if (!freshUser) {
            return res.status(401).json({ 
                status: 'fail', 
                message: 'The user belonging to this token no longer exists.' 
            });
        }

        // 4. Grant access to protected route
        req.user = freshUser; // Attach user object to the request
        next();
        
    } catch (err) {
        // Handle expired or invalid tokens
        return res.status(401).json({ 
            status: 'fail', 
            message: 'Invalid or expired token. Please log in again.' 
        });
    }
};