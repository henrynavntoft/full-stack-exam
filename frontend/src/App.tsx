import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CreateUserForm from './components/CreateUserForm';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import ArtworkList from './components/ArtworkList';
import ArtworkDetails from './components/ArtworkDetails';
import {fetchUserDetails} from './api/authApi';



function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ id: number; name: string; email: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true); 

  
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const data = await fetchUserDetails(); 
        setUser(data.user); 
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
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
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <Router>
      {/* Header is rendered on all pages */}
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />

      <Routes>
        <Route path="/" element={<Home />} />
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
        <Route path="/artworks/:id" element={<ArtworkDetails />} /> {/* Dynamic Route */}
      </Routes>
    </Router>
  );
}

const Home = () => (
 <>
    <ArtworkList />
</>
);

export default App;