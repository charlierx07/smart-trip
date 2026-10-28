import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import FilterBar from '../components/FilterBar';
import TripSidebar from '../components/TripSidebar';
import LocationCard from '../components/LocationCard';
import PlaceDetailsModal from '../components/PlaceDetailsModal';
import { fetchNearbyPlaces } from '../utils/locationFetcher';
import { calculateDistance } from '../utils/distanceUtils';
import '../App.css';

const TripPlanner = () => {
  const location = useLocation();
  const { lat, lon } = location.state || { lat: null, lon: null };

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (e) => setSelectedDate(e.target.value);
  const handleTypeChange = (e) => setSelectedType(e.target.value);

  const openModal = (place) => {
    setSelectedPlace(place);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPlace(null);
  };

  const handleSelectPlace = (place) => {
    const exists = selectedPlaces.find((p) => p.name === place.name);
    if (exists) {
      setSelectedPlaces(selectedPlaces.filter((p) => p.name !== place.name));
    } else {
      setSelectedPlaces([...selectedPlaces, place]);
    }
  };

  useEffect(() => {
    if (lat && lon) {
      setLoading(true);
      fetchNearbyPlaces(lat, lon)
        .then((places) => {
          const enrichedPlaces = places.map((place) => ({
            ...place,
            distance: calculateDistance(lat, lon, place.lat, place.lon),
          }));
          setNearbyPlaces(enrichedPlaces);
        })
        .finally(() => setLoading(false));
    }
  }, [lat, lon]);

  const filteredLocations = nearbyPlaces.filter((item) =>
    selectedType ? item.type === selectedType : true
  );

  return (
    <>
      <div className="planner-gradient-header">
        <Navbar />
        <FilterBar
          selectedDate={selectedDate}
          onDateChange={handleDateChange}
          selectedType={selectedType}
          onTypeChange={handleTypeChange}
        />
      </div>

      <div className="page-container">
        <div style={{ display: 'flex' }}>
          {/* Left side: Places */}
          <div style={{ flex: 1, padding: '10px 30px 30px 30px' }}>
            <h2>Suggested Places</h2>
            {loading ? (
              <div className="loader"></div>
            ) : filteredLocations.length === 0 ? (
              <p style={{ color: '#888', fontStyle: 'italic' }}>
                No places found nearby. Try a different location or filter.
              </p>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {filteredLocations.map((loc, index) => (
                  <LocationCard
                    key={loc.id ?? index}
                    image={`https://picsum.photos/seed/${encodeURIComponent(loc.name)}/400/300`}
                    name={loc.name}
                    type={loc.type}
                    distance={loc.distance?.toFixed(1)}
                    onClick={() => openModal(loc)}
                    onSelect={() => handleSelectPlace(loc)}
                    isSelected={selectedPlaces.some((p) => p.name === loc.name)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <TripSidebar
            selectedPlaces={selectedPlaces}
            setSelectedPlaces={setSelectedPlaces}
          />
        </div>
      </div>

      {/* Modal — now uses the PlaceDetailsModal component */}
      {isModalOpen && selectedPlace && (
        <PlaceDetailsModal
          place={selectedPlace}
          isSelected={selectedPlaces.some((p) => p.name === selectedPlace.name)}
          onSelect={handleSelectPlace}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default TripPlanner;
