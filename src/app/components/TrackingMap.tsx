import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

interface TrackingMapProps {
  lat: number;
  lng: number;
}

const TrackingMap: React.FC<TrackingMapProps> = ({ lat, lng }) => {
  const [currentLat, setCurrentLat] = useState(lat);
  const [currentLng, setCurrentLng] = useState(lng);

  useEffect(() => {
    setCurrentLat(lat);
    setCurrentLng(lng);
    
    // Advanced Live Tracking Simulation Loop
    const interval = setInterval(() => {
      setCurrentLat(prev => prev + 0.0001);
      setCurrentLng(prev => prev + 0.0001);
    }, 3000);

    return () => clearInterval(interval);
  }, [lat, lng]);

  if (!lat || !lng) return (
    <Box sx={{ width: "100%", height: "100%", minHeight: "150px", bgcolor: "grey.100", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px dashed #ccc" }}>
      <Typography color="text.secondary">📍 Location not available</Typography>
    </Box>
  );

  return (
    <Box sx={{ width: "100%", height: "100%", minHeight: "200px", borderRadius: "10px", overflow: "hidden", position: "relative" }}>
      {/* Animated Live Ping */}
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '20px',
        height: '20px',
        bgcolor: 'error.main',
        borderRadius: '50%',
        zIndex: 10,
        boxShadow: '0 0 10px rgba(211,47,47,0.8)',
        animation: 'pulseRing 2s infinite'
      }} />
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '10px',
        height: '10px',
        bgcolor: '#fff',
        borderRadius: '50%',
        zIndex: 11,
      }} />

      <iframe
        title="Google Map Tracking"
        width="100%"
        height="100%"
        style={{ minHeight: "200px", border: 0 }}
        src={`https://maps.google.com/maps?q=${currentLat},${currentLng}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
        allowFullScreen
      ></iframe>
    </Box>
  );
};

export default TrackingMap;
