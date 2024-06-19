const mongoose = require("mongoose");
const Joi = require("joi");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    googleId: { type: String },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

const validate = (user) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(20).required(),
    googleId: Joi.string(),
  });
  return schema.validate(user);
};

module.exports = {
  User,
  validate,
};
