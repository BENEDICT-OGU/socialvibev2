// import { useEffect, useState, useRef } from "react";
// import io from "socket.io-client";
// import { useNavigate } from "react-router-dom";

// // Use only import.meta.env for Vite, or hardcode for local dev
// const SOCKET_URL =
//   typeof import.meta !== "undefined" && import.meta.env?.VITE_SOCKET_URL
//     ? import.meta.env.VITE_SOCKET_URL
//     : "http://localhost:5000";

// const socket = io(SOCKET_URL, {
//   auth: { token: localStorage.getItem("token") },
// });

// export default function ChatPage() {
//   const [rooms, setRooms] = useState([]);
//   const [currentRoom, setCurrentRoom] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const messagesEndRef = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Fetch chat rooms from your API
//     fetch("/api/chatrooms", {
//       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//     })
//       .then((res) => res.json())
//       .then(setRooms);
//   }, []);

//   useEffect(() => {
//     if (!currentRoom) return;
//     // Fetch messages for the selected room
//     fetch(`/api/messages/${currentRoom._id}`, {
//       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//     })
//       .then((res) => res.json())
//       .then(setMessages);

//     socket.emit("join_room", { roomId: currentRoom._id });

//     socket.on("receive_message", (msg) => {
//       if (msg.roomId === currentRoom._id) {
//         setMessages((prev) => [...prev, msg]);
//       }
//     });

