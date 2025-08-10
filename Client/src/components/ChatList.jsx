import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { 
  FaWhatsapp, 
  FaSearch, 
  FaEllipsisV, 
  FaCheckDouble,
  FaCheck,
  FaCircle
} from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import { BsThreeDotsVertical, BsFilter } from 'react-icons/bs';

dayjs.extend(relativeTime);

const ChatList = ({ chats, onSelect, activeWaId }) => {
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    if (timestamp === 'Just now') return timestamp;

    const now = dayjs();
    const date = dayjs(timestamp);

    if (now.diff(date, 'day') < 1) {
      return date.format('HH:mm');
    } else if (now.diff(date, 'day') < 7) {
      return date.format('ddd');
    } else {
      return date.format('DD/MM/YY');
    }
  };

  const renderStatusIcon = (status) => {
    switch(status) {
      case 'sent':
        return <FaCheck className="text-gray-400 ml-1" size={12} />;
      case 'delivered':
        return <FaCheckDouble className="text-gray-400 ml-1" size={12} />;
      case 'read':
        return <FaCheckDouble className="text-blue-500 ml-1" size={12} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-gray-100">
      {/* Header */}
      <div className="sticky top-0 bg-emerald-700 text-white px-4 py-3 z-10 flex justify-between items-center">
        <div className="flex items-center">
          <FaWhatsapp className="text-white mr-2" size={24} />
          <h2 className="text-lg sm:text-xl font-bold">WhatsApp</h2>
        </div>
        <div className="flex space-x-4">
          <button className="text-white opacity-80 hover:opacity-100">
            <FaSearch size={18} />
          </button>
          <button className="text-white opacity-80 hover:opacity-100">
            <BsThreeDotsVertical size={18} />
          </button>
        </div>
      </div>

      {/* Filter/Search Bar */}
      <div className="bg-gray-50 px-4 py-2 flex items-center border-b">
        <button className="text-gray-500 mr-2">
          <BsFilter size={20} />
        </button>
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search or start new chat"
            className="w-full bg-white rounded-lg py-2 px-4 pl-10 text-sm focus:outline-none"
          />
          <FaSearch className="absolute left-3 top-2.5 text-gray-400" size={14} />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto bg-white">
        {chats.map((chat) => (
          <button
            key={chat.wa_id}
            onClick={() => onSelect(chat.wa_id)}
            className={`w-full text-left px-4 py-3 border-b border-gray-100 transition-colors flex items-start space-x-3 focus:outline-none ${
              activeWaId === chat.wa_id
                ? "bg-emerald-50 border-l-4 border-emerald-500"
                : "hover:bg-gray-50"
            }`}
          >
            <div className="flex-shrink-0 relative">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-medium">
                {chat.name?.charAt(0).toUpperCase() || chat.wa_id.charAt(0)}
              </div>
              {chat.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <p className="font-medium text-gray-800 truncate">
                  {chat.name || chat.wa_id}
                </p>
                {chat.timestamp && (
                  <span className="text-xs text-gray-400 ml-2 shrink-0">
                    {formatTimestamp(chat.timestamp)}
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center mt-0.5">
                <p className="text-sm text-gray-600 truncate flex-1">
                  {chat.lastMessageFrom && (
                    <span className="font-medium mr-1">
                      {chat.lastMessageFrom}:
                    </span>
                  )}
                  {chat.lastMessage || 'No message yet'}
                </p>
                {chat.lastMessageStatus && renderStatusIcon(chat.lastMessageStatus)}
              </div>
            </div>

            {chat.unreadCount > 0 && (
              <div className="flex-shrink-0 ml-2">
                <span className="inline-flex items-center justify-center bg-green-500 text-white text-xs font-bold w-5 h-5 rounded-full">
                  {chat.unreadCount}
                </span>
              </div>
            )}
          </button>
        ))}

        {chats.length === 0 && (
          <div className="p-6 text-center text-sm text-gray-500">
            No conversations yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;