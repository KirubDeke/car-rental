const express = require('express');
const router = express.Router();
const isAuthenticated = require('../../middleware/isAuthenticated');
const checkCarAvailability = require('../../middleware/checkCarAvailability');
const validateBooking = require('../../middleware/validateBooking');
const controller = require('../../controllers/booking');

router.post('/book-fleet/:id', isAuthenticated, checkCarAvailability, validateBooking, controller.createBooking);
router.delete('/cancel-booking/:id', isAuthenticated, controller.cancelBooking);
router.get('/bookingId/:fleetId', isAuthenticated, controller.getBookingId);

module.exports = router;

