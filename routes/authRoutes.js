const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");

router.post("/auth/register", auth.authUser);
router.post("/auth/login", auth.authLogin);
router.get("/auth/refreshToken", auth.refreshToken);
module.exports = router;
