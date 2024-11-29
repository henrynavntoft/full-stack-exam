import { Link } from 'react-router-dom';
import { Artwork } from '../types';
import { useState, useEffect } from 'react';
import { likeArtwork, deleteLikeArtwork, deleteArtwork } from '../api/artworksApi';

interface ArtworkCardProps {
  artwork: Artwork;
  user: { id: number; name: string; email: string; role: string } | null;
  onDelete: (deletedArtworkId: number) => void;
}

function ArtworkCard({ artwork, user, onDelete }: ArtworkCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  // Set the initial liked state based on artwork data
  useEffect(() => {
    if (user && artwork.likedByUser) {
      setIsLiked(true);
    }
  }, [user, artwork.likedByUser]);

  const handleLike = async () => {
    if (!user || isLiking) return;

    setIsLiking(true);
    try {
      if (!isLiked) {
        await likeArtwork(artwork.id, user.id);
      } else {
        await deleteLikeArtwork(artwork.id, user.id);
      }
      setIsLiked((prev) => !prev);
    } catch (error) {
      console.error(`Failed to ${isLiked ? 'unlike' : 'like'} artwork:`, error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteArtwork(artwork.id);
      onDelete(artwork.id);
    } catch (error) {
      console.error('Failed to delete artwork:', error);
    }
  };

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
      <div className="flex align-middle justify-end">
        {user && user.role === 'USER' && (
          <button
            onClick={handleLike}
            disabled={isLiking}
            className="text-red-500 text-2xl hover:scale-110 transition-transform"
            aria-label={isLiked ? 'Unlike this artwork' : 'Like this artwork'}
          >
            {isLiked ? '❤️' : '🤍'}
          </button>
        )}
        {user && user.role === 'ADMIN' && (
          <button
            onClick={handleDelete}
            className="text-red-500 text-1xl hover:scale-110 transition-transform align-middle justify-center"
            aria-label="Delete this artwork"
          >
            DELETE
          </button>
        )}
      </div>
    </li>
  );
}

export default ArtworkCard;