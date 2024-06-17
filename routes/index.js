const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const dataRoutes = require("./dataRoutes");
const campaignRoutes = require("./campaignRoutes");
const crmRoutes = require("./crmRoutes");
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
router.use("/campaign", authMiddleware, campaignRoutes);
router.use("/crm", authMiddleware, crmRoutes);

module.exports = router;
