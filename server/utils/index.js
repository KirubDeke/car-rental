const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});
/**
 * Send booking confirmation email
 */
const sendBookingConfirmation = async ({ to, fullName, fleet, booking }) => {

  const htmlMessage = `
    <h2>Booking Confirmation | Kirub Car Rental</h2>
    <p>Dear ${fullName},</p>
    <p>Your booking for <strong>${fleet.brand} ${fleet.model}</strong> has been confirmed.</p>
    <p><strong>Pickup:</strong> ${booking.pickupDate}</p>
    <p><strong>Return:</strong> ${booking.returnDate}</p>
    <p><strong>Total Price:</strong> ETB${booking.totalPrice}</p>
    <br/>
    <img 
    src="${process.env.BASE_URL}/uploads/cars/${fleet.image}" 
    alt="Car Image" 
    width="400" 
    style="border-radius:8px"
    />
    <br/><br/>
    <p>Thank you for choosing us 🚗</p>
  `;

  return transporter.sendMail({
    from: `"Car Rental Service" <${process.env.GMAIL_USER}>`,
    to,
    subject: "Your Car Booking Confirmation",
    html: htmlMessage,
  });
};

module.exports = { transporter, sendBookingConfirmation };
