// AdminLayout.jsx
import React, { useState } from "react";
import { Menu, LogOut, User } from "lucide-react";
import { router } from "@inertiajs/react";

const AdminLayout = ({ user, currentPage, menuItems = [], onNavigate }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    router.post("/logout");
  };

  const handleSidebarNavigation = (path) => {
    if (onNavigate) onNavigate(path);
    setSidebarOpen(false);
  };

  // cari komponen aktif
  const currentMenuItem = menuItems.find((item) => item.path === currentPage);
  const CurrentComponent = currentMenuItem?.component || (() => <p>No Component Found</p>);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header mobile */}
      <header className="bg-gray-900 border-b border-gray-700 h-16 flex items-center justify-between px-4 lg:hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white hover:text-red-500 transition-colors"
        >
          <Menu size={24} />
        </button>
        <h1 className="text-white text-xl font-bold">Admin Panel</h1>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 w-64 bg-gray-900 border-r border-gray-800 p-4 transform transition-transform duration-200 z-40
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        >
          <nav className="space-y-2 flex flex-col h-full">
            {/* Menu */}
            <div className="flex-1">
              {menuItems.length > 0 ? (
                menuItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => handleSidebarNavigation(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200
                      ${currentPage === item.path
                        ? "bg-red-600 text-white shadow-lg"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }`}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </button>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No menu available</p>
              )}
            </div>

            {/* Profile */}
            <div className="border-t border-gray-800 pt-4">
              <div className="flex items-center gap-3 px-4 mb-3">
                <div className="w-9 h-9 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{user?.name}</p>
                  <p className="text-gray-400 text-xs">{user?.email}</p>
                </div>
              </div>

              <button
                onClick={() => handleSidebarNavigation("profile")}
                className="w-full flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors rounded-lg"
              >
                <User size={16} />
                Profile
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-red-400 transition-colors rounded-lg"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </nav>
        </aside>

        {/* Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 bg-black p-6 overflow-y-auto ">
          <CurrentComponent user={user} />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
