const express = require("express");
const db = require("../../models");

const createBooking = async (req, res) => {
  const userId = req.user?.id;
  const fleetId = req.params.id;
  const { pickupDate, returnDate, pickupLocation } = req.body;

  try {
    // Validate user existence
    const user = await db.users.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    // Validate fleet existence
    const fleet = await db.fleets.findByPk(fleetId);
    if (!fleet) {
      return res.status(404).json({
        status: "fail",
        message: "Fleet not found",
      });
    }

    // Calculate total days
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    const timeDiff = returnD - pickup;
    const totalDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (totalDays <= 0) {
      return res.status(400).json({
        status: "fail",
        message: "Return date must be after pickup date",
      });
    }

    // Calculate price
    const pricePerDay = fleet.pricePerDay;
    const totalPrice = totalDays * pricePerDay;

    const bookingData = {
      pickupDate,
      returnDate,
      userId,
      fleetId,
      totalDate: totalDays,
      totalPrice,
      pickupLocation,
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

const bookingConfirmation = async (req, res) => {
  const userId = req.user?.id;
  const fleetId = req.params.id;

  try {
    // Check user existence
    const user = await db.users.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    // Find booking with user and fleet info
    const bookingInfo = await db.bookings.findOne({
      where: { userId, fleetId },
      include: [
        {
          model: db.users,
          attributes: ['fullName', 'phoneNumber', 'email']
        },
        {
          model: db.fleets,
          attributes: ['brand', 'model', 'year', 'plateNumber', 'type', 'pricePerDay', 'fuelType', 'seats', 'transmission', 'image']
        },
        
      ]
    });

    if (!bookingInfo) {
      return res.status(404).json({
        status: "fail",
        message: "Booking not found for this user and fleet",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Fetched Successfully",
      data: bookingInfo
    });

  } catch (error) {
    console.error("Booking confirmation error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

module.exports = {
  createBooking,
  bookingConfirmation
};
