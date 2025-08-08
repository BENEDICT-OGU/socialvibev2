import React, { useState, useEffect, useRef } from 'react';
import ChatList from './ChatList';
import DirectMessage from './DirectMessage';
import { io } from 'socket.io-client';
import axiosInstance from '../api';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://socialvibebackend-5.onrender.com";

function ChatPage() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState({}); // { chatId: [msg, ...] }
  const socketRef = useRef(null);

  // Fetch chat rooms on mount
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axiosInstance.get('/chats');
        setChats(res.data);
      } catch (err) {
        console.error("Failed to fetch chats", err);
      }
    };
    fetchChats();
  }, []);

  // Connect to socket and listen for messages
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      auth: { token: localStorage.getItem("token") }
    });
    socketRef.current = socket;

    socket.on("receive_message", (msg) => {
      setMessages(prev => {
        const chatId = msg.roomId || msg.sender || msg.receiver;
        const updated = { ...prev };
        updated[chatId] = [...(updated[chatId] || []), msg];
        return updated;
      });
      setChats(prevChats => prevChats.map(chat =>
        chat.id === (msg.roomId || msg.sender || msg.receiver)
          ? { ...chat, lastMessage: msg.content, unreadCount: (chat.unreadCount || 0) + 1 }
          : chat
      ));
    });

    return () => socket.disconnect();
  }, []);

  // Join all chat rooms
  useEffect(() => {
    if (socketRef.current && chats.length) {
      chats.forEach(chat => {
        socketRef.current.emit("join_room", { roomId: chat.id });
      });
    }
  }, [chats]);

  // Fetch messages for selected chat
  useEffect(() => {
    if (!selectedChat) return;
    const fetchMessages = async () => {
      try {
        const res = await axiosInstance.get(`/messages/${selectedChat.id}`);
        setMessages(prev => ({ ...prev, [selectedChat.id]: res.data }));
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    };
    fetchMessages();
  }, [selectedChat]);

  // Send message handler
  const handleSendMessage = (msg) => {
    if (socketRef.current && selectedChat) {
      socketRef.current.emit("send_message", {
        roomId: selectedChat.id,
        content: msg,
        type: "text"
      });
      // Optimistically update UI
      setMessages(prev => ({
        ...prev,
        [selectedChat.id]: [
          ...(prev[selectedChat.id] || []),
          { content: msg, role: "user", roomId: selectedChat.id }
        ]
      }));
      setChats(prevChats => prevChats.map(chat =>
        chat.id === selectedChat.id
          ? { ...chat, lastMessage: msg }
          : chat
      ));
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Chat List Sidebar */}
      <div className="w-1/4 bg-white border-r border-gray-200 overflow-y-auto">
        <ChatList
          chats={chats}
          selectedChatId={selectedChat?.id}
          onSelectChat={setSelectedChat}
        />
      </div>

      {/* Chat Window Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <DirectMessage
            userId={selectedChat.id}
            onBack={() => setSelectedChat(null)}
            onNewChat={(chat) => {
              setChats(prev => {
                // If chat already exists, update lastMessage
                const exists = prev.find(c => c.id === chat.id);
                if (exists) {
                  return prev.map(c => c.id === chat.id ? { ...c, lastMessage: chat.lastMessage } : c);
                }
                // Else, add new chat
                return [{ ...chat }, ...prev];
              });
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
export default ChatPage;