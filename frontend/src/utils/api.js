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









// // utils/api.js

// // Function to handle generic fetch requests
// export const fetchAPI = async (url, options) =>
// {
//     try
//     {
//         const response = await fetch(url, options);

//         if (!response.ok)
//         {
//             throw new Error('API request failed');
//         }

//         return response.json(); // Return JSON response data
//     } catch (error)
//     {
//         console.error('Error making API request:', error.message);
//         throw error; // Throw error for handling in UI
//     }
// };

// // Example function to handle API registration
// export const registerUser = async (formData) =>
// {
//     try
//     {
//         const response = await fetchAPI('http://localhost:8001/api/register', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(formData),
//         });

//         return response; // Return JSON response data from register endpoint
//     } catch (error)
//     {
//         console.error('Error registering user:', error.message);
//         throw error; // Throw error for handling in RegistrationForm.jsx
//     }
// };

// // Example function to handle API login
// export const loginUser = async (formData) =>
// {
//     try
//     {
//         const response = await fetchAPI('http://localhost:8001/api/login', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(formData),
//         });

//         return response; // Return JSON response data from login endpoint
//     } catch (error)
//     {
//         console.error('Error logging in user:', error.message);
//         throw error; // Throw error for handling in LoginForm.jsx
//     }
// };

// // Example function to handle API logout
// export const logoutUser = async () =>
// {
//     try
//     {
//         const response = await fetchAPI('http://localhost:8001/api/logout', {
//             method: 'POST',
//         });

//         return response; // Return JSON response data from logout endpoint
//     } catch (error)
//     {
//         console.error('Error logging out user:', error.message);
//         throw error; // Throw error for handling in LogoutButton.jsx
//     }
// };

// // Example function to fetch user profile data
// export const fetchUserProfile = async () =>
// {
//     try
//     {
//         const response = await fetchAPI('http://localhost:8001/api/user/profile');

//         return response; // Return JSON response data from user profile endpoint
//     } catch (error)
//     {
//         console.error('Error fetching user profile:', error.message);
//         throw error; // Throw error for handling in UserProfile.jsx
//     }
// };

// // Add more API functions as needed for different endpoints and functionalities
