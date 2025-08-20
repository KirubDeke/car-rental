const express = require("express");
const controller = require("../../controllers/contact")
const router = express.Router();

router.post("/contact", controller.sendContactMessage);

module.exports = router;