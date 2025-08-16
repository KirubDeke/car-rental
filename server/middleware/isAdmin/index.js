const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: "fail",
      message: "User not authenticated.",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      status: "fail",
      message: "Unauthorized. Admin access required.",
    });
  }

  next();
};

module.exports = isAdmin;

