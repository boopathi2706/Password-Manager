// frontend/src/components/PasswordRetrievalModal.jsx

import React, { useState } from 'react';
import api from '../api/axios';
import { FaLockOpen, FaTimes, FaClipboardCheck, FaExclamationTriangle } from 'react-icons/fa';

const PasswordRetrievalModal = ({ itemId, topicName, onClose }) => {
    const [answers, setAnswers] = useState({ answer1: '', answer2: '', answer3: '' });
    const [retrievedPassword, setRetrievedPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    const questions = [
        'Favourite person in the world?',
        'Favourite subject?',
        'Favourite place in world?',
    ];

    const handleChange = (e) => {
        setAnswers({ ...answers, [e.target.name]: e.target.value });
    };

    const handleRetrieve = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setRetrievedPassword('');

        try {
            // Send the answers to the secure backend endpoint
            const res = await api.post(`/passwords/${itemId}/retrieve`, answers);
            
            // On success, receive and display the decrypted password
            setRetrievedPassword(res.data.data.password);
            
            // Clear sensitive answers after successful retrieval
            setAnswers({ answer1: '', answer2: '', answer3: '' }); 

            // Automatically hide the password after a timeout for extra security
            setTimeout(() => {
                setRetrievedPassword('');
            }, 30000); // Password visible for 30 seconds

        } catch (err) {
            const message = err.response?.data?.message || 'Retrieval failed. Please try again.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };
    
    const copyToClipboard = () => {
        navigator.clipboard.writeText(retrievedPassword);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-70 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg transition-all-ease transform scale-100">
                
                <header className="p-5 border-b flex justify-between items-center">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                        <FaLockOpen className="text-red-500 mr-2" />
                        Access Password for: **{topicName}**
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-all">
                        <FaTimes className="text-2xl" />
                    </button>
                </header>

                <div className="p-6">
                    {retrievedPassword ? (
                        // --- Password Display View ---
                        <div className="text-center">
                            <p className="text-lg text-gray-700 mb-4">Your secured password:</p>
                            <div className="bg-gray-100 p-4 rounded-lg border border-dashed border-green-500 mb-6">
                                <code className="text-2xl font-mono text-green-700 select-all">
                                    {retrievedPassword}
                                </code>
                            </div>
                            
                            <button
                                onClick={copyToClipboard}
                                className={`w-full py-3 px-4 rounded-md text-white font-semibold transition-all-ease flex items-center justify-center ${
                                    copied ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'
                                }`}
                            >
                                <FaClipboardCheck className="mr-2" />
                                {copied ? 'Copied to Clipboard!' : 'Copy Password'}
                            </button>
                            <p className="mt-4 text-sm text-red-500">
                                Password will disappear automatically in 30 seconds.
                            </p>
                        </div>
                    ) : (
                        // --- Security Question Form View ---
                        <form onSubmit={handleRetrieve} className="space-y-4">
                            <p className="text-sm text-gray-500 mb-4 flex items-center">
                                <FaExclamationTriangle className="text-yellow-500 mr-2" />
                                Enter your security answers to unlock this password.
                            </p>

                            {questions.map((q, index) => (
                                <div key={index}>
                                    <label className="block text-sm font-medium text-gray-700">
                                        {index + 1}. {q}
                                    </label>
                                    <input
                                        type="password" // Use type='password' to hide answers for security
                                        name={`answer${index + 1}`}
                                        value={answers[`answer${index + 1}`]}
                                        onChange={handleChange}
                                        required
                                        placeholder="Type your answer here..."
                                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
                                    />
                                </div>
                            ))}

                            {error && <p className="text-red-600 text-center font-medium">{error}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-4 rounded-md text-white font-semibold bg-red-600 hover:bg-red-700 disabled:opacity-50 transition-all-ease"
                            >
                                {loading ? 'Verifying...' : 'Unlock Password'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PasswordRetrievalModal;