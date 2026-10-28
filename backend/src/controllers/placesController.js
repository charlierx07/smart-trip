const osmService = require('../services/osmService');

/**
 * Handle geocoding search
 * GET /api/places/geocode?q=Paris
 */
async function searchLocation(req, res) {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Query parameter "q" is required',
      });
    }

    const results = await osmService.geocode(q);

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No locations found for the specified query',
        data: [],
      });
    }

    return res.json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error('Error in searchLocation:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to geocode location',
      details: error.message,
    });
  }
}

/**
 * Handle nearby attractions search
 * GET /api/places/nearby?lat=48.8566&lon=2.3522&radius=15000
 */
async function getNearby(req, res) {
  try {
    const { lat, lon, radius } = req.query;

    if (lat == null || lon == null) {
      return res.status(400).json({
        success: false,
        error: 'Query parameters "lat" and "lon" are required',
      });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    const searchRadius = radius ? parseInt(radius, 10) : 15000;

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid coordinates: "lat" and "lon" must be valid numbers',
      });
    }

    const places = await osmService.getNearbyPlaces(latitude, longitude, searchRadius);

    return res.json({
      success: true,
      count: places.length,
      data: places,
    });
  } catch (error) {
    console.error('Error in getNearby:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch nearby places',
      details: error.message,
    });
  }
}

module.exports = {
  searchLocation,
  getNearby,
};
