import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TripSidebar.css';

const TripSidebar = ({ selectedPlaces, setSelectedPlaces }) => {
  const navigate = useNavigate();

  const handleRemoveAll = () => {
    setSelectedPlaces([]);
  };

  const handleNext = () => {
    navigate('/trip-summary', { state: { selectedPlaces } }); // ✅ Passing data via state
  };

  return (
    <div className="trip-sidebar">
      <div className="sidebar-header">
        <h3>🧳 Your Trip Plan</h3>
        {selectedPlaces.length > 0 && (
          <button className="clear-btn" title="Clear All" onClick={handleRemoveAll}>
            🗑
          </button>
        )}
      </div>

      {selectedPlaces.length === 0 ? (
        <p className="empty-text">No places selected yet.</p>
      ) : (
        <ul className="selected-list">
          {selectedPlaces.map((place, index) => (
            <li key={index} className="selected-item">
              <span>{place.name}</span>
            </li>
          ))}
        </ul>
      )}

      <button
        className="next-btn"
        disabled={selectedPlaces.length === 0}
        onClick={handleNext}
      >
        ➡ Next: Trip Summary
      </button>
    </div>
  );
};

export default TripSidebar;
