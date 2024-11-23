// src/components/ArtworkList.tsx
import { useQuery } from '@tanstack/react-query';
import { fetchArtworks } from '../api/artworksApi';
import ArtworkCard from './ArtworkCard';
import { useState, useEffect } from 'react';

interface ArtworkListProps {
  user: { id: number; name: string; email: string; role: string } | null;
}

function ArtworkList({user}: ArtworkListProps) {
  const [page, setPage] = useState(1);
  const [art, setArt] = useState([]);
  const [totalArtworks, setTotalArtworks] = useState(0);


  const {
    data,
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
    if (data) {
      const { artworks, totalArtworks: total } = data;

    if (page === 1) {
      setArt(artworks); 
    } else {
      setArt((prevArtworks) => [...prevArtworks, ...artworks]); 
    }
    setTotalArtworks(total); 
  }
  }, [data, page]); 

  const loadMoreArt = () => {
    setPage((prevPage) => prevPage + 1); 
  };

  const isAllFetched = art.length >= totalArtworks; 


  return (
    <div>
      {isLoading && page === 1 && <p>Loading artworks...</p>}
      {isError && <p>Error loading artworks: {(error as Error).message}</p>}

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-4">
        {art?.map((artwork) => (
          <ArtworkCard key={artwork.id} artwork={artwork} user={user} />
        ))}
      </ul>

      <button
        onClick={loadMoreArt}
        className="m-4 bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary-dark"
        disabled={isFetching || isLoading || isAllFetched}
      >
        {isFetching || isLoading ? 'Loading...' : isAllFetched ? 'All Artworks Loaded' : 'Load More'}
        </button>
    </div>
  );
}

export default ArtworkList;