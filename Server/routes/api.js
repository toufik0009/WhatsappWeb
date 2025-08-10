// backend/routes/api.js
const express = require("express");
const router = express.Router();
const {
  getAllChats,
  getMessagesByWaId,
  sendMessage
} = require("../controllers/messageController");

router.get("/chats", getAllChats);
router.get("/messages/:wa_id", getMessagesByWaId);
router.post("/messages", sendMessage);

module.exports = router;
