// User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Add this for password hashing

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullname: { type: String, required: true },
    The2048: {type: Number, default: 0,required: false},
    GuessColor: {type: Number, default: 0,required: false},
    MagicMatch: {type: Number, default: 0,required: false},
    RPS: {type: Number, default: 0,required: false},
    WPM: {type: Number, default: 0,required: false},
    createdAt: { type: Date, default: Date.now }
});

// Add pre-save middleware to hash password
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Add method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;