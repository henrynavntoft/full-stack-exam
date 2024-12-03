import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; 
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import LoginForm from './pages/LoginForm';
import CreateUserForm from './pages/CreateUserForm';
import ArtworkDetails from './pages/ArtworkDetails';
import ForgotPassword from './pages/ForgotPassword';

function App() {

  return (
    <AuthProvider>
    <Router>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<CreateUserForm />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/artworks/:id" element={<ArtworkDetails />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;