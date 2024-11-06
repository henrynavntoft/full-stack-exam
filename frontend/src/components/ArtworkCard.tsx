// src/components/ArtworkCard.tsx
import { Link } from 'react-router-dom';
import { Artwork } from '../types';

interface ArtworkCardProps {
  artwork: Artwork;
}

function ArtworkCard({ artwork }: ArtworkCardProps) {
  return (
    <li className="p-4 border rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow">
      <Link to={`/artworks/${artwork.id}`} className="block">
        {artwork.imageUrl && (
          <img
            src={artwork.imageUrl}
            alt={artwork.title}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
        )}
        <h2 className="font-semibold text-xl mb-2">{artwork.title}</h2>
        {artwork.artistProductions && artwork.artistProductions.length > 0 && (
          <p className="text-gray-700 mb-2">
            By: {artwork.artistProductions.map((ap) => ap.artist.name).join(', ')}
          </p>
        )}
      </Link>
    </li>
  );
}

export default ArtworkCard;