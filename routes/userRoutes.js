const express = require("express");
const router = express.Router();
const checkAuth = require("../utils/checkAuth");
const users = require("../controllers/userController");

router.post("/users/:username/follow", checkAuth, users.followUser);
router.delete("/users/:username/unfollow", checkAuth, users.unfollowUser);
router.get("/users/:username/profile" , users.getUser)
router.get("/users/:username/ads" , users.getUserAds)
module.exports = router;
