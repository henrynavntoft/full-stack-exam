import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { fetchArtwork } from '../api/artworksApi';
import { Artwork } from '../types';

function ArtworkDetails() {
  const { id } = useParams<{ id: string }>(); // Retrieve the artwork ID from URL parameters
  const artworkId = id ? parseInt(id) : undefined;

  // Fetch the artwork data with TanStack Query
  const { data: artwork, isLoading, isError } = useQuery<Artwork>({
    queryKey: ['artwork', artworkId],
    queryFn: () => fetchArtwork(artworkId!),
    enabled: !!artworkId, // Only run the query if artworkId is valid
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError || !artwork) return <p>Artwork not found.</p>;

  return (
    <div className="max-w-screen-lg mx-auto p-10 bg-white shadow-md rounded-lg flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 mt-20">
      {/* Artwork Image Section */}
      {artwork.imageUrl && (
        <div className="flex-shrink-0 w-full md:w-1/2">
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            className="w-full h-auto object-contain rounded-md"
          />
        </div>
      )}

      {/* Artwork Details Section */}
      <div className="flex flex-col w-full md:w-1/2">
        <h1 className="text-3xl font-bold mb-4">{artwork.title}</h1>
       

        {artwork.artistProductions && (
          <p className="text-gray-500 mb-2">
            <strong>Artists:</strong> {artwork.artistProductions.map((ap) => ap.artist.name).join(', ')}
          </p>
        )}

        {artwork.period && (
          <p className="text-gray-500 mb-2">
            <strong>Period:</strong> {artwork.period.periodName} (
            {new Date(artwork.period.startDate).getFullYear()} - {new Date(artwork.period.endDate).getFullYear()})
          </p>
        )}

        {artwork.description && (
          <p className="text-gray-500 mb-2">
            <strong>Description:</strong> {artwork.description}
          </p>
        )}

        {artwork.colors && artwork.colors.length > 0 && (
          <div className="">
            <p className="text-gray-700 mb-2 font-semibold">Colors:</p>
            <div className="flex space-x-2">
              {artwork.colors.map((color) => (
                <span
                  key={color.id}
                  className="w-8 h-8 rounded-full border"
                  style={{ backgroundColor: color.color }}
                ></span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArtworkDetails;