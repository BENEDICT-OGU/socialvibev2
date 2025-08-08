// ✅ components/ThreadSidebar.jsx
import { useEffect, useState } from "react";
import { FaComments, FaPlus, FaSearch } from "react-icons/fa";
import { MdOutlineChat } from "react-icons/md";

export default function ThreadSidebar({ userId, currentThreadId, setThreadId }) {
  const [threads, setThreads] = useState([]);
  const [search, setSearch] = useState("");

  const fetchThreads = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/threads/user/${userId}`);
      const data = await res.json();
      if (data.success) setThreads(data.threads);
    } catch (err) {
      console.error("Failed to load threads");
    }
  };

 const handleNewThread = async () => {
  try {
    const title = window.prompt("Enter thread title:", "New Chat") || "New Chat";
    if (!title) return; // User clicked cancel
    
    const res = await fetch("http://localhost:5000/api/threads/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, title })
    });
    
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

  const filteredThreads = threads.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="w-72 border-r dark:border-gray-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm p-4 flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 p-2">
        <div className="p-2 rounded-full bg-pink-500 text-white">
          <MdOutlineChat size={20} />
        </div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Conversations</h2>
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
        {filteredThreads.length === 0 ? (
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
          filteredThreads.map(thread => (
            <button
              key={thread._id}
              onClick={() => setThreadId(thread._id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3 transition-all ${
                currentThreadId === thread._id 
                  ? "bg-gradient-to-r from-pink-500/10 to-pink-600/10 border border-pink-500/20 text-pink-600 dark:text-pink-400"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
              }`}
            >
              <div className={`p-1.5 rounded-full ${
                currentThreadId === thread._id 
                  ? "bg-pink-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              }`}>
                <MdOutlineChat size={14} />
              </div>
              <span className="truncate flex-1 text-left">{thread.title}</span>
            </button>
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