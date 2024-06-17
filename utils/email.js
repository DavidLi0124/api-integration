const nodeMailer = require("nodemailer");

const writeVerifyEmail = (url) =>
  `
    <h2>Verify your email</h2>
    <p>Click the link below to verify your email address:</p>
    <a href="${url}">Verify</a>
  `;

const writeResetPasswordEmail = (url) =>
  `
    <h2>Reset Password</h2>
    <p>Click the link below to reset your password:</p>
    <a href="${url}">Reset Password</a>
  `;

const sendEmail = async (email, subject, text) => {
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    host: process.env.HOST,
    port: 465,
    secure: true,
    secureConnection: false,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const mailOptions = {
    from: process.env.USER,
    to: email,
    subject: subject,
    html: text,
  };
  try {
    // Send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { sendEmail, writeVerifyEmail, writeResetPasswordEmail };
