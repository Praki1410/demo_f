import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './app/hooks';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

// Protected route component
const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{element}</>;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/dashboard" 
              element={<ProtectedRoute element={<Dashboard />} />} 
            />
          </Routes>
        </main>
        <footer className="bg-white shadow-inner py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;