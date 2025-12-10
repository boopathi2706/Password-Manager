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
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />

                {/* Protected Routes */}
                <Route path="/" element={<ProtectedRoute element={<DashboardPage />} />} />
                
                {/* Catch-all for 404s */}
                <Route path="*" element={<Navigate to="/" replace />} />
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
        </>
    );
}

export default App;