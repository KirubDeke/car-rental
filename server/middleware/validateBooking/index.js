module.exports = (req, res, next) => {
  const { pickupDate, returnDate, pickupLocation, fullName, email, phoneNumber } = req.body;

  if (!pickupDate || !returnDate || !pickupLocation || !fullName || !email || !phoneNumber) {
    return res.status(400).json({
      message:
        "All fields (pickupDate, returnDate, pickupLocation, fullName, email, phoneNumber) are required.",
    });
  }
  if (typeof fullName !== "string" || fullName.trim().length < 2) {
    return res.status(400).json({
      message: "Full name must be a valid string with at least 2 characters.",
    });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: "Invalid email format.",
    });
  }

  const phoneRegex = /^[79]\d{8}$/;
  if (!phoneRegex.test(phoneNumber)) {
    return res.status(400).json({
      message: "Phone number must be 9 digits and start with 7 or 9.",
    });
  }
  const today = new Date();
  const pickup = new Date(pickupDate);
  const returnD = new Date(returnDate);

  if (pickup < today.setHours(0, 0, 0, 0)) {
    return res.status(400).json({
      message: "Pickup date cannot be in the past.",
    });
  }
  if (returnD <= pickup) {
    return res.status(400).json({
      message: "Return date must be after pickup date.",
    });
  }
  next(); 
};
