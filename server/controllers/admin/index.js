const db = require("../../models");

const getFleetCount = async (req, res) => {
  try {
    const count = await db.fleets.count();

    if (count === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No fleets currently",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Fleets fetched successfully",
      data: count,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong while fetching fleets",
    });
  }
};
//get active bookings
const getBookingCount = async (req, res) => {
  try {
    const count = await db.bookings.count();

    if (count === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No bookings currently",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Bookings fetched successfully",
      data: count,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong while fetching bookings",
    });
  }
};
//total users
const getUsersCount = async (req, res) => {
  try {
    const count = await db.users.count();

    if (count === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No users currently",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Users fetched successfully",
      data: count,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Something went wrong while fetching users",
    });
  }
};
//revenue
const revenue = async (req, res) => {
  try {
    const totalRevenue = await db.payments.sum("amount", {
      where: { status: "completed" } 
    });

    return res.status(200).json({
      status: "success",
      message: "Total revenue fetched successfully",
      data: totalRevenue || 0
    });
  } catch (error) {
    console.error("Error fetching revenue:", error);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong while fetching revenue",
    });
  }
};


module.exports = {
  getFleetCount,
  getBookingCount,
  getUsersCount,
  revenue
};
