// frontend/src/context/AuthProvider.jsx

import React, { createContext, useState, useContext } from 'react';
// frontend/src/context/AuthProvider.jsx

import api from '../api/axios'; // <--- The error is here// Your custom axios instance

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Will store user data on successful login
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    // Function to handle both signup and login
    // frontend/src/context/AuthProvider.jsx (Only the updated handleAuth function)

    // Function to handle both signup and login
    const handleAuth = async (endpoint, data) => {
        try {
            setLoading(true);
            const res = await api.post(`/auth/${endpoint}`, data);

            // On success, update state
            setUser(res.data.user);
            setIsAuthenticated(true);
            setLoading(false);
            return { success: true };

        } catch (err) {
            setLoading(false);
            
            // CRITICAL FIX: Instead of returning just a string, 
            // return the full error object (err) received from Axios.
            // This allows LoginPage/SignupPage to safely access err.response?.data?.message
            return { success: false, error: err }; 
        }
    };

    const login = (data) => handleAuth('login', data);
    const signup = (data) => handleAuth('signup', data);

    const logout = async () => {
        try {
            await api.get('/auth/logout'); // Clear the HTTP-only cookie on the server
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    // The context value
    const contextValue = {
        user,
        isAuthenticated,
        loading,
        login,
        signup,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};