//     return () => {
//       socket.off("receive_message");
//     };
//   }, [currentRoom]);

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const sendMessage = (e) => {
//     e.preventDefault();
//     if (!input.trim() || !currentRoom) return;
//     socket.emit("send_message", {
//       roomId: currentRoom._id,
//       content: input,
//       type: "text",
//     });
//     setInput("");
//   };

//   // Handle click: if direct message, go to /dm/:userId, else open group chat
//   const handleRoomClick = (room) => {
//     if (room.isDirect && room.userId) {
//       navigate(`/dm/${room.userId}`);
//     } else {
//       setCurrentRoom(room);
//     }
//   };

//   return (
//     <div className="flex h-screen bg-neutral-100 dark:bg-neutral-900">
//       {/* Sidebar */}
//       <div className="w-72 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 flex flex-col">
//         <div className="p-4 font-bold text-lg text-pink-500">Chats</div>
//         <div className="flex-1 overflow-y-auto">
//           {rooms.map((room) => (
//             <div
//               key={room._id}
//               className={`p-4 cursor-pointer hover:bg-pink-50 dark:hover:bg-neutral-700 ${
//                 currentRoom?._id === room._id
//                   ? "bg-pink-100 dark:bg-neutral-700"
//                   : ""
//               }`}
//               onClick={() => handleRoomClick(room)}
//             >
//               <div className="font-semibold">
//                 {room.name || "Direct Message"}
//               </div>
//               <div className="text-xs text-gray-500 truncate">
//                 {room.lastMessage?.content}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//       {/* Chat Area */}
//       <div className="flex-1 flex flex-col">
//         <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 font-semibold text-lg bg-white dark:bg-neutral-800">
//           {currentRoom?.name || "Select a chat"}
//         </div>
//         <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-neutral-50 dark:bg-neutral-900">
//           {messages.map((msg) => (
//             <div
//               key={msg._id}
//               className={`max-w-lg px-4 py-2 rounded-lg ${
//                 msg.sender === socket.userId
//                   ? "bg-pink-500 text-white ml-auto"
//                   : "bg-white dark:bg-neutral-800 text-gray-800 dark:text-gray-200"
//               }`}
//             >
//               {msg.content}
//             </div>
//           ))}
//           <div ref={messagesEndRef} />
//         </div>
//         {currentRoom && (
//           <form
//             onSubmit={sendMessage}
//             className="flex p-4 border-t border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
//           >
//             <input
//               className="flex-1 px-4 py-2 rounded-full bg-neutral-100 dark:bg-neutral-700 text-gray-800 dark:text-white focus:outline-none"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Type a message..."
//             />
//             <button
//               type="submit"
//               className="ml-2 px-4 py-2 rounded-full bg-pink-500 text-white font-semibold hover:bg-pink-600 transition"
//             >
//               Send
//             </button>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }














// File: socialvibe/src/pages/ChatWindow.jsx
import React, { useState, useEffect, useRef } from "react";
import ChatItem from "./ChatItem";

function ChatWindow({ selectedChat }) {
  const currentUserId = "currentUser"; // Replace with actual user ID logic

  const [messages, setMessages] = useState([
    { id: "msg1", sender: "user2", content: "Hey!", timestamp: "10:00 AM", type: "text" },
    { id: "msg2", sender: currentUserId, content: "Hi Alice!", timestamp: "10:01 AM", type: "text" },
    { id: "msg3", sender: "user2", content: "How are you?", timestamp: "10:02 AM", type: "text" },
    { id: "msg4", sender: "user2", content: "What are you up to?", timestamp: "10:03 AM", type: "text" },
    { id: "msg5", sender: currentUserId, content: "Just working on my social media app!", timestamp: "10:04 AM", type: "text" },
    { id: "msg6", sender: "user2", content: "Cool! Need any help?", timestamp: "10:05 AM", type: "text" },
    { id: "msg7", sender: currentUserId, content: "Maybe with the chat UI 😉", timestamp: "10:06 AM", type: "text" },
    { id: "msg8", sender: "user2", content: "Haha, I see. Looks good so far!", timestamp: "10:07 AM", type: "text" },
    { id: "msg9", sender: currentUserId, content: "Thanks! Trying to make it eye-catching.", timestamp: "10:08 AM", type: "text" },
    { id: "msg10", sender: "user2", content: "You're doing great!", timestamp: "10:09 AM", type: "text" },
    { id: "msg11", sender: currentUserId, content: "Appreciate it!", timestamp: "10:10 AM", type: "text" },
    { id: "msg12", sender: "user2", content: "Let me know if you get stuck.", timestamp: "10:11 AM", type: "text" },
    { id: "msg13", sender: currentUserId, content: "Will do!", timestamp: "10:12 AM", type: "text" },
    { id: "msg14", sender: "user2", content: "Okay, back to work for me.", timestamp: "10:13 AM", type: "text" },
    { id: "msg15", sender: currentUserId, content: "Catch you later!", timestamp: "10:14 AM", type: "text" },
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [voiceNote, setVoiceNote] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    const trimmedMessage = newMessage.trim();
    if (trimmedMessage) {
      const messageToSend = {
        id: `msg${Date.now()}`,
        sender: currentUserId,
        content: trimmedMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "text",
      };
      setMessages((prev) => [...prev, messageToSend]);
      setNewMessage("");
    }
  };

  const handleDeleteMessage = (messageId) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  };

  const handleEditMessage = (messageId, newContent) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, content: newContent, edited: true } : msg))
    );
  };

  const handleReactMessage = (messageId, emoji) => {
    // For demo, just log reaction
    console.log(`Reacted to message ${messageId} with ${emoji}`);
  };

  const handleCopyMessage = (content) => {
    navigator.clipboard.writeText(content).then(() => {
      alert("Message copied to clipboard");
    });
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach((file) => {
        const url = URL.createObjectURL(file);
        const type = file.type.startsWith("image/")
          ? "image"
          : file.type.startsWith("video/")
          ? "video"
          : "file";
        const messageToSend = {
          id: `msg${Date.now()}-${file.name}`,
          sender: currentUserId,
          content: url,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type,
        };
        setMessages((prev) => [...prev, messageToSend]);
      });
      e.target.value = null;
    }
  };

  const handleVoiceCall = () => {
    alert("Voice call feature coming soon!");
  };

  const handleVideoCall = () => {
    alert("Video call feature coming soon!");
  };

  const startRecording = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Your browser does not support audio recording.");
      return;
    }
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/mpeg" });
        const audioUrl = URL.createObjectURL(audioBlob);
        const messageToSend = {
          id: `msg${Date.now()}-voice`,
          sender: currentUserId,
          content: audioUrl,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "voice",
        };
        setMessages((prev) => [...prev, messageToSend]);
        audioChunksRef.current = [];
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    });
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
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
        {/* Call Buttons */}
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={handleVoiceCall}
            className="text-gray-500 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-600 focus:outline-none focus:text-pink-500 dark:focus:text-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedChat}
            aria-label="Start voice call"
          >
            {/* Voice Call Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleVideoCall}
            className="text-gray-500 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-600 focus:outline-none focus:text-pink-500 dark:focus:text-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedChat}
            aria-label="Start video call"
          >
            {/* Video Call Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M15 19l-7-7 7-7" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Message List Area */}
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
        {messages.map((message) => (
          <ChatItem
            key={message.id}
            message={message}
            currentUserId={currentUserId}
            onDelete={handleDeleteMessage}
            onEdit={handleEditMessage}
            onReact={handleReactMessage}
            onCopy={handleCopyMessage}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Area */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-inner">
        <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
            multiple
            accept="image/*,video/*,audio/*"
          />
          <button
            type="button"
            onClick={handleAttachmentClick}
            className="p-3 text-gray-500 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-600 focus:outline-none focus:text-pink-500 dark:focus:text-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedChat}
            aria-label="Attach file"
          >
            {/* Attachment Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.414 6.586a6 6 0 108.485 8.485l6.586-6.586a3 3 0 00-4.243-4.243l-6.586 6.586a1 10 0 101.414 1.414l5.656-5.757l1.414 1.414l-5.656 5.757a2 2 0 11-2.828-2.828l6.414-6.586a4 4 0 015.656 5.656z" />
            </svg>
          </button>

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

          {/* Voice Note Recording */}
          {!isRecording ? (
            <button
              type="button"
              onClick={startRecording}
              className="p-3 text-gray-500 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-600 focus:outline-none focus:text-pink-500 dark:focus:text-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!selectedChat}
              aria-label="Start voice note recording"
            >
              🎤
            </button>
          ) : (
            <button
              type="button"
              onClick={stopRecording}
              className="p-3 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-600 focus:outline-none focus:text-red-500 dark:focus:text-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Stop voice note recording"
            >
              ⏹
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default ChatWindow;
