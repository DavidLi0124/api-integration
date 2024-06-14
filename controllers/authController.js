const sendEmail = require("../utils/email");
const Token = require("../models/Token");
const { User, validate } = require("../models/User");
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/token");

const register = async (req, res) => {
  const { error } = validate(req.body);
  if (error) res.status(400).send(error.details[0].message);

  const { email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });

    // MAKING TOKEN
    let token = await generateToken(user);

    // SENDEMAIL
    const message = `${process.env.SERVER_URL}/auth/verify/${user._id}/${token.token}`;
    await sendEmail(user.email, "Verify Email", message);

    res
      .status(200)
      .json({ message: "An Email sent to your account please verify" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const verify = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) res.status(400).send("Invalid link");

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) res.status(400).send("Invalid link");

    await User.updateOne({ _id: user._id }, { isVerified: true });
    await token.deleteOne();

    res.status(200).send("email verified successfully");
  } catch (error) {
    res.status(400).send("An error occurred");
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
    }

    const { token } = await Token.findOne({ userId: user._id });
    if (token) res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const resetPassword = async (req, res) => {
  const { password } = req.body;
  if (!password) res.status(400).json({ message: "Invalid password" });
  try {
    const token = await Token.findOne({
      userId: req.params.id,
      token: req.params.token,
    });
    if (!token) {
      res.status(400).json({ message: "Invalid credentials" });
    }
    if (token.token === req.params.token) {
      const user = await User.findOne({ _id: req.params.id });
      user.password = await bcrypt.hash(password, 10);
      await user.save();
    } else {
      res.status(400).json({ message: "Invalid token" });
    }
    res.status(200).json({ message: "Password reset correctly" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
    }

    let token = await Token.findOne({ userId: user._id });
    console.log("1", token);
    if (!token) {
      res.status(400).json({ message: "Invalid credentials" });
    }

    token.deleteOne();
    token = await generateToken(user);
    console.log("2", token);
    await token.save();

    // SEND EMAIL WITH RESET PASSWORD FORM
    const message = `${process.env.SERVER_URL}/auth/resetpassword/${user._id}/${token.token}`;
    await sendEmail(user.email, "Enter New Password", message);

    res.status(200).json({
      message: "Password reset form was sent to email",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const resendEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "Register again." });
    }

    // REGENERATE TOKEN
    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      res.status(400).json({ message: "Invalid credentials" });
    }

    token.deleteOne();
    token = await generateToken(user);
    await token.save();

    // SENDEMAIL
    const message = `${process.env.SERVER_URL}/auth/verify/${user._id}/${token.token}`;
    await sendEmail(user.email, "Verify Email", message);

    res
      .status(200)
      .json({ message: "An Email sent to your account please verify" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  register,
  login,
  verify,
  forgetPassword,
  resendEmail,
  resetPassword,
};
