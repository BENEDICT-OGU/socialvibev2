import React from 'react';

function ChatList({ chats, selectedChatId, onSelectChat }) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Chats</h2>
      <ul>
        {chats.map(chat => (
          <li
            key={chat.id}
            className={`flex items-center p-3 rounded-lg cursor-pointer mb-2 transition duration-200 ease-in-out
              ${selectedChatId === chat.id ? 'bg-blue-100' : 'hover:bg-gray-50'}
            `}
            onClick={() => onSelectChat(chat)}
          >
            {/* Placeholder for avatar/icon */}
            <div className="w-10 h-10 bg-gray-300 rounded-full mr-3 flex-shrink-0"></div>

            <div className="flex-1 overflow-hidden">
              <h3 className="text-sm font-medium text-gray-800 truncate">{chat.name}</h3>
              <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
            </div>

            {chat.unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs font-bold rounded-full">
                {chat.unreadCount}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatList;
