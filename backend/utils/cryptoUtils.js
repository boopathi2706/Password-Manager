// backend/utils/cryptoUtils.js

const crypto = require('crypto');

const ENCRYPTION_KEY_SECRET = process.env.ENCRYPTION_KEY_SECRET;
const ALGORITHM = 'aes-256-cbc'; 

// 1. Check if the key exists
if (!ENCRYPTION_KEY_SECRET) {
    console.error('FATAL ERROR: ENCRYPTION_KEY_SECRET is not set in environment variables (e.g., .env file).');
    process.exit(1); 
}

const ENCRYPTION_KEY = Buffer.from(ENCRYPTION_KEY_SECRET, 'hex');

// 2. Check if the key is the correct length (32 bytes = 64 hex characters)
if (ENCRYPTION_KEY.length !== 32) {
    console.error(`FATAL ERROR: ENCRYPTION_KEY_SECRET is ${ENCRYPTION_KEY.length} bytes long. It must be a 64-character hex string (32 bytes).`);
    process.exit(1); 
}

/**
 * Encrypts a plaintext string using AES-256-CBC.
 */
exports.encrypt = (text) => {
    const iv = crypto.randomBytes(16); 
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
};

/**
 * Decrypts an encrypted string using AES-256-CBC.
 */
exports.decrypt = (text) => {
    try {
        const parts = text.split(':');
        if (parts.length !== 2) {
             throw new Error("Invalid encrypted format.");
        }
        
        const iv = Buffer.from(parts[0], 'hex');
        const encryptedText = parts[1];
        
        const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
        
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return decrypted;
        
    } catch (error) {
        console.error('Decryption failed:', error.message);
        throw new Error('Failed to decrypt data.');
    }
};