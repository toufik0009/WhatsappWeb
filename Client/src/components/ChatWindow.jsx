import React, { useRef, useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FaCheck, FaCheckDouble } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";

dayjs.extend(relativeTime);

const ChatWindow = ({ messages }) => {
  const chatContainerRef = useRef(null);
  const [visibleDate, setVisibleDate] = useState(null);
  const dateHeadersRef = useRef({});

  const groupMessagesByDate = (messages) => {
    if (!messages?.length) return {};

    const grouped = {};
    messages.forEach((msg) => {
      const date = dayjs.unix(msg.timestamp).format("YYYY-MM-DD");
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(msg);
    });
    return grouped;
  };

  const formatDateHeader = (date) => {
    const today = dayjs().format("YYYY-MM-DD");
    const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

    if (date === today) return "Today";
    if (date === yesterday) return "Yesterday";
    return dayjs(date).format("MMMM D, YYYY");
  };

  const renderMessageStatus = (status) => {
    switch (status) {
      case "sent":
        return <IoMdTime className="text-gray-400 ml-1" size={12} />;
      case "delivered":
        return <FaCheckDouble className="text-gray-400 ml-1" size={12} />;
      case "read":
        return <FaCheckDouble className="text-blue-500 ml-1" size={12} />;
      default:
        return <FaCheck className="text-gray-400 ml-1" size={12} />;
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const container = chatContainerRef.current;
      if (!container) return;

      // Find which date header is currently at the top
      const containerTop = container.getBoundingClientRect().top;
      let currentVisibleDate = null;
      let smallestDistance = Infinity;

      Object.entries(dateHeadersRef.current).forEach(([date, element]) => {
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const distanceFromTop = Math.abs(rect.top - containerTop - 20);

        if (distanceFromTop < smallestDistance) {
          smallestDistance = distanceFromTop;
          currentVisibleDate = date;
        }
      });

      if (currentVisibleDate !== visibleDate) {
        setVisibleDate(currentVisibleDate);
      }
    };

    const container = chatContainerRef.current;
    container?.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => container?.removeEventListener("scroll", handleScroll);
  }, [messages, visibleDate]);

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div
      ref={chatContainerRef}
      className="flex-1 flex flex-col overflow-y-auto p-4 relative"
      style={{
        backgroundImage: `
      linear-gradient(
        to bottom,
        rgba(229, 221, 213, 0.98),
        rgba(229, 221, 213, 0.96) 20%,
        rgba(229, 221, 213, 0.94) 40%,
        rgba(229, 221, 213, 0.92) 60%,
        rgba(229, 221, 213, 0.9) 80%,
        rgba(229, 221, 213, 0.88)
      ),
      url("data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm33.414-6l5.95-5.95L45.95.636 40 6.586 34.05.636 32.636 2.05 38.586 8l-5.95 5.95 1.414 1.414L40 9.414l5.95 5.95 1.414-1.414L41.414 8zM40 48c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zM8 48c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6z' fill='%23a5a5a5' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E")
    `,
        backgroundSize: "64px 64px",
        backgroundAttachment: "fixed",
        backgroundBlendMode: "overlay",
      }}
    >
      {/* Floating date header */}
      {visibleDate && (
        <div className="sticky top-2 z-20 flex justify-center mb-2 animate-fade-in">
          <div className="bg-white text-gray-600 text-xs px-3 py-1.5 rounded-full shadow-md border border-gray-300 backdrop-blur-sm">
            {formatDateHeader(visibleDate)}
          </div>
        </div>
      )}

      {!messages?.length ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
          <div className="w-16 h-16 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19.005 3.175H4.674C3.642 3.175 3 3.789 3 4.821V19.114l3.544-3.514h12.461c1.033 0 2.064-1.06 2.064-2.093V4.821c-.001-1.032-1.032-1.646-2.064-1.646zm-4.989 9.869H7.041V11.1h6.975v1.944zm3-4H7.041V7.1h9.975v1.944z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-700">No messages yet</h3>
          <p className="text-sm text-gray-500 mt-1">
            Send a message to start chatting
          </p>
        </div>
      ) : (
        Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <React.Fragment key={date}>
            <div
              ref={(el) => (dateHeadersRef.current[date] = el)}
              className="flex justify-center my-2"
            >
              <div
                className={`bg-[#e5ddd5] text-gray-600 text-xs px-3 py-1 rounded-full shadow-sm border border-gray-300 backdrop-blur-sm transition-opacity ${
                  visibleDate === date ? "opacity-0" : "opacity-100"
                }`}
              >
                {formatDateHeader(date)}
              </div>
            </div>

            {dateMessages.map((msg) => (
              <div
                key={msg.message_id}
                className={`mb-3 flex ${
                  msg.from === "me" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[75%] lg:max-w-[65%] xl:max-w-[55%] flex ${
                    msg.from === "me" ? "flex-row-reverse" : ""
                  }`}
                >
                  {msg.from !== "me" && (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0 mr-2 mt-1 flex items-center justify-center text-gray-600 font-medium">
                      {msg.senderName?.charAt(0) || "U"}
                    </div>
                  )}

                  <div
                    className={`relative p-3 rounded-lg ${
                      msg.from === "me"
                        ? "bg-[#d9fdd3] rounded-tr-none shadow-sm"
                        : "bg-white rounded-tl-none shadow-sm border border-gray-100"
                    }`}
                  >
                    {msg.from !== "me" && msg.senderName && (
                      <div className="font-medium text-xs text-gray-700 mb-1">
                        {msg.senderName}
                      </div>
                    )}

                    <div className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                      {msg.text}
                    </div>

                    <div className="flex justify-end items-center mt-1 space-x-1">
                      <span className="text-xs text-gray-500">
                        {dayjs.unix(msg.timestamp).format("h:mm A")}
                      </span>
                      {msg.from === "me" && renderMessageStatus(msg.status)}
                    </div>

                    {/* Message tail */}
                    <div
                      className={`absolute top-0 w-3 h-3 overflow-hidden ${
                        msg.from === "me" ? "right-0" : "left-0"
                      }`}
                    >
                      <div
                        className={`absolute w-4 h-4 bg-inherit transform rotate-45 origin-bottom-left ${
                          msg.from === "me"
                            ? "right-0 -mr-1.5 -mt-1.5 border-r border-t border-[#d9fdd3]"
                            : "left-0 -ml-1.5 -mt-1.5 border-l border-t border-white"
                        }`}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))
      )}
    </div>
  );
};

export default ChatWindow;
