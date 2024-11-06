// src/components/ArtworkDetails.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Artwork } from '../types';

function ArtworkDetails() {
  const { id } = useParams<{ id: string }>(); // Retrieve the artwork ID from URL parameters
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const response = await axios.get<Artwork>(`http://localhost:3000/api/artworks/${id}`);
        setArtwork(response.data);
      } catch (error) {
        console.error("Error fetching artwork details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtwork();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!artwork) return <p>Artwork not found.</p>;

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded">
      {artwork.imageUrl && (
        <img
          src={artwork.imageUrl}
          alt={artwork.title}
          className="w-full h-64 object-cover rounded-md mb-4"
        />
      )}
      <h1 className="text-3xl font-bold mb-4">{artwork.title}</h1>
      <p className="text-gray-600 mb-2">{artwork.description}</p>
      {artwork.artistProductions && (
        <p className="text-gray-700 mb-2">
          Artists: {artwork.artistProductions.map((ap) => ap.artist.name).join(', ')}
        </p>
      )}
      {artwork.period && (
        <p className="text-gray-500 mb-2">
          Period: {artwork.period.periodName} ({new Date(artwork.period.startDate).getFullYear()} - {new Date(artwork.period.endDate).getFullYear()})
        </p>
      )}
      {artwork.colors && artwork.colors.length > 0 && (
        <div className="flex space-x-2 mt-4">
          {artwork.colors.map((color) => (
            <span
              key={color.id}
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: color.color }}
            ></span>
          ))}
        </div>
      )}
    </div>
  );
}

export default ArtworkDetails;