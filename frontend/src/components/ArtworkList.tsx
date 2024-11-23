// src/components/ArtworkList.tsx
import { useQuery } from '@tanstack/react-query';
import { fetchArtworks } from '../api/artworksApi';
import ArtworkCard from './ArtworkCard';
import { useState } from 'react';

function ArtworkList() {
  const [page, setPage] = useState(1);

  const {
    data: artworks,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['artworks', page],
    queryFn: () => fetchArtworks(page),
    keepPreviousData: true,
  });

  const loadMoreArt = () => {
    setPage((prevPage) => prevPage + 1); // Increment page for the next fetch
  };

  return (
    <div>
      {isLoading && page === 1 && <p>Loading artworks...</p>}
      {isError && <p>Error loading artworks: {(error as Error).message}</p>}

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {artworks?.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </ul>

      <button
        onClick={loadMoreArt}
        className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Load More'}
      </button>
    </div>
  );
}

export default ArtworkList;