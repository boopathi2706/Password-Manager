// frontend/src/pages/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import api from '../api/axios';
import PasswordFormModal from '../components/PasswordFormModal';
import PasswordRetrievalModal from '../components/PasswordRetrievalModal';
import toast from 'react-hot-toast';
// UPDATED: Added FaTrashAlt icon import
import { FaLock, FaStar, FaRegStar, FaPlus, FaSignOutAlt, FaTrashAlt } from 'react-icons/fa';

const DashboardPage = () => {
    const { user, logout } = useAuth();
    const [passwords, setPasswords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Modal state for Retrieval
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [selectedTopicName, setSelectedTopicName] = useState('');
    
    // Modal state for Adding a new password
    const [isFormModalOpen, setIsFormModalOpen] = useState(false); 

    // --- 1. Fetch Password List ---
    const fetchPasswords = async () => {
        try {
            setLoading(true);
            const res = await api.get('/passwords');
            setPasswords(res.data.data);
            setLoading(false);
        } catch (err) {
            // Check if error is 401 (Unauthorized) and redirect to login
            if (err.response?.status === 401) {
                logout(); // Logs user out if token is expired/invalid
            }
            setError('Failed to load passwords.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPasswords();
    }, []);

    // --- NEW: Handle Delete Function ---
   const handleDelete = async (id, topicName) => { // Added topicName for a better message
        
        // Custom confirmation prompt using a toast
        toast((t) => (
            <div className="flex flex-col space-y-2">
                <p className="text-gray-900 font-semibold">Confirm Deletion</p>
                <p className="text-sm text-gray-700">Are you sure you want to delete ?</p>
                <div className="flex justify-end space-x-2">
                    <button 
                        onClick={() => toast.dismiss(t.id)} 
                        className="text-sm px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={() => {
                            _performDelete(id, topicName);
                            toast.dismiss(t.id);
                        }} 
                        className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Delete
                    </button>
                </div>
            </div>
        ), {
            duration: Infinity,
            style: { background: 'white', border: '1px solid #ccc' },
        });
    };

    const _performDelete = async (id, topicName) => {
        try {
            await api.delete(`/passwords/${id}`);
            toast.success(`Password for "${topicName}" deleted.`); // SUCCESS TOAST
            fetchPasswords(); 
            
        } catch (err) {
            toast.error('Failed to delete item.'); // ERROR TOAST
        }
    };

    // --- 2. Handle Favorite Toggle (Optional - requires backend update logic) ---
    const handleFavoriteToggle = (id) => {
        // In a real app, send a PATCH request here to update the 'isFavorite' field
        console.log('Toggling favorite for:', id);
    };

    // --- 3. Handle Password Click (Opens Retrieval Modal) ---
    const handlePasswordClick = (id, topicName) => {
        setSelectedItemId(id);
        setSelectedTopicName(topicName);
        setIsModalOpen(true);
    };

    if (loading) return <div className="flex items-center justify-center min-h-screen">Loading password list...</div>;
    if (error) return <div className="flex items-center justify-center min-h-screen text-red-600 text-lg">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10">
                <h1 className="text-xl font-bold text-gray-800 flex items-center">
                    <FaLock className="text-blue-600 mr-2" />
                    {user?.username}'s Vault
                </h1>
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={() => setIsFormModalOpen(true)}
                        className="text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-md flex items-center transition-all-ease"
                    >
                        <FaPlus className="mr-1" /> Add New
                    </button>
                    <button 
                        onClick={logout}
                        className="text-sm text-gray-600 hover:text-red-600 transition-all-ease flex items-center"
                    >
                        <FaSignOutAlt className="mr-1" /> Logout
                    </button>
                </div>
            </header>

            <main className="p-4 md:p-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">Password Topics</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {passwords.length === 0 ? (
                        <p className="col-span-full text-center text-gray-500">No passwords saved yet. Click "Add New" to get started!</p>
                    ) : (
                        passwords.map((item) => (
                            <div 
                                key={item._id} 
                                // The main div onClick opens the retrieval modal
                                onClick={() => handlePasswordClick(item._id, item.topicName)}
                                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl border-t-4 border-blue-500 cursor-pointer transition-all-ease flex justify-between items-center"
                            >
                                <p className="text-lg font-medium text-gray-800">{item.topicName}</p>
                                
                                <div className="flex space-x-3 items-center">
                                    {/* Favorite Toggle Button */}
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleFavoriteToggle(item._id); }}
                                        className="text-xl text-yellow-500 hover:text-yellow-600 p-1"
                                        title="Toggle Favorite"
                                    >
                                        {item.isFavorite ? <FaStar /> : <FaRegStar className="text-gray-400 hover:text-yellow-500" />}
                                    </button>
                                    
                                    {/* DELETE Button (NEW FEATURE) */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(item._id); }} // Stop propagation prevents the click from opening the retrieval modal
                                        className="text-lg text-gray-400 hover:text-red-600 transition-all p-1"
                                        title="Delete Password Item"
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>

            {/* Password Retrieval Modal */}
            {isModalOpen && (
                <PasswordRetrievalModal
                    itemId={selectedItemId}
                    topicName={selectedTopicName}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
             {/* Password Form Modal (Add New) */}
             {isFormModalOpen && (
                <PasswordFormModal
                    onClose={() => setIsFormModalOpen(false)}
                    onPasswordAdded={fetchPasswords} 
                />
            )}
             {/* <footer className="w-full py-4 text-right pr-8">
                <p className="text-sm text-gray-700">
                    Made by 
                    <span className="text-black ml-1 mr-1">@</span> 
                    <span className="text-blue-600 font-medium">boopathi</span>
                </p>
            </footer> */}
        </div>
    );
};

export default DashboardPage;