import React from 'react';

const TYPE_INFO = {
  park:              { fee: 'Free',       time: '9:00 AM – 6:00 PM', transport: 'Bus, Auto, Cab' },
  garden:            { fee: 'Free',       time: '6:00 AM – 8:00 PM', transport: 'Auto, Cab' },
  water_park:        { fee: '₹500',       time: '10:00 AM – 6:00 PM', transport: 'Cab, Bus' },
  theme_park:        { fee: '₹600',       time: '10:00 AM – 8:00 PM', transport: 'Cab, Bus' },
  attraction:        { fee: '₹100',       time: '9:00 AM – 5:00 PM', transport: 'Bus, Auto, Cab' },
  museum:            { fee: '₹50',        time: '10:00 AM – 5:00 PM', transport: 'Bus, Auto' },
  place_of_worship:  { fee: 'Free',       time: '5:00 AM – 9:00 PM', transport: 'Bus, Auto, Cab' },
  historic:          { fee: '₹100',       time: '8:00 AM – 6:00 PM', transport: 'Bus, Auto, Cab' },
};

const getInfo = (type) =>
  TYPE_INFO[type?.toLowerCase()] || {
    fee: '₹50–₹200',
    time: '9:00 AM – 6:00 PM',
    transport: 'Bus, Auto, Cab',
  };

const PlaceDetailsModal = ({ place, isSelected, onSelect, onClose }) => {
  if (!place) return null;

  const info = getInfo(place.type);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ marginTop: 0 }}>{place.name}</h2>

        <img
          src={`https://picsum.photos/seed/${encodeURIComponent(place.name)}/560/240`}
          alt={place.name}
          style={{ width: '100%', borderRadius: '10px', objectFit: 'cover', height: '220px' }}
          onError={(e) => {
            e.target.src = `https://placehold.co/560x240/7c3aed/white?text=${encodeURIComponent(place.type || 'Place')}`;
          }}
        />

        <table style={{ marginTop: '16px', borderCollapse: 'collapse', width: '100%', fontSize: '0.95rem' }}>
          <tbody>
            {[
              ['📍 Type',        place.type || 'Unknown'],
              ['📏 Distance',    `${place.distance?.toFixed(1) ?? '–'} km from your location`],
              ['🕘 Visit Hours', info.time],
              ['🎟 Entry Fee',   info.fee],
              ['🚌 Transport',   info.transport],
              ['📝 Description', 'A wonderful place to explore, relax, and make memories.'],
            ].map(([label, value]) => (
              <tr key={label} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '8px 4px', fontWeight: 600, whiteSpace: 'nowrap', color: '#555', width: '140px' }}>
                  {label}
                </td>
                <td style={{ padding: '8px 4px', color: '#333' }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', gap: '12px' }}>
          <button
            onClick={() => { onSelect(place); onClose(); }}
            style={{
              flex: 1,
              padding: '11px 20px',
              backgroundColor: isSelected ? '#dc3545' : '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.95rem',
            }}
          >
            {isSelected ? '🗑 Remove from Plan' : '➕ Add to Plan'}
          </button>

          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '11px 20px',
              backgroundColor: '#f0f0f0',
              color: '#333',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.95rem',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetailsModal;
