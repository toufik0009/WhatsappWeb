import React, { useEffect, useState } from "react";
import WhatsAppLayout from "./components/WhatsAppLayout";
import { fetchChats, fetchMessages, sendMessage } from "./provider/api";

const App = () => {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState({});
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    const loadChats = async () => {
      try {
        const res = await fetchChats();
        const fetchedChats = res.data;
        console.log(fetchedChats)
        setChats(fetchedChats);

        // Preload messages for each chat (optional)
        const allMessages = {};
        for (let chat of fetchedChats) {
          const msgRes = await fetchMessages(chat.wa_id);
          allMessages[chat.wa_id] = msgRes.data;
        }
        setMessages(allMessages);

        if (fetchedChats.length > 0) {
          setActiveChat(fetchedChats[0].wa_id);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    loadChats();
  }, []);

  const handleSendMessage = async (wa_id, text) => {
    try {
      const res = await sendMessage(wa_id, text);
      const newMsg = res.data.data;

      console.log("New message sent:", newMsg);

      setMessages((prev) => ({
        ...prev,
        [wa_id]: [...(prev[wa_id] || []), newMsg],
      }));

      setChats((prev) =>
        prev.map((chat) =>
          chat.wa_id === wa_id
            ? {
                ...chat,
                lastMessage: text,
                timestamp: "Just now",
                unreadCount: 0,
              }
            : chat
        )
      );
    } catch (err) {
      console.error("Send message failed:", err);
    }
  };

  return (
    <WhatsAppLayout
      chats={chats}
      messages={messages}
      activeChat={activeChat}
      setActiveChat={setActiveChat}
      onSendMessage={handleSendMessage}
      setChats={setChats}
    />
  );
};

export default App;
