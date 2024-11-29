import { useState } from 'react';
import ArtworkList from './ArtworkList';
import Filters from './Filters';

function Home({ user }: { user: { id: number; name: string; email: string; role: string } | null }) {
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