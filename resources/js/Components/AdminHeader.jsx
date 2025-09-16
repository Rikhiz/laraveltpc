import React from 'react';
import { LogOut, User } from 'lucide-react';
import { router, usePage } from '@inertiajs/react';

const AdminHeader = ({ currentPage = 'dashboard', menuItems = [], onNavigate }) => {
  const { auth } = usePage().props;   // ambil session user dari inertia
  const user = auth.user;

  const handleLogout = () => {
    router.post('/logout');
  };

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
      {/* Title */}
      <div className="h-16 flex items-center px-4 border-b border-gray-800">
        <h1 className="text-white text-lg font-bold">
          Welcome Admin {user ? `(${user.name})` : ""}
        </h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200
                ${currentPage === item.path
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
              `}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* User Info + Actions */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {user?.name?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-white font-medium text-sm">{user?.name}</p>
            <p className="text-gray-400 text-xs">{user?.email}</p>
            <p className="text-red-400 text-xs font-medium">Administrator</p>
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => router.visit('/profile')}
            className="w-full flex items-center gap-2 px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors text-left"
          >
            <User size={16} />
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-red-400 rounded-md transition-colors text-left"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminHeader;
