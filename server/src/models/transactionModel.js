const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true, min: [1, 'Minimum amount is $1'] },
    type: { type: String, enum: ['transfer', 'deposit', 'withdrawal'], default: 'transfer' },
    description: { type: String, default: 'Fund Transfer' },
    status: { type: String, enum: ['completed', 'failed', 'pending'], default: 'completed' }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);