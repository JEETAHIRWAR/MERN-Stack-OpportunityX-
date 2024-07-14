// import express from "express";
// import dotenv from "dotenv";
// import connectDB from './config/db.js';
// import cors from 'cors';

// dotenv.config({
//     path: './.env'
// })
// connectDB()
//     .then(() =>
//     {
//         app.listen(process.env.PORT || 8001, () =>
//         {
//             console.log(` ⚙️  Server is running on port : ${process.env.PORT}`);
//         })
//     })
//     .catch((err) =>
//     {
//         console.log("MONGO DB Connection failed !!!", err);
//     })


// const app = express();
// app.use(express.json());
// app.use(cors({
//     origin: process.env.CORS_ORIGIN,
//     credentials: true
// }));


// import adminRoutes from "./routes/adminRoutes.js"
// import jobRoutes from "./routes/jobRoutes.js"
// import applicationRoutes from "./routes/applicationRoutes.js"

// // Routes
// app.use('/api/admin', adminRoutes);
// app.use('/api/jobs', jobRoutes);
// app.use('/api/applications', applicationRoutes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// Routes
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";

import express from "express";
import dotenv from "dotenv";
import connectDB from './config/db.js';
import cors from 'cors';
import helmet from 'helmet';

// Initialize dotenv
dotenv.config({
    path: './.env'
});

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

// Use Helmet middleware to set Content Security Policy headers
// app.use((req, res, next) =>
// {
//     res.setHeader(
//         'Content-Security-Policy',
//         "default-src 'self'; connect-src 'self' http://localhost:*; script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:; style-src 'self' 'unsafe-inline';"
//         // Add more directives as needed
//     );
//     next();
// });

// Connect to MongoDB
connectDB()
    .then(() =>
    {
        console.log("MongoDB connected !!");

        app.use('/api/auth', authRoutes);
        app.use('/api/jobs', jobRoutes);
        app.use('/api/applications', applicationRoutes);

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
