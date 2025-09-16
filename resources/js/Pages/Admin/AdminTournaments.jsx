
import React, { useState, useEffect } from 'react';
import { Calculator, Trophy, Eye, Download, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import TournamentSlugFetcher from '../Oauth/TournamentSlugFetcher'; // Import the new component

const AdminTournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [calculating, setCalculating] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [eventId, setEventId] = useState('');
  const [fetchStatus, setFetchStatus] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [playerDetails, setPlayerDetails] = useState(null);

  const API_BASE = '/admin/tournaments'; // Adjusted to match your Laravel routes

  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  // Fetch leaderboard data
  const fetchLeaderboardData = async () => {
    try {
      const response = await fetch(`${API_BASE}/leaderboard`);
      const data = await response.json();
      
      if (data.tournaments) setTournaments(data.tournaments);
      if (data.leaderboards) setLeaderboard(data.leaderboards);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      showAlert('error', 'Failed to fetch leaderboard data');
    }
  };

  // Fetch tournament standings from Start.gg (legacy Event ID method)
  const fetchTournamentStandings = async () => {
    if (!eventId.trim()) {
      showAlert('error', 'Please enter an Event ID');
      return;
    }

    setFetching(true);
    setFetchStatus({ type: 'loading', message: '🔍 Searching for event...' });

    try {
      const response = await fetch(`${API_BASE}/fetch-standings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({ event_id: eventId })
      });

      const data = await response.json();

      if (data.success) {
        setFetchStatus({
          type: 'success',
          message: `✅ Successfully saved ${data.saved_count} standings`,
          details: {
            event_name: data.event_name,
            saved_count: data.saved_count
          }
        });
        showAlert('success', data.message);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      setFetchStatus({
        type: 'error',
        message: `❌ Error: ${error.message}`
      });
      showAlert('error', error.message);
    } finally {
      setFetching(false);
    }
  };

  // Calculate leaderboard
  const calculateLeaderboard = async () => {
    setCalculating(true);

    try {
      const response = await fetch(`${API_BASE}/calculate-leaderboard`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        }
      });

      const data = await response.json();

      if (data.success) {
        showAlert('success', data.message);
        // Refresh leaderboard data
        setTimeout(() => {
          fetchLeaderboardData();
        }, 1500);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      showAlert('error', error.message);
    } finally {
      setCalculating(false);
    }
  };

  // Get player details
  const getPlayerDetails = async (userId) => {
    try {
      const response = await fetch(`${API_BASE}/player/${userId}`);
      const data = await response.json();

      if (data.success) {
        setPlayerDetails(data);
        setShowPlayerModal(true);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      showAlert('error', error.message);
    }
  };

  // Handle successful data fetch from slug fetcher
  const handleDataFetched = (data) => {
    showAlert('success', `Tournament data fetched successfully: ${data.event_name}`);
    // Refresh leaderboard data after a short delay
    setTimeout(() => {
      fetchLeaderboardData();
    }, 1000);
  };

  // Handle status changes from slug fetcher
  const handleStatusChange = (type, data) => {
    if (type === 'success') {
      console.log('Tournament fetched successfully:', data);
    } else if (type === 'error') {
      console.error('Tournament fetch error:', data);
    }
  };

  // Show alert (you can implement this with your preferred notification system)
  const showAlert = (type, message) => {
    // Simple alert for now - replace with your notification system
    if (type === 'error') {
      alert(`Error: ${message}`);
    } else if (type === 'success') {
      alert(`Success: ${message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">Global Leaderboard</h2>
        <div className="flex gap-3">
          <button
            onClick={calculateLeaderboard}
            disabled={calculating}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white px-4 py-2 rounded flex items-center gap-2 transition-colors"
          >
            <Calculator size={16} />
            {calculating ? "Calculating..." : "Recalculate Points"}
          </button>
        </div>
      </div>

      {/* New Slug Fetcher Component */}
      <TournamentSlugFetcher 
        onDataFetched={handleDataFetched}
        onStatusChange={handleStatusChange}
      />

      {/* Legacy Event ID Fetch Form */}
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Download size={20} />
          Fetch Tournament Data by Event ID (Legacy)
        </h3>
        <div className="flex gap-3 mb-3">
          <input
            type="number"
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
            placeholder="Enter Event ID (e.g., 123456)"
            className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={fetchTournamentStandings}
            disabled={fetching}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-2 rounded transition-colors flex items-center gap-2"
          >
            {fetching && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {fetching ? 'Fetching...' : 'Fetch'}
          </button>
        </div>

        {/* Legacy Fetch Status */}
        {fetchStatus && (
          <div className={`p-4 rounded border ${
            fetchStatus.type === 'loading' ? 'bg-blue-900 border-blue-500' :
            fetchStatus.type === 'error' ? 'bg-red-900 border-red-500' :
            'bg-green-900 border-green-500'
          }`}>
            <div className="flex items-center gap-2">
              {fetchStatus.type === 'loading' && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span className="text-white">{fetchStatus.message}</span>
            </div>
            {fetchStatus.details && (
              <div className="mt-2 text-sm text-gray-300">
                <p>📊 Event: {fetchStatus.details.event_name}</p>
                <p>🗂 Total saved: {fetchStatus.details.saved_count}</p>
              </div>
            )}
            {fetchStatus.type === 'error' && (
              <div className="mt-3 p-3 bg-red-800 rounded text-sm">
                <p className="font-semibold text-red-200">Troubleshooting:</p>
                <ul className="mt-1 text-red-300 list-disc list-inside">
                  <li>Check Event ID validity</li>
                  <li>Ensure standings are available</li>
                  <li>Verify your Start.gg API key in .env</li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rule Explanation */}
      <div className="bg-blue-900 border border-blue-500 rounded-lg p-4 mb-6">
        <h3 className="text-blue-200 font-semibold mb-2 flex items-center gap-2">
          <AlertCircle size={20} />
          Leaderboard Rules:
        </h3>
        <p className="text-blue-100 text-sm mb-1">
          Players are ranked by total points from:{" "}
          <strong>Top 1 Major event</strong> +{" "}
          <strong>Top 2 Minor events</strong> +{" "}
          <strong>Top 4 Mini events</strong>
        </p>
        <p className="text-blue-200 text-xs">
          Additional events in each category are recorded but not counted towards total points.
        </p>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-gray-900 border border-red-500 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-white border-collapse">
            <thead>
              <tr className="border-b border-red-500 bg-gray-800">
                <th className="py-3 px-4 text-left">Rank</th>
                <th className="py-3 px-4 text-left">Player</th>
                <th className="py-3 px-4 text-left">Major Points</th>
                <th className="py-3 px-4 text-left">Minor Points</th>
                <th className="py-3 px-4 text-left">Mini Points</th>
                <th className="py-3 px-4 text-left">Total Points</th>
                <th className="py-3 px-4 text-left">Events Played</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center text-gray-400 py-8">
                    <div className="flex flex-col items-center gap-2">
                      <AlertCircle size={48} className="text-gray-500" />
                      <div>No leaderboard data available.</div>
                      <div className="text-sm">Fetch tournament data and click "Recalculate Points" to generate leaderboard.</div>
                    </div>
                  </td>
                </tr>
              ) : (
                leaderboard.map((player, index) => (
                  <tr
                    key={player.user_id}
                    className="hover:bg-gray-800 border-b border-gray-700"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {index === 0 && (
                          <Trophy className="text-yellow-400" size={16} />
                        )}
                        {index === 1 && (
                          <Trophy className="text-gray-400" size={16} />
                        )}
                        {index === 2 && (
                          <Trophy className="text-orange-400" size={16} />
                        )}
                        <span className="font-bold">#{index + 1}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">{player.player_name}</td>
                    <td className="py-3 px-4">
                      <span className="text-yellow-400 font-semibold">
                        {player.major}
                      </span>
                      <span className="text-gray-400 text-xs ml-1">
                        ({player.counted_major_events || 0}/1 counted)
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-blue-400 font-semibold">
                        {player.minor}
                      </span>
                      <span className="text-gray-400 text-xs ml-1">
                        ({player.counted_minor_events || 0}/2 counted)
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-green-400 font-semibold">
                        {player.mini}
                      </span>
                      <span className="text-gray-400 text-xs ml-1">
                        ({player.counted_mini_events || 0}/4 counted)
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-red-400 font-bold text-lg">
                        {player.total_points}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-xs text-gray-400">
                        <div>Major: {player.total_major_events || 0}</div>
                        <div>Minor: {player.total_minor_events || 0}</div>
                        <div>Mini: {player.total_mini_events || 0}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => getPlayerDetails(player.user_id)}
                        className="text-blue-400 hover:text-blue-300 p-2 hover:bg-gray-700 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scoring Rule Footer */}
      {leaderboard.length > 0 && (
        <div className="mt-4 text-sm text-gray-400">
          <p>
            <strong>Scoring Rule:</strong> Only the highest-scoring events count
            towards total points: Top 1 Major + Top 2 Minor + Top 4 Mini events
            per player.
          </p>
        </div>
      )}

      {/* Player Details Modal */}
      {showPlayerModal && playerDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-600">
              <h3 className="text-xl font-semibold text-white">Player Details</h3>
              <button
                onClick={() => setShowPlayerModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[70vh]">
              {/* Player Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-lg font-semibold text-blue-400 mb-3">Player Information</h4>
                  <div className="space-y-2">
                    <p><strong>Name:</strong> {playerDetails.player.name}</p>
                    <p><strong>Email:</strong> {playerDetails.player.email}</p>
                    <p><strong>Role:</strong> {playerDetails.player.role}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-blue-400 mb-3">Points Summary</h4>
                  <div className="space-y-2">
                    <p><strong>Total Points:</strong> 
                      <span className="text-red-400 font-bold ml-2">{playerDetails.leaderboard.total_points}</span>
                    </p>
                    <div className="flex gap-4 text-sm">
                      <span className="text-yellow-400">Major: {playerDetails.leaderboard.major}</span>
                      <span className="text-blue-400">Minor: {playerDetails.leaderboard.minor}</span>
                      <span className="text-green-400">Mini: {playerDetails.leaderboard.mini}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tournament Results by Category */}
              {/* Major Events */}
              {playerDetails.results.majorEvents.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-yellow-400 mb-3">
                    Major Events ({playerDetails.results.majorEvents.length} total, top 1 counted)
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm bg-gray-700 rounded">
                      <thead>
                        <tr className="bg-gray-600">
                          <th className="p-2 text-left">Tournament</th>
                          <th className="p-2 text-left">Placement</th>
                          <th className="p-2 text-left">Points</th>
                          <th className="p-2 text-left">Entrants</th>
                          <th className="p-2 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {playerDetails.results.majorEvents.map((event, index) => (
                          <tr key={index} className={index === 0 ? 'bg-yellow-900' : ''}>
                            <td className="p-2">{event.tournament_name}</td>
                            <td className="p-2">{event.placement}</td>
                            <td className="p-2 font-semibold">{event.points}</td>
                            <td className="p-2">{event.entrants}</td>
                            <td className="p-2">
                              {index === 0 ? (
                                <span className="text-green-400 text-xs">✓ Counted</span>
                              ) : (
                                <span className="text-gray-400 text-xs">Not counted</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Minor Events */}
              {playerDetails.results.minorEvents.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-blue-400 mb-3">
                    Minor Events ({playerDetails.results.minorEvents.length} total, top 2 counted)
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm bg-gray-700 rounded">
                      <thead>
                        <tr className="bg-gray-600">
                          <th className="p-2 text-left">Tournament</th>
                          <th className="p-2 text-left">Placement</th>
                          <th className="p-2 text-left">Points</th>
                          <th className="p-2 text-left">Entrants</th>
                          <th className="p-2 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {playerDetails.results.minorEvents.map((event, index) => (
                          <tr key={index} className={index < 2 ? 'bg-blue-900' : ''}>
                            <td className="p-2">{event.tournament_name}</td>
                            <td className="p-2">{event.placement}</td>
                            <td className="p-2 font-semibold">{event.points}</td>
                            <td className="p-2">{event.entrants}</td>
                            <td className="p-2">
                              {index < 2 ? (
                                <span className="text-green-400 text-xs">✓ Counted</span>
                              ) : (
                                <span className="text-gray-400 text-xs">Not counted</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            {/* Mini Events */}
              {playerDetails.results.miniEvents.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-green-400 mb-3">
                    Mini Events ({playerDetails.results.miniEvents.length} total, top 4 counted)
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm bg-gray-700 rounded">
                      <thead>
                        <tr className="bg-gray-600">
                          <th className="p-2 text-left">Tournament</th>
                          <th className="p-2 text-left">Placement</th>
                          <th className="p-2 text-left">Points</th>
                          <th className="p-2 text-left">Entrants</th>
                          <th className="p-2 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {playerDetails.results.miniEvents.map((event, index) => (
                          <tr key={index} className={index < 4 ? 'bg-green-900' : ''}>
                            <td className="p-2">{event.tournament_name}</td>
                            <td className="p-2">{event.placement}</td>
                            <td className="p-2 font-semibold">{event.points}</td>
                            <td className="p-2">{event.entrants}</td>
                            <td className="p-2">
                              {index < 4 ? (
                                <span className="text-green-400 text-xs">✓ Counted</span>
                              ) : (
                                <span className="text-gray-400 text-xs">Not counted</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default AdminTournaments;