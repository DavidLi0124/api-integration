const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get(
  "/",
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login"],
  })
);

router.get(
  "/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

module.exports = router;
