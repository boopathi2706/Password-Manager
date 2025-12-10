// frontend/src/components/LoadingSpinner.jsx

import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
      <p className="ml-3 text-lg text-gray-700">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;