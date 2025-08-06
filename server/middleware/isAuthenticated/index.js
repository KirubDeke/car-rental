const jwt = require("jsonwebtoken");
const db = require("../../models"); 

const isAuthenticated = async (req, res, next) => {
  const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "No token provided. Authentication required.",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const user = await db.users.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "User no longer exists.",
      });
    }
    // Attach user to request object
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({
      status: "fail",
      message: "Invalid or expired token.",
    });
  }
};

module.exports = isAuthenticated;
