const express = require("express");
const router = express.Router();
const favorites = require("../controllers/favoriteController");
const checkAuth = require("../utils/checkAuth");

router.post("/favorites/add", checkAuth, favorites.addToFavorites);
router.delete("/favorites/remove", checkAuth, favorites.removeFromFavorites);
router.get("/favorites/my", checkAuth, favorites.myFavorites);
module.exports = router;
