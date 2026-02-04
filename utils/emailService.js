const nodemailer = require("nodemailer");

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // or 'outlook', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASSWORD, // your app password
  },
});

// function to welcome mail
const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    const emailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Welcome to Our CRUD App! 🎉",
      html: `
        <h1>Welcome, ${userName}!</h1>
        <p>Thank you for registering with us.</p>
        <p>We're excited to have you on board!</p>
        <p>If you have any questions, feel free to reach out.</p>
        <br>
        <p>Best regards,</p>
        <p>The Team</p>
      `,
    };
    const info = await transporter.sendMail(emailOptions);
    return info;
  } catch (error) {
    throw error;
  }
};

module.exports = { sendWelcomeEmail };
