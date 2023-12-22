const express = require("express");
const router = express.Router();
const checkAuth = require("../utils/checkAuth");
const profile = require("../controllers/profileController");

router.get("/profile/me", checkAuth, profile.getMe);
router.get("/profile/my/ads" , checkAuth , profile.getMyAds)
module.exports = router;
