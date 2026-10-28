/**
 * Central API Service for Smart Trip Frontend
 * Connects to the Express backend when available, with automatic
 * graceful fallback to direct OpenStreetMap / Overpass queries if the backend is offline.
 */

const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Geocode location name into coordinates
 * @param {string} query
 * @returns {Promise<{ location: string, lat: number, lon: number }>}
 */
export async function geocodeLocation(query) {
  if (!query || !query.trim()) {
    throw new Error('Please enter a location');
  }

  // 1. Try Backend API first
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(
      `${API_BASE_URL}/places/geocode?q=${encodeURIComponent(query.trim())}`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (json.data && json.data.length > 0) {
        const first = json.data[0];
        return {
          location: first.location,
          lat: first.lat,
          lon: first.lon,
        };
      }
    }
  } catch (backendError) {
    console.warn(
      'Backend geocode unreachable, falling back to direct OSM:',
      backendError.message
    );
  }

  // 2. Direct OSM Nominatim Fallback
  const fallbackRes = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query.trim()
    )}`
  );
  if (!fallbackRes.ok) {
    throw new Error('Geocoding service unavailable');
  }

  const data = await fallbackRes.json();
  if (!data || data.length === 0) {
    throw new Error('No location found. Try a different place.');
  }

  return {
    location: data[0].display_name,
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon),
  };
}

/**
 * Fetch nearby points of interest
 * @param {number} lat
 * @param {number} lon
 * @param {number} [radius=15000]
 * @returns {Promise<Array>}
 */
export async function fetchPlaces(lat, lon, radius = 15000) {
  // 1. Try Backend API first
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(
      `${API_BASE_URL}/places/nearby?lat=${lat}&lon=${lon}&radius=${radius}`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json.data) && json.data.length > 0) {
        return json.data;
      }
    }
  } catch (backendError) {
    console.warn(
      'Backend places unreachable, falling back to direct Overpass:',
      backendError.message
    );
  }

  // 2. Direct Overpass API Fallback
  const overpassQuery = `
    [out:json][timeout:25];
    (
      node["leisure"="park"](around:${radius},${lat},${lon});
      node["leisure"="garden"](around:${radius},${lat},${lon});
      node["leisure"="water_park"](around:${radius},${lat},${lon});
      node["tourism"="theme_park"](around:${radius},${lat},${lon});
      node["tourism"="attraction"](around:${radius},${lat},${lon});
      node["tourism"="museum"](around:${radius},${lat},${lon});
      node["historic"](around:${radius},${lat},${lon});
      node["amenity"="place_of_worship"](around:${radius},${lat},${lon});
    );
    out body;
  `;

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `data=${encodeURIComponent(overpassQuery)}`,
    });

    const data = await response.json();
    if (!data.elements) return [];

    return data.elements.map((el) => ({
      id: el.id,
      name: el.tags?.name || 'Unnamed Place',
      type:
        el.tags?.tourism ||
        el.tags?.leisure ||
        el.tags?.historic ||
        el.tags?.amenity ||
        'Unknown',
      lat: el.lat,
      lon: el.lon,
      distance: null,
    }));
  } catch (error) {
    console.error('Error fetching from Overpass API:', error);
    return [];
  }
}

/**
 * Save a finalized trip to the backend
 * @param {Object} tripData
 * @returns {Promise<Object>}
 */
export async function saveTrip(tripData) {
  try {
    const res = await fetch(`${API_BASE_URL}/trips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tripData),
    });
    if (!res.ok) throw new Error('Failed to save trip');
    return await res.json();
  } catch (error) {
    console.error('saveTrip error:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get all saved trips from the backend
 * @returns {Promise<Array>}
 */
export async function getSavedTrips() {
  try {
    const res = await fetch(`${API_BASE_URL}/trips`);
    if (!res.ok) throw new Error('Failed to fetch trips');
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error('getSavedTrips error:', error);
    return [];
  }
}
