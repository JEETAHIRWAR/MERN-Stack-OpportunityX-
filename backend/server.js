// server.js


import app from "./app.js";
import connectDB from './config/db.js';

// Connect to MongoDB
connectDB()
    .then(() =>
    {
        console.log("MongoDB connected !!");

        // Start the server
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () =>
        {
            console.log(`⚙️ Server running on port ${PORT}`);
        });
    })
    .catch((err) =>
    {
        console.error("MongoDB connection failed !!", err);
    });


// Routes
// import authRoutes from "./routes/authRoutes.js";
// import jobRoutes from "./routes/jobRoutes.js";
// import applicationRoutes from "./routes/applicationRoutes.js";

// import express from "express";
// import dotenv from "dotenv";
// import connectDB from './config/db.js';
// import cors from 'cors';

// // Initialize dotenv
// dotenv.config({
//     path: './.env'
// });

// // Create Express app
// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true
// }));


// // Connect to MongoDB
// connectDB()
//     .then(() =>
//     {
//         console.log("MongoDB connected !!");

//         app.use('/api/auth', authRoutes);
//         app.use('/api/jobs', jobRoutes);
//         app.use('/api/applications', applicationRoutes);

//         // Start the server
//         const PORT = process.env.PORT || 5000;
//         app.listen(PORT, () =>
//         {
//             console.log(`⚙️ Server running on port ${PORT}`);
//         });
//     })
//     .catch((err) =>
//     {
//         console.error("MongoDB connection failed !!", err);
//     });
