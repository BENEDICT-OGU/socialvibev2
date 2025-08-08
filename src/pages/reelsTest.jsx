import { useRef, useState, useEffect } from "react";
import {
  FaHeart,
  FaRegCommentDots,
  FaShare,
  FaBookmark,
  FaMusic,
  FaEllipsisV,
  FaPauseCircle,
  FaSearch,
  FaArrowUp,
  FaArrowDown,
  FaVolumeMute,
  FaVolumeUp,
  FaPlay,
  FaPause,
  FaUserPlus,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../api";

const HEART_COLORS = [
  "text-pink-500",
  "text-red-800",
  "text-yellow-700",
  "text-blue-800",
  "text-purple-700",
  "text-green-800",
  "text-orange-800",
  "text-cyan-800",
  "text-fuchsia-800",
  "text-lime-700",
];

export default function Reels() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reelsData, setReelsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [comments, setComments] = useState([]);
  const [following, setFollowing] = useState([]);
  const [explodingHearts, setExplodingHearts] = useState([]);
  const [hasExploded, setHasExploded] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  const touchStartY = useRef(null);
  const videoRefs = useRef([]);
  const navigate = useNavigate();

  // Fetch reels from backend
  useEffect(() => {
    const fetchReels = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/reels');
         const data = Array.isArray(response.data) ? response.data : [];
        
        setReelsData(data);
        setIsLiked(data.map(reel => reel.liked || false));
        setComments(data.map(reel => reel.comments || []));
        setFollowing(data.map(reel => reel.following || false));
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReels();
  }, []);

  const handleLikeIconClick = () => {
    setReelsData(prev => {
      const updated = [...prev];
      updated[currentIndex].likes += isLiked[currentIndex] ? -1 : 1;
      return updated;
    });
    
    setIsLiked(prev => {
      const updated = [...prev];
      updated[currentIndex] = !updated[currentIndex];
      return updated;
    });
    
    setHasExploded(false);
  };

  const handleDoubleTapExplosion = () => {
    if (!isLiked[currentIndex] && !hasExploded) {
      setReelsData(prev => {
        const updated = [...prev];
        updated[currentIndex].likes += 1;
        return updated;
      });
      
      setIsLiked(prev => {
        const updated = [...prev];
        updated[currentIndex] = true;
        return updated;
      });
      
      setHasExploded(true);
    }
    
    const count = getRandomInt(8, 12);
    const hearts = [];
    for (let i = 0; i < count; i++) {
      hearts.push({
        id: Date.now() + Math.random(),
        drift: getRandomInt(-180, 180),
        color: HEART_COLORS[getRandomInt(0, HEART_COLORS.length - 1)],
        scale: Math.random() * 0.9 + 3,
        duration: Math.random() * 0.2 + 1.1,
        delay: Math.random() * 0.08,
        rotate: getRandomInt(-10, 10),
      });
    }
    setExplodingHearts(hearts);
    setTimeout(() => setExplodingHearts([]), 1400);
  };

  // ... (keep other existing functions like handleNext, handlePrev, etc.)

  const handleTimeUpdate = (e) => {
    const video = e.target;
    if (video.duration) {
      setVideoProgress((video.currentTime / video.duration) * 100);
    }
  };

  const handleVideoRef = (el, idx) => {
    videoRefs.current[idx] = el;
    if (idx === currentIndex && el) {
      setVideoProgress((el.currentTime / el.duration) * 100 || 0);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen bg-black text-white">Loading reels...</div>;
  if (error) return <div className="flex items-center justify-center h-screen bg-black text-white">Error: {error}</div>;
  if (reelsData.length === 0) return <div className="flex items-center justify-center h-screen bg-black text-white">No reels available</div>;

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Desktop Search Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate('/reels-search', { state: { searchQuery: search } });
        }}
        className="hidden md:flex absolute top-4 left-0 right-0 z-20 justify-center px-4"
      >
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search reels..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-neutral-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </form>

      {/* Mobile Search Icon */}
      <button
        onClick={() => navigate('/reels-search')}
        className="md:hidden absolute top-4 right-4 z-20 bg-black/60 text-white rounded-full p-2"
      >
        <FaSearch size={20} />
      </button>

      {/* Reels Container */}
      <div className="relative w-full h-full">
        {/* Desktop Navigation Arrows */}
        <div className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-10">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="bg-black/60 hover:bg-pink-500 text-white rounded-full p-3 transition disabled:opacity-30"
          >
            <FaArrowUp />
          </button>
        </div>

        {/* Reels Content */}
        <div className="w-full h-full">
          {reelsData.map((reel, idx) => (
            <motion.div
              key={reel._id || reel.id}
              className={`absolute inset-0 w-full h-full ${idx === currentIndex ? 'block' : 'hidden'}`}
              animate={{
                y: (idx - currentIndex) * window.innerHeight,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onDoubleClick={handleDoubleTapExplosion}
            >
              {/* Video Progress Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gray-600 z-30">
                <div
                  className="h-full bg-pink-500 transition-all duration-150"
                  style={{ width: `${videoProgress}%` }}
                />
              </div>

              {/* Video Element - Changed to object-contain for mobile */}
              <video
                ref={(el) => handleVideoRef(el, idx)}
                src={reel.videoUrl}
                className={`absolute inset-0 w-full h-full ${
                  window.innerWidth < 768 ? 'object-contain' : 'object-cover'
                } bg-black`}
                autoPlay={idx === currentIndex}
                loop
                muted={isMuted}
                onClick={handleVideoTap}
                onTimeUpdate={handleTimeUpdate}
              />

              {/* Video Controls and UI Elements */}
              {idx === currentIndex && (
                <>
                  {/* Mute Toggle */}
                  <button
                    className="absolute top-4 right-4 bg-black/60 text-white rounded-full p-2 z-20"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMuteToggle();
                    }}
                  >
                    {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
                  </button>

                  {/* User Info */}
                  <div className="absolute left-4 bottom-20 z-10 text-white max-w-[70%]">
                    <div className="flex items-center gap-2 mb-2">
                      <img
                        src={reel.user?.avatar}
                        alt={reel.user?.username}
                        className="w-8 h-8 rounded-full border border-pink-500"
                      />
                      <span className="font-semibold">@{reel.user?.username}</span>
                      <button
                        className={`ml-2 px-2 py-1 rounded-full text-xs ${
                          following[idx] ? "bg-gray-300 text-gray-700" : "bg-pink-500 text-white"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFollow();
                        }}
                      >
                        {following[idx] ? "Following" : "Follow"}
                      </button>
                    </div>
                    <p className="text-sm mb-1">{reel.caption}</p>
                    <div className="flex items-center gap-1 text-xs text-pink-200">
                      <FaMusic size={12} /> {reel.music || "Original Sound"}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="absolute right-4 bottom-20 flex flex-col items-center gap-4 z-10">
                    {/* Like Button */}
                    <div className="flex flex-col items-center">
                      <button
                        className="relative"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLikeIconClick();
                        }}
                      >
                        <FaHeart
                          size={24}
                          className={`transition ${isLiked[idx] ? "text-pink-500 scale-110" : "text-white"}`}
                        />
                      </button>
                      <span className="text-xs text-white mt-1">
                        {reel.likes}
                      </span>
                    </div>

                    {/* Comment Button */}
                    <div className="flex flex-col items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowComments(true);
                        }}
                      >
                        <FaRegCommentDots size={24} className="text-white" />
                      </button>
                      <span className="text-xs text-white mt-1">
                        {comments[idx]?.length || 0}
                      </span>
                    </div>

                    {/* Share Button */}
                    <button>
                      <FaShare size={24} className="text-white" />
                    </button>
                  </div>

                  {/* Heart Animation */}
                  <AnimatePresence>
                    {explodingHearts.map((heart) => (
                      <motion.span
                        key={heart.id}
                        initial={{ opacity: 1.2, scale: 0.8, x: 0, y: 0, rotate: heart.rotate }}
                        animate={{
                          opacity: 0.3,
                          scale: heart.scale,
                          x: heart.drift,
                          y: -500,
                          rotate: heart.rotate + getRandomInt(-10, 10),
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: heart.duration,
                          delay: heart.delay,
                          ease: "easeOut",
                        }}
                        className={`absolute left-1/2 bottom-1/3 text-4xl ${heart.color} pointer-events-none`}
                      >
                        <FaHeart />
                      </motion.span>
                    ))}
                  </AnimatePresence>
                </>
              )}
            </motion.div>
          ))}
        </div>

        {/* Desktop Next Arrow */}
        <div className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-10">
          <button
            onClick={handleNext}
            disabled={currentIndex === reelsData.length - 1}
            className="bg-black/60 hover:bg-pink-500 text-white rounded-full p-3 transition disabled:opacity-30"
          >
            <FaArrowDown />
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowComments(false)}
          />
          <div className="relative w-full max-w-md h-full bg-black/90 backdrop-blur-sm border-l border-gray-800">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-white font-semibold">Comments</h3>
              <button 
                onClick={() => setShowComments(false)}
                className="text-gray-400 hover:text-white"
              >
                &times;
              </button>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-120px)]">
              {comments[currentIndex]?.length === 0 ? (
                <p className="text-gray-400 text-center">No comments yet</p>
              ) : (
                comments[currentIndex].map((comment) => (
                  <div key={comment._id || comment.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center text-white">
                      {comment.user[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{comment.user}</p>
                      <p className="text-gray-300">{comment.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <form 
              onSubmit={handleCommentSend}
              className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800 flex gap-2"
            >
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 bg-gray-800 rounded-full px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button 
                type="submit"
                className="bg-pink-500 text-white rounded-full p-2 hover:bg-pink-600"
              >
                <FaPaperPlane />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}