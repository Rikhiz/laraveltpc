// AdminDsb.jsx

import React, { useEffect } from 'react';

const AdminDsb = ({ user, users = [], tournaments = [], session = {} }) => {
  useEffect(() => {
    console.log("🔍 Data users dari Laravel:", users);
    console.log("📦 Data session dari Laravel:", session);
  }, [users, session]);  

  const adminCount = users.filter((u) => u.role === 'admin').length;
  const playerCount = users.filter((u) => u.role === 'player').length;

  return (
    <div className="p-6">
      {/* Welcome */}
      <h1 className="text-white text-3xl font-bold mb-6">
        Welcome, {user?.name}!
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-900 border-2 border-red-500 rounded-lg p-6">
          <h3 className="text-white text-lg font-semibold">Total Users</h3>
          <p className="text-red-500 text-3xl font-bold">{users.length}</p>
        </div>
        <div className="bg-gray-900 border-2 border-red-500 rounded-lg p-6">
          <h3 className="text-white text-lg font-semibold">Admins</h3>
          <p className="text-red-500 text-3xl font-bold">{adminCount}</p>
        </div>
        <div className="bg-gray-900 border-2 border-red-500 rounded-lg p-6">
          <h3 className="text-white text-lg font-semibold">Players</h3>
          <p className="text-red-500 text-3xl font-bold">{playerCount}</p>
        </div>
        <div className="bg-gray-900 border-2 border-red-500 rounded-lg p-6">
          <h3 className="text-white text-lg font-semibold">Tournaments</h3>
          <p className="text-red-500 text-3xl font-bold">
            {tournaments.length}
          </p>
        </div>
      </div>

      {/* Session Data */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mt-8">
        <h2 className="text-white text-xl font-semibold mb-4">Session Info</h2>
        <pre className="text-green-400 text-sm overflow-x-auto">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export default AdminDsb;
