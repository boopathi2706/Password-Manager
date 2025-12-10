// backend/controllers/passwordController.js

const PasswordItem = require('../models/PasswordItem');
const User = require('../models/User');
const { encrypt, decrypt } = require('../utils/cryptoUtils');
const bcrypt = require('bcryptjs');

// --- 1. CREATE A NEW PASSWORD ITEM ---
exports.createPassword = async (req, res) => {
    try {
        const { topicName, password, isFavorite } = req.body;
        
        // Encrypt the password before storing
        const encryptedPassword = encrypt(password);

        const newPasswordItem = await PasswordItem.create({
            userId: req.user._id, // User ID comes from JWT middleware (req.user)
            topicName,
            encryptedPassword,
            isFavorite: isFavorite || false,
        });

        res.status(201).json({ 
            status: 'success', 
            data: { 
                _id: newPasswordItem._id, 
                topicName: newPasswordItem.topicName,
                isFavorite: newPasswordItem.isFavorite 
            }
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// --- 2. GET ALL PASSWORD TOPICS (List View) ---
exports.getAllPasswords = async (req, res) => {
    try {
        const passwords = await PasswordItem.find({ userId: req.user._id })
            .select('topicName isFavorite createdAt'); // Only send necessary metadata

        res.status(200).json({ 
            status: 'success', 
            results: passwords.length,
            data: passwords
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};

// --- 3. SECURE PASSWORD RETRIEVAL (The core feature) ---
exports.retrievePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { answer1, answer2, answer3 } = req.body; // Answers from the modal

        const item = await PasswordItem.findById(id);

        if (!item || item.userId.toString() !== req.user._id.toString()) {
            return res.status(404).json({ status: 'fail', message: 'Password item not found.' });
        }

        // 1. Retrieve the user's stored answer hashes
        const user = req.user; 
        
        // 2. Validate the three security answers against their hashes
        const isMatch1 = await bcrypt.compare(answer1.toLowerCase().trim(), user.answerHash1);
        const isMatch2 = await bcrypt.compare(answer2.toLowerCase().trim(), user.answerHash2);
        const isMatch3 = await bcrypt.compare(answer3.toLowerCase().trim(), user.answerHash3);

        if (!(isMatch1 && isMatch2 && isMatch3)) {
            // Log this attempt but send a generic failure message
            console.warn(`Failed retrieval attempt for user ${user.username} at ${new Date()}`); 
            return res.status(403).json({ 
                status: 'fail', 
                message: 'Incorrect security answers. Password retrieval failed.' 
            });
        }

        // 3. If all match, decrypt and send the password
        const decryptedPassword = decrypt(item.encryptedPassword);

        res.status(200).json({ 
            status: 'success', 
            data: { 
                password: decryptedPassword, 
                topicName: item.topicName 
            }
        });

    } catch (err) {
        // Handle decryption errors or other server errors
        res.status(500).json({ status: 'error', message: 'Secure retrieval failed.' });
    }
};


// backend/controllers/passwordController.js (Add this function at the end)

// --- 4. DELETE A PASSWORD ITEM ---
exports.deletePassword = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedItem = await PasswordItem.findOneAndDelete({
            _id: id,
            userId: req.user._id, // Ensure user can only delete their own passwords
        });

        if (!deletedItem) {
            return res.status(404).json({ 
                status: 'fail', 
                message: 'Password item not found or you do not have permission.' 
            });
        }

        // Send a 204 No Content status for successful deletion
        res.status(204).json({ status: 'success', data: null }); 

    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
};
// Add functions for update and delete as needed (omitted for brevity, but follow CRUD patterns)