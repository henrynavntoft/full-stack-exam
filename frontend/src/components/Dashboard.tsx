import { useNavigate } from 'react-router-dom';
import UserList from './UserList';

interface DashboardProps {
  onLogout: () => void;
  user: { id: number; name: string; email: string; role: string } | null;
}

function Dashboard({ onLogout, user }: DashboardProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <>
      <section className="p-4">
        {/* Display user role in the dashboard title */}
        <h1 className="text-2xl font-bold mb-4">
          {user?.role === 'ADMIN' ? 'Admin' : 'User'} Dashboard
        </h1>
        <p>Welcome, {user?.name}!</p>
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 text-white p-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </section>
      
      {/* Only render UserList if the user has an ADMIN role */}
      {user?.role === 'ADMIN' && (
        <section className="p-4">
          <UserList />
        </section>
      )}
    </>
  );
}

export default Dashboard;