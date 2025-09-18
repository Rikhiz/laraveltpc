import React, { useState } from "react";
import AdminLayout from "../Layouts/AdminLayout";
import AdminDashboard from "./Admin/AdminDsb";
import AdminTournaments from "./Admin/AdminTournaments";
import UserManage from "./Admin/AdminUserManage";
import { Home, Trophy } from "lucide-react";

const AdminPages = ({ user }) => {  
  const [currentPage, setCurrentPage] = useState("dashboard");

  const menuItems = [
    {
      path: "dashboard",
      label: "Dashboard",
      icon: Home,
      component: AdminDashboard,   // ⬅️ langsung component, bukan default import salah
    },
    {
      path: "tournaments",
      label: "Tournaments",
      icon: Trophy,
      component: AdminTournaments,
    },
    {
      path: "UserManage",
      label: "User Management",
      icon: Trophy,
      component: UserManage,
    },
  ];

  return (
    <AdminLayout
      user={user}
      currentPage={currentPage}
      menuItems={menuItems}
      onNavigate={setCurrentPage}
    />
  );
};

export default AdminPages;
