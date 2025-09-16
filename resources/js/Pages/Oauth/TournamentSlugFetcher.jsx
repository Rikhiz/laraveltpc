    import React, { useState } from 'react';
    import { Download, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

    const TournamentSlugFetcher = ({ onDataFetched = () => {}, onStatusChange = () => {} }) => {
    const [slug, setSlug] = useState('');
    const [fetching, setFetching] = useState(false);
    const [fetchStatus, setFetchStatus] = useState(null);

    const API_BASE = '/admin/tournaments'; // Adjusted to match your Laravel routes

    // Helper function to validate slug format
    const validateSlug = (inputSlug) => {
        const slugPattern = /^tournament\/[^\/]+\/event\/[^\/]+$/;
        return slugPattern.test(inputSlug);
    };

    // Parse slug to extract tournament and event names
    const parseSlug = (inputSlug) => {
        const match = inputSlug.match(/^tournament\/([^\/]+)\/event\/([^\/]+)$/);
        if (match) {
        return {
            tournamentSlug: match[1],
            eventSlug: match[2]
        };
        }
        return null;
    };

    // Fetch tournament standings from Start.gg using slug
    const fetchTournamentBySlug = async () => {
        if (!slug.trim()) {
        showFetchStatus('error', 'Please enter a tournament slug');
        return;
        }

        if (!validateSlug(slug.trim())) {
        showFetchStatus('error', 'Invalid slug format. Use: tournament/{tournament_name}/event/{event_name}');
        return;
        }

        setFetching(true);
        showFetchStatus('loading', '🔍 Searching for tournament...');

        try {
        const response = await fetch(`${API_BASE}/fetch-by-slug`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
            body: JSON.stringify({ slug: slug.trim() })
        });

        const data = await response.json();

        if (data.success) {
            showFetchStatus('success', `✅ Successfully saved ${data.saved_count} standings`, {
            event_name: data.event_name,
            tournament_name: data.tournament_name,
            saved_count: data.saved_count,
            entrants: data.entrants || 0
            });
            
            // Call callback functions
            onDataFetched(data);
            onStatusChange('success', data);
        } else {
            throw new Error(data.message || 'Failed to fetch tournament data');
        }
        } catch (error) {
        showFetchStatus('error', `❌ Error: ${error.message}`);
        onStatusChange('error', error);
        } finally {
        setFetching(false);
        }
    };

    // Update fetch status
    const showFetchStatus = (type, message, details = null) => {
        setFetchStatus({ type, message, details });
    };

    // Handle Enter key press
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
        fetchTournamentBySlug();
        }
    };

    return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Download size={20} />
            Fetch Tournament Data from Start.gg (Using Slug)
        </h3>
        
        {/* Input Section */}
        <div className="space-y-3 mb-4">
            <div className="flex gap-3">
            <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="tournament/genesis-9-1/event/ultimate-singles"
                className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                onClick={fetchTournamentBySlug}
                disabled={fetching}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-2 rounded transition-colors flex items-center gap-2"
            >
                {fetching && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                {fetching ? 'Fetching...' : 'Fetch'}
            </button>
            </div>

            {/* Help Text */}
            <div className="text-sm text-gray-400">
            <p className="mb-1">
                <strong>Format:</strong> tournament/&lt;tournament_name&gt;/event/&lt;event_name&gt;
            </p>
            <p className="text-xs">
                Example: tournament/genesis-9-1/event/ultimate-singles
            </p>
            </div>
        </div>

        {/* Fetch Status */}
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
                {fetchStatus.type === 'error' && <XCircle size={16} className="text-red-400" />}
                {fetchStatus.type === 'success' && <CheckCircle size={16} className="text-green-400" />}
                <span className="text-white">{fetchStatus.message}</span>
            </div>
            
            {fetchStatus.details && (
                <div className="mt-2 text-sm text-gray-300">
                <p>🏆 Tournament: {fetchStatus.details.tournament_name}</p>
                <p>📊 Event: {fetchStatus.details.event_name}</p>
                <p>👥 Entrants: {fetchStatus.details.entrants}</p>
                <p>🗂 Total saved: {fetchStatus.details.saved_count}</p>
                </div>
            )}
            
            {fetchStatus.type === 'error' && (
                <div className="mt-3 p-3 bg-red-800 rounded text-sm">
                <p className="font-semibold text-red-200">Troubleshooting:</p>
                <ul className="mt-1 text-red-300 list-disc list-inside">
                    <li>Check slug format: tournament/name/event/name</li>
                    <li>Ensure tournament exists on Start.gg</li>
                    <li>Verify event has completed standings</li>
                    <li>Check your Start.gg API key configuration</li>
                </ul>
                </div>
            )}
            </div>
        )}

        {/* Recent Examples */}
        <div className="mt-4 text-xs text-gray-500">
            <p className="font-semibold mb-1">Common tournament slug examples:</p>
            <div className="space-y-1">
            <code className="block">tournament/evo-2023/event/street-fighter-6</code>
            <code className="block">tournament/big-house-11/event/melee-singles</code>
            <code className="block">tournament/genesis-9-1/event/ultimate-singles</code>
            </div>
        </div>
        </div>
    );
    };

    export default TournamentSlugFetcher;