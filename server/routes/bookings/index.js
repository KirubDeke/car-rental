const express = require('express');
const router = express.Router();
const isAuthenticated = require('../../middleware/isAuthenticated');
const checkCarAvailability = require('../../middleware/checkCarAvailability');
const validateBooking = require('../../middleware/validateBooking');
const isAdmin = require('../../middleware/isAdmin');
const controller = require('../../controllers/booking');

router.post('/book-fleet/:id', isAuthenticated, checkCarAvailability, validateBooking, controller.createBooking);
router.put('/cancel-booking/:bookingId', isAuthenticated, controller.cancelBooking);
router.get('/bookingId/:fleetId', isAuthenticated, controller.getBookingId);
router.get('/getBookingsInfo', isAuthenticated, isAdmin, controller.getBookingInformation);
router.delete('/deleteBooking/:id', isAuthenticated, isAdmin, controller.deleteBooking);
router.get('/bookingHistory', isAuthenticated, controller.bookingHistory);
router.get('/getBookingHistory/:bookingId', isAuthenticated, controller.singleBookingHistory);

module.exports = router;

