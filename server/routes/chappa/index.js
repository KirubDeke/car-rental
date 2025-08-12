const express = require("express");
const controller = require("../../controllers/chappa");
const isAuthenticated = require("../../middleware/isAuthenticated");
const router = express.Router();

router.post("/initialize/:bookingId", isAuthenticated, controller.initializePayment);
router.post("/callback", controller.handleChappaCallback);

module.exports = router;
