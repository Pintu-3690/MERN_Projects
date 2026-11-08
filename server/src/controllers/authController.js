const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { generateAccountNumber } = require('../utils/helpers');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_jwt_banking_key_2026', { expiresIn: '30d' });

exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Missing fields' });

        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ success: false, message: 'User already exists' });

        const accountNumber = generateAccountNumber();
        const user = await User.create({ name, email, password, accountNumber, balance: 1000.00 });

        res.status(201).json({
            success: true,
            data: { _id: user._id, name: user.name, email: user.email, accountNumber: user.accountNumber, balance: user.balance, token: generateToken(user._id) }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                success: true,
                data: { _id: user._id, name: user.name, email: user.email, accountNumber: user.accountNumber, balance: user.balance, token: generateToken(user._id) }
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getUserProfile = async (req, res) => {
    res.json({ success: true, data: req.user });
};