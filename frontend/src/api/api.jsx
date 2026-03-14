import axios from 'axios';

const API = axios.create({
    // MODIFICATION : Utilise le port 5000 (ou celui de ton backend)
    baseURL: 'http://localhost:5000/api', 
});

// Intercepteur pour ajouter le token
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('galaxy_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// OPTIONNEL : Intercepteur pour gérer les erreurs 401 (Token expiré)
API.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('galaxy_token');
            // window.location.href = '/login'; // Optionnel : redirection forcée
        }
        return Promise.reject(error);
    }
);

export default API;