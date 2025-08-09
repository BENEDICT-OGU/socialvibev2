import { useEffect, useState, useRef } from "react";
import { FaPaperPlane, FaSmile, FaImage, FaArrowLeft, FaEllipsisV, FaTrash, FaPhone, FaVideo } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import axiosInstance from "../api";
import TypingIndicator from "../components/TypingIndicator";
import MessageStatus from "../components/MessageStatus";

export default function DirectMessage({ userId, messages = [], onBack, onSendMessage, onNewChat }) {
  const [user, setUser] = useState(null);
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);

  const currentUserId = localStorage.getItem("userId") || "me";

  // Fetch user info
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axiosInstance.get(`/user/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    };
    getUser();
  }, [userId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() && !image) return;

    if (image) {
      const reader = new FileReader();
      reader.onload = () => {
        onSendMessage(reader.result, "image");
        setImage(null);
      };
      reader.readAsDataURL(image);
    } else {
      const messageData = {
        content: input,
        type: "text",
        replyTo: replyingTo?.id
      };
      onSendMessage(messageData);
      
      if (onNewChat) {
        onNewChat({
          id: userId,
          name: user?.name || "Unknown",
          lastMessage: input,
          unreadCount: 0,
          avatar: user?.avatar
        });
      }
    }
    
    setInput("");
    setReplyingTo(null);
    setShowEmojiPicker(false);
  };

  const handleTyping = () => {
    setIsTyping(true);
    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(setTimeout(() => setIsTyping(false), 2000));
  };

  const handleEmojiClick = (emojiData) => {
    setInput(prev => prev + emojiData.emoji);
    inputRef.current.focus();
  };

  const handleImageUpload = () => {
    fileInputRef.current.click();
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  if (!user) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-neutral-100 dark:bg-neutral-900">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
        <div className="flex items-center">
          <button onClick={onBack} className="mr-2 md:mr-4 text-pink-500">
            <FaArrowLeft size={20} />
          </button>
          <img
            src={user.avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
            alt={user.name}
            className="w-10 h-10 rounded-full border-2 border-pink-500 mr-3"
          />
          <div>
            <span className="font-semibold text-lg block">{user.name}</span>
            {isTyping && <TypingIndicator />}
          </div>
        </div>
        <div className="flex items-center space-x-4 relative">
          <button className="text-gray-600 dark:text-gray-300">
            <FaPhone size={18} />
          </button>
          <button className="text-gray-600 dark:text-gray-300">
            <FaVideo size={18} />
          </button>
          <button 
            onClick={() => setShowOptions(!showOptions)}
            className="text-gray-600 dark:text-gray-300"
          >
            <FaEllipsisV size={18} />
          </button>
          
          {showOptions && (
            <div className="absolute right-0 top-10 bg-white dark:bg-neutral-800 shadow-lg rounded-md py-2 w-48 z-10">
              <button className="flex items-center px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                <FaTrash className="mr-2 text-red-500" />
                Delete Chat
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-neutral-50 dark:bg-neutral-900">
        {messages.map((msg) => {
          const isSender = msg.sender === currentUserId;
          const isImage = msg.type === "image";
          const isReply = msg.replyTo;
          const repliedMessage = isReply ? messages.find(m => m._id === msg.replyTo) : null;

          return (
            <div
              key={msg._id || Math.random()}
              className={`flex ${isSender ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`relative max-w-xs sm:max-w-sm md:max-w-md px-4 py-2 rounded-2xl shadow
                  ${isSender
                    ? "bg-pink-500 text-white rounded-br-none"
                    : "bg-white dark:bg-neutral-800 text-gray-800 dark:text-gray-200 rounded-bl-none"
                  }
                `}
              >
                {/* Reply indicator */}
                {isReply && repliedMessage && (
                  <div className={`text-xs mb-1 p-1 rounded-t-lg border-l-2 ${isSender ? 'border-white' : 'border-pink-500'} bg-black bg-opacity-10 dark:bg-opacity-20`}>
                    <p className="truncate">
                      {repliedMessage.sender === currentUserId ? 'You' : user.name}: {repliedMessage.type === 'image' ? '[Image]' : repliedMessage.content}
                    </p>
                  </div>
                )}

                {isImage ? (
                  <img
                    src={msg.content}
                    alt="sent"
                    className="max-w-[200px] rounded mb-2"
                  />
                ) : (
                  <span className="break-words">{msg.content}</span>
                )}
                
                <div className="flex items-center justify-end mt-1 space-x-1">
                  {msg.edited && (
                    <span className="text-xs text-gray-400">(edited)</span>
                  )}
                  <span className="text-xs text-gray-400">
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </span>
                  {isSender && (
                    <MessageStatus status={msg.status || "sent"} />
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply preview */}
      {replyingTo && (
        <div className="bg-gray-100 dark:bg-gray-800 p-2 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Replying to: {replyingTo.content.length > 30 ? replyingTo.content.substring(0, 30) + '...' : replyingTo.content}
          </div>
          <button 
            onClick={cancelReply}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
          >
            ×
          </button>
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="flex items-center p-3 border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
      >
        <div className="flex items-center mr-2 space-x-2">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-pink-500"
          >
            <FaSmile size={20} />
          </button>
          <button
            type="button"
            onClick={handleImageUpload}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-pink-500"
          >
            <FaImage size={20} />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </button>
        </div>
        
        <input
          ref={inputRef}
          className="flex-1 px-4 py-2 rounded-full bg-neutral-100 dark:bg-neutral-700 text-gray-800 dark:text-white focus:outline-none"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            handleTyping();
          }}
          placeholder="Type a message..."
        />
        
        <button
          type="submit"
          className="ml-2 p-2 rounded-full bg-pink-500 text-white hover:bg-pink-600 transition"
          disabled={!input.trim() && !image}
        >
          <FaPaperPlane size={18} />
        </button>
      </form>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-16 right-4 z-10">
          <EmojiPicker 
            onEmojiClick={handleEmojiClick}
            width={300}
            height={350}
            theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
          />
        </div>
      )}
    </div>
  );
}