import React from "react";
import { LogOut, User, ChevronRight, Settings } from "lucide-react";

const AdminHeader = ({ user, currentPage, menuItems = [], onNavigate }) => {
  return (
    <div className="flex flex-col h-full">
      {/* User Info */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
            <User size={20} className="text-gray-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium truncate">{user?.name}</p>
            <p className="text-gray-400 text-sm truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-8">
        <ul className="space-y-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.path;
            return (
              <li key={item.path}>
                <button
                  onClick={() => onNavigate(item.path)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors
                    ${
                      isActive
                        ? "bg-red-500 text-white shadow-md"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && <ChevronRight size={16} className="ml-auto" />}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="space-y-3">
          <button className="w-full flex items-center gap-3 px-3 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors">
            <Settings size={20} />
            <span>Settings</span>
          </button>
          <button
            onClick={() => onNavigate("logout")}
            className="w-full flex items-center gap-3 px-3 py-3 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
