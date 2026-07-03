import { Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { adminApi } from '../../api/orderApi.js';
import Button from '../../components/Button.jsx';
import Loader from '../../components/Loader.jsx';
import AdminShell from './AdminShell.jsx';

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi
      .getUsers()
      .then(setUsers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const changeRole = async (id, role) => {
    const updated = await adminApi.updateUserRole(id, role);
    setUsers((current) => current.map((user) => (user._id === id ? updated : user)));
  };

  const removeUser = async (id) => {
    await adminApi.deleteUser(id);
    setUsers((current) => current.filter((user) => user._id !== id));
  };

  return (
    <AdminShell>
      <div className="admin-heading">
        <h1>Users</h1>
        <p>Manage marketplace users and roles.</p>
      </div>
      {loading ? <Loader label="Loading users" /> : null}
      {error ? <div className="empty-state danger">{error}</div> : null}
      <div className="data-table">
        {users.map((user) => (
          <div className="table-row admin-user-row" key={user._id}>
            <div>
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>
            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
            <select value={user.role} onChange={(event) => changeRole(user._id, event.target.value)}>
              <option value="user">user</option>
              <option value="seller">seller</option>
              <option value="admin">admin</option>
            </select>
            <Button type="button" variant="ghost" icon={Trash2} onClick={() => removeUser(user._id)}>
              Delete
            </Button>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}

export default AdminUsers;
