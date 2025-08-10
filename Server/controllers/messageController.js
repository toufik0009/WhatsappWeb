// backend/controllers/messageController.js
const { getDB } = require("../config/db");

const getAllChats = async (req, res) => {
  const db = getDB();
  const messages = await db.collection("processed_messages").find().toArray();

  const grouped = {};
  messages.forEach((msg) => {
    if (!grouped[msg.wa_id]) {
      grouped[msg.wa_id] = {
        wa_id: msg.wa_id,
        name: msg.name || msg.wa_id,
        lastMessage: msg.text || '',
        lastTimestamp: msg.timestamp,
        lastStatus: msg.status || 'sent',
        direction: msg.from === 'me' ? 'outgoing' : 'incoming'
      };
    }

    // Update if newer message found
    if (msg.timestamp > grouped[msg.wa_id].lastTimestamp) {
      grouped[msg.wa_id].lastMessage = msg.text;
      grouped[msg.wa_id].lastTimestamp = msg.timestamp;
      grouped[msg.wa_id].lastStatus = msg.status || 'sent';
      grouped[msg.wa_id].direction = msg.from === 'me' ? 'outgoing' : 'incoming';
    }
  });

  const chatList = Object.values(grouped).sort(
    (a, b) => b.lastTimestamp - a.lastTimestamp
  );

  res.json(chatList);
};

const getMessagesByWaId = async (req, res) => {
  const db = getDB();
  const wa_id = req.params.wa_id;

  const messages = await db
    .collection("processed_messages")
    .find({ wa_id })
    .sort({ timestamp: 1 })
    .project({ _id: 0 }) // Optional: exclude _id
    .toArray();

  res.json(messages);
};

const sendMessage = async (req, res) => {
  const db = getDB();
  const { wa_id, text } = req.body;

  if (!wa_id || !text) {
    return res.status(400).json({ error: "wa_id and text are required" });
  }

  const newMsg = {
    wa_id,
    from: "me",
    text,
    timestamp: Math.floor(Date.now() / 1000),
    status: "delivered", // Default status
    type: "text",
    message_id: `local_${Date.now()}`,
  };

  await db.collection("processed_messages").insertOne(newMsg);
  res.status(201).json({ message: "Message stored", data: newMsg });
};

module.exports = {
  getAllChats,
  getMessagesByWaId,
  sendMessage,
};
