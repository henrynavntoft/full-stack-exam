import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteUser, fetchUsers } from '../api/usersApi';
import UserCard from './UserCard';
import { User } from '../types';

interface UserListProps {
  isAdmin: boolean;
  loggedInUserId: number;
}

function UserList({ isAdmin, loggedInUserId }: UserListProps) {
  const queryClient = useQueryClient();

  // Fetch all users
  const { data: users, isLoading, isError, error } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  // Mutation to delete a user
  const deleteMutation = useMutation({
  mutationFn: deleteUser,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] }); 
  },
});

  const handleDelete = (userId: number) => {
    deleteMutation.mutate(userId);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {(error as Error).message}</div>;

  return (
    <ul className="space-y-2">
      {users?.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          isAdmin={isAdmin}
          onDelete={handleDelete}
          loggedInUserId={loggedInUserId}
        />
      ))}
    </ul>
  );
}

export default UserList;