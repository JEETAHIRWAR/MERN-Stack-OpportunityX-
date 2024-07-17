import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8001/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
    (config) =>
    {
        const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
        if (token)
        {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


export default api;
