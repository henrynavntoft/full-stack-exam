// src/components/ArtworkList.tsx
import { useQuery } from '@tanstack/react-query';
import { fetchArtworks } from '../api/artworksApi';
import ArtworkCard from './ArtworkCard';

function ArtworkList() {
  const { data: artworks, isLoading, isError, error } = useQuery({
    queryKey: ['artworks'],
    queryFn: fetchArtworks,
  });

  if (isLoading) return <p>Loading artworks...</p>;
  if (isError) return <p>Error loading artworks: {(error as Error).message}</p>;

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {artworks?.map((artwork) => (
        <ArtworkCard key={artwork.id} artwork={artwork} />
      ))}
    </ul>
  );
}

export default ArtworkList;