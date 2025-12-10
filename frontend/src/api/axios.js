// frontend/src/api/axios.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // <--- MUST match backend port and /api prefix
    withCredentials: true,
});

export default api; 