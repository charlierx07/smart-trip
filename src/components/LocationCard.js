import React from 'react';
import './LocationCard.css';

const LocationCard = ({ image, name, type, distance, onClick, onSelect, isSelected }) => {
  return (
    <div className="location-card" onClick={onClick}>
      <img
        src={image}
        alt={name}
        onError={(e) => {
          e.target.src = `https://placehold.co/400x300/7c3aed/white?text=${encodeURIComponent(type || 'Place')}`;
        }}
      />
      <div className="location-info">
        <h3>{name}</h3>
        <p>Type: {type}</p>
        <p>Distance: {distance} km</p>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevents modal from opening when clicking this button
            onSelect();
          }}
          className={isSelected ? 'card-btn remove' : 'card-btn add'}
        >
          {isSelected ? '🗑 Remove from Plan' : '➕ Add to Plan'}
        </button>
      </div>
    </div>
  );
};

export default LocationCard;
