import { useState, useEffect, useContext, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api";
import { AuthContext } from "../AuthContext";
import { io } from "socket.io-client";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
// import { Canvas } from '@react-three/fiber';
// import { VRCanvas as XRCanvas } from "@react-three/xr";
import { ethers } from "ethers";
import confetti from "canvas-confetti";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import PullToRefresh from "react-simple-pull-to-refresh";
import {
  FaHeart,
  FaRegComment,
  FaShare,
  FaBookmark,
  FaEllipsisH,
  FaTimes,
  FaRegHeart,
  FaRegBookmark,
  FaDownload,
  FaMicrophone,
  FaRobot,
  FaAward,
  FaMoon,
  FaSun,
  FaMagic,
  FaCamera,
  FaRocket,
  FaCrown,
  FaUserAstronaut,
  FaWallet,
  FaCube,
  FaVideo,
  FaBolt,
} from "react-icons/fa";
import { FiSend, FiShare2 } from "react-icons/fi";
import { IoMdSend } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import {
  BsThreeDotsVertical,
  BsEmojiSmile,
  BsArrowRight,
  BsStars,
} from "react-icons/bs";
import { RiLiveLine } from "react-icons/ri";
import { HiOutlineSparkles } from "react-icons/hi";

const trending = [
  { tag: "#funny", posts: "24.5K" },
  { tag: "#news", posts: "18.2K" },
  { tag: "#music", posts: "32.1K" },
  { tag: "#sports", posts: "15.7K" },
  { tag: "#movies", posts: "12.3K" },
  { tag: "#trending", posts: "45.6K" },
];

const stories = [
  { id: 1, username: "your_story", isYou: true },
  { id: 2, username: "traveler", hasNew: true },
  { id: 3, username: "foodie", hasNew: true },
  { id: 4, username: "photographer" },
  { id: 5, username: "fitness" },
  { id: 6, username: "artist" },
];

const badges = [
  { icon: <FaAward className="text-yellow-400" />, name: "Top Creator" },
  { icon: <FaCrown className="text-pink-500" />, name: "VIP" },
  { icon: <FaRocket className="text-blue-500" />, name: "Streak" },
];

export default function HomeTest() {
  // Infinite Scroll
  const [hasMore, setHasMore] = useState(true);
  const { ref: loadMoreRef, inView } = useInView();

  // Main State
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState([]);
  const [currentMediaIdx, setCurrentMediaIdx] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [showComments, setShowComments] = useState({ postId: null });
  const [newComment, setNewComment] = useState({});
  const [openMenu, setOpenMenu] = useState(null);
  const menuRefs = useRef([]);
  const [showHeart, setShowHeart] = useState({ postId: null });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("forYou");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAppDownloadBanner, setShowAppDownloadBanner] = useState(true);

  // Dark Mode
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  // Gamification
  const [points, setPoints] = useState(1200);

  // Voice Search
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  // AI Chatbot
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { from: "bot", text: "Hi! How can I help you today?" }
  ]);
  const [chatInput, setChatInput] = useState("");

  // NFT/Web3
  const [walletAddress, setWalletAddress] = useState(null);

  // Live Streaming
  const [isLive, setIsLive] = useState(false);

  // AR/VR/3D
  const [show3D, setShow3D] = useState(false);
  const [showAR, setShowAR] = useState(false);

  // AI Recommendations
  const [showRecommended, setShowRecommended] = useState(false);

  // Pull-to-refresh
  const [refreshing, setRefreshing] = useState(false);

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch Posts
  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const endpoint = user?.token ? "/posts" : "/posts";
      const res = await axiosInstance.get(endpoint, {
        headers: user?.token ? { Authorization: `Bearer ${user.token}` } : {},
      });
      const fetchedPosts = res.data.posts || res.data;
      setPosts(fetchedPosts);
      setCurrentMediaIdx(fetchedPosts.map(() => 0));
      setLikedPosts(
        fetchedPosts.map(
          (post) =>
            post.reactions?.some(
              (r) => r.user._id === user?._id && r.type === "like"
            ) || false
        )
      );
      setBookmarkedPosts(
        fetchedPosts.map(
          (post) =>
            post.reactions?.some(
              (r) => r.user._id === user?._id && r.type === "bookmark"
            ) || false
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load posts");
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // AI Recommendations
  const fetchRecommended = async () => {
    setIsLoading(true);
    setShowRecommended(true);
    try {
      const res = await axiosInstance.get("/posts/recommended");
      setPosts(res.data.posts);
    } catch (err) {
      setError("Failed to load recommendations");
    } finally {
      setIsLoading(false);
    }
  };

  // Infinite Scroll
  const loadMorePosts = async () => {
    setIsLoading(true);
    const res = await axiosInstance.get(`/posts?page=${page + 1}`);
    setPosts((prev) => [...prev, ...res.data.posts]);
    setPage((prev) => prev + 1);
    setHasMore(res.data.posts.length > 0);
    setIsLoading(false);
  };
  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadMorePosts();
    }
  }, [inView]);

  // Pull-to-refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  // Initial fetch
  useEffect(() => {
    fetchPosts();
  }, [user?.token]);

  // Real-Time Updates (WebSockets)
  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_BASE_URL);
    socket.on("new_post", (post) => setPosts((prev) => [post, ...prev]));
    return () => socket.disconnect();
  }, []);

  // Click outside menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        openMenu !== null &&
        menuRefs.current[openMenu] &&
        !menuRefs.current[openMenu].contains(event.target)
      ) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenu]);

  // Like, Bookmark, Comment handlers (with confetti)
  const handlePrev = (postIdx) => {
    setCurrentMediaIdx((idxArr) =>
      idxArr.map((idx, i) => (i === postIdx ? Math.max(0, idx - 1) : idx))
    );
  };
  const handleNext = (postIdx, mediaLen) => {
    setCurrentMediaIdx((idxArr) =>
      idxArr.map((idx, i) =>
        i === postIdx ? Math.min(mediaLen - 1, idx + 1) : idx
      )
    );
  };
  const toggleLike = async (postId, postIdx) => {
    try {
      const isLiked = likedPosts[postIdx];
      const endpoint = isLiked ? `/${postId}/unlike` : `/${postId}/like`;
      await axiosInstance.put(
        `/posts${endpoint}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setLikedPosts((prev) =>
        prev.map((liked, i) => (i === postIdx ? !liked : liked))
      );
      setPosts((prev) => {
        const updated = [...prev];
        if (isLiked) {
          updated[postIdx].reactions =
            updated[postIdx].reactions?.filter(
              (r) => !(r.user._id === user._id && r.type === "like")
            ) || [];
        } else {
          updated[postIdx].reactions = [
            ...(updated[postIdx].reactions || []),
            { user: { _id: user._id }, type: "like" },
          ];
        }
        return updated;
      });
      if (!isLiked) {
        setShowHeart({ postId });
        confetti();
        setTimeout(() => setShowHeart({ postId: null }), 700);
        setPoints((p) => p + 10); // Gamification: add points
      }
    } catch (err) {
      // error handling
    }
  };
  const toggleBookmark = async (postId, postIdx) => {
    try {
      const isBookmarked = bookmarkedPosts[postIdx];
      const endpoint = isBookmarked
        ? `/${postId}/unbookmark`
        : `/${postId}/bookmark`;
      await axiosInstance.put(
        `/posts${endpoint}`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setBookmarkedPosts((prev) =>
        prev.map((bookmarked, i) => (i === postIdx ? !bookmarked : bookmarked))
      );
      setPosts((prev) => {
        const updated = [...prev];
        if (isBookmarked) {
          updated[postIdx].reactions =
            updated[postIdx].reactions?.filter(
              (r) => !(r.user._id === user._id && r.type === "bookmark")
            ) || [];
        } else {
          updated[postIdx].reactions = [
            ...(updated[postIdx].reactions || []),
            { user: { _id: user._id }, type: "bookmark" },
          ];
        }
        return updated;
      });
    } catch (err) {}
  };
  const handleAddComment = async (postId, postIdx) => {
    const commentText = newComment[postId];
    if (!commentText?.trim()) return;
    try {
      const res = await axiosInstance.post(
        `/posts/${postId}/comment`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setPosts((prev) => {
        const updated = [...prev];
        updated[postIdx].comments = res.data.comments || [];
        return updated;
      });
      setNewComment((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {}
  };

  // Voice Search: filter posts by transcript
  const filteredPosts = transcript
    ? posts.filter((post) =>
        post.content?.toLowerCase().includes(transcript.toLowerCase())
      )
    : posts;

  // NFT/Web3: Connect Wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setWalletAddress(accounts[0]);
    } else {
      alert("MetaMask not found!");
    }
  };

  // AI Chatbot
  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    setChatMessages((msgs) => [...msgs, { from: "user", text: chatInput }]);
    setChatInput("");
    // Simulate AI response
    setTimeout(() => {
      setChatMessages((msgs) => [
        ...msgs,
        { from: "bot", text: "This is an AI-powered response! 🚀" },
      ]);
    }, 1000);
  };

  // Skeleton loading for posts
  if (isLoading && posts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 p-8">
        <Skeleton height={200} count={3} className="mb-6 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode((d) => !d)}
        className="fixed top-4 right-4 z-50 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full flex items-center"
      >
        {darkMode ? <FaSun className="mr-2" /> : <FaMoon className="mr-2" />}
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      {/* Voice Search Button */}
      <button
        onClick={() =>
          listening
            ? SpeechRecognition.stopListening()
            : SpeechRecognition.startListening({ continuous: true })
        }
        className="fixed bottom-4 right-4 z-50 bg-pink-500 text-white px-4 py-2 rounded-full flex items-center"
      >
        <FaMicrophone className="mr-2" />
        {listening ? "Listening..." : "Voice Search"}
      </button>
      {transcript && (
        <div className="fixed bottom-20 right-4 z-50 bg-white dark:bg-gray-800 px-4 py-2 rounded shadow">
          <span className="text-xs text-gray-500">Voice: {transcript}</span>
          <button
            className="ml-2 text-pink-500 text-xs"
            onClick={resetTranscript}
          >
            Clear
          </button>
        </div>
      )}

      {/* AI Chatbot Button */}
      <button
        onClick={() => setShowChatbot((v) => !v)}
        className="fixed bottom-4 left-4 z-50 bg-blue-500 text-white px-4 py-2 rounded-full flex items-center"
      >
        <FaRobot className="mr-2" />
        AI Chatbot
      </button>
      {/* AI Chatbot Modal */}
      <AnimatePresence>
        {showChatbot && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-20 left-4 z-50 bg-white dark:bg-gray-800 w-80 rounded-xl shadow-xl p-4"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold">AI Chatbot</span>
              <button onClick={() => setShowChatbot(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="h-48 overflow-y-auto mb-2">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`mb-2 ${
                    msg.from === "bot"
                      ? "text-blue-500"
                      : "text-gray-800 dark:text-gray-200 text-right"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="flex">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 rounded-l px-2 py-1 border dark:bg-gray-700"
                placeholder="Type your question..."
              />
              <button
                onClick={sendChatMessage}
                className="bg-blue-500 text-white px-3 py-1 rounded-r"
              >
                <FiSend />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* App Download Banner */}
      {showAppDownloadBanner && (
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-3 flex items-center justify-between">
          <div className="flex items-center">
            <HiOutlineSparkles className="text-xl mr-2" />
            <div>
              <p className="font-bold">Get the best experience</p>
              <p className="text-xs opacity-90">Download our app now!</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAppDownloadBanner(false)}
              className="p-1 rounded-full hover:bg-white/20"
            >
              <FaTimes />
            </button>
            <a
              href="#download"
              className="bg-white text-pink-600 px-3 py-1 rounded-full text-sm font-semibold flex items-center"
            >
              Download <FaDownload className="ml-1" />
            </a>
          </div>
        </div>
      )}

      {/* Gamification Bar */}
      <div className="fixed top-4 left-4 z-40 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow flex items-center space-x-2">
        <FaBolt className="text-yellow-400" />
        <span className="font-bold">{points} pts</span>
        {badges.map((badge, i) => (
          <span key={i} title={badge.name}>
            {badge.icon}
          </span>
        ))}
      </div>

      {/* NFT/Web3 Wallet Connect */}
      <button
        onClick={connectWallet}
        className="fixed top-20 left-4 z-40 bg-purple-600 text-white px-4 py-2 rounded-full flex items-center"
      >
        <FaWallet className="mr-2" />
        {walletAddress
          ? walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4)
          : "Connect Wallet"}
      </button>

      {/* Live Streaming Button */}
      <button
        onClick={() => setIsLive((v) => !v)}
        className="fixed top-36 left-4 z-40 bg-red-500 text-white px-4 py-2 rounded-full flex items-center"
      >
        <FaVideo className="mr-2" />
        {isLive ? "Stop Live" : "Go Live"}
      </button>
      {isLive && (
        <div className="fixed top-52 left-4 z-40 bg-white dark:bg-gray-800 px-4 py-2 rounded shadow flex items-center">
          <RiLiveLine className="text-red-500 mr-2" />
          <span>Live streaming... (WebRTC placeholder)</span>
        </div>
      )}

      {/* 3D/AR/VR Buttons */}
      <button
        onClick={() => setShow3D((v) => !v)}
        className="fixed top-60 left-4 z-40 bg-green-500 text-white px-4 py-2 rounded-full flex items-center"
      >
        <FaCube className="mr-2" />
        3D
      </button>
      <button
        onClick={() => setShowAR((v) => !v)}
        className="fixed top-72 left-4 z-40 bg-indigo-500 text-white px-4 py-2 rounded-full flex items-center"
      >
        <FaUserAstronaut className="mr-2" />
        AR/VR
      </button>
      {/* 3D Modal */}
      <AnimatePresence>
        {show3D && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl relative w-[400px] h-[400px]">
              <button
                className="absolute top-2 right-2"
                onClick={() => setShow3D(false)}
              >
                <FaTimes />
              </button>
              <Canvas>
                {/* Example 3D: Spinning cube */}
                <mesh rotation={[0.4, 0.2, 0]}>
                  <boxGeometry args={[2, 2, 2]} />
                  <meshStandardMaterial color="hotpink" />
                </mesh>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
              </Canvas>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* AR/VR Modal */}
      <AnimatePresence>
        {showAR && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl relative w-[400px] h-[400px]">
              <button
                className="absolute top-2 right-2"
                onClick={() => setShowAR(false)}
              >
                <FaTimes />
              </button>
              <XRCanvas>
                {/* Example AR/VR: Spinning sphere */}
                <mesh rotation={[0.4, 0.2, 0]}>
                  <sphereGeometry args={[1, 32, 32]} />
                  <meshStandardMaterial color="skyblue" />
                </mesh>
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
              </XRCanvas>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <PullToRefresh onRefresh={handleRefresh}>
        <div className="max-w-lg mx-auto px-2 pb-20">
          {/* Stories with Progress Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-4 overflow-x-auto">
            <div className="flex space-x-4">
              {stories.map((story) => (
                <div
                  key={story.id}
                  className="flex flex-col items-center space-y-1"
                >
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      story.isYou
                        ? "bg-gradient-to-tr from-pink-500 to-yellow-500 p-0.5"
                        : story.hasNew
                        ? "bg-gradient-to-tr from-pink-500 to-purple-500 p-0.5"
                        : "bg-gray-200 dark:bg-gray-700 p-0.5"
                    }`}
                  >
                    <div className="bg-white dark:bg-gray-800 rounded-full w-full h-full flex items-center justify-center overflow-hidden relative">
                      {story.isYou ? (
                        <div className="text-2xl">+</div>
                      ) : (
                        <img
                          src={`https://i.pravatar.cc/150?img=${story.id}`}
                          className="w-full h-full object-cover"
                          alt={story.username}
                        />
                      )}
                      {/* Progress bar (placeholder) */}
                      {story.hasNew && (
                        <div className="absolute bottom-0 left-0 h-1 w-full bg-pink-500 animate-pulse rounded-b-full"></div>
                      )}
                    </div>
                  </div>
                  <span className="text-xs truncate w-16 text-center">
                    {story.username}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Premium CTA */}
          <div className="bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl shadow-lg p-4 mb-4 text-white relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full"></div>
            <div className="absolute -right-5 -bottom-5 w-20 h-20 bg-white/10 rounded-full"></div>
            <div className="relative z-10">
              <h3 className="font-bold text-lg mb-1">Go Premium</h3>
              <p className="text-sm opacity-90 mb-3">
                Unlock exclusive features and content
              </p>
              <button className="bg-white text-purple-600 px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                Upgrade Now <BsArrowRight className="ml-1" />
              </button>
            </div>
          </div>

          {/* Feed Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-2 mb-4">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  setActiveTab("forYou");
                  setShowRecommended(false);
                  fetchPosts();
                }}
                className={`flex-1 py-2 text-sm font-medium ${
                  activeTab === "forYou"
                    ? "text-pink-500 border-b-2 border-pink-500"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                For You
              </button>
              <button
                onClick={() => {
                  setActiveTab("following");
                  setShowRecommended(false);
                  fetchPosts();
                }}
                className={`flex-1 py-2 text-sm font-medium ${
                  activeTab === "following"
                    ? "text-pink-500 border-b-2 border-pink-500"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                Following
              </button>
              <button
                onClick={() => {
                  setActiveTab("popular");
                  setShowRecommended(false);
                  fetchPosts();
                }}
                className={`flex-1 py-2 text-sm font-medium ${
                  activeTab === "popular"
                    ? "text-pink-500 border-b-2 border-pink-500"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                Popular
              </button>
              <button
                onClick={() => {
                  setActiveTab("recommended");
                  fetchRecommended();
                }}
                className={`flex-1 py-2 text-sm font-medium ${
                  activeTab === "recommended"
                    ? "text-green-500 border-b-2 border-green-500"
                    : "text-gray-500 dark:text-gray-400"
                }`}
              >
                <FaMagic className="inline mr-1" />
                AI Recs
              </button>
            </div>
          </div>

          {/* Posts Feed with Infinite Scroll, Skeleton, Micro-Interactions */}
          <div className="flex flex-col gap-4">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                <p className="text-gray-500 dark:text-gray-400">
                  No posts yet. Create one!
                </p>
                <Link
                  to="/createPost"
                  className="mt-4 inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all"
                >
                  Create Post
                </Link>
              </div>
            ) : (
              filteredPosts.map((post, postIdx) => {
                const mediaIdx = currentMediaIdx[postIdx];
                const mediaItem = post.media?.[mediaIdx] || {};
                const isLiked = likedPosts[postIdx];
                const isBookmarked = bookmarkedPosts[postIdx];
                const likeCount =
                  post.reactions?.filter((r) => r.type === "like").length || 0;
                const commentCount = post.comments?.length || 0;
                const postAuthor = post.user || post.author || {};

                return (
                  <motion.div
                    key={post._id}
                    className="mb-6"
                    whileHover={{ scale: 1.01, boxShadow: "0 4px 32px #e11d48" }}
                  >
                    {/* Premium Post Card Container */}
                    <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                      {/* Post Header */}
                      <div className="p-4 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Link
                              to={`/profile/${postAuthor.username}`}
                              className="relative group"
                            >
                              <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              <img
                                src={
                                  postAuthor?.avatar ||
                                  "https://i.pravatar.cc/150"
                                }
                                className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-800 relative z-10"
                                alt={postAuthor?.username}
                              />
                              {post.isLive && (
                                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center z-20">
                                  <RiLiveLine className="mr-1" /> LIVE
                                </div>
                              )}
                            </Link>
                            <div>
                              <Link to={`/profile/${postAuthor.username}`}>
                                <p className="font-bold text-gray-900 dark:text-white group-hover:text-pink-500 transition-colors">
                                  {postAuthor?.username || "Unknown User"}
                                  {post.isVerified && (
                                    <span className="ml-1 text-blue-500">✓</span>
                                  )}
                                </p>
                              </Link>
                              <div className="flex items-center space-x-2">
                                <p className="text-xs text-gray-500">
                                  {new Date(post.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                    }
                                  )}
                                </p>
                                <span className="text-gray-300 dark:text-gray-600">
                                  •
                                </span>
                                <span className="text-xs text-pink-500 font-medium">
                                  {typeof post.location === "string"
                                    ? post.location
                                    : post.location?.name ||
                                      (Array.isArray(post.location?.coordinates)
                                        ? `(${post.location.coordinates.join(
                                            ", "
                                          )})`
                                        : "Global")}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div
                            ref={(el) => (menuRefs.current[postIdx] = el)}
                            className="relative"
                          >
                            <button
                              onClick={() =>
                                setOpenMenu(openMenu === postIdx ? null : postIdx)
                              }
                              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              <BsThreeDotsVertical className="text-gray-500 text-lg" />
                            </button>
                            {openMenu === postIdx && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl z-50 overflow-hidden border border-gray-100 dark:border-gray-700"
                              >
                                <button className="flex items-center w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                  <FiShare2 className="mr-3 text-gray-500" />
                                  <span>Share Post</span>
                                </button>
                                <button className="flex items-center w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                  <FaBookmark className="mr-3 text-gray-500" />
                                  <span>Save Post</span>
                                </button>
                                {user?._id === postAuthor?._id && (
                                  <button className="flex items-center w-full px-4 py-3 text-left text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    <FaTimes className="mr-3" />
                                    <span>Delete Post</span>
                                  </button>
                                )}
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </div>
                      {/* Post Content */}
                      {post.content && (
                        <div className="p-5">
                          <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                            {post.content}
                          </p>
                          {/* AI-Generated Caption (placeholder) */}
                          <div className="mt-2 text-xs text-green-500 flex items-center">
                            <FaMagic className="mr-1" />
                            AI Caption: "This is an AI-generated caption."
                          </div>
                        </div>
                      )}
                      {/* Media */}
                      {post.media?.length > 0 && (
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                          <img
                            src={mediaItem.url}
                            className="w-full max-h-[600px] object-cover"
                            alt="Post media"
                            onDoubleClick={() => toggleLike(post._id, postIdx)}
                          />
                          {/* Heart Animation */}
                          <AnimatePresence>
                            {showHeart.postId === post._id && (
                              <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{
                                  scale: [0, 1.5, 1],
                                  opacity: [0, 1, 0],
                                }}
                                transition={{ duration: 1 }}
                                className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                              >
                                <FaHeart
                                  className="text-white drop-shadow-2xl"
                                  style={{ fontSize: 120, color: "#e11d48" }}
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>
                          {/* Media Navigation Arrows */}
                          {post.media.length > 1 && (
                            <>
                              <button
                                onClick={() => handlePrev(postIdx)}
                                disabled={mediaIdx === 0}
                                className={`absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-2 z-20 transition-all ${
                                  mediaIdx === 0
                                    ? "opacity-0 cursor-default"
                                    : "opacity-0 group-hover:opacity-100 hover:bg-black/50"
                                }`}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 19l-7-7 7-7"
                                  />
                                </svg>
                              </button>
                              <button
                                onClick={() =>
                                  handleNext(postIdx, post.media.length)
                                }
                                disabled={mediaIdx === post.media.length - 1}
                                className={`absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-2 z-20 transition-all ${
                                  mediaIdx === post.media.length - 1
                                    ? "opacity-0 cursor-default"
                                    : "opacity-0 group-hover:opacity-100 hover:bg-black/50"
                                }`}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </button>
                            </>
                          )}
                          {/* Media Indicators */}
                          {post.media.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                              {post.media.map((_, i) => (
                                <span
                                  key={i}
                                  className={`h-1.5 rounded-full transition-all duration-300 ${
                                    i === mediaIdx
                                      ? "bg-white w-6"
                                      : "bg-white/50 w-3"
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      {/* Action Bar */}
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex space-x-5">
                            <button
                              onClick={() => toggleLike(post._id, postIdx)}
                              className="group relative"
                            >
                              <div className="absolute -inset-1 bg-pink-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              {isLiked ? (
                                <FaHeart className="text-red-500 text-2xl" />
                              ) : (
                                <FaRegHeart className="text-gray-500 text-2xl group-hover:text-red-400 transition-colors" />
                              )}
                            </button>
                            <button
                              onClick={() =>
                                setShowComments({ postId: post._id })
                              }
                              className="group relative"
                            >
                              <div className="absolute -inset-1 bg-blue-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              <FaRegComment className="text-gray-500 text-2xl group-hover:text-blue-400 transition-colors" />
                            </button>
                            <button className="group relative">
                              <div className="absolute -inset-1 bg-green-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              <FiShare2 className="text-gray-500 text-2xl group-hover:text-green-400 transition-colors" />
                            </button>
                          </div>
                          <button
                            onClick={() => toggleBookmark(post._id, postIdx)}
                            className="group relative"
                          >
                            <div className="absolute -inset-1 bg-purple-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            {isBookmarked ? (
                              <FaBookmark className="text-purple-500 text-2xl" />
                            ) : (
                              <FaRegBookmark className="text-gray-500 text-2xl group-hover:text-purple-400 transition-colors" />
                            )}
                          </button>
                        </div>
                        {/* Likes Count with Avatars */}
                        <div className="flex items-center mb-3">
                          <div className="flex -space-x-2 mr-3">
                            {post.reactions?.slice(0, 3).map((reaction, i) => (
                              <img
                                key={i}
                                src={
                                  reaction.user?.avatar ||
                                  "https://i.pravatar.cc/150"
                                }
                                className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800"
                                alt={reaction.user?.username}
                              />
                            ))}
                          </div>
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Liked by{" "}
                            <span className="text-gray-900 dark:text-white">
                              {post.reactions?.[0]?.user?.username || "someone"}
                            </span>
                            {likeCount > 1 && ` and ${likeCount - 1} others`}
                          </p>
                        </div>
                        {/* Comments Preview */}
                        {post.comments?.length > 0 && (
                          <div className="mb-3">
                            <p className="text-sm text-gray-800 dark:text-gray-200">
                              <Link
                                to={`/profile/${post.comments[0].user?.username}`}
                                className="font-semibold hover:underline"
                              >
                                {post.comments[0].user?.username || "User"}
                              </Link>{" "}
                              {post.comments[0].text}
                            </p>
                            {post.comments.length > 1 && (
                              <button
                                onClick={() =>
                                  setShowComments({ postId: post._id })
                                }
                                className="text-sm text-gray-500 dark:text-gray-400 mt-1 hover:underline"
                              >
                                View all {commentCount} comments
                              </button>
                            )}
                          </div>
                        )}
                        {/* Add Comment */}
                        <div className="relative mt-4">
                          <input
                            type="text"
                            placeholder=" "
                            value={newComment[post._id] || ""}
                            onChange={(e) =>
                              setNewComment((prev) => ({
                                ...prev,
                                [post._id]: e.target.value,
                              }))
                            }
                            className="w-full bg-gray-50 dark:bg-gray-700 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 peer"
                            onKeyPress={(e) =>
                              e.key === "Enter" &&
                              handleAddComment(post._id, postIdx)
                            }
                          />
                          <label className="absolute left-4 top-3 text-gray-500 dark:text-gray-400 pointer-events-none transition-all duration-200 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-pink-500 peer-focus:bg-white dark:peer-focus:bg-gray-800 peer-focus:px-1 peer-focus:left-3">
                            Add a comment...
                          </label>
                          <button
                            onClick={() => handleAddComment(post._id, postIdx)}
                            disabled={!newComment[post._id]?.trim()}
                            className={`absolute right-1 top-1 p-2 rounded-full ${
                              newComment[post._id]?.trim()
                                ? "text-pink-500 hover:text-pink-600"
                                : "text-gray-400"
                            }`}
                          >
                            <IoMdSend className="text-xl" />
                          </button>
                        </div>
                        {/* NFT Mint Button (Web3) */}
                        <button
                          onClick={() => alert("NFT minting coming soon!")}
                          className="mt-4 bg-gradient-to-r from-yellow-400 to-pink-500 text-white px-4 py-2 rounded-full flex items-center"
                        >
                          <FaCube className="mr-2" />
                          Mint as NFT
                        </button>
                      </div>
                    </div>
                    {/* Comments Modal */}
                    <AnimatePresence>
                      {showComments.postId === post._id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end"
                        >
                          <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{
                              type: "spring",
                              damping: 30,
                              stiffness: 500,
                            }}
                            className="w-full bg-white dark:bg-gray-800 rounded-t-3xl shadow-xl max-h-[85vh] flex flex-col"
                          >
                            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                              <h3 className="text-lg font-bold">Comments</h3>
                              <button
                                onClick={() => setShowComments({ postId: null })}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                              >
                                <FaTimes className="text-gray-500" />
                              </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                              {post.comments?.length > 0 ? (
                                post.comments.map((comment, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-start space-x-3"
                                  >
                                    <Link
                                      to={`/profile/${comment.user?.username}`}
                                      className="flex-shrink-0"
                                    >
                                      <img
                                        src={
                                          comment.user?.avatar ||
                                          "https://i.pravatar.cc/150"
                                        }
                                        className="w-10 h-10 rounded-full object-cover"
                                        alt={comment.user?.username}
                                      />
                                    </Link>
                                    <div className="flex-1">
                                      <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-3">
                                        <Link
                                          to={`/profile/${comment.user?.username}`}
                                          className="font-semibold text-sm hover:underline"
                                        >
                                          {comment.user?.username || "User"}
                                        </Link>
                                        <p className="mt-1 text-sm">
                                          {comment.text}
                                        </p>
                                      </div>
                                      <div className="flex items-center mt-2 ml-2 space-x-4">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                          {new Date(
                                            comment.createdAt
                                          ).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                        </span>
                                        <button className="text-xs text-gray-500 dark:text-gray-400 hover:underline">
                                          Like
                                        </button>
                                        <button className="text-xs text-gray-500 dark:text-gray-400 hover:underline">
                                          Reply
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                                  No comments yet
                                </div>
                              )}
                            </div>
                            <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder=" "
                                  value={newComment[post._id] || ""}
                                  onChange={(e) =>
                                    setNewComment((prev) => ({
                                      ...prev,
                                      [post._id]: e.target.value,
                                    }))
                                  }
                                  className="w-full bg-gray-50 dark:bg-gray-700 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 peer"
                                  onKeyPress={(e) =>
                                    e.key === "Enter" &&
                                    handleAddComment(post._id, postIdx)
                                  }
                                />
                                <label className="absolute left-4 top-3 text-gray-500 dark:text-gray-400 pointer-events-none transition-all duration-200 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-pink-500 peer-focus:bg-white dark:peer-focus:bg-gray-800 peer-focus:px-1 peer-focus:left-3">
                                  Write a comment...
                                </label>
                                <button
                                  onClick={() =>
                                    handleAddComment(post._id, postIdx)
                                  }
                                  disabled={!newComment[post._id]?.trim()}
                                  className={`absolute right-1 top-1 p-2 rounded-full ${
                                    newComment[post._id]?.trim()
                                      ? "text-pink-500 hover:text-pink-600"
                                      : "text-gray-400"
                                  }`}
                                >
                                  <IoMdSend className="text-xl" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            )}
            {/* Infinite Scroll Loader */}
            <div ref={loadMoreRef} className="h-8 flex items-center justify-center">
              {isLoading && <Skeleton height={32} width={120} />}
            </div>
          </div>
        </div>
      </PullToRefresh>
    </div>
  );
}