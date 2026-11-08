import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { fetchTransactionsApi, fetchBalanceApi } from '../services/api';
import Card from '../components/Card';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user, setUser } = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getDashboardData = async () => {
            try {
                const [balRes, txRes] = await Promise.all([
                    fetchBalanceApi(),
                    fetchTransactionsApi()
                ]);
                setUser((prev) => ({ ...prev, balance: balRes.data.balance }));
                setTransactions(txRes.data.data);
            } catch (err) {
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };
        getDashboardData();
    }, []);

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-blue-900/60 to-slate-800 border-blue-500/30">
                    <span className="text-gray-400 text-sm font-medium">Total Balance</span>
                    <h2 className="text-3xl font-extrabold text-blue-400 mt-2">
                        ${user?.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </h2>
                    <p className="text-xs text-gray-400 mt-2">Available for transfer</p>
                </Card>

                <Card>
                    <span className="text-gray-400 text-sm font-medium">Account Details</span>
                    <div className="mt-2 text-sm space-y-1">
                        <p className="text-gray-300"><span className="text-gray-500">Holder:</span> {user?.name}</p>
                        <p className="text-gray-300"><span className="text-gray-500">Account #:</span> {user?.accountNumber}</p>
                    </div>
                </Card>

                <Card className="flex flex-col justify-between">
                    <div>
                        <span className="text-gray-400 text-sm font-medium font-semibold">Quick Actions</span>
                        <p className="text-xs text-gray-500 mt-1">Send money securely to any account</p>
                    </div>
                    <Link
                        to="/transfer"
                        className="mt-4 text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                    >
                        Initiate Money Transfer →
                    </Link>
                </Card>
            </div>

            {/* Recent Transactions */}
            <Card title="Recent Transactions">
                {loading ? (
                    <p className="text-gray-400 text-sm">Loading transactions...</p>
                ) : transactions.length === 0 ? (
                    <p className="text-gray-400 text-sm">No transactions found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-900/50 text-gray-400 text-xs uppercase border-b border-slate-700">
                            <tr>
                                <th className="py-3 px-4">Date</th>
                                <th className="py-3 px-4">Type</th>
                                <th className="py-3 px-4">Counterparty</th>
                                <th className="py-3 px-4">Description</th>
                                <th className="py-3 px-4 text-right">Amount</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                            {transactions.map((tx) => {
                                const isSender = tx.sender?._id === user?._id;
                                return (
                                    <tr key={tx._id} className="hover:bg-slate-700/30">
                                        <td className="py-3 px-4 text-gray-400">
                                            {new Date(tx.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-3 px-4 capitalize font-medium text-gray-300">
                                            {tx.type}
                                        </td>
                                        <td className="py-3 px-4 text-gray-300">
                                            {isSender ? tx.receiver?.name || 'External' : tx.sender?.name || 'External'}
                                        </td>
                                        <td className="py-3 px-4 text-gray-400">{tx.description}</td>
                                        <td className={`py-3 px-4 text-right font-semibold ${isSender ? 'text-red-400' : 'text-green-400'}`}>
                                            {isSender ? `-$${tx.amount.toFixed(2)}` : `+$${tx.amount.toFixed(2)}`}
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Dashboard;