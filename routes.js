const express = require("express");
const router = express.Router();
const auth = require("./controllers/authController");

router.post("/v1/auth/register", auth.authUser);
router.post("/v1/auth/login", auth.authLogin);
module.exports = router;
