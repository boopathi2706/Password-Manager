// frontend/src/App.jsx

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthProvider';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import LoadingSpinner from './components/LoadingSpinner';
import "./App.css" ;
import { Toaster } from 'react-hot-toast';// We'll create this simple component

// --- Protected Route Component ---
const ProtectedRoute = ({ element: Component }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    // Redirect to login if not authenticated
    return isAuthenticated ? Component : <Navigate to="/login" replace />;
};

function App() {
    return (
         <> {/* Use a fragment to wrap the Routes and Toaster */}
           <Routes>
                {/* 1. Public Routes: These are rendered immediately */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* 2. Protected Route: This checks for authentication and will show 
                       the spinner ONLY if a page is accessed directly during the initial check. */}
                <Route path="/dashboard" element={<ProtectedRoute element={<DashboardPage />} />} />

                {/* 3. Default Route: Redirect the bare root path to login. */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                
                {/* 4. Catch-all for 404s */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
            
            {/* NEW: Toast Notification Provider */}
            <Toaster
                position="bottom-right" // Position as requested
                toastOptions={{
                    success: {
                        style: {
                            background: '#10B981', // green-500
                            color: 'white',
                        },
                    },
                    error: {
                        style: {
                            background: '#EF4444', // red-500
                            color: 'white',
                        },
                    },
                    style: {
                        fontSize: '16px',
                        padding: '16px',
                    },
                }}
            />
            <footer className="w-full py-4 text-right pr-8">
                <p className="text-sm text-gray-700">
                    Made by 
                    <span className="text-black ml-1 mr-1">@</span> 
                    <span className="text-blue-600 font-medium">boopathi</span>
                </p>
            </footer>
        </>
    );
}

export default App;