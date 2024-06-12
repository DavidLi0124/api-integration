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

    // send confirmation email logic here
    let token = await Token.create({
      userId: user._id,
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      }),
    });

    const message = `${process.env.BASE_URL}/user/verify/${user.id}/${token.token}`;
    await sendEmail(user.email, "Verify Email", message);

    // res.send("An Email sent to your account please verify");
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

    await User.updateOne({ _id: user._id, verified: true });
    await Token.findByIdAndRemove(token._id);

    res.send("email verified successfully");
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

module.exports = { register, login, verify };
