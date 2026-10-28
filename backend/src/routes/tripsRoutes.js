const express = require('express');
const router = express.Router();
const tripsController = require('../controllers/tripsController');

// GET /api/trips - list all trips
router.get('/', tripsController.getAllTrips);

// POST /api/trips - save a new trip
router.post('/', tripsController.createTrip);

// GET /api/trips/:id - get single trip
router.get('/:id', tripsController.getTripById);

// DELETE /api/trips/:id - delete a trip
router.delete('/:id', tripsController.deleteTrip);

module.exports = router;
