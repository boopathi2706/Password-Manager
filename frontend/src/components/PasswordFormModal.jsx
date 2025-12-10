// frontend/src/components/PasswordFormModal.jsx

import React, { useState } from 'react';
import api from '../api/axios';
import { FaTimes, FaSave } from 'react-icons/fa';
import toast from 'react-hot-toast';

const PasswordFormModal = ({ onClose, onPasswordAdded }) => {
    const [formData, setFormData] = useState({
        topicName: '',
        password: '',
        isFavorite: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // The backend endpoint for creating a new password is POST /api/passwords
            await api.post('/passwords', formData); 
            toast.success(`Password for "${formData.topicName}" saved successfully!`); 
            
            // Notify the parent component (DashboardPage) to refresh the list
            onPasswordAdded(); 
            
            onClose(); // Close the modal on success

        } catch (err) {
            const message = err.response?.data?.message || 'Failed to save password.';
            toast.error(message);
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-70 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transition-all-ease transform scale-100">
                
                <header className="p-5 border-b flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900">Add New Password Item</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-all">
                        <FaTimes className="text-2xl" />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    
                    {error && <p className="text-red-600 text-center font-medium">{error}</p>}

                    {/* Topic Name Input */}
                    <div>
                        <label htmlFor="topicName" className="block text-sm font-medium text-gray-700">
                            Topic Name (e.g., Google, Work VPN)
                        </label>
                        <input
                            id="topicName"
                            name="topicName"
                            type="text"
                            value={formData.topicName}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="text" // Use text to allow user to see/copy what they enter
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Favorite Checkbox */}
                    <div className="flex items-center">
                        <input
                            id="isFavorite"
                            name="isFavorite"
                            type="checkbox"
                            checked={formData.isFavorite}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="isFavorite" className="ml-2 block text-sm font-medium text-gray-900">
                            Mark as Favorite
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 rounded-md text-white font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-all-ease flex items-center justify-center"
                    >
                        <FaSave className="mr-2" />
                        {loading ? 'Saving...' : 'Save Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PasswordFormModal;