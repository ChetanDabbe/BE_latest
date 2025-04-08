import React, { useRef, useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../styles/livefeed.css";

function LiveFeed() {
  const [scanning, setScanning] = useState(false);
  const [videoLink, setVideoLink] = useState("");
  const videoRef = useRef(null);
  const mediaStream = useRef(null);
  const intervalId = useRef(null);

  const captureFrame = useCallback(async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/jpeg");

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URI}/stream`, { image: imageData });
    } catch (error) {
      console.error("Error streaming frame:", error);
    }
  }, []);

  const startStreaming = useCallback(async () => {
    try {
      setVideoLink("");
      mediaStream.current = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream.current;
      }
      intervalId.current = setInterval(captureFrame, 100);
      await axios.post(`${import.meta.env.VITE_BACKEND_URI}/start_recording`);
    } catch (err) {
      console.error("Camera access error:", err);
    }
  }, [captureFrame]);

  const stopStreaming = useCallback(async () => {
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach(track => track.stop());
      mediaStream.current = null;
    }
    clearInterval(intervalId.current);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URI}/stop_recording`);
      if (response.data.video_link) {
        setVideoLink(response.data.video_link);
      }
    } catch (error) {
      console.error("Error stopping recording:", error);
    }
  }, []);

  useEffect(() => {
    if (scanning) {
      startStreaming();
    } else {
      stopStreaming();
    }
    return () => stopStreaming();
  }, [scanning, startStreaming, stopStreaming]);

  return (
    <div className="live-feed-container">
      <h4 className="live-feed-title">Live Scanning</h4>
      <div className="live-feed-box">
        {scanning ? (
          <video ref={videoRef} autoPlay playsInline muted className="live-feed-media" />
        ) : (
          <div className="live-feed-placeholder">📷 Live feed will appear here</div>
        )}
        <div className="moving-line"></div>
      </div>
      <div className="live-feed-buttons">
        <button onClick={() => setScanning(!scanning)} className="live-feed-btn">
          {scanning ? "Stop Scan" : "Start Scan"}
        </button>
        {videoLink && (
          <a href={videoLink} target="_blank" rel="noreferrer" className="video-link">
            🔗 View Recorded Video
          </a>
        )}
      </div>
    </div>
  );
}

export default LiveFeed;
