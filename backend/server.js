// backend/server.js

const dotenv = require('dotenv');
// CRITICAL: Load environment variables first
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const passwordRoutes = require('./routes/passwordRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// --- Security and Middleware ---

// 1. Helmet: Secure HTTP headers
app.use(helmet());

// 2. CORS Configuration: Allow frontend to communicate (Vite default port 5173)
const corsOptions = {
    origin: 'https://password-manager-mu-drab.vercel.app', 
    credentials: true, // IMPORTANT: Allows HTTP-only cookies
};
app.use(cors(corsOptions));

// 3. Body Parser: Accept JSON data
app.use(express.json());

// 4. Cookie Parser: Parse cookies sent by the client
app.use(cookieParser());

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/passwords', passwordRoutes);

app.get('/', (req, res) => {
    res.send('Password Manager Backend API is running...');
});

// --- Start Server ---
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));