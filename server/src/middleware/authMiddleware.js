const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization?.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_banking_key_2026');
            req.user = await User.findById(decoded.id).select('-password');
            if (!req.user) return res.status(401).json({ success: false, message: 'User not found' });
            return next();
        } catch (error) {
            return res.status(401).json({ success: false, message: 'Token verification failed' });
        }
    }
    return res.status(401).json({ success: false, message: 'No authorization token provided' });
};

module.exports = { protect };