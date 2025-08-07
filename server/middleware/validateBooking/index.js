module.exports = (req, res, next) => {
  const { fleetId, pickupDate, returnDate, totalPrice, totalDates } = req.body;

  // Check for required fields
  if (!fleetId || !pickupDate || !returnDate || !totalPrice || !totalDates) {
    return res.status(400).json({
      message: "All fields (fleetId, pickupDate, returnDate, totalPrice, totalDates) are required.",
    });
  }

  const today = new Date();
  const pickup = new Date(pickupDate);
  const returnD = new Date(returnDate);

  // Check if pickup date is in the past
  if (pickup < today.setHours(0, 0, 0, 0)) {
    return res.status(400).json({
      message: "Pickup date cannot be in the past.",
    });
  }

  // Check if return date is after pickup date
  if (returnD <= pickup) {
    return res.status(400).json({
      message: "Return date must be after pickup date.",
    });
  }

  next(); // All checks passed
};
