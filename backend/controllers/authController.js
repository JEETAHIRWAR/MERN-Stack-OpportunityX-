import User from "../models/User.js"
import jwt from "jsonwebtoken"
import sendEmail from "../utils/sendEmail.js"
import crypto from "crypto";

// Register
export const register = async (req, res) =>
{
    const { username, email, password, role, code } = req.body;

    // console.log('Received data:', { username, email, password, role, code });

    // For admin registration, check code
    if (role === 'admin')
    {
        if (code !== '2580')
        {
            return res.status(403).json({ message: 'Invalid code for admin registration' });
        }
    }

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
    // console.log('Received data:', { email, password });

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


export const forgotPassword = async (req, res) =>
{
    const { email } = req.body;
    try
    {
        const user = await User.findOne({ email });
        // console.log('Received user data:', { user });

        if (!user)
        {
            return res.status(404).json({ message: 'No account found with that email' });
        }

        const token = crypto.randomBytes(20).toString('hex');
        const expiry = Date.now() + 3600000; // 1 hour

        user.resetPasswordToken = token;
        user.resetPasswordExpires = expiry;
        await user.save();

        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
        // console.log('Received resetUrl data:', { resetUrl });

        // const message = `You are receiving this email because you requested a password reset. Please click on the following link, or paste it into your browser to complete the process: ${resetUrl}`;


        const companyLogoUrl = 'https://imgur.com/S280BBr';
        const message = `
  <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="${companyLogoUrl}" alt="Company Logo" style="max-width: 200px; height: auto;" />
    </div>
    <p>You are receiving this email because you requested a password reset. Please click on the following link, or paste it into your browser to complete the process:</p>
    <p><a href="${resetUrl}" style="color: #1FAB89;">${resetUrl}</a></p>
    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
    <p>Best regards,<br/>GhostCode Dynamics</p>
  </div>
`;
        // console.log('Received message data:', { message });

        await sendEmail({
            email: user.email,
            subject: 'Password Reset email from OpportunityX',
            message,
        });

        // console.log('Received data send mail', sendEmail);


        res.status(200).json({ message: 'Password reset link sent to email' });
    } catch (error)
    {
        // console.log('Received error data:', { error });
        res.status(500).json({ message: 'Server error', error });
    }
};


export const resetPassword = async (req, res) =>
{
    const { token, password } = req.body;
    // console.log(token);
    try
    {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user)
        {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error)
    {
        res.status(500).json({ message: 'Server error', error });
    }
};