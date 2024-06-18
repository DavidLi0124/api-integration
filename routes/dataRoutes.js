const express = require("express");
const router = express.Router();

const { upload } = require("../config/multer");
const { uploadFiles } = require("../controllers/dataController");

router.post("/upload", upload.array("files"), uploadFiles);

module.exports = router;
