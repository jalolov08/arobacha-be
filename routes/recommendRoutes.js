const express = require("express");
const router = express.Router();
const recommends = require("../controllers/recommendsController");
const checkAuth = require("../utils/checkAuth");


router.post("/recommends/" , checkAuth , recommends.addToRecommends)
router.get("/recommends/" , checkAuth , recommends.getRecommends)

module.exports = router;
