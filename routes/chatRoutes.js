const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const checkAuth = require("../utils/checkAuth");
router.post("/chat/send/:id", checkAuth, chatController.sendMessage);
router.get("/chat/:id" , checkAuth , chatController.getMessages)
module.exports = router;
