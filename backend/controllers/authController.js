import User from "../models/User.js"
import jwt from "jsonwebtoken"
import bcrypt from 'bcryptjs';

// Register
export const register = async (req, res) =>
{
    const { username, email, password, role, code } = req.body;

    console.log('Received data:', { username, email, password, role, code });

    // For admin registration, check code
    if (role === 'admin')
    {
        if (code !== '2580')
        {
            return res.status(403).json({ message: 'Invalid code for admin registration' });
        }
    }

    // try
    // {
    //     const existingUser = await User.findOne({ email });
    //     if (existingUser)
    //     {
    //         return res.status(400).json({ message: 'User already exists' });
    //     }

    //     const hashedPassword = await bcrypt.hash(password, 10);
    //     const user = await User.create({ username, email, password: hashedPassword, role });

    //     const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    //         expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    //     });

    //     res.status(201).json({ token, user });
    // } catch (error)
    // {
    //     res.status(400).json({ message: 'User registration failed', error });
    // }


    if (role === 'admin' && code !== '2580')
    {
        return res.status(403).json({ message: 'Invalid code for admin registration' });
    }

    try
    {
        const user = await User.create({ username, email, password, role });
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
        res.status(201).json({ token, user });
    } catch (error)
    {
        res.status(400).json({ message: 'User registration failed', error });
    }

};

// Login
export const login = async (req, res) =>
{
    const { email, password } = req.body;
    console.log('Received data:', { email, password });

    try
    {
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password)))
        {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
        res.status(200).json({ token, user });
    } catch (error)
    {
        res.status(500).json({ message: 'Login failed', error });
    }
};