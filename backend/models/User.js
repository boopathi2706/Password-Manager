// backend/models/User.js

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please enter a username'],
        unique: true,
        trim: true,
        lowercase: true,
    },
    passwordHash: { // Hashed login password
        type: String,
        required: true,
    },
    // Hashed answers for the three security questions
    answerHash1: { // Favourite person in the world
        type: String,
        required: true,
    },
    answerHash2: { // Favourite subject
        type: String,
        required: true,
    },
    answerHash3: { // Favourite place in world
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);