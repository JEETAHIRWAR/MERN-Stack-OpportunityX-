import mongoose from "mongoose";
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], required: true },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
});



// Hash password before saving
UserSchema.pre('save', async function (next)
{
    if (!this.isModified('password'))
    {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password for login
UserSchema.methods.comparePassword = async function (enteredPassword)
{
    return await bcrypt.compare(enteredPassword, this.password);
};


const user = mongoose.model('user', UserSchema);
export default user;