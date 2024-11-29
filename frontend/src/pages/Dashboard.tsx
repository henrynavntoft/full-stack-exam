import { useNavigate } from 'react-router-dom';
import UserList from '../components/UserList';
import ArtworkList from '../components/ArtworkList';
import Filters from '../components/Filters'; // Import the Filters component
import { useState } from 'react';
import  useAuth  from '../context/useAuth'; // Import useAuth to access user and logout

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Access user and logout function from AuthContext

  const [filters, setFilters] = useState({ searchQuery: '', artist: '', period: '' });

  const handleLogout = async () => {
    try {
      await logout(); // Call logout from AuthContext
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Failed to log out:', error);
    }
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