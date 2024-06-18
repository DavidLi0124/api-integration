const jwt = require("jsonwebtoken");
const { verifyToken } = require("../utils/token");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const parts = authHeader.split(" ");
  const token = parts[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    req.user = await verifyToken(token);
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

module.exports = authMiddleware;
