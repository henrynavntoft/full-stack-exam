import React from 'react';
import ArtworkList from './ArtworkList';

interface HomeProps {
  user: { id: number; name: string; email: string; role: string } | null;
  filters: { searchQuery: string; artist: string; period: string };
}

const Home: React.FC<HomeProps> = ({ user, filters }) => (
  <>
    <ArtworkList user={user} filters={filters} />
  </>
);

export default Home;