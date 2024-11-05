import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '../api/usersApi';
import UserCard from './UserCard';
import { User } from '../types';

function UserList() {
  const { data: users, isLoading, isError, error } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;

  return (
    <ul className="space-y-2">
      {users?.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </ul>
  );
}

export default UserList;