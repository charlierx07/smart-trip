import React from 'react';
import './FilterBar.css';

const FilterBar = ({ selectedDate, onDateChange, selectedType, onTypeChange }) => {
  return (
    <div className="filter-bar">
      <div className="filter-input">
        <label>Date:</label>
        <input type="date" value={selectedDate} onChange={onDateChange} />
      </div>

      <div className="filter-input">
        <label>Trip Type:</label>
        <select value={selectedType} onChange={onTypeChange}>
          <option value="">Select</option>
          <option value="Park">Park</option>
          <option value="Resort">Resort</option>
          <option value="Waterfall">Waterfall</option>
          <option value="Mandir">Mandir</option>
          <option value="Heritage Site">Heritage Site</option>
          <option value="Amusement Park">Amusement Park</option>
          <option value="Museum">Museum</option>
          <option value="Other">Other</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
