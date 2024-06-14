const jwt = require("jsonwebtoken");
const Token = require("../models/Token");

const generateToken = async (user) => {
  try {
    const token = await Token.create({
      userId: user._id,
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      }),
    });
    return token;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { generateToken };
