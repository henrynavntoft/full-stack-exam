import { useQuery } from '@tanstack/react-query';
import { fetchArtworks } from '../api/artworksApi';
import ArtworkCard from './ArtworkCard';
import { useState, useEffect } from 'react';
import { Artwork, User, Filters } from '../types'; // Use shared types

interface ArtworkListProps {
  user: User | null; // Use the shared User type
  filters: Filters;  // Use the shared Filters type
}

function ArtworkList({ user, filters }: ArtworkListProps) {
  const [page, setPage] = useState(1);
  const [art, setArt] = useState<Artwork[]>([]);
  const [totalArtworks, setTotalArtworks] = useState(0);

  const { searchQuery, artist, period } = filters;

  const { data, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ['artworks', page, searchQuery, artist, period],
    queryFn: () => fetchArtworks(page, filters), // Fetch data using API
    staleTime: 5000,
  });

  // Update artworks and totalArtworks whenever data changes
  useEffect(() => {
    if (data) {
      const { artworks, totalArtworks: total } = data;

      if (page === 1) {
        setArt(artworks); // Replace existing artworks on the first page
      } else {
        setArt((prevArtworks) => [...prevArtworks, ...artworks]); // Append artworks for pagination
      }
      setTotalArtworks(total); // Update total artworks count
    }
  }, [data, page]);

  const loadMoreArt = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const isAllFetched = art.length >= totalArtworks;

  // Handle artwork deletion
  const handleArtworkDelete = (deletedArtworkId: number) => {
    setArt((prevArt) => prevArt.filter((artwork) => artwork.id !== deletedArtworkId));
  };

  return (
    <div>
      {/* Loading and Error Handling */}
      {isLoading && page === 1 && <p>Loading artworks...</p>}
      {isError && <p>Error loading artworks: {(error as Error).message}</p>}

      {/* Artwork Cards */}
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 m-4">
        {art?.map((artwork) => (
          <ArtworkCard
            key={artwork.id}
            artwork={artwork}
            user={user}
            onDelete={handleArtworkDelete} // Pass delete callback to ArtworkCard
          />
        ))}
      </ul>

      {/* Load More Button */}
      <button
        onClick={loadMoreArt}
        className="mx-4 bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary-dark"
        disabled={isFetching || isLoading || isAllFetched}
      >
        {isFetching || isLoading ? 'Loading...' : isAllFetched ? 'All Artworks Loaded' : 'Load More'}
      </button>
    </div>
  );
}

export default ArtworkList;