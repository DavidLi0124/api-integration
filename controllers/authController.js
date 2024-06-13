const sendEmail = require("../utils/email");
const Token = require("../models/Token");
const { User, validate } = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });

    // MAKING TOKEN
    let token = await Token.create({
      userId: user._id,
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      }),
    });

    // SENDEMAIL
    const message = `${process.env.BASE_URL}/user/verify/${user._id}/${token.token}`;
    await sendEmail(user.email, "Verify Email", message);

    res
      .status(201)
      .json({ message: "An Email sent to your account please verify" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const verify = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send("Invalid link");

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send("Invalid link");

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
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const { token } = await Token.findOne({ userId: user._id });
    if (token) res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const forgetPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    // USER DOESN'T EXIST
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // CREATE AND SAVE NEW PASSWORD
    const newPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // SENDEMAIL
    await sendEmail(user.email, "New Password", newPassword);

    return res.status(200).json({
      message: "New password sent to your email. Please check your email",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const resendEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const userExists = await User.findOne({ email });

    if (!userExists) {
      return res.status(400).json({ message: "Register again." });
    }

    const token = await Token.findOne({ userId: userExists._id });

    // SENDEMAIL
    const message = `${process.env.BASE_URL}/user/verify/${userExists._id}/${token.token}`;
    await sendEmail(userExists.email, "Verify Email", message);

    res
      .status(201)
      .json({ message: "An Email sent to your account please verify" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { register, login, verify, forgetPassword, resendEmail };
