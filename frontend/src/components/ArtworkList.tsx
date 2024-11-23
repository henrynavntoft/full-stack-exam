// src/components/ArtworkList.tsx
import { useQuery } from '@tanstack/react-query';
import { fetchArtworks } from '../api/artworksApi';
import ArtworkCard from './ArtworkCard';
import { useState, useEffect } from 'react';

function ArtworkList() {
  const [page, setPage] = useState(1);
  const [art, setArt] = useState([]);

  const {
    data: artworks,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ['artworks', page],
    queryFn: () => fetchArtworks(page),
    keepPreviousData: true,
  });

  useEffect(() => {
    if (artworks) {
      if (page === 1) {
        setArt(artworks); 
      } else {
        setArt((prevArtworks) => [...prevArtworks, ...artworks]); 
      }
    }
  }, [artworks, page]); 

  const loadMoreArt = () => {
    setPage((prevPage) => prevPage + 1); 
  };

  return (
    <div>
      {isLoading && page === 1 && <p>Loading artworks...</p>}
      {isError && <p>Error loading artworks: {(error as Error).message}</p>}

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {art?.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </ul>

      <button
        onClick={loadMoreArt}
        className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark transition"
        disabled={isFetching || isLoading}
      >
        {isFetching || isLoading ? 'Loading...' : 'Load More'}
      </button>
    </div>
  );
}

export default ArtworkList;