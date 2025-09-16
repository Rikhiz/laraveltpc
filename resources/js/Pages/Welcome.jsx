import React, { useState } from "react";
import AppLayout from "@/Layouts/AppLayout";



const Welcome = () => {
  // Dummy state biar struktur tetap
  const [leaderboardData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;

  const pageCount = Math.ceil(leaderboardData.length / itemsPerPage);

  return (
    <AppLayout>
    <div className="max-w-7xl mx-auto p-8">
      <div className="text-center mb-12">
        <h1 className="text-white text-5xl font-bold mb-4">
          Welcome to Tournament Portal
        </h1>
        <p className="text-gray-400 text-xl">
          Your gateway to competitive gaming tournaments
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-gray-900 border-2 border-red-500 rounded-lg p-6 text-center">
          <div className="text-red-500 mb-4">
            
          </div>
          <h3 className="text-white text-xl font-semibold mb-2">
            Live Tournaments
          </h3>
          <p className="text-gray-400">
            Join active tournaments and compete with players worldwide
          </p>
        </div>

        <div className="bg-gray-900 border-2 border-red-500 rounded-lg p-6 text-center">
          <div className="text-red-500 mb-4">
            
          </div>
          <h3 className="text-white text-xl font-semibold mb-2">
            Community
          </h3>
          <p className="text-gray-400">
            Connect with gamers and build your network
          </p>
        </div>

        <div className="bg-gray-900 border-2 border-red-500 rounded-lg p-6 text-center">
          <div className="text-red-500 mb-4">
           
          </div>
          <h3 className="text-white text-xl font-semibold mb-2">
            Rankings
          </h3>
          <p className="text-gray-400">
            Track your progress and climb the leaderboards
          </p>
        </div>
      </div>

      {/* Leaderboard Section (Grafik dimatikan sementara) */}
      <div className="bg-gray-900 border-2 border-red-500 rounded-lg p-8 mb-12">
        <h2 className="text-white text-2xl font-bold mb-4">Leaderboard</h2>
        <div className="text-gray-400 italic">
          Grafik sementara dimatikan
        </div>

       
      </div>

      <div className="bg-gray-900 border-2 border-red-500 rounded-lg p-8">
        <h2 className="text-white text-2xl font-bold mb-4">Latest News</h2>
        <div className="space-y-4">
          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="text-white font-semibold">
              Tournament Season 2 Begins!
            </h3>
            <p className="text-gray-400 text-sm">
              Registration is now open for the upcoming season
            </p>
          </div>
          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="text-white font-semibold">
              New Gaming Categories Added
            </h3>
            <p className="text-gray-400 text-sm">
              Explore new competitive gaming options
            </p>
          </div>
        </div>
      </div>
    </div>
    </AppLayout>
  );
};

export default Welcome;
