const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const dataRoutes = require("./dataRoutes");
const projectRoutes = require("./projectRoutes");

const googleRoutes = require("./googleRoutes");
const appleRoutes = require("./appleRoutes");

const authMiddleware = require("../middleware/authMiddleware");

// USE GOOGLE APIS
router.use("/auth/google", googleRoutes);

// USE APPLE APIS
router.use("/auth/apple", appleRoutes);

// USE ROUTE MODULES
router.use("/auth", authRoutes);
router.use("/data", authMiddleware, dataRoutes);
router.use("/project", authMiddleware, projectRoutes);

module.exports = router;
