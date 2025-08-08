import React, { useEffect, useState } from 'react';
import api from '../api';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers(page, searchTerm);
  }, [page, searchTerm]);

  const fetchUsers = async (page, search) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/users', { params: { page, search } });
      setUsers(res.data.users);
      setPages(res.data.pages);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const toggleBan = async (id, ban) => {
    try {
      await api.post(`/users/${id}/ban`, { ban });
      fetchUsers(page, searchTerm);
    } catch {
      setError('Failed to update ban status');
    }
  };

  const updateRoles = async (id, roles) => {
    try {
      await api.post(`/users/${id}/roles`, { roles });
      fetchUsers(page, searchTerm);
    } catch {
      setError('Failed to update roles');
    }
  };

  const handleRoleChange = (id, role) => {
    const user = users.find(u => u._id === id);
    let newRoles = [...user.roles];
    if (newRoles.includes(role)) {
      newRoles = newRoles.filter(r => r !== role);
    } else {
      newRoles.push(role);
    }
    updateRoles(id, newRoles);
  };

  const handleSearchChange = (e) => {
    setPage(1);
    setSearchTerm(e.target.value);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Users</h2>

      <input
        type="text"
        placeholder="Search by username or email"
        value={searchTerm}
        onChange={handleSearchChange}
        className="mb-4 p-2 border rounded w-full max-w-sm"
      />

      {error && <div className="mb-4 text-red-600">{error}</div>}

      {loading ? (
        <div>Loading users...</div>
      ) : (
        <table className="min-w-full bg-white rounded shadow overflow-hidden">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="p-3">Username</th>
              <th className="p-3">Email</th>
              <th className="p-3">Roles</th>
              <th className="p-3">Banned</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{u.username}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3 space-x-2">
                  {['user','moderator','admin'].map(role => (
                    <label key={role} className="inline-flex items-center space-x-1">
                      <input
                        type="checkbox"
                        checked={u.roles.includes(role)}
                        onChange={() => handleRoleChange(u._id, role)}
                        className="form-checkbox"
                      />
                      <span className="capitalize">{role}</span>
                    </label>
                  ))}
                </td>
                <td className="p-3">{u.isBanned ? 'Yes' : 'No'}</td>
                <td className="p-3">
                  <button
                    onClick={() => toggleBan(u._id, !u.isBanned)}
                    className={`px-3 py-1 rounded text-white ${u.isBanned ? 'bg-green-600' : 'bg-red-600'}`}
                  >
                    {u.isBanned ? 'Unban' : 'Ban'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-4 flex justify-center space-x-2">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 rounded bg-gray-300 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-3 py-1">{page} / {pages}</span>
        <button
          disabled={page >= pages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 rounded bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
