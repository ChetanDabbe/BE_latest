import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/recordedHistory.css";

function RecordedHistory() {
  const [recordedVideos, setRecordedVideos] = useState([]);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const [playbackError, setPlaybackError] = useState(null);

  const backendURL = import.meta.env.VITE_BACKEND_URI;

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get(`${backendURL}/get_videos`);
        setRecordedVideos(response.data.videos || []);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, [backendURL]);

  const formatTimestamp = (filename) => {
    try {
      const match = filename.match(/output_(\d{8})-(\d{6})\.(mp4|avi)/);
      if (!match) return "Unknown Date";

      const datePart = match[1];
      const timePart = match[2];

      const formattedDate = new Date(
        `${datePart.substring(0, 4)}-${datePart.substring(4, 6)}-${datePart.substring(6, 8)}T` +
          `${timePart.substring(0, 2)}:${timePart.substring(2, 4)}:${timePart.substring(4, 6)}`
      );

      return formattedDate.toLocaleString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    } catch (error) {
      console.error("Error formatting timestamp:", error);
      return "Invalid Date";
    }
  };

  const handleVideoError = (e) => {
    console.error("Video playback error:", e);
    setPlaybackError("Error playing video. Try downloading instead.");
  };

  const handleDownloadVideo = (filename) => {
    const downloadUrl = `${backendURL}/download_video/${filename}`;
    window.open(downloadUrl, '_blank');
  };

  return (
    <div className="recorded-history-container">
      <h4 className="recorded-history-title">Recorded Sessions</h4>

      <div className="tabs">
        <button className="active">Recent</button>
      </div>

      <div className="recorded-list">
        {recordedVideos.length > 0 ? (
          recordedVideos.map((video, index) => (
            <div
              key={index}
              className="recorded-item"
              onClick={() => {
                const fullUrl = `${backendURL}/videos/${video.filename}`;
                setSelectedVideoUrl(fullUrl);
                setPlaybackError(null);
              }}
            >
              <div className="video-thumbnail">🎥</div>
              <div className="video-details">
                <p className="video-title">{video.filename}</p>
                <p className="video-meta">
                  Recorded on: {formatTimestamp(video.filename)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No recorded videos yet.</p>
        )}
      </div>

      {selectedVideoUrl && (
        <div className="video-player-overlay">
          <div className="video-player">
            <video
              controls
              width="640"
              height="480"
              style={{ backgroundColor: "#000" }}
              preload="auto"
              onError={handleVideoError}
            >
              <source src={selectedVideoUrl} type="video/mp4" />
              <source src={selectedVideoUrl} type="video/x-msvideo" />
              Your browser does not support the video tag.
            </video>

            {playbackError && (
              <div className="error-message" style={{ color: 'red', margin: '10px 0' }}>
                {playbackError}
              </div>
            )}

            <div className="video-controls" style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
              <button
                className="close-btn"
                onClick={() => setSelectedVideoUrl(null)}
              >
                Close
              </button>

              {selectedVideoUrl && (
                <button 
                  className="download-btn"
                  onClick={() => handleDownloadVideo(selectedVideoUrl.split('/').pop())}
                  style={{ backgroundColor: '#28a745' }}
                >
                  Download
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RecordedHistory;
