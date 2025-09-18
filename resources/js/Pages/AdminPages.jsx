import React, { useState } from "react";
import AdminLayout from "../Layouts/AdminLayout";
import AdminDashboard from "./Admin/AdminDsb";
import AdminTournaments from "./Admin/AdminTournaments";
import AdminUserManage from "./Admin/AdminUserManage";
import { Home, Trophy, Users, Settings, Camera,Layers } from "lucide-react";
import { Inertia } from '@inertiajs/inertia';
import { usePage, Link } from '@inertiajs/react';


const AdminPages = ({ user, users = [], tournaments = [], session = {}, currentPage: initialPage = 'dashboard' }) => {  
  const [currentPage, setCurrentPage] = useState(initialPage);

  const menuItems = [
    {
      path: "dashboard",
      label: "Dashboard",
      icon: Home,
      component: AdminDashboard,
    },
    {
      path: "tournaments",
      label: "Tournaments",
      icon: Trophy,
      component: AdminTournaments,
    },
    {
      path: "users",
      label: "Users",
      icon: Users,
      component: AdminUserManage,
    },
    {
      path: "users",
      label: "Gallery",
      icon: Camera,
      component: AdminUserManage,
    },
    {
      path: "users",
      label: "StartGG Data",
      icon: Layers,
      component: AdminUserManage,
    },
  ];

  const renderCurrentComponent = () => {
    const currentMenuItem = menuItems.find(item => item.path === currentPage);
    const CurrentComponent = currentMenuItem?.component;
    
    if (!CurrentComponent) return null;

    // Pass appropriate props based on the current page
    const getComponentProps = () => {
      switch (currentPage) {
        case 'dashboard':
          return {
            user,
            users,
            tournaments,
            session
          };
        case 'tournaments':
          return {
            user,
            tournaments
          };
        case 'users':
          return {
            user,
            users
          };
        default:
          return { user };
      }
    };

    return <CurrentComponent {...getComponentProps()} />;
  };

  return (
    <AdminLayout
      user={user}
      currentPage={currentPage}
      menuItems={menuItems}
      onNavigate={setCurrentPage}
    >
      {renderCurrentComponent()}
    </AdminLayout>
  );
};

export default AdminPages;