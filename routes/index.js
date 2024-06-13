const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const dataRoutes = require("./dataRoutes");
const campaignRoutes = require("./campaignRoutes");
const crmRoutes = require("./crmRoutes");

// USE ROUTE MODULES
router.use("/auth", authRoutes);
router.use("/data", dataRoutes);
router.use("/campaign", campaignRoutes);
router.use("/crm", crmRoutes);

module.exports = router;
