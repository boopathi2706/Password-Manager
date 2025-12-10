// frontend/src/components/AuthForm.jsx

import React from 'react';

const AuthForm = ({ title, children, onSubmit }) => (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl transition-all-ease hover:shadow-3xl">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
                {title}
            </h2>
            <form className="space-y-6" onSubmit={onSubmit}>
                {children}
            </form>
        </div>
    </div>
);

export const InputField = ({ label, name, type = 'text', value, onChange, placeholder, required = true }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
            {label}
        </label>
        <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
    </div>
);

export default AuthForm;