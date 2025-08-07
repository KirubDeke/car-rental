const express = require('express');
const router = express.Router();
const isAuthenticated = require('../../middleware/checkCarAvailability');
const checkCarAvailability = require('../../middleware/checkCarAvailability');
const validateBooking = require('../../middleware/validateBooking');
const controller = require('../../controllers/booking');

router.post('/book-fleet/:fleetId', isAuthenticated, checkCarAvailability, validateBooking, controller.createBooking);

module.exports = router;

