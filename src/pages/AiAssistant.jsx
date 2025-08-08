import { useEffect, useState, useRef } from "react";
import {
  FaMicrophone,
  FaPaperPlane,
  FaUserCircle,
  FaRobot,
  FaThumbsUp,
  FaThumbsDown,
} from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { MdAutoFixHigh } from "react-icons/md";

export default function AIAssistantPro({ userId, threadId: initialThreadId }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [threadId, setThreadId] = useState(initialThreadId || null);
  const chatRef = useRef(null);

  console.log("AIAssistantPro userId:", userId);

  const handleVoiceInput = () => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      alert(
        "Voice input is not supported in your browser. Try Chrome or Edge."
      );
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
        const res = await fetch(
          `https://socialvibebackend-5.onrender.com/api/groq/history/${threadId}`
        );
        const data = await res.json();
        if (data.success) setMessages(data.messages);
      } catch (err) {
        console.error("Failed to load chat history", err);
      }
    };
    fetchHistory();
  }, [threadId]);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

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
      const res = await fetch("https://socialvibebackend-5.onrender.com/api/groq/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: cleanInput,
          history: cleanHistory,
          userId,
          threadId,
        }),
      });

      const data = await res.json();

      if (data.reply) {
        const botMsg = { role: "assistant", content: data.reply };
        setMessages((prev) => [...prev, botMsg]);

        // ✅ If a new thread was created, update state
        if (!threadId && data.threadId) {
          setThreadId(data.threadId);
        }
      } else {
        throw new Error(data.error || "No reply received");
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Failed to get response." },
      ]);
      console.error("Chat error:", err);
    }

    setLoading(false);
    setTyping(false);
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
    <div className="flex-1 flex flex-col bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-black h-screen w-screen overflow-hidden">
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
        {messages.length === 0 && (
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
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
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
                      <button
                        onClick={() => handleFeedback(i, "up")}
                        className="p-1.5 rounded-full hover:bg-green-100 dark:hover:bg-green-900/50 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400"
                      >
                        <FaThumbsUp size={14} />
                      </button>
                      <button
                        onClick={() => handleFeedback(i, "down")}
                        className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                      >
                        <FaThumbsDown size={14} />
                      </button>
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
          </div>
        ))}

        {typing && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 px-4 py-3 rounded-2xl flex items-center gap-2">
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
          </div>
        )}
        <div ref={chatRef} />
      </main>

      {/* Input Area */}
      <footer className="p-2 md:p-4 border-t dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm">
        <div className="flex items-center gap-1 md:gap-2">
          <button
            onClick={handleVoiceInput}
            className="p-2 md:p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Voice input"
          >
            <FaMicrophone className="text-sm md:text-base" />
          </button>
          <div className="flex-1 relative">
            <input
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
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className={`p-2 md:p-3 rounded-full ${
              loading || !input.trim()
                ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                : "bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700"
            } transition-all`}
            aria-label="Send message"
          >
            <IoSend className="text-sm md:text-base" />
          </button>
        </div>
      </footer>
    </div>
  );
}
