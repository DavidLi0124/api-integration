const nodemailer = require("nodemailer");

const sendEmail = async (email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      // service: process.env.SERVICE,
      port: 587,
      secure: true,
      secureConnection: false, // TLS requires secureConnection to be false
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
      tls: {
        ciphers: "SSLv3",
      },
    });

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      text: text,
    });
    console.log("email sent successfully");
  } catch (error) {
    console.log("email not sent");
    console.log(error);
  }
};

module.exports = sendEmail;
