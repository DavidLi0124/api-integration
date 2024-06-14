const express = require("express");
const passport = require("passport");
const router = express.Router();

const Token = require("../models/Token");
const { generateToken } = require("../utils/token");

router.get(
  "/",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

router.get(
  "/callback",
  passport.authenticate("google", {
    successRedirect: "/api/auth/google/success",
    failureRedirect: "/api/auth/google/failure",
  })
);

router.get("/success", async (req, res) => {
  const { user } = req;
  if (!user) {
    return;
  }
  let token = await Token.findOne({ userId: user._id });
  if (!token) {
    token = await generateToken(user);
  }
  res.status(200).send({ token: token.token, user });
});

router.get("/failure", (req, res) => {
  res.status(400).send({ message: "Google Authentication Failure" });
});

module.exports = router;
