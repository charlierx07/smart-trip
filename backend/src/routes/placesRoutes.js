const express = require('express');
const router = express.Router();
const placesController = require('../controllers/placesController');

// GET /api/places/geocode?q=...
router.get('/geocode', placesController.searchLocation);

// GET /api/places/nearby?lat=...&lon=...&radius=...
router.get('/nearby', placesController.getNearby);

module.exports = router;
