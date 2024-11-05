import { User } from '../types';

interface UserCardProps {
  user: User;
}

function UserCard({ user }: UserCardProps) {
  return (
    <li className="p-4 border rounded shadow-sm">
      <h2 className="font-semibold text-lg">{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <p>Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
    </li>
  );
}

export default UserCard;