import React from 'react';
import './LocationInput.css';

const LocationInput = ({ onLocationSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const location = e.target.location.value;
    onLocationSubmit(location);
  };

  return (
    <form className="location-form" onSubmit={handleSubmit}>
      <input type="text" name="location" placeholder="Enter your location" required />
      <button type="submit">Proceed</button>
    </form>
  );
};

export default LocationInput;
