const { Op } = require("sequelize");
const db = require("../../models");
const bookings = db.bookings;

module.exports = async (req, res, next) => {
  const { pickupDate, returnDate } = req.body;
  const fleetId = req.params.id;

  try {
    // Parse dates
    const today = new Date();
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);

    // 1. Check if the car is currently booked today
    const bookedToday = await bookings.findOne({
      where: {
        fleetId,
        status: "confirmed",
        pickupDate: { [Op.lte]: today },
        returnDate: { [Op.gte]: today },
      },
    });

    if (bookedToday) {
      return res
        .status(409)
        .json({ message: "This car is currently in use today." });
    }

    // 2. Check for overlap in the selected date range
    const overlappingBooking = await bookings.findOne({
      where: {
        fleetId,
        status: "confirmed",
        pickupDate: { [Op.lte]: returnD },
        returnDate: { [Op.gte]: pickup },
      },
    });

    if (overlappingBooking) {
      return res
        .status(409)
        .json({ message: "Car is already booked for the selected dates." });
    }

    // All checks passed
    next();
  } catch (error) {
    console.error("Availability check error:", error);
    res.status(500).json({ message: "Server error while checking availability." });
  }
};
