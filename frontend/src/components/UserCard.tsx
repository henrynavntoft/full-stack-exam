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
    <li className="p-4 border border-border bg-card shadow-sm rounded-lg">
      <h2 className="font-semibold text-lg text-primary">{user.name}</h2>
      <p className="text-muted-foreground">Email: {user.email}</p>
      <p className="text-muted-foreground">Role: {user.role}</p>
      <p className="text-muted-foreground">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>

      {/* Show delete button only if the current user is an admin and not deleting their own account */}
      {isAdmin && user.id !== loggedInUserId && (
        <button
          onClick={handleDelete}
          className="mt-3 bg-destructive text-destructive-foreground px-3 py-1 rounded hover:bg-destructive-dark transition"
        >
          Delete User
        </button>
      )}
    </li>
  );
}

export default UserCard;