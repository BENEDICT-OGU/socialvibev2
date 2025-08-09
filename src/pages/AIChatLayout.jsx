import { useState, useEffect, useRef } from "react";
import {
  FaMicrophone,
  FaPaperPlane,
  FaUserCircle,
  FaRobot,
  FaThumbsUp,
  FaThumbsDown,
  FaComments,
  FaPlus,
  FaSearch,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { MdOutlineChat, MdAutoFixHigh } from "react-icons/md";
import { useMediaQuery } from "react-responsive";
import { motion, AnimatePresence } from "framer-motion";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";

export default function AIChatLayout() {
  const { user: currentUser } = useContext(AuthContext);
  const [threadId, setThreadId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar when thread is selected on mobile
  useEffect(() => {
    if (isMobile && threadId) {
      setSidebarOpen(false);
    }
  }, [threadId, isMobile]);

  return (
    <div className="flex h-screen  overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black">
      {/* Mobile Sidebar Toggle Button */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-30 p-2 rounded-full bg-pink-500 text-white shadow-lg md:hidden"
        >
          {sidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>
      )}

      {/* Sidebar with Animation */}
      <AnimatePresence>
        {(!isMobile || sidebarOpen) && (
          <motion.div
            initial={{ x: isMobile ? -300 : 0 }}
            animate={{ x: 0 }}
            exit={{ x: isMobile ? -300 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`absolute md:relative z-20 w-72 h-full border-r dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm ${
              isMobile ? "shadow-xl" : ""
            }`}
          >
            <ThreadSidebar
              userId={currentUser._id}
              currentThreadId={threadId}
              setThreadId={setThreadId}
              onClose={toggleSidebar}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <AIAssistantPro userId={currentUser._id} threadId={threadId} />
      </div>
    </div>
  );
}

function ThreadSidebar({ userId, currentThreadId, setThreadId, onClose }) {
  const [threads, setThreads] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchThreads = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://socialvibebackend-5.onrender.com/api/threads/user/${userId}`
      );
      const data = await res.json();
      if (data.success) setThreads(data.threads);
    } catch (err) {
      console.error("Failed to load threads");
    } finally {
      setLoading(false);
    }
  };

  const handleNewThread = async () => {
    try {
      const title =
        window.prompt("Enter thread title:", "New Chat") || "New Chat";
      if (!title) return;

      const res = await fetch(
        "https://socialvibebackend-5.onrender.com/api/threads/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, title }),
        }
      );

      const data = await res.json();
      if (data.success) {
        setThreads([data.thread, ...threads]);
        setThreadId(data.thread._id);
      }
    } catch (err) {
      console.error("Failed to create thread:", err);
      alert("Failed to create new thread. Please try again.");
    }
  };

  useEffect(() => {
    if (userId) fetchThreads();
  }, [userId]);

  const filteredThreads = threads.filter((t) =>
    t.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full h-full p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 p-2">
        <div className="p-2 rounded-full bg-pink-500 text-white">
          <MdOutlineChat size={20} />
        </div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Conversations
        </h2>
        <button
          onClick={handleNewThread}
          className="ml-auto p-2 rounded-full bg-pink-500 text-white hover:bg-pink-600 transition-colors"
          aria-label="New thread"
        >
          <FaPlus size={14} />
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
          <FaSearch size={14} />
        </div>
        <input
          type="text"
          placeholder="Search chats..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all text-gray-700 dark:text-gray-200"
        />
      </div>

      {/* Thread List */}
      <div className="overflow-y-auto flex-1 space-y-1">
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        ) : filteredThreads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4 text-gray-500 dark:text-gray-400">
            <FaComments className="text-2xl mb-2 text-pink-500 opacity-70" />
            <p className="text-sm">No conversations found</p>
            <button
              onClick={handleNewThread}
              className="mt-3 px-4 py-2 text-sm rounded-lg bg-pink-500 text-white hover:bg-pink-600 transition-colors"
            >
              Start New Chat
            </button>
          </div>
        ) : (
          filteredThreads.map((thread) => (
            <motion.button
              key={thread._id}
              onClick={() => {
                setThreadId(thread._id);
                onClose?.();
              }}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3 transition-all ${
                currentThreadId === thread._id
                  ? "bg-gradient-to-r from-pink-500/10 to-pink-600/10 border border-pink-500/20 text-pink-600 dark:text-pink-400"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <div
                className={`p-1.5 rounded-full ${
                  currentThreadId === thread._id
                    ? "bg-pink-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                }`}
              >
                <MdOutlineChat size={14} />
              </div>
              <span className="truncate flex-1 text-left">{thread.title}</span>
            </motion.button>
          ))
        )}
      </div>

      {/* User Profile */}
      <div className="mt-auto pt-4 border-t dark:border-gray-800">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white text-sm">
            {userId?.charAt(0).toUpperCase()}
          </div>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">
            User #{userId?.substring(0, 6)}
          </div>
        </div>
      </div>
    </div>
  );
}

