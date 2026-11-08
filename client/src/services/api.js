import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('banking_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const loginApi = (credentials) => API.post('/auth/login', credentials);
export const registerApi = (userData) => API.post('/auth/register', userData);
export const fetchProfileApi = () => API.get('/auth/profile');
export const fetchBalanceApi = () => API.get('/account/balance');
export const transferFundsApi = (data) => API.post('/account/transfer', data);
export const fetchTransactionsApi = () => API.get('/account/transactions');

export default API;