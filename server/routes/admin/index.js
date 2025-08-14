const express = require("express");
const controller = require("../../controllers/admin");
const router = express.Router();

router.get("/stats/getFleetCount", controller.getFleetCount);
router.get("/stats/getBookingsCount", controller.getBookingCount);
router.get("/stats/getUsersCount", controller.getUsersCount);
router.get("/stats/getTotalRevenue", controller.revenue);

module.exports = router;
