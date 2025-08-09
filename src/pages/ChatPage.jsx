import React, { useState, useEffect, useRef } from 'react';
import ChatList from './ChatList';
import DirectMessage from './DirectMessage';
import { io } from 'socket.io-client';
import axiosInstance from '../api';
import { FiMenu, FiSearch, FiPlus } from 'react-icons/fi';
import NewChatModal from '../components/NewChatModal';
import SearchModal from '../components/SearchModal';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://socialvibebackend-5.onrender.com";

function ChatPage() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState({});
  const [showSidebar, setShowSidebar] = useState(true);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const socketRef = useRef(null);
  const isMobile = window.innerWidth <= 768;

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
          ? { 
              ...chat, 
              lastMessage: msg.type === 'image' ? '[Image]' : msg.content, 
              unreadCount: chat.id !== selectedChat?.id ? (chat.unreadCount || 0) + 1 : 0,
              lastMessageTime: new Date().toISOString()
            }
          : chat
      ));
    });

    return () => socket.disconnect();
  }, [selectedChat]);

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
    
    // Mark messages as read when chat is selected
    if (selectedChat.unreadCount > 0) {
      setChats(prevChats => prevChats.map(chat =>
        chat.id === selectedChat.id
          ? { ...chat, unreadCount: 0 }
          : chat
      ));
    }

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

  // Auto-hide sidebar on mobile when chat is selected
  useEffect(() => {
    if (isMobile && selectedChat) {
      setShowSidebar(false);
    }
  }, [selectedChat, isMobile]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setShowSidebar(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSendMessage = (content, type = 'text') => {
    if (socketRef.current && selectedChat) {
      const msg = {
        roomId: selectedChat.id,
        content,
        type,
        sender: localStorage.getItem("userId"),
        receiver: selectedChat.id,
        createdAt: new Date().toISOString()
      };
      
      socketRef.current.emit("send_message", msg);
      
      // Optimistically update UI
      setMessages(prev => ({
        ...prev,
        [selectedChat.id]: [
          ...(prev[selectedChat.id] || []),
          msg
        ]
      }));
      
      setChats(prevChats => prevChats.map(chat =>
        chat.id === selectedChat.id
          ? { 
              ...chat, 
              lastMessage: type === 'image' ? '[Image]' : content,
              lastMessageTime: new Date().toISOString()
            }
          : chat
      ));
    }
  };

  const createNewChat = async (userId) => {
    try {
      const res = await axiosInstance.post('/chats', { userId });
      setChats(prev => [res.data, ...prev]);
      setSelectedChat(res.data);
      setShowNewChatModal(false);
    } catch (err) {
      console.error("Failed to create new chat", err);
    }
  };

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile Header */}
      {isMobile && !showSidebar && (
        <div className="fixed top-0 left-0 right-0 z-10 bg-white dark:bg-gray-800 p-3 shadow-md flex items-center">
          <button 
            onClick={() => setShowSidebar(true)}
            className="mr-4 text-gray-600 dark:text-gray-300"
          >
            <FiMenu size={24} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            {selectedChat?.name || 'Messages'}
          </h1>
        </div>
      )}

      {/* Chat List Sidebar */}
      <div className={`${showSidebar ? 'block' : 'hidden'} md:block w-full md:w-1/3 lg:w-1/4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto`}>
        <div className="sticky top-0 bg-white dark:bg-gray-800 p-3 border-b border-gray-200 dark:border-gray-700 z-10">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Chats</h2>
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowSearchModal(true)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <FiSearch size={20} />
              </button>
              <button 
                onClick={() => setShowNewChatModal(true)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              >
                <FiPlus size={20} />
              </button>
            </div>
          </div>
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <ChatList
          chats={filteredChats}
          selectedChatId={selectedChat?.id}
          onSelectChat={(chat) => {
            setSelectedChat(chat);
            if (isMobile) setShowSidebar(false);
          }}
        />
      </div>

      {/* Chat Window Area */}
      <div className={`${!showSidebar || !isMobile ? 'block' : 'hidden'} md:block flex-1 flex flex-col`}>
        {selectedChat ? (
          <DirectMessage
            userId={selectedChat.id}
            messages={messages[selectedChat.id] || []}
            onBack={() => {
              setSelectedChat(null);
              if (isMobile) setShowSidebar(true);
            }}
            onSendMessage={handleSendMessage}
            onNewChat={(chat) => {
              setChats(prev => {
                const exists = prev.find(c => c.id === chat.id);
                if (exists) {
                  return prev.map(c => c.id === chat.id ? { 
                    ...c, 
                    lastMessage: chat.lastMessage,
                    lastMessageTime: new Date().toISOString()
                  } : c);
                }
                return [{ ...chat }, ...prev];
              });
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <div className="text-center p-6">
              <div className="text-5xl mb-4">💬</div>
              <h3 className="text-xl font-medium mb-2">No chat selected</h3>
              <p className="mb-4">Select a chat to start messaging or</p>
              <button
                onClick={() => setShowNewChatModal(true)}
                className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition"
              >
                Start a new chat
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <NewChatModal
        isOpen={showNewChatModal}
        onClose={() => setShowNewChatModal(false)}
        onCreateChat={createNewChat}
      />

      <SearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
      />
    </div>
  );
}

export default ChatPage;