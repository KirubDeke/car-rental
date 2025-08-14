const db = require("../../models");

const createBooking = async (req, res) => {
  const userId = req.user?.id;
  const fleetId = req.params.id;
  const {
    pickupDate,
    returnDate,
    pickupLocation,
    fullName,
    email,
    phoneNumber,
  } = req.body;

  const transaction = await db.sequelize.transaction();
  try {
    // Validate user existence
    const user = await db.users.findByPk(userId, { transaction });
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ status: "fail", message: "User not found" });
    }

    // Validate fleet existence
    const fleet = await db.fleets.findByPk(fleetId, { transaction });
    if (!fleet) {
      await transaction.rollback();
      return res.status(404).json({ status: "fail", message: "Fleet not found" });
    }

    // Calculate total days
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    const timeDiff = returnD - pickup;
    const totalDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (totalDays <= 0) {
      await transaction.rollback();
      return res.status(400).json({
        status: "fail",
        message: "Return date must be after pickup date",
      });
    }

    // Calculate total price
    const pricePerDay = fleet.pricePerDay;
    const totalPrice = totalDays * pricePerDay;

    // Create booking
    const booking = await db.bookings.create(
      {
        pickupDate,
        returnDate,
        userId,
        fleetId,
        totalDate: totalDays,
        totalPrice,
        pickupLocation,
        fullName,
        email,
        phoneNumber,
        status: "confirmed", 
      },
      { transaction }
    );

    fleet.bookedDates = [
      ...(fleet.bookedDates || []),
      {
        startDate: pickupDate,
        endDate: returnDate,
        bookingId: booking.id,
      },
    ];
    fleet.changed("bookedDates", true);
    await fleet.save({ transaction });

    await transaction.commit();

    res.status(200).json({
      status: "success",
      message: "Fleet booked successfully",
      bookingId: booking.id,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("Booking error:", error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

const cancelBooking = async (req, res) => {
  const userId = req.user?.id;
  const fleetId = req.params.id;

  try {
    const user = await db.users.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    const fleet = await db.fleets.findByPk(fleetId);
    if (!fleet) {
      return res.status(404).json({
        status: "fail",
        message: "Fleet not found",
      });
    }

    const booking = await db.bookings.findOne({
      where: { userId, fleetId },
    });
    if (!booking) {
      return res.status(404).json({
        status: "fail",
        message: "Booking not found",
      });
    }

    await booking.update({ status: "cancelled" });

    return res.status(200).json({
      status: "success",
      message: "Booking cancelled successfully",
      data: booking,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "An error occurred while cancelling the booking",
    });
  }
};

const getBookingId = async (req, res) => {
  const userId = req.user?.id;
  const { fleetId } = req.params;

  try {
    const user = await db.users.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }

    const fleet = await db.fleets.findByPk(fleetId); 
    if (!fleet) {
      return res.status(404).json({
        status: "fail",
        message: "Fleet not found",
      });
    }
    const booking = await db.bookings.findOne({
      where: {
        userId,
        fleetId,
        status: "confirmed",
      },
    });

    if (!booking) {
      return res.status(404).json({
        status: "fail",
        message: "No confirmed booking found for this user and fleet",
      });
    }
    return res.status(200).json({
      status: "success",
      data: {
        bookingId: booking.id,
      },
    });
  } catch (error) {
    console.error("Error fetching booking ID:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

module.exports = {
  createBooking,
  cancelBooking,
  getBookingId
};
