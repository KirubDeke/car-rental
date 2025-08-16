const express = require("express")
const router = express.Router();
const uploads = require("../../middleware/uploadImage");
const isAuthenticated = require("../../middleware/isAuthenticated");
const isAdmin = require("../../middleware/isAdmin");
const controller = require("../../controllers/fleets");

router.post("/create", isAuthenticated, isAdmin, uploads.single("image"), controller.createFleets)
router.get("/all", controller.getAllFleets)
router.get("/car/:id", controller.getFleetById)
router.get("/isAvailable/:id", controller.checkFleetAvailability)
router.put("/updateFleet/:id", isAuthenticated, isAdmin, uploads.single("image"), controller.updateFleet)
router.delete("/deleteFleet/:id", isAuthenticated, isAdmin, controller.deleteFleet)

module.exports = router;