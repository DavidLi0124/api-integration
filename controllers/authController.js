const bcrypt = require("bcrypt");

const {
  sendEmail,
  writeVerifyEmail,
  writeResetPasswordEmail,
} = require("../utils/email");
const Token = require("../models/Token");
const { User, validate } = require("../models/User");
const { generateToken, verifyToken } = require("../utils/token");

const register = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const { email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });

    // MAKING TOKEN
    const token = await generateToken(user);

    // SENDEMAIL
    const message = writeVerifyEmail(
      `${process.env.SERVER_URL}/auth/verify/${user._id}/${token}`
    );
    await sendEmail(user.email, "Verify Email", message);

    res
      .status(200)
      .json({ message: "An Email sent to your account. please verify" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

const verify = async (req, res) => {
  try {
    const { user } = await verifyToken(req.params.token);
    console.log(user);
    if (!user || user._id !== req.params.id)
      return res.status(400).send("Invalid link");

    await User.updateOne({ _id: user._id }, { isVerified: true });
    return res.redirect(`${process.env.CLIENT_URL}`);
  } catch (error) {
    return res.status(400).send("An error occurred");
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (!user.isVerified) {
      return res.status(400).json({ message: "Verify Email." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = await generateToken(user);
    return res.status(200).json({ token, user });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: "Invalid password" });

    const user = await verifyToken(req.params.token);
    if (!user) return res.status(400).json({ message: "Invalid link" });
    user.password = await bcrypt.hash(password, 10);
    await user.save();

    return res
      .status(200)
      .json({ message: "Password was reset successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = await generateToken(user);

    // SEND EMAIL WITH RESET PASSWORD FORM
    const message = writeResetPasswordEmail(
      `${process.env.CLIENT_URL}/resetpassword/${user._id}/${token}`
    );
    await sendEmail(user.email, "Enter New Password", message);

    return res.status(200).json({
      message: "Password reset mail was sent.",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

const resendEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Register again." });
    }

    const token = await generateToken(user);

    // SENDEMAIL
    const message = `${process.env.SERVER_URL}/auth/verify/${user._id}/${token}`;
    await sendEmail(user.email, "Verify Email", message);

    res
      .status(200)
      .json({ message: "An Email sent to your account. please verify" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  register,
  login,
  verify,
  forgotPassword,
  resendEmail,
  resetPassword,
};
