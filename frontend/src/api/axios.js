// frontend/src/api/axios.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://password-manager-rwy8.onrender.com/api', // <--- MUST match backend port and /api prefix
    withCredentials: true,
});

export default api; 