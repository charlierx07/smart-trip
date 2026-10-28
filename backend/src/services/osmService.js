/**
 * OpenStreetMap (OSM) Service
 * Handles Geocoding via Nominatim & Nearby Places search via Overpass API
 */

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
const OVERPASS_BASE_URL = 'https://overpass-api.de/api/interpreter';

// Custom User-Agent header (required by OSM Nominatim usage policy)
const HEADERS = {
  'User-Agent': 'SmartTripApp/1.0 (smart-trip-planner)',
  'Accept-Language': 'en',
};

/**
 * Geocode a textual location query to coordinates
 * @param {string} query - Location name (e.g., "Paris", "Goa", "Tokyo")
 * @returns {Promise<Array>} Array of matching locations
 */
async function geocode(query) {
  if (!query || typeof query !== 'string') {
    throw new Error('A valid query string is required');
  }

  const url = `${NOMINATIM_BASE_URL}/search?format=json&limit=5&q=${encodeURIComponent(
    query.trim()
  )}`;

  const response = await fetch(url, { headers: HEADERS });
  if (!response.ok) {
    throw new Error(`Nominatim geocoding failed with status: ${response.status}`);
  }

  const data = await response.json();
  return data.map((item) => ({
    location: item.display_name,
    lat: parseFloat(item.lat),
    lon: parseFloat(item.lon),
    type: item.type,
    importance: item.importance,
  }));
}

/**
 * Fetch nearby points of interest within radius (in meters)
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @param {number} radius - Search radius in meters (default 15000 = 15km)
 * @returns {Promise<Array>} Array of normalized places
 */
async function getNearbyPlaces(lat, lon, radius = 15000) {
  if (lat == null || lon == null) {
    throw new Error('Latitude and Longitude are required');
  }

  const numericRadius = Number(radius) || 15000;
  const overpassQuery = `
    [out:json][timeout:25];
    (
      node["leisure"="park"](around:${numericRadius},${lat},${lon});
      node["leisure"="garden"](around:${numericRadius},${lat},${lon});
      node["leisure"="water_park"](around:${numericRadius},${lat},${lon});
      node["tourism"="theme_park"](around:${numericRadius},${lat},${lon});
      node["tourism"="attraction"](around:${numericRadius},${lat},${lon});
      node["tourism"="museum"](around:${numericRadius},${lat},${lon});
      node["historic"](around:${numericRadius},${lat},${lon});
      node["amenity"="place_of_worship"](around:${numericRadius},${lat},${lon});
    );
    out body;
  `;

  const response = await fetch(OVERPASS_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      ...HEADERS,
    },
    body: `data=${encodeURIComponent(overpassQuery)}`,
  });

  if (!response.ok) {
    throw new Error(`Overpass API query failed with status: ${response.status}`);
  }

  const data = await response.json();
  if (!data.elements || !Array.isArray(data.elements)) {
    return [];
  }

  return data.elements.map((el) => {
    const rawType =
      el.tags?.tourism ||
      el.tags?.leisure ||
      el.tags?.historic ||
      el.tags?.amenity ||
      'attraction';

    return {
      id: el.id,
      name: el.tags?.name || 'Unnamed Attraction',
      type: rawType,
      lat: el.lat,
      lon: el.lon,
      tags: {
        website: el.tags?.website,
        opening_hours: el.tags?.opening_hours,
        fee: el.tags?.fee,
      },
    };
  });
}

module.exports = {
  geocode,
  getNearbyPlaces,
};
