import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [meetingData, setMeetingData] = useState(null);

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

    // Safely handle non-array values
    const safeActionItems = Array.isArray(insights?.action_items) ? insights.action_items : [];
    const safeDecisions = Array.isArray(insights?.decisions) ? insights.decisions : [];
    const safeParticipantInteractions = Array.isArray(insights?.participant_interactions) ? insights.participant_interactions : [];

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Meeting Dashboard</h1>
                <button onClick={handleBackToUpload} className="back-button">Back to Upload</button>
            </header>

            <div className="dashboard-content">
                <div className="meeting-info">
                    <h2>Meeting Information</h2>
                    <div className="info-card">
                        <p><strong>Meeting ID:</strong> {meeting_id || 'N/A'}</p>
                    </div>
                </div>

                <div className="transcript-section">
                    <h2>Transcript</h2>
                    <div className="content-card">
                        <p>{transcription || 'No transcript available'}</p>
                    </div>
                </div>

                <div className="insights-section">
                    <h2>AI Insights</h2>
                    <div className="insights-grid">
                        <div className="insights-card">
                            <h3>Action Items</h3>
                            <ul>
                                {safeActionItems.length > 0
                                    ? safeActionItems.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))
                                    : <li>No action items found</li>
                                }
                            </ul>
                        </div>

                        <div className="insights-card">
                            <h3>Decisions</h3>
                            <ul>
                                {safeDecisions.length > 0
                                    ? safeDecisions.map((decision, index) => (
                                        <li key={index}>{decision}</li>
                                    ))
                                    : <li>No decisions made</li>
                                }
                            </ul>
                        </div>

                        <div className="insights-card">
                            <h3>Participant Interactions</h3>
                            <ul>
                                {safeParticipantInteractions.length > 0
                                    ? safeParticipantInteractions.map((interaction, index) => (
                                        <li key={index}>{interaction}</li>
                                    ))
                                    : <li>No participant interactions found</li>
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
