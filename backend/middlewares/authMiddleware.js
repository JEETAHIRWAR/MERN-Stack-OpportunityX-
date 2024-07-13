import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

export const authMiddleware = async (req, res, next) =>
{
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token)
    {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try
    {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // req.user = decoded;
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (error)
    {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
