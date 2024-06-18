const mongoose = require("mongoose");
const { Data, validate } = require("../models/Data");

const uploadFiles = async (req, res) => {
  if (req.files.length === 0) {
    return res.status(400).send("No files uploaded or invalid file format.");
  }
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  try {
    const files = req.files;
    const { userId } = req.body;
    const filePaths = files.map((file) => file.path);

    const data = await Data.findOne({
      userId: userId,
    });
    if (data) {
      data.files = data.files.concat(filePaths);
      await data.save();
    } else {
      Data.create({ userId: userId, files: filePaths });
    }

    return res.status(200).json({ message: "Uploaded successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  uploadFiles,
};
