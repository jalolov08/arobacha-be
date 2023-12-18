const express = require("express");
const router = express.Router();
const checkAuth = require("../utils/checkAuth");
const follow = require("../controllers/followController")

router.post("/users/:username/follow", checkAuth, follow.followUser);
router.delete("/users/:username/unfollow", checkAuth, follow.unfollowUser);
router.get("/users/:username/followsandfollowers/count", follow.getFollowsAndFollowers);
module.exports = router;