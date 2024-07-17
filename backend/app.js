import express from "express";
import dotenv from "dotenv";
import cors from 'cors';


// Routes
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";

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

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api', jobRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// // Serve static files from the React frontend app
// const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, 'frontend/dist')));

// // The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
// app.get('*', (req, res) =>
// {
//     res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
// });


export default app;
