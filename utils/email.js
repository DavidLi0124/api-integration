const nodeMailer = require("nodemailer");

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
    text: text,
  };
  try {
    // Send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = sendEmail;
