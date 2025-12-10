// backend/models/PasswordItem.js

const mongoose = require('mongoose');

const PasswordItemSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    topicName: {
        type: String,
        required: [true, 'Please enter a password topic name'],
        trim: true,
    },
    encryptedPassword: { // The sensitive password, encrypted
        type: String,
        required: true,
    },
    isFavorite: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

module.exports = mongoose.model('PasswordItem', PasswordItemSchema);