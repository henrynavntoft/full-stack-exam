import { useNavigate } from 'react-router-dom';
import UserList from './UserList';

interface DashboardProps {
  onLogout: () => void;
  user: { id: number; name: string; email: string } | null;
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
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome, {user?.name}!</p>
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white p-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </section>
    <section className='p-4'>
        <UserList />
    </section>
    </>
  );
}

export default Dashboard;