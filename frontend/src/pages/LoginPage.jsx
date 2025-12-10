// frontend/src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import { useNavigate, Link } from 'react-router-dom';
import AuthForm, { InputField } from '../components/AuthForm';
import toast from 'react-hot-toast'; 

const LoginPage = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    // FIX 1: Removed redundant local error state: const [error, setError] = useState(null);
    const { login, loading } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // FIX 2: Removed unnecessary state cleanup: setError(null);
        
        const result = await login(formData);

        if (result.success) {
            toast.success('Login Successful! Welcome back.');
            navigate('/dashboard', { replace: true });
        } else {
            // FIX 3: Safely define the error message and call toast.
            const errorMessage = result.error?.response?.data?.message || 
                                 result.error?.message || 
                                 "Login failed due to an unknown error.";
                                 
            toast.error(errorMessage);
            // FIX 4: Removed the line setError(result.error);
        }
    };

    return (
        <AuthForm title="Secure Login" onSubmit={handleSubmit}>
            {/* FIX 5: Removed the display of the redundant local error state */}
            {/* {error && <p className="text-red-600 text-center font-medium">{error}</p>} */}
            
            <InputField 
                label="Username" 
                name="username" 
                value={formData.username} 
                onChange={handleChange} 
                placeholder="Enter your username"
            />
            
            <InputField 
                label="Password" 
                name="password" 
                type="password" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="Enter your password"
            />
            
            <div>
                <button
                    type="submit"
                  // Use loading state to disable the button
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all-ease"
                >
                    {loading ? 'Logging In...' : 'Log In'}
                </button>
            </div>
            
            <p className="text-center text-sm text-gray-600">
                Don't have an account? 
                <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500 ml-1">
                    Sign Up
                </Link>
            </p>
             {/* <footer className="w-full py-4 text-right pr-8">
                <p className="text-sm text-gray-700">
                    Made by 
                    <span className="text-black ml-1 mr-1">@</span> 
                    <span className="text-blue-600 font-medium">boopathi</span>
                </p>
            </footer> */}
        </AuthForm>
    );
};

export default LoginPage;