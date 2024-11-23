import { useNavigate } from 'react-router-dom';
import UserList from './UserList';
import ArtworkList from './ArtworkList';
import { useState } from 'react';


interface DashboardProps {
  onLogout: () => void;
  user: { id: number; name: string; email: string; role: string } | null;
}

function Dashboard({ onLogout, user }: DashboardProps) {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [period, setPeriod] = useState('all');
  const [artist, setArtist] = useState('all');

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const resetFilters = () => {
    setSearchQuery('');
    setPeriod('all');
    setArtist('all');
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

        <section>
          <div className="flex justify-between mb-4">
            <h2 className="text-2xl font-bold text-primary">Filters</h2>
            <button onClick={resetFilters} className="text-primary hover:text-primary-dark">
              Reset Filters
            </button>
          </div>
          <div className="flex flex-wrap -mx-4">

          <div className="w-full md:w-1/2 xl:w-1/3 px-4 mb-4">
          <label className="block mb-2 text-sm text-muted-foreground">Search</label>

          <input 
          className="block w-full px-4 py-2 text-sm text-muted-foreground bg-white border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" type="text" placeholder="Title, period.." name="search" 
          type="text"
          placeholder="Title, period.."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}          
          />
          </div>

            <div className="w-full md:w-1/2 xl:w-1/3 px-4 mb-4">
            <label className="block mb-2 text-sm text-muted-foreground">Period</label>
            <select 
            className="block w-full px-4 py-2 text-sm text-muted-foreground bg-white border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" name="period"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="all">All</option>
              <option value="renaissance">Renaissance</option>
              <option value="baroque">Baroque</option>
              <option value="romanticism">Romanticism</option>
              </select>
            </div>
              <div className="w-full md:w-1/2 xl:w-1/3 px-4 mb-4">
              <label className="block mb-2 text-sm text-muted-foreground">Artists</label>
              <select 
              className="block w-full px-4 py-2 text-sm text-muted-foreground bg-white border border-border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" name="artists"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              >
                <option value="all">All</option>
                <option value="leonardo">Leonardo da Vinci</option>
                <option value="raphael">Raphael</option>
                <option value="michelangelo">Michelangelo</option>
              </select>
              </div>
          </div>
        </section>
        
        {/* Display artworks */}
        <section>
          <h2 className="text-2xl font-bold text-primary mb-2">Artworks</h2>
          <ArtworkList user={user} filters={{ searchQuery, period, artist }}
 />
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