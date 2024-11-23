import { useNavigate } from 'react-router-dom';
import UserList from './UserList';
import ArtworkList from './ArtworkList';

interface DashboardProps {
  onLogout: () => void;
  user: { id: number; name: string; email: string; role: string } | null;
}

function Dashboard({ onLogout, user }: DashboardProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="p-6 max-w-4xl w-full bg-card shadow-md rounded-lg">
        <section className="p-4 mb-6 border-b border-border">
          {/* Display user role in the dashboard title */}
          <h1 className="text-3xl font-bold text-primary mb-2">
            {user?.role === 'ADMIN' ? 'Admin' : 'User'} Dashboard
          </h1>
          <p className="text-muted-foreground">Welcome, {user?.name}!</p>
          <button
            onClick={handleLogout}
            className="mt-4 bg-destructive text-destructive-foreground px-4 py-2 rounded hover:bg-destructive-dark transition"
          >
            Logout
          </button>
        
        </section>
        
        {/* Display artworks */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-2">Artworks</h2>
          <ArtworkList />
        </section>

        {/* Only render UserList if the user has an ADMIN role */}
        {user?.role === 'ADMIN' && (
          <section className="p-4">
            <UserList isAdmin={user.role === 'ADMIN'} loggedInUserId={user.id} />
          </section>
        )}
      </div>
    </div>
  );
}

export default Dashboard;