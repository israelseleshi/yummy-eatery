import React, { useState, useEffect } from 'react';
import { User, Edit, Trash2 } from 'lucide-react';
import { getAllUsers, updateUserStatus } from '../lib/users';
import { User as UserType } from '../lib/auth';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId: string, status: 'active' | 'inactive') => {
    try {
      await updateUserStatus(userId, status);
      await fetchUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 px-4">User</th>
            <th className="text-left py-3 px-4">Email</th>
            <th className="text-left py-3 px-4">Role</th>
            <th className="text-left py-3 px-4">Status</th>
            <th className="text-left py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b">
              <td className="py-3 px-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.firstName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-primary-500" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-neutral-500">{user.role}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">{user.email}</td>
              <td className="py-3 px-4">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  user.role === 'admin'
                    ? 'bg-primary-100 text-primary-800'
                    : 'bg-neutral-100 text-neutral-800'
                }`}>
                  {user.role}
                </span>
              </td>
              <td className="py-3 px-4">
                <select
                  value={user.status || 'active'}
                  onChange={(e) => handleStatusChange(user.id, e.target.value as 'active' | 'inactive')}
                  className="bg-transparent border rounded px-2 py-1 text-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </td>
              <td className="py-3 px-4">
                <div className="flex space-x-2">
                  <button
                    className="text-neutral-600 hover:text-primary-500 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    className="text-neutral-600 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;