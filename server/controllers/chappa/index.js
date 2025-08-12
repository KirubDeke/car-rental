const db = require("../../models");
const axios = require("axios");
require("dotenv").config();

const initializePayment = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const bookingId = req.params.bookingId;
    const userId = req.user.id;
    const { amount } = req.body;

    if (!amount || !bookingId || !userId) {
      await transaction.rollback();
      return res.status(400).json({ error: "Missing required fields" });
    }
    const booking = await db.bookings.findByPk(bookingId, { transaction });
    if (!booking) {
      await transaction.rollback();
      return res.status(404).json({ error: "Booking not found" });
    }
    const tx_ref = `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const chapaRes = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        amount,
        currency: "ETB",
        tx_ref,
        callback_url: `${process.env.BASE_URL}/api/chappa/callback`,
        return_url: `${process.env.FRONTEND_URL}/payment-success?tx_ref=${tx_ref}`,
        customization: {
          title: "Car Rental",
          description: `Payment-for-booking-${bookingId}`,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPPA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    await db.payments.create(
      {
        amount,
        method: "chappa",
        status: "pending",
        bookingId,
        userId,
        tx_ref,
      },
      { transaction }
    );
    // Commit transaction
    await transaction.commit();
    res.status(200).json({
      status: "success",
      checkout_url: chapaRes.data.data.checkout_url,
      tx_ref,
    });
  } catch (error) {
    await transaction.rollback();
    console.error(error.response?.data || error.message);
    res.status(500).json({
      error: "Payment initialization failed",
      details: error.response?.data?.message || error.message,
    });
  }
};

const handleChappaCallback = async (req, res) => {
  try {
    const { tx_ref } = req.body;

    if (!tx_ref) return res.status(400).json({ error: "Missing tx_ref" });

    const verifyRes = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPPA_SECRET_KEY}`,
        },
      }
    );

    const paymentStatus = verifyRes.data.data.status;

    const payment = await db.Payment.findOne({ where: { tx_ref } });
    if (payment) {
      payment.status = paymentStatus === "success" ? "completed" : "failed";
      await payment.save();
    }

    res
      .status(200)
      .json({ message: "Callback processed", status: paymentStatus });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to process callback" });
  }
};

module.exports = {
  initializePayment,
  handleChappaCallback,
};
