const isAdmin = async (req, res, next) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({
      status: "fail",
      message: "User not authenticated.",
    });
  }

  try {
    const user = await db.users.findByPk(userId);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found.",
      });
    }

  
    if (user.role === "admin") { 
      return next();
    }

    return res.status(403).json({
      status: "fail",
      message: "Unauthorized. Admin access required.",
    });

  } catch (error) {
    console.error("Admin check error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error.",
    });
  }
};

module.exports = isAdmin;

