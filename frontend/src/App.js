import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TripPlanner from './pages/TripPlanner';
import TripSummary from './pages/TripSummary';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/trip" element={<TripPlanner />} />
      <Route path="/trip-summary" element={<TripSummary />} />
    </Routes>
  );
}

export default App;
