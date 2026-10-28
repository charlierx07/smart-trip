import React, { useState } from 'react';
import './HeroSection.css';
import backgroundImage from '../assets/bg.jpg';
import { geocodeLocation } from '../services/api';

const HeroSection = ({ onPlanTrip }) => {
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!location.trim()) {
      alert('Please enter a location or use GPS');
      return;
    }

    try {
      setLoading(true);
      const locationObj = await geocodeLocation(location);
      onPlanTrip(locationObj);
    } catch (error) {
      console.error('Geocoding failed:', error);
      alert(error.message || 'Error finding location. Please check your internet connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationObj = {
          location: 'My Current Location',
          lat: latitude,
          lon: longitude,
        };
        onPlanTrip(locationObj);
      },
      (error) => {
        console.error('GPS Error:', error);
        alert('Could not access your location. Please enable GPS or use manual input.');
        setLoading(false);
      }
    );
  };

  return (
    <div
      className="hero-section"
      style={{
        backgroundImage: `linear-gradient(to bottom right, rgba(0,0,0,0.6), rgba(0,0,0,0.3)), url(${backgroundImage})`,
      }}
    >
      <div className="hero-overlay">
        <h1 className="hero-title">SMART TRIP</h1>
        <p className="hero-subtitle">Plan Personalized trips with AI in seconds</p>

        <div className="input-group">
          <input
            type="text"
            placeholder="Enter your location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={loading}
          />
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Searching...' : 'Plan Trip →'}
          </button>
        </div>

        <div style={{ marginTop: '10px' }}>
          <button onClick={handleUseGPS} className="gps-button" disabled={loading}>
            📍 Use My Current Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
