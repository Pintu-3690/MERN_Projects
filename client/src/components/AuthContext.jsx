import React, { createContext, useState, useEffect } from 'react';
import { loginApi, registerApi, fetchProfileApi } from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('banking_token');
            if (token) {
                try {
                    const res = await fetchProfileApi();
                    setUser(res.data.data);
                } catch (err) {
                    localStorage.removeItem('banking_token');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        loadUser();
    }, []);

    const login = async (credentials) => {
        const res = await loginApi(credentials);
        const { token, ...userData } = res.data.data;
        localStorage.setItem('banking_token', token);
        setUser(userData);
        return res.data;
    };

    const register = async (userData) => {
        const res = await registerApi(userData);
        const { token, ...data } = res.data.data;
        localStorage.setItem('banking_token', token);
        setUser(data);
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('banking_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};