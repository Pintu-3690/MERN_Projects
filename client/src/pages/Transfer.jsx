import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { transferFundsApi } from '../services/api';
import Card from '../components/Card';
import Button from '../components/Button';

const Transfer = () => {
    const { user, setUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        recipientAccountNumber: '',
        amount: '',
        description: ''
    });
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        if (parseFloat(formData.amount) > user?.balance) {
            setError('Insufficient account balance');
            return;
        }

        try {
            setLoading(true);
            const res = await transferFundsApi(formData);
            setUser((prev) => ({ ...prev, balance: res.data.newBalance }));
            setMessage(`Successfully transferred $${formData.amount}!`);
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Transfer failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 px-4">
            <Card title="Transfer Money">
                {message && <div className="bg-green-900/50 border border-green-500 text-green-200 p-3 rounded mb-4 text-sm">{message}</div>}
                {error && <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Recipient Account Number</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. 1049283741"
                            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono"
                            value={formData.recipientAccountNumber}
                            onChange={(e) => setFormData({ ...formData, recipientAccountNumber: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Amount ($)</label>
                        <input
                            type="number"
                            min="1"
                            step="0.01"
                            required
                            placeholder="0.00"
                            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        />
                        <p className="text-xs text-gray-500 mt-1">Available balance: ${user?.balance?.toFixed(2)}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Description / Note</label>
                        <input
                            type="text"
                            placeholder="e.g. Rent payment"
                            className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <Button type="submit" disabled={loading}>
                        {loading ? 'Processing...' : 'Confirm Transfer'}
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default Transfer;