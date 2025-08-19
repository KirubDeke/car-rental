const db = require("../../models");
const { sendBookingConfirmation } = require("../../utils");

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
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });
    }

    // Validate fleet existence
    const fleet = await db.fleets.findByPk(fleetId, { transaction });
    if (!fleet) {
      await transaction.rollback();
      return res
        .status(404)
        .json({ status: "fail", message: "Fleet not found" });
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

    sendBookingConfirmation({
      to: email,
      fullName,
      fleet,
      booking,
    }).catch((err) => console.error("Email sending failed:", err));

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
  const bookingId = req.params.bookingId;

  try {
    const booking = await db.bookings.findOne({
      where: { id: bookingId, userId },
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
//fetch booking information
const getBookingInformation = async (req, res) => {
  try {
    const bookings = await db.bookings.findAndCountAll({
      include: [
        {
          model: db.users,
          as: "user",
          attributes: ["id", "fullName", "email", "phoneNumber"],
        },
        {
          model: db.fleets,
          as: "fleet",
          attributes: [
            "id",
            "brand",
            "model",
            "year",
            "plateNumber",
            "type",
            "pricePerDay",
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (bookings.count === 0) {
      return res.status(404).json({
        status: "fail",
        message: "No bookings found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Bookings fetched successfully",
      total: bookings.count,
      data: bookings.rows,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
//delete booking
const deleteBooking = async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await db.bookings.findByPk(id);

    if (!booking) {
      return res.status(404).json({
        status: "fail",
        message: "No bookings found",
      });
    }
    const fleet = await db.fleets.findByPk(booking.fleetId);
    if (fleet && Array.isArray(fleet.bookedDates)) {
      // normalize dates to YYYY-MM-DD
      const pickupDate = new Date(booking.pickupDate)
        .toISOString()
        .split("T")[0];
      const returnDate = new Date(booking.returnDate)
        .toISOString()
        .split("T")[0];
      // filter by startDate and endDate (not pickupDate / returnDate)
      fleet.bookedDates = fleet.bookedDates.filter(
        (dateRange) =>
          !(
            dateRange.startDate === pickupDate &&
            dateRange.endDate === returnDate
          )
      );
      await fleet.save();
    }
    await booking.destroy();
    return res.status(200).json({
      status: "success",
      message: "Booking deleted and fleet updated successfully",
    });
  } catch (error) {
    console.error("Delete booking error:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
//get bookings history
const bookingHistory = async (req, res) => {
  const userId = req.user?.id;

  try {
    const user = await db.users.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
    const history = await db.bookings.findAll({
      where: { userId },
      include: [
        {
          model: db.fleets,
          as: "fleet",
          attributes: [
            "model",
            "brand",
            "year",
            "plateNumber",
            "type",
            "pricePerDay",
            "fuelType",
            "seats",
            "transmission",
            "image",
            "description",
            "bookedDates",
          ],
        },
        {
          model: db.payments,
          as: "payment",
          attributes: ["id", "amount", "method", "status", "tx_ref", "paidAt"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      status: "success",
      count: history.length,
      history,
    });
  } catch (error) {
    console.error("Error fetching booking history:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
//get a single booking
const singleBookingHistory = async (req, res) => {
  const userId = req.user?.id;
  const { bookingId } = req.params; 

  try {
    const user = await db.users.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
    const booking = await db.bookings.findOne({
      where: { id: bookingId, userId },
      include: [
        {
          model: db.fleets,
          as: "fleet",
          attributes: [
            "model",
            "brand",
            "year",
            "plateNumber",
            "type",
            "pricePerDay",
            "fuelType",
            "seats",
            "transmission",
            "image",
            "description",
            "bookedDates",
          ],
        },
        {
          model: db.payments,
          as: "payment", 
          attributes: ["id", "amount", "method", "status", "tx_ref", "paidAt"],
        },
      ],
    });
    if (!booking) {
      return res.status(404).json({
        status: "fail",
        message: "Booking not found",
      });
    }
    return res.status(200).json({
      status: "success",
      booking,
    });
  } catch (error) {
    console.error("Error fetching single booking history:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

module.exports = {
  createBooking,
  cancelBooking,
  getBookingId,
  getBookingInformation,
  deleteBooking,
  bookingHistory,
  singleBookingHistory,
};
