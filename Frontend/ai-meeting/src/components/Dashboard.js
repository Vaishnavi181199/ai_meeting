import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [meetingData, setMeetingData] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [isSearching, setIsSearching] = useState(false);


    useEffect(() => {
        if (location.state?.meetingData) {
            setMeetingData(location.state.meetingData);
            localStorage.setItem('meetingData', JSON.stringify(location.state.meetingData));
        } else {
            const savedData = localStorage.getItem('meetingData');
            if (savedData) {
                setMeetingData(JSON.parse(savedData));
            }
        }
    }, [location.state]);

    const handleBackToUpload = () => {
        localStorage.removeItem('meetingData');
        navigate('/');
    };

    if (!meetingData) {
        return (
            <div className="dashboard-container">
                <div className="loading">
                    <h2>No meeting data found. Please upload a file.</h2>
                    <button onClick={handleBackToUpload} className="back-button">Back to Upload</button>
                </div>
            </div>
        );
    }

    const { meeting_id, transcription, insights } = meetingData;

    function extractJsonFromString(text) {
        try {
            const cleaned = text
                .replace(/```(?:json)?/g, '')  // remove ```json
                .replace(/```/g, '')           // remove closing ```
                .trim();
            return JSON.parse(cleaned);
        } catch (err) {
            console.error("Failed to parse JSON from string:", err);
            return {};
        }
    }


    const extractedInsights = {
        action_items: extractJsonFromString(insights?.action_items || ""),
        decisions: extractJsonFromString(insights?.decisions || ""),
        participant_interactions: extractJsonFromString(insights?.participant_interactions || "")
    };


    // Then access like:
    const safeActionItems = extractedInsights.action_items?.action_items || [];
    const safeDecisions = extractedInsights.decisions?.decisions || [];
    const safeParticipantInteractions = extractedInsights.participant_interactions?.participant_interactions || [];

    const handleSearch = async () => {
        if (!searchQuery.trim() || !meetingData?.meeting_id) return;

        setIsSearching(true);
        try {
            const response = await fetch('http://localhost:8000/api/meeting/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    meeting_id: meetingData.meeting_id,
                    user_query: searchQuery
                })
            });

            if (!response.ok) {
                throw new Error('Search failed');
            }

            const data = await response.json();
            const cleaned = data.answer.trim();
            const parsed = JSON.parse(cleaned);
            setSearchResult(parsed);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResult({ error: 'Could not retrieve insights' });
        } finally {
            setIsSearching(false);
        }
    };


    return (
        <div className="dashboard-container min-h-screen bg-gray-100 px-4 py-8">
            <header className="dashboard-header flex flex-col md:flex-row justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Meeting Dashboard</h1>
                <button
                    onClick={handleBackToUpload}
                    className="back-button bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                    Back to Upload
                </button>
            </header>

            <div className="dashboard-content space-y-8">
                {/* Meeting Info */}
                <div className="meeting-info">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Meeting Information</h2>
                    <div className="info-card bg-white rounded-lg shadow p-4">
                        <p className="text-gray-700"><strong>Meeting ID:</strong> {meeting_id || 'N/A'}</p>
                    </div>
                </div>

                {/* Transcript */}
                <div className="transcript-section">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Transcript</h2>
                    <div className="content-card bg-white rounded-lg shadow p-4 max-h-96 overflow-y-auto">
                        <p className="text-gray-800 whitespace-pre-wrap">
                            {transcription || 'No transcript available'}
                        </p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="search-bar flex flex-col md:flex-row items-center gap-4 mb-8">
                    <input
                        type="text"
                        placeholder="Ask something about this meeting..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full md:w-2/3 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSearch}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                        disabled={isSearching}
                    >
                        {isSearching ? 'Searching...' : 'Search'}
                    </button>
                </div>
                {searchResult && (
                    <div className="search-results bg-white rounded-lg shadow p-4">
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">Search Results</h2>

                        {searchResult.error && (
                            <p className="text-red-500">{searchResult.error}</p>
                        )}

                        {!searchResult.error && Object.keys(searchResult).map((key, idx) => (
                            <div key={idx} className="mb-4">
                                <h3 className="font-semibold text-gray-800 capitalize">{key.replace(/_/g, ' ')}</h3>
                                <ul className="list-disc list-inside text-gray-700 space-y-1">
                                    {Array.isArray(searchResult[key])
                                        ? searchResult[key].map((item, i) => (
                                            <li key={i}>
                                                {typeof item === 'string'
                                                    ? item
                                                    : item.description || JSON.stringify(item)}
                                            </li>
                                        ))
                                        : <li>{JSON.stringify(searchResult[key])}</li>
                                    }
                                </ul>
                            </div>
                        ))}
                    </div>
                )}


                {/* AI Insights */}
                <div className="insights-section">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">AI Insights</h2>
                    <div className="insights-grid grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Action Items */}
                        <div className="insights-card bg-white rounded-lg shadow p-4">
                            <h3 className="text-lg font-medium text-gray-800 mb-2">Action Items</h3>
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                {safeActionItems.length > 0
                                    ? safeActionItems.map((item, index) => (
                                        <li key={index}>
                                            {typeof item === 'string'
                                                ? item
                                                : item.description || JSON.stringify(item)}
                                        </li>
                                    ))
                                    : <li>No action items found</li>}
                            </ul>
                        </div>

                        {/* Decisions */}
                        <div className="insights-card bg-white rounded-lg shadow p-4">
                            <h3 className="text-lg font-medium text-gray-800 mb-2">Decisions</h3>
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                {safeDecisions.length > 0
                                    ? safeDecisions.map((item, index) => (
                                        <li key={index}>
                                            {typeof item === 'string'
                                                ? item
                                                : item.description || JSON.stringify(item)}
                                        </li>
                                    ))
                                    : <li>No decisions made</li>}
                            </ul>
                        </div>

                        {/* Participant Interactions */}
                        <div className="insights-card bg-white rounded-lg shadow p-4">
                            <h3 className="text-lg font-medium text-gray-800 mb-2">Participant Interactions</h3>
                            <ul className="list-disc list-inside text-gray-700 space-y-1">
                                {safeParticipantInteractions.length > 0
                                    ? safeParticipantInteractions.map((item, index) => (
                                        <li key={index}>
                                            {typeof item === 'string'
                                                ? item
                                                : `${item.speaker || 'Unknown'} (${item.role || 'N/A'}) — ${item.interaction_type || 'Interaction'}: ${item.content || ''}`}
                                        </li>
                                    ))
                                    : <li>No participant interactions found</li>}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default Dashboard;
