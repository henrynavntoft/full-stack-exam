import { User } from '../types';

interface UserCardProps {
  user: User;
  isAdmin: boolean;
  loggedInUserId: number; 
  onDelete: (userId: number) => void;
}

function UserCard({ user, isAdmin, loggedInUserId, onDelete }: UserCardProps) {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      onDelete(user.id);
    }
  };

  return (
    <li className="p-4 border rounded shadow-sm">
      <h2 className="font-semibold text-lg">{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>

      {/* Show delete button only if the current user is an admin and not deleting their own account */}
      {isAdmin && user.id !== loggedInUserId && (
        <button
          onClick={handleDelete}
          className="mt-2 bg-red-500 text-white p-1 rounded hover:bg-red-600"
        >
          Delete User
        </button>
      )}
    </li>
  );
}

export default UserCard;