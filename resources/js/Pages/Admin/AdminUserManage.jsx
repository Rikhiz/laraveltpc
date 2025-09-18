import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Save, 
  X, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Crown,
  User,
  Mail,
  Calendar,
  Shield
} from 'lucide-react';

const AdminUserManage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'view'
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'player'
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const API_BASE = '/admin/users';

  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}`);
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.users);
      } else {
        showAlert('error', 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showAlert('error', 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Create new user
  const createUser = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        showAlert('success', 'User created successfully');
        setShowModal(false);
        resetForm();
        fetchUsers();
      } else {
        setErrors(data.errors || {});
        showAlert('error', data.message || 'Failed to create user');
      }
    } catch (error) {
      showAlert('error', 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  // Update user
  const updateUser = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        showAlert('success', 'User updated successfully');
        setShowModal(false);
        resetForm();
        fetchUsers();
      } else {
        setErrors(data.errors || {});
        showAlert('error', data.message || 'Failed to update user');
      }
    } catch (error) {
      showAlert('error', 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/${userId}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        }
      });

      const data = await response.json();

      if (data.success) {
        showAlert('success', 'User deleted successfully');
        fetchUsers();
      } else {
        showAlert('error', data.message || 'Failed to delete user');
      }
    } catch (error) {
      showAlert('error', 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  // Open modal for different modes
  const openModal = (mode, user = null) => {
    setModalMode(mode);
    setSelectedUser(user);
    setErrors({});
    
    if (mode === 'create') {
      resetForm();
    } else if (mode === 'edit' && user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        role: user.role
      });
    } else if (mode === 'view' && user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        role: user.role
      });
    }
    
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    resetForm();
    setErrors({});
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      password_confirmation: '',
      role: 'player'
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (modalMode === 'create') {
      createUser();
    } else if (modalMode === 'edit') {
      updateUser();
    }
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  // Filter users based on search and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  // Show alert
  const showAlert = (type, message) => {
    if (type === 'error') {
      alert(`Error: ${message}`);
    } else if (type === 'success') {
      alert(`Success: ${message}`);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">User Management</h2>
        <button
          onClick={() => openModal('create')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
        >
          <Plus size={16} />
          Add New User
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="sm:w-48">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="player">Player</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-900 border border-blue-500 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Users className="text-blue-400" size={24} />
            <div>
              <p className="text-blue-200 text-sm">Total Users</p>
              <p className="text-blue-100 text-xl font-bold">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-900 border border-yellow-500 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Crown className="text-yellow-400" size={24} />
            <div>
              <p className="text-yellow-200 text-sm">Admins</p>
              <p className="text-yellow-100 text-xl font-bold">
                {users.filter(u => u.role === 'admin').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-green-900 border border-green-500 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <User className="text-green-400" size={24} />
            <div>
              <p className="text-green-200 text-sm">Players</p>
              <p className="text-green-100 text-xl font-bold">
                {users.filter(u => u.role === 'player').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-900 border border-red-500 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-white border-collapse">
            <thead>
              <tr className="border-b border-red-500 bg-gray-800">
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Role</th>
                <th className="py-3 px-4 text-left">Email Verified</th>
                <th className="py-3 px-4 text-left">Created At</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center text-gray-400 py-8">
                    <div className="flex justify-center items-center gap-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      Loading users...
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-gray-400 py-8">
                    <div className="flex flex-col items-center gap-2">
                      <Users size={48} className="text-gray-500" />
                      <div>No users found.</div>
                      {searchTerm && (
                        <div className="text-sm">Try adjusting your search criteria.</div>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-800 border-b border-gray-700"
                  >
                    <td className="py-3 px-4 font-mono text-sm">{user.id}</td>
                    <td className="py-3 px-4 font-medium">{user.name}</td>
                    <td className="py-3 px-4 text-gray-300">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        user.role === 'admin' 
                          ? 'bg-yellow-900 text-yellow-200 border border-yellow-500' 
                          : 'bg-green-900 text-green-200 border border-green-500'
                      }`}>
                        {user.role === 'admin' ? (
                          <><Crown size={12} className="inline mr-1" />Admin</>
                        ) : (
                          <><User size={12} className="inline mr-1" />Player</>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {user.email_verified_at ? (
                        <span className="text-green-400 text-sm flex items-center gap-1">
                          <CheckCircle size={14} />
                          Verified
                        </span>
                      ) : (
                        <span className="text-red-400 text-sm flex items-center gap-1">
                          <XCircle size={14} />
                          Not Verified
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-sm">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openModal('view', user)}
                          className="text-blue-400 hover:text-blue-300 p-2 hover:bg-gray-700 rounded transition-colors"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => openModal('edit', user)}
                          className="text-yellow-400 hover:text-yellow-300 p-2 hover:bg-gray-700 rounded transition-colors"
                          title="Edit User"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="text-red-400 hover:text-red-300 p-2 hover:bg-gray-700 rounded transition-colors"
                          title="Delete User"
                        >
                          <Trash2 size={16} />
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

      {/* User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg max-w-md w-full mx-4">
            <div className="flex justify-between items-center p-6 border-b border-gray-600">
              <h3 className="text-xl font-semibold text-white">
                {modalMode === 'create' ? 'Add New User' : 
                 modalMode === 'edit' ? 'Edit User' : 'User Details'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              {/* Name Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={modalMode === 'view'}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  placeholder="Enter user name"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">{errors.name[0]}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={modalMode === 'view'}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">{errors.email[0]}</p>
                )}
              </div>

              {/* Role Field */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Role <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  disabled={modalMode === 'view'}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <option value="player">Player</option>
                  <option value="admin">Admin</option>
                </select>
                {errors.role && (
                  <p className="text-red-400 text-sm mt-1">{errors.role[0]}</p>
                )}
              </div>

              {/* Password Field (only for create/edit) */}
              {modalMode !== 'view' && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Password {modalMode === 'create' && <span className="text-red-400">*</span>}
                      {modalMode === 'edit' && <span className="text-gray-400 text-xs">(leave blank to keep current)</span>}
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter password"
                    />
                    {errors.password && (
                      <p className="text-red-400 text-sm mt-1">{errors.password[0]}</p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Confirm Password {modalMode === 'create' && <span className="text-red-400">*</span>}
                    </label>
                    <input
                      type="password"
                      value={formData.password_confirmation}
                      onChange={(e) => handleInputChange('password_confirmation', e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Confirm password"
                    />
                  </div>
                </>
              )}

              {/* Additional info for view mode */}
              {modalMode === 'view' && selectedUser && (
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-gray-400" />
                    <span className="text-gray-400">Created:</span>
                    <span>{formatDate(selectedUser.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={16} className="text-gray-400" />
                    <span className="text-gray-400">Email Status:</span>
                    {selectedUser.email_verified_at ? (
                      <span className="text-green-400">Verified</span>
                    ) : (
                      <span className="text-red-400">Not Verified</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Shield size={16} className="text-gray-400" />
                    <span className="text-gray-400">Last Updated:</span>
                    <span>{formatDate(selectedUser.updated_at)}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors"
                >
                  {modalMode === 'view' ? 'Close' : 'Cancel'}
                </button>
                {modalMode !== 'view' && (
                  <button
                    type="button"
                    onClick={() => modalMode === 'create' ? createUser() : updateUser()}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Save size={16} />
                    )}
                    {loading ? 'Saving...' : modalMode === 'create' ? 'Create User' : 'Update User'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManage;