import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    role: String,
    phone: String,
    createdAt: String,
    isAdmin: Boolean
}); 
export const User = mongoose.model('User', userSchema); 