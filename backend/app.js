import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
const app = express();
import path from 'path';

// Routes
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";

// Initialize dotenv
dotenv.config({
    path: './.env'
});

// Middleware
app.use(express.json());
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);

// Serve static files from the React app
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) =>
{
    console.log('Request path:', req.path);
    res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});



export default app;
