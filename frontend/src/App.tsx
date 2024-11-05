import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CreateUserForm from './components/CreateUserForm';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';

function App() {
  // Initialize the state based on `localStorage`
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));
  const [user, setUser] = useState<{ id: number; name: string; email: string; role: string } | null>(null);

  // Load user and token from `localStorage` on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (token && storedUser) {
      // Parse and set the user from localStorage
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (loggedInUser: { id: number; name: string; email: string; role: string }) => {
    setIsAuthenticated(true);
    setUser(loggedInUser); // Update the state with the logged-in user's data
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null); // Clear the user data on logout
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
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
      </Routes>
    </Router>
  );
}

const Home = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">Welcome to the App</h1>
    <CreateUserForm />
  </div>
);

export default App;