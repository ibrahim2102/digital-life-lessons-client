import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null); // user id currently updating

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get('/admin/users');
        // Expecting: { success: true, data: [ { _id, name, email, role, totalLessons } ] }
        setUsers(res.data.data || res.data || []);
      } catch (err) {
        console.error('Error fetching users:', err);
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [axiosSecure]);

  const handleRoleChange = async (userId, newRole) => {
    setUpdating(userId);
    try {
      const res = await axiosSecure.patch(`/admin/users/${userId}`, { role: newRole });
      if (res.data.success) {
        toast.success('User role updated');
        setUsers(prev =>
          prev.map(u => (u._id === userId ? { ...u, role: newRole } : u))
        );
      } else {
        toast.error(res.data.message || 'Failed to update role');
      }
    } catch (err) {
      console.error('Error updating role:', err);
      toast.error(err.response?.data?.message || 'Failed to update role');
    } finally {
      setUpdating(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
    setUpdating(userId);
    try {
      const res = await axiosSecure.delete(`/admin/users/${userId}`);
      if (res.data.success) {
        toast.success('User deleted');
        setUsers(prev => prev.filter(u => u._id !== userId));
      } else {
        toast.error(res.data.message || 'Failed to delete user');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[300px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Manage Users</h2>
        <p className="text-sm text-gray-500">Total users: {users.length}</p>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>User Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Total Lessons</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-6">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr key={user._id}>
                      <td>{index + 1}</td>
                      <td className="font-semibold">
                        {user.displayName || user.name || '—'}
                      </td>
                      <td>{user.email}</td>
                      <td>
                        <span className="badge badge-ghost capitalize">
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td>{user.totalLessons ?? 0}</td>
                      <td>
                        <div className="flex flex-wrap gap-2">
                          {/* Promote / Demote role */}
                          {user.role === 'admin' ? (
                            <button
                              className="btn btn-xs btn-outline"
                              disabled={updating === user._id}
                              onClick={() => handleRoleChange(user._id, 'user')}
                            >
                              {updating === user._id ? 'Updating...' : 'Make User'}
                            </button>
                          ) : (
                            <button
                              className="btn btn-xs btn-primary"
                              disabled={updating === user._id}
                              onClick={() => handleRoleChange(user._id, 'admin')}
                            >
                              {updating === user._id ? 'Updating...' : 'Make Admin'}
                            </button>
                          )}

                          {/* Optional: Delete account */}
                          <button
                            className="btn btn-xs btn-error"
                            disabled={updating === user._id}
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            {updating === user._id ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;