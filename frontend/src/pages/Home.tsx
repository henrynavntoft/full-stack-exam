import { useState } from 'react';
import  useAuth  from '../context/useAuth'; 
import ArtworkList from '../components/ArtworkList';
import Filters from '../components/Filters';

function Home() {
  const { user } = useAuth(); // Access user directly from AuthContext
  const [filters, setFilters] = useState({ searchQuery: '', artist: '', period: '' });

  const handleFilterChange = (updatedFilters: { searchQuery: string; artist: string; period: string }) => {
    setFilters(updatedFilters);
  };

  return (
    <div>
      {/* Filters Section */}
      <Filters onFilterChange={handleFilterChange} />

      {/* Artwork List Section */}
      <ArtworkList user={user} filters={filters} />
    </div>
  );
}

export default Home;