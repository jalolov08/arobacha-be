const express = require("express");
const authRoutes = require("./routes/authRoutes.js");
const carRoutes = require("./routes/carRoutes.js");
const motoRoutes = require("./routes/motoRoutes.js");
const uploadRoutes = require("./routes/uploadRoutes.js");
const profileRoutes = require("./routes/profileRoutes.js")
const router = express.Router();

router.use("/" , profileRoutes)
router.use("/", authRoutes);
router.use("/", carRoutes);
router.use("/", motoRoutes);
router.use("/", uploadRoutes);

module.exports = router;
