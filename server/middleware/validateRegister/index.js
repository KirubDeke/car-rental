const validateRegisterInput = async (req, res, next) => {
  const { fullName, email, phoneNumber, password } = req.body;

  if (!fullName || typeof fullName !== 'string' || fullName.trim().length === 0) {
    return res.status(400).json({ error: "Full name must be a valid string." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email format." });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters long." });
  }

  const phoneStr = phoneNumber?.toString() ?? "";
  const phoneRegex = /^[97][0-9]{8}$/;
  if (!phoneStr || !phoneRegex.test(phoneStr)) {
    return res.status(400).json({
      error: "Phone number must be 9 digits and start with 9 or 7.",
    });
  }

  next();
};

module.exports = {
    validateRegisterInput
}