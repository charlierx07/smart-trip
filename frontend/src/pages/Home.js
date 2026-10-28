import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';

const Home = () => {
  const navigate = useNavigate();

  const goToNextPage = (locationObj) => {
    // Example locationObj = { location: "Panaji", lat: 15.492, lon: 73.827 }

    if (!locationObj || !locationObj.lat || !locationObj.lon) {
      console.error("Invalid location object:", locationObj);
      return;
    }

    // Optional: Store in localStorage (for other fallback uses)
    localStorage.setItem("userLocation", JSON.stringify(locationObj));

    // Navigate to /trip with coordinates (matches route in App.js)
    navigate('/trip', {
      state: {
        lat: locationObj.lat,
        lon: locationObj.lon
      }
    });
  };

  return (
    <>
      <Navbar />
      <HeroSection onPlanTrip={goToNextPage} />
    </>
  );
};

export default Home;
