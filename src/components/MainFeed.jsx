import { useState, useEffect, useContext, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../api";
import { AuthContext } from "../AuthContext";
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
  FaGem,
  FaGift,
  FaVolumeUp,
  FaVideo,
  FaMusic,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import {
  FiSend,
  FiShare2,
  FiAward,
  FiClock,
  FiUsers,
  FiShoppingBag,
} from "react-icons/fi";
import { IoMdSend, IoMdMic, IoMdNotifications } from "react-icons/io";
import {
  BsThreeDotsVertical,
  BsEmojiSmile,
  BsArrowRight,
  BsStars,
  BsCameraVideo,
  BsCurrencyBitcoin,
} from "react-icons/bs";
import { RiLiveLine, RiVerifiedBadgeFill } from "react-icons/ri";
import { HiOutlineSparkles, HiOutlineLightningBolt } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import ReactPlayer from "react-player";
import EmojiPicker from "emoji-picker-react";

const HomePage = () => {
  // State management
  const [posts, setPosts] = useState([]);
  const [currentMediaIdx, setCurrentMediaIdx] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
  const [showComments, setShowComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [openMenu, setOpenMenu] = useState(null);
  const menuRefs = useRef([]);
  const [showHeart, setShowHeart] = useState({ postId: null });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("forYou");
  const [showEmojiPicker, setShowEmojiPicker] = useState({ postId: null });
  const [showAppDownloadBanner, setShowAppDownloadBanner] = useState(true);

  // New feature states
  const [activeAudioRoom, setActiveAudioRoom] = useState(null);
  const [watchParty, setWatchParty] = useState(null);
  const [liveStreams, setLiveStreams] = useState([]);
  const [trendingNFTs, setTrendingNFTs] = useState([]);
  const [activePolls, setActivePolls] = useState([]);
  const [memories, setMemories] = useState([]);
  const [streakCount, setStreakCount] = useState(0);
  const [achievements, setAchievements] = useState([]);
  const [theme, setTheme] = useState("light");
  const [isIncognito, setIsIncognito] = useState(false);
  const [activeFeatures, setActiveFeatures] = useState({
    audioRooms: true,
    watchParties: true,
    nftDisplay: true,
  });

  // Sample data
  const stories = [
    { id: 1, username: "your_story", isYou: true },
    { id: 2, username: "traveler", hasNew: true, isLive: true },
    { id: 3, username: "foodie", hasNew: true },
    { id: 4, username: "photographer" },
    { id: 5, username: "fitness", isLive: true },
    { id: 6, username: "artist" },
  ];

  const trending = [
    { tag: "#funny", posts: "24.5K" },
    { tag: "#news", posts: "18.2K" },
    { tag: "#music", posts: "32.1K" },
    { tag: "#sports", posts: "15.7K" },
    { tag: "#movies", posts: "12.3K" },
    { tag: "#trending", posts: "45.6K" },
  ];

  const audioRooms = [
    {
      id: 1,
      title: "Tech Talk",
      host: "techguru",
      listeners: 142,
      topic: "Web3",
    },
    { id: 2, title: "Music Jam", host: "djcool", listeners: 89, topic: "EDM" },
  ];

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Fetch posts with error handling
  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const endpoint = user?.token ? "/posts" : "/posts";
      const res = await axiosInstance.get(endpoint, {
        headers: user?.token ? { Authorization: `Bearer ${user.token}` } : {},
      });

      const fetchedPosts = Array.isArray(res.data.posts) ? res.data.posts : Array.isArray(res.data) ? res.data : [];
      setPosts(fetchedPosts);
      setCurrentMediaIdx(fetchedPosts.map(() => 0));
      
      // Initialize liked and bookmarked states
      setLikedPosts(
        fetchedPosts.map((post) => 
          post.reactions?.some(r => r.user?._id === user?._id && r.type === "like") || false
        )
      );
      
      setBookmarkedPosts(
        fetchedPosts.map((post) => 
          post.reactions?.some(r => r.user?._id === user?._id && r.type === "bookmark") || false
        )
      );
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setError(
        err.response?.data?.message || "Please check your internet and try again"
      );
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [user?.token]);

  // Close menus when clicking outside
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

  // Media navigation handlers
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

  // Like functionality
  const toggleLike = async (postId, postIdx, e) => {
    e.preventDefault(); // Prevent default behavior
    e.stopPropagation(); // Stop event propagation

    if (!user?.token) {
      navigate("/login");
      return;
    }

    try {
      const isLiked = likedPosts[postIdx];
      const endpoint = isLiked ? `/${postId}/unlike` : `/${postId}/like`;

      await axiosInstance.put(
        `/posts${endpoint}`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      setLikedPosts((prev) =>
        prev.map((liked, i) => (i === postIdx ? !liked : liked))
      );

      setPosts((prev) => {
        const updated = [...prev];
        if (isLiked) {
          updated[postIdx].reactions =
            updated[postIdx].reactions?.filter(
              (r) => !(r.user?._id === user._id && r.type === "like")
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
        setTimeout(() => setShowHeart({ postId: null }), 700);
      }
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  // Bookmark functionality
  const toggleBookmark = async (postId, postIdx) => {
    if (!user?.token) {
      navigate("/login");
      return;
    }

    try {
      const isBookmarked = bookmarkedPosts[postIdx];
      const endpoint = isBookmarked
        ? `/${postId}/unbookmark`
        : `/${postId}/bookmark`;

      await axiosInstance.put(
        `/posts${endpoint}`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );

      setBookmarkedPosts((prev) =>
        prev.map((bookmarked, i) => (i === postIdx ? !bookmarked : bookmarked))
      );

      setPosts((prev) => {
        const updated = [...prev];
        if (isBookmarked) {
          updated[postIdx].reactions =
            updated[postIdx].reactions?.filter(
              (r) => !(r.user?._id === user._id && r.type === "bookmark")
            ) || [];
        } else {
          updated[postIdx].reactions = [
            ...(updated[postIdx].reactions || []),
            { user: { _id: user._id }, type: "bookmark" },
          ];
        }
        return updated;
      });
    } catch (err) {
      console.error("Failed to toggle bookmark:", err);
    }
  };

  // Comment functionality
  const handleAddComment = async (postId, postIdx) => {
    if (!user?.token) {
      navigate("/login");
      return;
    }

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
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  // Emoji picker handler
  const onEmojiClick = (emojiData, postId) => {
    setNewComment((prev) => ({
      ...prev,
      [postId]: (prev[postId] || "") + emojiData.emoji,
    }));
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="text-red-500 text-center p-4 max-w-md">
          <p className="mb-4">{error}</p>
          <button
            onClick={fetchPosts}
            className="bg-pink-500 text-white px-4 py-2 rounded-full hover:bg-pink-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Render individual post
  const renderPost = (post, postIdx) => {
    const mediaIdx = currentMediaIdx[postIdx];
    const mediaItem = post.media?.[mediaIdx] || {};
    const isLiked = likedPosts[postIdx];
    const isBookmarked = bookmarkedPosts[postIdx];
    const likeCount =
      post.reactions?.filter((r) => r.type === "like").length || 0;
    const commentCount = post.comments?.length || 0;
    const postAuthor = post.user || post.author;

    return (
      <div key={post._id} className="mb-6">
        {/* Post Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
          {/* Post Header */}
          <div className="p-4 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Link
                  to={`/profile/${postAuthor?.username || 'unknown'}`}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <img
                    src={postAuthor?.avatar || "https://i.pravatar.cc/150"}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-800 relative z-10"
                    alt={postAuthor?.username || "User"}
                  />
                  {post.isLive && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center z-20">
                      <RiLiveLine className="mr-1" /> LIVE
                    </div>
                  )}
                  {postAuthor?.isVerified && (
                    <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full z-20">
                      <RiVerifiedBadgeFill className="text-xs" />
                    </div>
                  )}
                </Link>

                <div>
                  <Link to={`/profile/${postAuthor?.username || 'unknown'}`}>
                    <p className="font-bold text-gray-900 dark:text-white group-hover:text-pink-500 transition-colors">
                      {postAuthor?.username || "Unknown User"}
                    </p>
                  </Link>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    {post.location && (
                      <>
                        <span className="text-gray-300 dark:text-gray-600">•</span>
                        <span className="text-xs text-pink-500 font-medium flex items-center">
                          <FaMapMarkerAlt className="mr-1" />
                          {typeof post.location === "string"
                            ? post.location
                            : post.location?.name || "Location"}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Post Menu */}
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
                      <span>Save to Collection</span>
                    </button>
                    {post.isMintable && (
                      <button
                        onClick={() => console.log(`Minting NFT for post ${post._id}`)}
                        className="flex items-center w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <BsCurrencyBitcoin className="mr-3 text-gray-500" />
                        <span>Mint as NFT</span>
                      </button>
                    )}
                    {post.hasProducts && (
                      <button className="flex items-center w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <FiShoppingBag className="mr-3 text-gray-500" />
                        <span>View Products</span>
                      </button>
                    )}
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
              {post.poll && (
                <div className="mt-3 bg-gray-50 dark:bg-gray-700 rounded-xl p-3">
                  <h4 className="font-semibold mb-2">{post.poll.question}</h4>
                  {post.poll.options.map((option, idx) => (
                    <div key={idx} className="mb-2">
                      <button className="w-full text-left bg-white dark:bg-gray-600 rounded-lg px-3 py-2 flex justify-between items-center">
                        <span>{option.text}</span>
                        <span className="text-xs text-gray-500">
                          {option.percent}%
                        </span>
                      </button>
                    </div>
                  ))}
                  <p className="text-xs text-gray-500 mt-1">
                    {post.poll.totalVotes} votes
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Media Display */}
          {post.media?.length > 0 && (
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

              {mediaItem.type === "video" ? (
                <ReactPlayer
                  url={mediaItem.url}
                  width="100%"
                  height="auto"
                  controls
                  light={mediaItem.thumbnail}
                  playing={false}
                />
              ) : (
                <img
                  src={mediaItem.url}
                  className="w-full max-h-[600px] object-cover"
                  alt="Post media"
                  onDoubleClick={() => toggleLike(post._id, postIdx)}
                />
              )}

              {/* Heart Animation */}
              <AnimatePresence>
                {showHeart.postId === post._id && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0] }}
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

              {/* Product Tags */}
              {post.products && post.products.length > 0 && (
                <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2">
                  {post.products.slice(0, 3).map((product, idx) => (
                    <button
                      key={idx}
                      className="bg-white/90 hover:bg-white text-gray-800 text-xs px-2 py-1 rounded-full flex items-center shadow-sm"
                    >
                      <FiShoppingBag className="mr-1" /> ${product.price}
                    </button>
                  ))}
                </div>
              )}

              {/* Media Navigation */}
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
                    onClick={() => handleNext(postIdx, post.media.length)}
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
                        i === mediaIdx ? "bg-white w-6" : "bg-white/50 w-3"
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
                <div className="flex items-center space-x-1">
                   <button
          onClick={(e) => toggleLike(post._id, postIdx, e)}
          className="group relative"
        >
          <div className="absolute -inset-1 bg-pink-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          {isLiked ? (
            <FaHeart className="text-red-500 text-2xl" />
          ) : (
            <FaRegHeart className="text-gray-500 text-2xl group-hover:text-red-400 transition-colors" />
          )}
        </button>
                  <div className="relative group">
                    <button className="text-gray-500 hover:text-yellow-400 transition-colors">
                      <BsStars className="text-xl" />
                    </button>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex bg-white dark:bg-gray-700 shadow-lg rounded-full p-1 space-x-1">
                      {["😂", "😍", "😮", "😢", "👍"].map((emoji, i) => (
                        <button
                          key={i}
                          className="text-xl hover:scale-125 transition-transform"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowComments(prev => ({
                    ...prev,
                    [post._id]: !prev[post._id]
                  }))}
                  className="group relative"
                >
                  <div className="absolute -inset-1 bg-blue-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <FaRegComment className="text-gray-500 text-2xl group-hover:text-blue-400 transition-colors" />
                </button>

                <button className="group relative">
                  <div className="absolute -inset-1 bg-green-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <FiShare2 className="text-gray-500 text-2xl group-hover:text-green-400 transition-colors" />
                </button>

                {post.hasAudio && (
                  <button className="group relative">
                    <div className="absolute -inset-1 bg-purple-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <FaVolumeUp className="text-gray-500 text-2xl group-hover:text-purple-400 transition-colors" />
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-3">
                {post.isMintable && (
                  <button className="text-xs bg-gradient-to-r from-purple-500 to-blue-500 text-white px-2 py-1 rounded-full flex items-center">
                    <BsCurrencyBitcoin className="mr-1" /> Mint
                  </button>
                )}
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
            </div>

            {/* Likes Count */}
            <div className="flex items-center mb-3">
              <div className="flex -space-x-2 mr-3">
                {post.reactions?.slice(0, 3).map((reaction, i) => (
                  <img
                    key={i}
                    src={reaction.user?.avatar || "https://i.pravatar.cc/150"}
                    className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800"
                    alt={reaction.user?.username || "User"}
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

            {/* Comments Section */}
            {showComments[post._id] && (
              <div className="mb-3 space-y-3 max-h-60 overflow-y-auto">
                {post.comments?.length > 0 ? (
                  post.comments.map((comment, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <img
                        src={comment.user?.avatar || "https://i.pravatar.cc/150"}
                        className="w-8 h-8 rounded-full"
                        alt={comment.user?.username}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold">
                          {comment.user?.username || "User"}
                        </p>
                        <p className="text-sm text-gray-800 dark:text-gray-200">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-2">
                    No comments yet
                  </p>
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
                  e.key === "Enter" && handleAddComment(post._id, postIdx)
                }
              />
              <label className="absolute left-4 top-3 text-gray-500 dark:text-gray-400 pointer-events-none transition-all duration-200 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-pink-500 peer-focus:bg-white dark:peer-focus:bg-gray-800 peer-focus:px-1 peer-focus:left-3">
                Add a comment...
              </label>
              <div className="absolute right-1 top-1 flex">
                <button 
                  onClick={() => setShowEmojiPicker(prev => ({
                    ...prev,
                    [post._id]: !prev[post._id]
                  }))}
                  className="p-2 text-gray-400 hover:text-pink-500"
                >
                  <BsEmojiSmile className="text-xl" />
                </button>
                {showEmojiPicker[post._id] && (
                  <div className="absolute bottom-full right-0 z-50">
                    <EmojiPicker
                      onEmojiClick={(emojiData) => onEmojiClick(emojiData, post._id)}
                      width={300}
                      height={350}
                    />
                  </div>
                )}
                <button className="p-2 text-gray-400 hover:text-blue-500">
                  <IoMdMic className="text-xl" />
                </button>
                <button
                  onClick={() => handleAddComment(post._id, postIdx)}
                  disabled={!newComment[post._id]?.trim()}
                  className={`p-2 rounded-full ${
                    newComment[post._id]?.trim()
                      ? "text-pink-500 hover:text-pink-600"
                      : "text-gray-400"
                  }`}
                >
                  <IoMdSend className="text-xl" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 ${theme === "dark" ? "dark" : ""}`}>
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

      {/* Main Content */}
      <div className="max-w-lg mx-auto px-2 pb-20">
        {/* Stories */}
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
                  } relative`}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-full w-full h-full flex items-center justify-center overflow-hidden">
                    {story.isYou ? (
                      <div className="text-2xl">+</div>
                    ) : (
                      <img
                        src={`https://i.pravatar.cc/150?img=${story.id}`}
                        className="w-full h-full object-cover"
                        alt={story.username}
                      />
                    )}
                  </div>
                  {story.isLive && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full z-10">
                      <RiLiveLine />
                    </div>
                  )}
                </div>
                <span className="text-xs truncate w-16 text-center">
                  {story.username}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Audio Rooms */}
        {activeFeatures.audioRooms && audioRooms.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-lg flex items-center">
                <FaVolumeUp className="text-purple-500 mr-2" />
                Live Audio Rooms
              </h2>
              <button className="text-sm text-pink-500">See All</button>
            </div>
            <div className="space-y-3">
              {audioRooms.map((room) => (
                <div
                  key={room.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                      <FaVolumeUp className="text-purple-500 text-xl" />
                    </div>
                    <div>
                      <p className="font-semibold">{room.title}</p>
                      <p className="text-xs text-gray-500">
                        Hosted by @{room.host}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveAudioRoom(room.id)}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    Join <FiUsers className="ml-1" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Watch Party */}
        {activeFeatures.watchParties && watchParty === null && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-lg flex items-center">
                <BsCameraVideo className="text-blue-500 mr-2" />
                Watch Parties
              </h2>
              <button className="text-sm text-pink-500">See All</button>
            </div>
            <div className="relative rounded-lg overflow-hidden h-40 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="relative z-10 text-white text-center p-4">
                <p className="text-sm mb-3">Join friends to watch together</p>
                <button
                  onClick={() => setWatchParty("movie123")}
                  className="bg-white text-blue-500 px-4 py-1 rounded-full text-sm font-semibold flex items-center mx-auto"
                >
                  Start Party <FiUsers className="ml-1" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Trending NFTs */}
        {activeFeatures.nftDisplay && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-lg flex items-center">
                <BsCurrencyBitcoin className="text-yellow-500 mr-2" />
                Trending NFTs
              </h2>
              <button className="text-sm text-pink-500">See All</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
                >
                  <img
                    src={`https://source.unsplash.com/random/300x300/?nft,${item}`}
                    className="w-full h-32 object-cover"
                    alt={`NFT ${item}`}
                  />
                  <div className="p-2">
                    <p className="font-semibold text-sm truncate">
                      Awesome NFT #{item}
                    </p>
                    <p className="text-xs text-gray-500">0.0{item} ETH</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Feed Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-2 mb-4">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab("forYou")}
              className={`flex-1 py-2 text-sm font-medium flex items-center justify-center ${
                activeTab === "forYou"
                  ? "text-pink-500 border-b-2 border-pink-500"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              For You
            </button>
            <button
              onClick={() => setActiveTab("following")}
              className={`flex-1 py-2 text-sm font-medium flex items-center justify-center ${
                activeTab === "following"
                  ? "text-pink-500 border-b-2 border-pink-500"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Following
            </button>
            <button
              onClick={() => setActiveTab("popular")}
              className={`flex-1 py-2 text-sm font-medium flex items-center justify-center ${
                activeTab === "popular"
                  ? "text-pink-500 border-b-2 border-pink-500"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              Popular
            </button>
            <div className="flex items-center justify-center px-2">
              <div className="bg-pink-100 dark:bg-pink-900 text-pink-500 dark:text-pink-200 text-xs px-2 py-1 rounded-full flex items-center">
                <FiAward className="mr-1" /> {streakCount} day streak
              </div>
            </div>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="flex flex-col gap-4">
          {posts.length === 0 ? (
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
            posts.map((post, idx) => renderPost(post, idx))
          )}
        </div>
      </div>

      {/* Mobile App Download CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg p-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 z-10">
        <div>
          <p className="font-semibold text-sm">Get the full experience</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Download our app
          </p>
        </div>
        <a
          href="#download"
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center"
        >
          Install <FaDownload className="ml-1" />
        </a>
      </div>
    </div>
  );
};

export default HomePage;