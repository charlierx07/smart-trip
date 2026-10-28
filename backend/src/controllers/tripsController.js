// In-memory trips store (can be connected to MongoDB, PostgreSQL, or Firebase)
let trips = [];

/**
 * Fee estimates per place type (in ₹)
 */
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

const TRANSPORT_COST_PER_KM = 12;

/**
 * Calculate budget breakdown for selected places
 */
function calculateTripBudget(selectedPlaces = []) {
  const entryTotal = selectedPlaces.reduce((sum, p) => {
    const fee = TYPE_FEE[(p.type || '').toLowerCase()] ?? 100;
    return sum + fee;
  }, 0);

  const totalDistance = selectedPlaces.reduce((sum, p) => sum + (p.distance ?? 0), 0);
  const transportEstimate = Math.round(totalDistance * TRANSPORT_COST_PER_KM);
  const foodEstimate = Math.round(selectedPlaces.length * 200);
  const grandTotal = entryTotal + transportEstimate + foodEstimate;

  return {
    entryFees: entryTotal,
    transportEstimate,
    foodEstimate,
    totalBudget: grandTotal,
  };
}

/**
 * Create/Save a new Trip
 * POST /api/trips
 */
async function createTrip(req, res) {
  try {
    const { title, destination, date, places = [], notes = '' } = req.body;

    if (!destination && (!places || places.length === 0)) {
      return res.status(400).json({
        success: false,
        error: 'Trip must have at least a destination or selected places',
      });
    }

    const budget = calculateTripBudget(places);

    const newTrip = {
      id: `trip_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      title: title || `Trip to ${destination || 'Destination'}`,
      destination: destination || (places[0]?.name ?? 'Custom Trip'),
      date: date || new Date().toISOString().split('T')[0],
      places,
      budget,
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    trips.unshift(newTrip);

    return res.status(201).json({
      success: true,
      message: 'Trip created successfully',
      data: newTrip,
    });
  } catch (error) {
    console.error('Error in createTrip:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to create trip',
      details: error.message,
    });
  }
}

/**
 * Get all saved trips
 * GET /api/trips
 */
async function getAllTrips(req, res) {
  return res.json({
    success: true,
    count: trips.length,
    data: trips,
  });
}

/**
 * Get single trip by ID
 * GET /api/trips/:id
 */
async function getTripById(req, res) {
  const { id } = req.params;
  const trip = trips.find((t) => t.id === id);

  if (!trip) {
    return res.status(404).json({
      success: false,
      error: `Trip with id "${id}" not found`,
    });
  }

  return res.json({
    success: true,
    data: trip,
  });
}

/**
 * Delete a trip by ID
 * DELETE /api/trips/:id
 */
async function deleteTrip(req, res) {
  const { id } = req.params;
  const initialLength = trips.length;
  trips = trips.filter((t) => t.id !== id);

  if (trips.length === initialLength) {
    return res.status(404).json({
      success: false,
      error: `Trip with id "${id}" not found`,
    });
  }

  return res.json({
    success: true,
    message: 'Trip deleted successfully',
  });
}

module.exports = {
  createTrip,
  getAllTrips,
  getTripById,
  deleteTrip,
  calculateTripBudget,
};
