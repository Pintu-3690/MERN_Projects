import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-slate-800 border-b border-slate-700 py-4 px-6 flex justify-between items-center shadow-lg">
            <Link to="/" className="text-xl font-bold tracking-wide text-blue-400 flex items-center gap-2">
                <span className="text-2xl">⚡</span> DigitalBank
            </Link>

            {user ? (
                <div className="flex items-center space-x-6">
                    <Link to="/dashboard" className="text-gray-300 hover:text-white transition font-medium">
                        Dashboard
                    </Link>
                    <Link to="/transfer" className="text-gray-300 hover:text-white transition font-medium">
                        Transfer
                    </Link>
                    <div className="text-sm bg-slate-700 py-1.5 px-3 rounded-full text-blue-300 font-mono">
                        Acc: {user.accountNumber}
                    </div>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition duration-200 shadow"
                    >
                        Logout
                    </button>
                </div>
            ) : (
                <div className="space-x-4">
                    <Link to="/login" className="text-gray-300 hover:text-white font-medium">
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-medium text-white transition duration-200 shadow"
                    >
                        Register
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;