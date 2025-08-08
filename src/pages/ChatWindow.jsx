import React, { useEffect, useRef, useState } from "react";
import ChatItem from "./ChatItem";

function ChatWindow({ selectedChat, messages, onSendMessage }) {
  const currentUserId = "currentUser"; // Replace with actual user ID logic
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    const trimmedMessage = newMessage.trim();
    if (trimmedMessage) {
      onSendMessage(trimmedMessage);
      setNewMessage("");
    }
  };

  if (!selectedChat) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-900">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Chat Header */}
      <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{selectedChat.name}</h3>
      </div>

      {/* Message List Area */}
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        {messages.map((message, idx) => (
          <ChatItem
            key={message._id || message.id || idx}
            message={message}
            currentUserId={currentUserId}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Area */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-inner">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-lg p-3 text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:focus:ring-pink-600 placeholder-gray-500 dark:placeholder-gray-400"
            disabled={!selectedChat}
          />
          <button
            type="submit"
            className="bg-pink-500 text-white rounded-r-lg px-6 py-3 hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 dark:bg-pink-600 dark:hover:bg-pink-700 dark:focus:ring-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedChat || !newMessage.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatWindow;