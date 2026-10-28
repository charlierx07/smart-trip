import { fetchPlaces } from '../services/api';

/**
 * Fetch nearby places for given coordinates
 * Uses central API service (backend with Overpass fallback)
 */
export const fetchNearbyPlaces = async (lat, lon, radius = 15000) => {
  return await fetchPlaces(lat, lon, radius);
};
