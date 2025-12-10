// frontend/src/pages/SignupPage.jsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import { useNavigate, Link } from 'react-router-dom';
import AuthForm, { InputField } from '../components/AuthForm';
import toast from 'react-hot-toast';

const SignupPage = () => {
    const [formData, setFormData] = useState({
        username: '', password: '', answer1: '', answer2: '', answer3: ''
    });
    const [error, setError] = useState(null);
    const { signup, loading } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        // Pass data to the backend: username, password, and 3 answers
        const result = await signup(formData);
        console.log(formData);

        if (result.success) {
            toast.success(`Password for "${formData.topicName}" saved successfully!`); 
            navigate('/', { replace: true });
        } else {
            toast.error(message);
            setError(result.error);

        }
    };

    return (
        <AuthForm title="Create Account" onSubmit={handleSubmit}>
            {error && <p className="text-red-600 text-center font-medium">{error}</p>}

            <InputField label="Username" name="username" value={formData.username} onChange={handleChange} />
            <InputField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} />
            
            <h3 className="pt-4 text-lg font-bold text-gray-800 border-t mt-4">Security Questions (Mandatory)</h3>
            
            <InputField 
                label="1. Favourite person in the world" 
                name="answer1" 
                value={formData.answer1} 
                onChange={handleChange} 
                placeholder="Remember this answer!"
            />
            <InputField 
                label="2. Favourite subject" 
                name="answer2" 
                value={formData.answer2} 
                onChange={handleChange} 
                placeholder="Remember this answer!"
            />
            <InputField 
                label="3. Favourite place in world" 
                name="answer3" 
                value={formData.answer3} 
                onChange={handleChange} 
                placeholder="Remember this answer!"
            />
            
            <div>
                <button
                    type="submit"
                    
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-all-ease"
                >
                    {loading ? 'Creating...' : 'Sign Up'}
                </button>
            </div>

            <p className="text-center text-sm text-gray-600">
                Already have an account? 
                <Link to="/login" className="font-medium text-green-600 hover:text-green-500 ml-1">
                    Log In
                </Link>
            </p>
        </AuthForm>
    );
};

export default SignupPage;