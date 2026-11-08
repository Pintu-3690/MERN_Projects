const express = require('express');
const router = express.Router();
const { getBalance, transferFunds, getTransactionHistory } = require('../controllers/accountController');
const { protect } = require('../middleware/authMiddleware');

router.get('/balance', protect, getBalance);
router.post('/transfer', protect, transferFunds);
router.get('/transactions', protect, getTransactionHistory);

module.exports = router;