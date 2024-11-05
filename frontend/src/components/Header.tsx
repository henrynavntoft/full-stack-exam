// src/components/Header.tsx
import { Link, useNavigate } from 'react-router-dom';

interface HeaderProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

function Header({ isAuthenticated, onLogout }: HeaderProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <header className="flex justify-between items-center p-4 bg-background text-foreground shadow-md">
      {/* Left: App title */}
      <div className="text-2xl font-bold text-primary">
        <Link to="/">ART PROJECT</Link>
      </div>

      {/* Right: Auth buttons */}
      <div>
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="bg-destructive text-destructive-foreground px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="mr-4 bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary-dark">
              Login
            </Link>
            <Link to="/signup" className="bg-secondary text-secondary-foreground px-4 py-2 rounded hover:bg-secondary-dark">
              Signup
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;