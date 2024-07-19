import axios from 'axios';

const api = axios.create({
    baseURL: 'https://opportunityx.onrender.com/api',
    // baseURL: 'http://localhost:8001/api',
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


// Add a response interceptor to handle retries
api.interceptors.response.use(null, async (error) =>
{
    const { config, response } = error;
    if (response && response.status === 400)
    {
        // Too Many Requests
        const retryAfter = response.headers['retry-after']
            ? parseInt(response.headers['retry-after'], 10) * 1000
            : 1000;

        // If config does not exist or retry property is not set, reject
        if (!config || !config.retry) return Promise.reject(error);

        config.__retryCount = config.__retryCount || 0;

        // Check if we've maxed out the total number of retries
        if (config.__retryCount >= config.retry)
        {
            return Promise.reject(error);
        }

        // Increase the retry count
        config.__retryCount += 1;

        // Create new promise to handle exponential backoff
        const backoff = new Promise((resolve) =>
        {
            setTimeout(() =>
            {
                resolve();
            }, retryAfter);
        });

        // Return the promise in which recalls axios to retry the request
        return backoff.then(() => api(config));
    }

    return Promise.reject(error);
});

// Set default retry and retry delay
api.defaults.retry = 3; // Number of retry attempts
api.defaults.retryDelay = 1000; // Delay between retry attempts


export default api;
