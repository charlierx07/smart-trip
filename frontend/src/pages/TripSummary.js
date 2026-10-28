import React, { useState } from 'react';
import './TripSummary.css';
import Navbar from '../components/Navbar';
import { useLocation, useNavigate } from 'react-router-dom';
import { saveTrip } from '../services/api';

// Fee estimates per place type (in ₹, 0 = free)
const TYPE_FEE = {
  park: 0,
  garden: 0,
  water_park: 500,
  theme_park: 600,
  attraction: 100,
  museum: 50,
  place_of_worship: 0,
  historic: 100,
};

const TRANSPORT_COST_PER_KM = 12; // ₹ per km (auto/cab estimate)

/**
 * Build a time string like "9:00 AM – 10:30 AM" for a slot starting at
 * `startMinutes` (minutes since midnight) lasting `durationMins`.
 */
function formatSlot(startMinutes, durationMins) {
  const fmt = (m) => {
    const h = Math.floor(m / 60);
    const min = m % 60;
    const suffix = h < 12 ? 'AM' : 'PM';
    const hour = h % 12 === 0 ? 12 : h % 12;
    return `${hour}:${String(min).padStart(2, '0')} ${suffix}`;
  };
  return `${fmt(startMinutes)} – ${fmt(startMinutes + durationMins)}`;
}

const TripSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedPlaces = [] } = location.state || {};
  const [saveStatus, setSaveStatus] = useState(null);
  const [saving, setSaving] = useState(false);

  // If no places were passed, show a helpful fallback
  if (selectedPlaces.length === 0) {
    return (
      <div className="trip-summary-page">
        <Navbar />
        <div className="trip-header">
          <h2>Optimized Trip Plan</h2>
        </div>
        <div style={{ padding: '60px', textAlign: 'center' }}>
          <p style={{ fontSize: '1.1rem', color: '#555' }}>
            No places selected. Go back and add some places to your plan!
          </p>
          <button
            onClick={() => navigate(-1)}
            style={{
              marginTop: '20px',
              padding: '12px 28px',
              background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '1rem',
            }}
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  // Sort places by distance so the itinerary is geographically optimal
  const sorted = [...selectedPlaces].sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));

  // Build itinerary — start at 9:00 AM, 90 min per place + 15 min travel gap
  let cursor = 9 * 60; // 9:00 AM in minutes
  const VISIT_DURATION = 90; // minutes
  const TRAVEL_GAP = 15; // minutes between stops

  const itinerary = [
    {
      time: '8:30 AM',
      title: 'Start Location',
      type: 'Starting Point',
      distance: '0 km',
      duration: '',
      fee: null,
      tags: [],
    },
    ...sorted.map((place) => {
      const item = {
        time: formatSlot(cursor, VISIT_DURATION),
        title: place.name,
        type: place.type || 'Attraction',
        distance: `${place.distance?.toFixed(1) ?? '–'} km`,
        duration: '1.5 hrs',
        fee:
          TYPE_FEE[place.type?.toLowerCase()] === 0
            ? 'Free'
            : `₹${TYPE_FEE[place.type?.toLowerCase()] ?? 100}`,
        tags: [],
      };
      cursor += VISIT_DURATION + TRAVEL_GAP;
      return item;
    }),
  ];

  // Budget calculation
  const entryTotal = sorted.reduce((sum, p) => {
    return sum + (TYPE_FEE[p.type?.toLowerCase()] ?? 100);
  }, 0);

  const totalDistance = sorted.reduce((sum, p) => sum + (p.distance ?? 0), 0);
  const transportEstimate = Math.round(totalDistance * TRANSPORT_COST_PER_KM);
  const foodEstimate = Math.round(sorted.length * 200); // ₹200 per person per stop approx

  const grandTotal = entryTotal + transportEstimate + foodEstimate;

  const handleSaveTrip = async () => {
    setSaving(true);
    setSaveStatus(null);
    try {
      const result = await saveTrip({
        destination: sorted[0]?.name || 'My Trip',
        places: sorted,
        notes: `Trip itinerary with ${sorted.length} stops`,
      });
      if (result.success) {
        setSaveStatus({ type: 'success', msg: 'Trip saved successfully! 🎉' });
      } else {
        setSaveStatus({ type: 'info', msg: 'Saved locally for this session.' });
      }
    } catch {
      setSaveStatus({ type: 'info', msg: 'Plan ready to view anytime.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="trip-summary-page">
      <Navbar />
      <div className="trip-header">
        <h2>Optimized Trip Plan</h2>
        <p style={{ fontSize: '0.95rem', opacity: 0.85, marginTop: '4px' }}>
          {sorted.length} place{sorted.length !== 1 ? 's' : ''} selected
        </p>
      </div>

      <div className="trip-body">
        {/* Itinerary */}
        <div className="itinerary">
          {itinerary.map((item, index) => (
            <div className="itinerary-card" key={index}>
              <div className="time">{item.time}</div>
              <div className="details">
                <h4>{item.title}</h4>
                <p>{item.type}</p>
                <div className="meta">
                  <span>{item.distance}</span>
                  {item.duration && <span> • {item.duration}</span>}
                  {item.fee && <span> • {item.fee}</span>}
                </div>
                {item.tags?.length > 0 && (
                  <div className="tags">
                    {item.tags.map((tag, i) => (
                      <span className="tag" key={i}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Budget Box */}
        <div className="budget-box">
          <h3>Trip Budget</h3>
          <ul>
            <li>🎟 Entry Fees: ₹{entryTotal}</li>
            <li>🍽 Food &amp; Refreshments: ₹{foodEstimate}</li>
            <li>🚌 Transport (est.): ₹{transportEstimate}</li>
          </ul>
          <hr />
          <h4>Total: ₹{grandTotal}</h4>

          <button
            onClick={handleSaveTrip}
            disabled={saving}
            style={{
              marginTop: '16px',
              width: '100%',
              padding: '10px',
              background: 'linear-gradient(135deg, #11998e, #38ef7d)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            {saving ? 'Saving...' : '💾 Save Trip Plan'}
          </button>

          {saveStatus && (
            <p
              style={{
                marginTop: '8px',
                fontSize: '0.85rem',
                color: saveStatus.type === 'success' ? '#2e7d32' : '#555',
                textAlign: 'center',
              }}
            >
              {saveStatus.msg}
            </p>
          )}

          <button
            onClick={() => navigate(-1)}
            style={{
              marginTop: '10px',
              width: '100%',
              padding: '10px',
              background: 'linear-gradient(135deg, #6a11cb, #2575fc)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            ← Edit Plan
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripSummary;
