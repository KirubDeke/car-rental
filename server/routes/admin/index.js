const express = require("express");
const controller = require("../../controllers/admin");
const isAdmin = require('../../middleware/isAdmin');
const isAuthenticated = require('../../middleware/isAuthenticated');
const router = express.Router();

router.get("/stats/getFleetCount", isAuthenticated, isAdmin, controller.getFleetCount);
router.get("/stats/getBookingsCount", isAuthenticated, isAdmin, controller.getBookingCount);
router.get("/stats/getUsersCount", isAuthenticated, isAdmin, controller.getUsersCount);
router.get("/stats/getTotalRevenue", isAuthenticated, isAdmin, controller.revenue);

module.exports = router;
