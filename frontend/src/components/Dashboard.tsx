import { useNavigate } from 'react-router-dom';
import UserList from './UserList';
import ArtworkList from './ArtworkList';
import Filters from './Filters'; // Import the new Filters component
import { useState } from 'react';

interface DashboardProps {
  onLogout: () => void;
  user: { id: number; name: string; email: string; role: string } | null;
}

function Dashboard({ onLogout, user }: DashboardProps) {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({ searchQuery: '', artist: '', period: '' });

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const handleFilterChange = (updatedFilters: { searchQuery: string; artist: string; period: string }) => {
    setFilters(updatedFilters); // Update the filters state
  };

  return (
    <div className="flex items-center justify-center p-4 bg-background">
      <div className="p-6 w-full bg-card shadow-md rounded-lg">
        {/* Header Section */}
        <section className="p-4 mb-6 border-b border-border">
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

        {/* Filters Section */}
        <section className="mb-6">
          <Filters onFilterChange={handleFilterChange} /> {/* Use the reusable Filters component */}
        </section>

        {/* Artworks Section */}
        <section className="mb-6">
          <h2 className="text-2xl font-bold text-primary mb-2">Artworks</h2>
          <ArtworkList user={user} filters={filters} />
        </section>

        {/* User Management Section */}
        {user?.role === 'ADMIN' && (
          <section className="p-4">
            <h2 className="text-2xl font-bold text-primary mb-2">User Management</h2>
            <UserList isAdmin={user.role === 'ADMIN'} loggedInUserId={user.id} />
          </section>
        )}
      </div>
    </div>
  );
}

export default Dashboard;