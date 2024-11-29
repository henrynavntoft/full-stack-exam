import { Link, useNavigate } from 'react-router-dom';
import  useAuth  from '../context/useAuth';

function Header() {
  const { isAuthenticated, logout } = useAuth(); // Access AuthContext
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Failed to logout:', error);
      alert('Failed to logout. Please try again.');
    }
  };

  return (
    <header className="flex justify-between items-center p-4 bg-background text-foreground">
      {/* Left: App title */}
      <div className="text-2xl font-bold text-primary">
        <Link to="/">ART PROJECT</Link>
      </div>

      {/* Right: Auth buttons */}
      <div>
        {isAuthenticated ? (
          <>
            <button
              onClick={handleLogout}
              className="bg-destructive text-destructive-foreground px-4 py-2 rounded hover:bg-red-700"
              aria-label="Logout from the application"
            >
              Logout
            </button>
            <Link
              to="/dashboard"
              className="ml-4 bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary-dark"
              aria-label="Go to Dashboard"
            >
              Dashboard
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="mr-4 bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary-dark"
              aria-label="Login to the application"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary-dark"
              aria-label="Sign up for a new account"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;