import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CreateUserForm from './components/CreateUserForm';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import ArtworkDetails from './components/ArtworkDetails';
import Home from './components/Home';
import { fetchUserDetails, logoutUser } from './api/authApi';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ id: number; name: string; email: string; role: string } | null>(null);
  const [filters] = useState({ searchQuery: '', artist: '', period: '' }); 
  const [loading, setLoading] = useState(true); // Track loading state


useEffect(() => {
  const initializeAuth = async () => {
    try {
      const data = await fetchUserDetails(); 
      if (data) {
        console.log('User fetched successfully:', data.user);
        setUser(data.user); // Update user state
        setIsAuthenticated(true);
      } else {
        console.log('No user found, logging out.');
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error initializing authentication:', error);
      setUser(null);
      setIsAuthenticated(false);
    }finally {
        setLoading(false); // End loading
      }
  };

  initializeAuth();
}, []);

  const handleLogin = (loggedInUser: { id: number; name: string; email: string; role: string }) => {
    setIsAuthenticated(true);
    setUser(loggedInUser);
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Prevent redirect until loading is complete
  }

  return (
    <Router>
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <Routes>
        <Route 
          path="/" 
          element={<Home user={user} filters={filters} />} 
        />
        <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
        <Route path="/signup" element={<CreateUserForm />} />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard onLogout={handleLogout} user={user} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/artworks/:id" element={<ArtworkDetails />} />
      </Routes>
    </Router>
  );
}

export default App;