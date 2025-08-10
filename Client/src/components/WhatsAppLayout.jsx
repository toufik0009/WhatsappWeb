import React from "react";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import MessageInput from "./MessageInput";
import dayjs from "dayjs";
import SideMenu from "./SideMenu";

const WhatsAppLayout = ({
  chats,
  setChats,
  messages,
  activeChat,
  setActiveChat,
  onSendMessage,
}) => {
  const handleSelectChat = (wa_id) => {
    setActiveChat(wa_id);
    // Mark messages as read when selecting chat
    setChats(
      chats.map((chat) =>
        chat.wa_id === wa_id ? { ...chat, unreadCount: 0 } : chat
      )
    );
  };

  const handleSendMessage = (wa_id, text) => {
    onSendMessage(wa_id, text);
  };

  const handleBackToChatList = () => {
    setActiveChat(null);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Side Menu - Always visible on desktop, hidden on mobile when chat is open */}
      <div
        className={`${
          activeChat ? "hidden md:block" : "block"
        } w-16 bg-gray-100 border-r border-gray-200`}
      >
        <SideMenu />
      </div>

      {/* Chat List - Always visible on desktop, toggled on mobile */}
      <div
        className={`w-full ${
          activeChat ? "hidden md:block md:w-1/3 lg:w-1/4" : "block"
        } border-r border-gray-300 bg-white`}
      >
        <ChatList
          chats={chats}
          onSelect={handleSelectChat}
          activeWaId={activeChat}
        />
      </div>

      {/* Chat Window */}
      {activeChat ? (
        <div
          className={`flex flex-col ${
            !activeChat ? "hidden md:flex" : "flex"
          } w-full md:w-2/3 lg:w-3/4`}
        >
          {/* Mobile header with back button */}
          <div className="md:hidden flex items-center p-3 border-b border-gray-200 bg-gray-50">
            <button
              onClick={handleBackToChatList}
              className="mr-3 text-gray-600 p-1 rounded-full hover:bg-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M11.03 3.97a.75.75 0 010 1.06l-6.22 6.22H21a.75.75 0 010 1.5H4.81l6.22 6.22a.75.75 0 11-1.06 1.06l-7.5-7.5a.75.75 0 010-1.06l7.5-7.5a.75.75 0 011.06 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div className="flex-1">
              <h2 className="font-medium">
                {chats.find((c) => c.wa_id === activeChat)?.name || activeChat}
              </h2>
              <p className="text-xs text-gray-500">Online</p>
            </div>
            <button className="text-gray-600 p-1 rounded-full hover:bg-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M4.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          {/* Desktop header */}
          <div className="hidden md:flex items-center border-b border-gray-300 p-3 bg-gray-50">
            <div className="flex-1 flex flex-row items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-medium">
                {chats
                  .find((c) => c.wa_id === activeChat)
                  ?.name.charAt(0)
                  .toUpperCase() || chats.wa_id.charAt(0)}
              </div>
              <div>
                <h2 className="font-medium">
                  {chats.find((c) => c.wa_id === activeChat)?.name ||
                    activeChat}
                </h2>
                <p className="text-xs text-gray-500">{activeChat}</p>
              </div>
            </div>
            <button className="text-gray-600 p-1 rounded-full hover:bg-gray-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M4.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm6 0a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <ChatWindow messages={messages[activeChat] || []} />

          <MessageInput wa_id={activeChat} onSend={handleSendMessage} />
        </div>
      ) : (
        // Empty state when no chat is selected (desktop only)
        <div className="hidden md:flex flex-col items-center justify-center w-2/3 lg:w-3/4 bg-gray-50">
          <div className="text-center p-8 max-w-md">
            <div className="w-48 h-48 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-24 h-24"
              >
                <path
                  fillRule="evenodd"
                  d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-light text-gray-600 mb-2">
              WhatsApp Web
            </h2>
            <p className="text-gray-500 mb-6">
              Select a chat to start messaging
            </p>
            <p className="text-sm text-gray-400">End-to-end encrypted</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppLayout;
