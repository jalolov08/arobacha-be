const express = require("express");
const router = express.Router();
const recommends = require("../controllers/recommendsController");
const optionalCheckAuth = require("../utils/optionalCheckAuth")
const checkAuth = require("../utils/checkAuth");


router.post("/recommends/" , checkAuth , recommends.addToRecommends)
router.get("/recommends/" , optionalCheckAuth , recommends.getRecommends)
router.get("/ad/:id", recommends.getAdById)
module.exports = router;
