// backend/index.js
const express = require("express");
const cors = require("cors");
const { connectDB, getDB } = require("./config/db");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4100;

app.use(cors());
app.use(express.json());

// Route example
app.get("/", (req, res) => {
  res.send("Welcome to Whatsapp Web Server");
});

async function processPayloadFiles() {
  const db = getDB();

  const payloadDir = path.join(__dirname, "payloads");
  const files = fs.readdirSync(payloadDir);

  for (const file of files) {
    const filePath = path.join(payloadDir, file);
    const rawData = fs.readFileSync(filePath, "utf-8");
    const payload = JSON.parse(rawData);

    console.log("📄 Processing file:", filePath);

    const entry = payload.metaData?.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;

    const messages = value?.messages || [];
    const contacts = value?.contacts || [];
    const metadata = value?.metadata || {};

    const contactMap = {};
    contacts.forEach((contact) => {
      contactMap[contact.wa_id] = contact.profile?.name || "Unknown";
    });

    for (const msg of messages) {
      const wa_id = msg.from;
      const messageData = {
        wa_id,
        name: contactMap[wa_id] || "Unknown",
        from: msg.from,
        message_id: msg.id,
        text: msg.text?.body || "",
        timestamp: parseInt(msg.timestamp, 10),
        status: "sent",
        type: msg.type,
        raw: msg,
      };

      const exists = await db
        .collection("processed_messages")
        .findOne({ message_id: msg.id });

      if (!exists) {
        await db.collection("processed_messages").insertOne(messageData);
        console.log(`✅ Inserted message: ${msg.text?.body}`);
      } else {
        console.log(`⚠️ Message ${msg.id} already exists, skipping.`);
      }
    }

    const statuses = value?.statuses || [];

    for (const statusObj of statuses) {
      const { id: message_id, status, timestamp } = statusObj;

      const result = await db.collection("processed_messages").updateOne(
        { message_id },
        {
          $set: {
            status,
            status_updated_at: parseInt(timestamp, 10),
          },
        }
      );

      if (result.matchedCount > 0) {
        console.log(`🟢 Updated message ${message_id} status to: ${status}`);
      } else {
        console.log(`❌ Status update received for unknown message: ${message_id}`);
      }
    }
  }

  console.log("✅ Finished processing all payloads.");
}

connectDB().then(async () => {
  app.use("/api", require("./routes/api"));

  // Run payload processing after DB connection
  await processPayloadFiles();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
