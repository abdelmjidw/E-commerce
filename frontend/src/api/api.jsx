// src/api/api.js
import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3000', // Your Backend URL
});

// Automatically add the token to every request if it exists
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('galaxy_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;