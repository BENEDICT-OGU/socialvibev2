import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { FaPaperPlane, FaSmile, FaImage, FaArrowLeft } from "react-icons/fa";
import axiosInstance from "../api";

const SOCKET_URL =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_SOCKET_URL
    ? import.meta.env.VITE_SOCKET_URL
    : "http://localhost:5000";

const socket = io(SOCKET_URL, {
  auth: { token: localStorage.getItem("token") },
});

export default function DirectMessage({ userId, onBack }) {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);
  const messagesEndRef = useRef(null);

  // Replace with your actual logged-in user ID logic
  const currentUserId = localStorage.getItem("userId") || "me";
  const roomId = userId;

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

  // Fetch messages and set up socket listeners
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axiosInstance.get(`/messages/${userId}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    };

    fetchMessages();
    socket.emit("join_room", { roomId });

    const handleReceive = (msg) => {
      // Only add if message is for this chat
      if (
        (msg.sender === userId && msg.receiver === currentUserId) ||
        (msg.sender === currentUserId && msg.receiver === userId) ||
        msg.roomId === roomId
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receive_message", handleReceive);

    return () => {
      socket.off("receive_message", handleReceive);
    };
    // eslint-disable-next-line
  }, [userId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message handler
  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() && !image) return;

    if (image) {
      const reader = new FileReader();
      reader.onload = () => {
        const msg = {
          roomId,
          content: reader.result,
          type: "image",
        };
        socket.emit("send_message", msg);
        // Optimistically add to UI
        setMessages((prev) => [
          ...prev,
          {
            ...msg,
            sender: currentUserId,
            receiver: userId,
            _id: Math.random().toString(36),
            createdAt: new Date().toISOString(),
          },
        ]);
        setImage(null);
      };
      reader.readAsDataURL(image);
    } else {
      const msg = {
        roomId,
        content: input,
        type: "text",
      };
      socket.emit("send_message", msg);
      // Optimistically add to UI
      setMessages((prev) => [
        ...prev,
        {
          ...msg,
          sender: currentUserId,
          receiver: userId,
          _id: Math.random().toString(36),
          createdAt: new Date().toISOString(),
        },
      ]);
    }
 if (onNewChat) {
      onNewChat({
        id: userId,
        name: user?.name || "Unknown",
        lastMessage: image ? "[Image]" : input,
        unreadCount: 0,
        // Optionally add avatar: user?.avatar
      });
    }
    setInput("");
  };

  if (!user) return <div className="p-4">Loading chat...</div>;

  return (
    <div className="flex flex-col h-screen bg-neutral-100 dark:bg-neutral-900">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
        <button onClick={onBack} className="mr-4 text-pink-500">
          <FaArrowLeft size={20} />
        </button>
        <img
          src={
            user.avatar ||
            "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
          }
          alt={user.name}
          className="w-10 h-10 rounded-full border-2 border-pink-500 mr-3"
        />
        <span className="font-semibold text-lg">{user.name}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-neutral-50 dark:bg-neutral-900">
        {messages.map((msg) => {
          const isSender = msg.sender === currentUserId;
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
                {msg.type === "image" ? (
                  <img
                    src={msg.content}
                    alt="sent"
                    className="max-w-[200px] rounded mb-2"
                  />
                ) : null}
                <span className="break-words">{msg.content}</span>
                <span className="block text-xs text-gray-400 mt-1 text-right">
                  {msg.createdAt
                    ? new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={sendMessage}
        className="flex items-center p-4 border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
      >
        <label className="cursor-pointer mr-2">
          <FaImage className="text-pink-500" size={20} />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </label>
        <input
          className="flex-1 px-4 py-2 rounded-full bg-neutral-100 dark:bg-neutral-700 text-gray-800 dark:text-white focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          type="submit"
          className="ml-2 px-4 py-2 rounded-full bg-pink-500 text-white font-semibold hover:bg-pink-600 transition flex items-center"
        >
          <FaPaperPlane className="mr-1" /> Send
        </button>
      </form>
    </div>
  );
}