const express = require("express");
const db = require("../../models");

const createBooking = async (req, res) => {
  const userId = req.user?.id;
  const { fleetId } = req.params;
  const { pickupDate, returnDate } = req.body;

  try {
    // ✅ Validate user existence
    const user = await db.users.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
    // ✅ Validate fleet existence
    const fleet = await db.fleets.findByPk(fleetId);
    if (!fleet) {
      return res.status(404).json({
        status: "fail",
        message: "Fleet not found",
      });
    }
    // Calculate total dates
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    const timeDiff = returnD - pickup;
    const totalDate = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (totalDates <= 0) {
      return res.status(400).json({
        status: "fail",
        message: "Return date must be after pickup date",
      });
    }

    // Calculate price
    const pricePerDay = fleet.pricePerDay;
    const totalPrice = totalDates * pricePerDay;

    const bookingData = {
      pickupDate,
      returnDate,
      userId,
      fleetId,
      totalDate,
      totalPrice,
    };

    await db.bookings.create(bookingData);

    res.status(200).json({
      status: "success",
      message: "Fleet booked successfully",
      data: bookingData,
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

module.exports = {
  createBooking,
};
