const User = require('../models/userModel');
const Transaction = require('../models/transactionModel');
const { sendEmailNotification } = require('../services/emailService');

exports.getBalance = async (req, res) => {
    const user = await User.findById(req.user._id);
    res.json({ success: true, accountNumber: user.accountNumber, balance: user.balance });
};

exports.transferFunds = async (req, res) => {
    try {
        const { recipientAccountNumber, amount, description } = req.body;
        const transferAmount = parseFloat(amount);

        if (!recipientAccountNumber || isNaN(transferAmount) || transferAmount <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid transfer parameter' });
        }

        const sender = await User.findById(req.user._id);
        if (sender.accountNumber === recipientAccountNumber) {
            return res.status(400).json({ success: false, message: 'Cannot transfer money to self' });
        }

        if (sender.balance < transferAmount) {
            return res.status(400).json({ success: false, message: 'Insufficient funds' });
        }

        const recipient = await User.findOne({ accountNumber: recipientAccountNumber });
        if (!recipient) {
            return res.status(404).json({ success: false, message: 'Recipient account not found' });
        }

        sender.balance -= transferAmount;
        recipient.balance += transferAmount;

        await sender.save();
        await recipient.save();

        const transaction = await Transaction.create({
            sender: sender._id,
            receiver: recipient._id,
            amount: transferAmount,
            type: 'transfer',
            description: description || 'Fund Transfer'
        });

        await sendEmailNotification({
            to: sender.email,
            subject: 'Transfer Notification',
            text: `Transferred $${transferAmount} to ${recipient.name}`
        });

        res.json({ success: true, message: 'Transfer successful', data: transaction, newBalance: sender.balance });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getTransactionHistory = async (req, res) => {
    const transactions = await Transaction.find({
        $or: [{ sender: req.user._id }, { receiver: req.user._id }]
    })
        .populate('sender', 'name accountNumber')
        .populate('receiver', 'name accountNumber')
        .sort({ createdAt: -1 });

    res.json({ success: true, count: transactions.length, data: transactions });
};