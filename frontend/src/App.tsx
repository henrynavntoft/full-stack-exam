import UserList from './components/UserList';
import CreateUserForm from './components/CreateUserForm';

function App() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <UserList />
      <CreateUserForm />
    </div>
  );
}

export default App;