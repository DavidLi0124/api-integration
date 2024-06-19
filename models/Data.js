const mongoose = require("mongoose");
const Joi = require("joi");

const DataSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    files: Array,
  },
  { timestamps: true }
);

const Data = mongoose.model("Data", DataSchema);

const validate = (data) => {
  const schema = Joi.object({
    userId: Joi.string(),
    files: Joi.array().items(Joi.string().required()),
  });
  return schema.validate(data);
};

module.exports = {
  Data,
  validate,
};
