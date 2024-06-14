const express = require("express");
const {
  register,
  login,
  verify,
  resetPassword,
  forgetPassword,
  resendEmail,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify/:id/:token", verify);
router.post("/forgetpassword", forgetPassword);
router.get("/resetpassword/:id/:token", resetPassword);
router.put("/resend/:email", resendEmail);

module.exports = router;
