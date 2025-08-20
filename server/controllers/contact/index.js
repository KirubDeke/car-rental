const nodemailer = require("nodemailer");

exports.sendContactMessage = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, error: "All fields are required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER, 
        pass: process.env.GMAIL_APP_PASSWORD, 
      },
    });

    // Send email
    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_RECEIVER || "fistumkirubeldeke@gmail.com",
      subject: `[Contact Form] ${subject}`,
      text: `
        Name: ${name}
        Email: ${email}
        Message:
        ${message}
      `,
    });

    return res.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error("Email send error:", error);
    return res.status(500).json({ success: false, error: "Failed to send email" });
  }
};