function AIAssistantPro({ userId, threadId }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const chatRef = useRef(null);
  const inputRef = useRef(null);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const handleVoiceInput = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Voice input is not supported in your browser. Try Chrome or Edge.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setInput((prev) => `${prev} (Listening...)`);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => prev.replace(" (Listening...)", "") + transcript);
    };
    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setInput((prev) => prev.replace(" (Listening...)", ""));
      alert(`Voice input error: ${event.error}`);
    };
    recognition.onend = () =>
      setInput((prev) => prev.replace(" (Listening...)", ""));

    recognition.start();
  };

  const cleanHistory = messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  useEffect(() => {
    const fetchHistory = async () => {
      if (!threadId) return;
      try {
        setLoading(true);
        const res = await fetch(
          `https://socialvibebackend-5.onrender.com/api/groq/history/${threadId}`
        );
        const data = await res.json();
        if (data.success) setMessages(data.messages);
      } catch (err) {
        console.error("Failed to load chat history", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [threadId]);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (!isMobile) {
      inputRef.current?.focus();
    }
  }, [isMobile]);

  const parseCommand = (text) => {
    if (text.startsWith("/joke")) return "Tell me a funny joke.";
    if (text.startsWith("/summary "))
      return `Summarize this: ${text.replace("/summary ", "")}`;
    if (text.startsWith("/translate ")) {
      const [, lang, ...words] = text.split(" ");
      return `Translate to ${lang}: ${words.join(" ")}`;
    }
    return text;
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const cleanInput = parseCommand(input);

    const userMsg = { role: "user", content: cleanInput };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setTyping(true);

    try {
      const res = await fetch(
        "https://socialvibebackend-5.onrender.com/api/groq/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: cleanInput,
            history: cleanHistory,
            userId,
            threadId,
          }),
        }
      );

      const data = await res.json();

      if (data.reply) {
        const botMsg = { role: "assistant", content: data.reply };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error(data.error || "No reply received");
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Failed to get response." },
      ]);
      console.error("Chat error:", err);
    } finally {
      setLoading(false);
      setTyping(false);
    }
  };

  const handleFeedback = (index, type) => {
    setMessages((prev) =>
      prev.map((msg, i) => (i === index ? { ...msg, feedback: type } : msg))
    );
  };

  useEffect(() => {
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .catch((err) => console.log("Microphone permission not granted:", err));
    }
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <header className="p-4 border-b dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-pink-500 text-white">
            <FaRobot size={20} />
          </div>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
            SOCIALVIBE AI
          </h1>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white/50 to-gray-100/30 dark:from-gray-900/50 dark:to-black/30">
        {loading && messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 text-gray-500 dark:text-gray-400">
            <FaRobot className="text-4xl mb-4 text-pink-500" />
            <h2 className="text-xl font-medium mb-2">
              How can I help you today?
            </h2>
            <p className="max-w-md">
              Ask me anything, or try commands like /joke, /summary, or
              /translate
            </p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <motion.div
              key={i}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className={`flex flex-col max-w-[85%] rounded-2xl p-3 shadow-lg ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-br-none"
                    : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 rounded-bl-none"
                }`}
              >
                <div className="flex gap-3 items-start">
                  <div
                    className={`mt-1 flex-shrink-0 ${
                      msg.role === "user" ? "text-pink-200" : "text-pink-500"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <FaUserCircle size={18} />
                    ) : (
                      <FaRobot size={18} />
                    )}
                  </div>
                  <div className="whitespace-pre-wrap break-words">
                    {msg.content}
                  </div>
                </div>

                {msg.role === "assistant" && (
                  <div className="flex justify-end mt-2">
                    {!msg.feedback ? (
                      <div className="flex gap-1">
                        <motion.button
                          onClick={() => handleFeedback(i, "up")}
                          className="p-1.5 rounded-full hover:bg-green-100 dark:hover:bg-green-900/50 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaThumbsUp size={14} />
                        </motion.button>
                        <motion.button
                          onClick={() => handleFeedback(i, "down")}
                          className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <FaThumbsDown size={14} />
                        </motion.button>
                      </div>
                    ) : (
                      <span
                        className={`text-xs ${
                          msg.feedback === "up"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {msg.feedback === "up"
                          ? "Thank you! 👍"
                          : "Noted, I'll improve 👎"}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}

        {typing && (
          <motion.div
            className="flex justify-start"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 rounded-2xl flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full bg-pink-500 animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="w-2 h-2 rounded-full bg-pink-500 animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="w-2 h-2 rounded-full bg-pink-500 animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </motion.div>
        )}
        <div ref={chatRef} />
      </main>

      {/* Input Area */}
      <footer className="p-2 md:p-4 border-t dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm">
        <div className="flex items-center gap-1 md:gap-2">
          <motion.button
            onClick={handleVoiceInput}
            className="p-2 md:p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Voice input"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaMicrophone className="text-sm md:text-base" />
          </motion.button>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="w-full p-2 md:p-3 pr-10 md:pr-12 rounded-xl border dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm md:text-base"
              placeholder="Type or speak..."
            />
            {input && (
              <button
                onClick={() => setInput("")}
                className="absolute right-10 md:right-14 top-2 md:top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm"
              >
                ×
              </button>
            )}
          </div>
          <motion.button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className={`p-2 md:p-3 rounded-full ${
              loading || !input.trim()
                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                : "bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700"
            } transition-all`}
            aria-label="Send message"
            whileHover={{ scale: loading || !input.trim() ? 1 : 1.05 }}
            whileTap={{ scale: 0.9 }}
          >
            <IoSend className="text-sm md:text-base" />
          </motion.button>
        </div>
      </footer>
    </div>
  );
}