import React, { useState, useRef, useEffect } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaComment,
  FaPaperPlane,
  FaBookmark,
  FaRegBookmark,
  FaEllipsisH,
  FaMusic,
  FaUserPlus,
  FaEnvelope,
  FaLink,
  FaFlag,
  FaHome,
  FaSearch,
  FaPlusCircle,
  FaFilm,
  FaUser,
  FaVolumeMute,
  FaVolumeUp,
  FaExpand,
  FaChevronUp,
  FaChevronDown,
  FaSmile,
  FaGift,
  FaClock,
  FaMagic,
  FaRegClock,
  FaRegSmile,
  FaRegImage,
} from "react-icons/fa";
import { MdGif } from "react-icons/md";
import { IoMdSend } from "react-icons/io";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { BiLike, BiDislike } from "react-icons/bi";
import { motion, AnimatePresence } from "framer-motion";
import { useSwipeable } from "react-swipeable";

const ReelsPage = () => {
  // State for reels data
  const [reels, setReels] = useState([]);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [likedReels, setLikedReels] = useState([]);
  const [savedReels, setSavedReels] = useState([]);
  const [activeTab, setActiveTab] = useState("forYou");
  const [volume, setVolume] = useState(0.5);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [showCaption, setShowCaption] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [showCreateReel, setShowCreateReel] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [showMiniMap, setShowMiniMap] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [showTagFriends, setShowTagFriends] = useState(false);
  const [showAudioDetails, setShowAudioDetails] = useState(false);
  const [showProfilePreview, setShowProfilePreview] = useState(null);
  const [showReactions, setShowReactions] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [lastTap, setLastTap] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showEffectsPanel, setShowEffectsPanel] = useState(false);
  const [showSpeedOptions, setShowSpeedOptions] = useState(false);
  const [videoSpeed, setVideoSpeed] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Refs
  const videoRef = useRef(null);
  const reelsContainerRef = useRef(null);
  const commentInputRef = useRef(null);
  const containerRef = useRef(null);

  // Mock data for reels
  useEffect(() => {
    const mockReels = [
      {
        id: 1,
        videoUrl:
          "https://assets.mixkit.co/videos/preview/mixkit-woman-dancing-under-neon-lights-1230-large.mp4",
        thumbnail: "https://picsum.photos/400/700",
        creator: {
          id: 101,
          username: "dancequeen",
          avatar: "https://randomuser.me/api/portraits/women/44.jpg",
          isVerified: true,
        },
        caption: "Friday night vibes 💃✨ #dance #nightout",
        likes: 12543,
        comments: 842,
        shares: 321,
        views: 450000,
        audio: {
          title: "Night Fever - Disco Remix",
          artist: "DJ GrooveMaster",
        },
        duration: 15,
        timestamp: "2h ago",
        location: "Miami, FL",
        hashtags: ["#dance", "#nightout", "#vibes"],
        products: [],
        isSponsored: false,
        isLiked: false,
        isSaved: false,
        isFollowing: false,
        commentsList: [
          {
            id: 1001,
            user: {
              id: 201,
              username: "partyanimal",
              avatar: "https://randomuser.me/api/portraits/women/22.jpg",
            },
            text: "Those moves though! 🔥",
            likes: 42,
            timestamp: "1h ago",
            isLiked: false,
            replies: [],
          },
        ],
      },
      {
        id: 2,
        videoUrl:
          "https://assets.mixkit.co/videos/preview/mixkit-man-doing-tricks-with-skateboard-in-a-parking-lot-34553-large.mp4",
        thumbnail: "https://picsum.photos/400/700",
        creator: {
          id: 102,
          username: "sk8rboi",
          avatar: "https://randomuser.me/api/portraits/men/32.jpg",
          isVerified: false,
        },
        caption: "New board, new tricks 🛹 #skateboarding #shredding",
        likes: 8765,
        comments: 432,
        shares: 198,
        views: 320000,
        audio: {
          title: "Punk Rock Anthem",
          artist: "Skate or Die",
        },
        duration: 22,
        timestamp: "5h ago",
        location: "Los Angeles, CA",
        hashtags: ["#skateboarding", "#shredding", "#skatelife"],
        products: [],
        isSponsored: false,
        isLiked: false,
        isSaved: false,
        isFollowing: false,
        commentsList: [
          {
            id: 1002,
            user: {
              id: 202,
              username: "skategirl",
              avatar: "https://randomuser.me/api/portraits/women/33.jpg",
            },
            text: "That kickflip was clean! 👏",
            likes: 28,
            timestamp: "4h ago",
            isLiked: false,
            replies: [],
          },
        ],
      },
      {
        id: 3,
        videoUrl:
          "https://assets.mixkit.co/videos/preview/mixkit-portrait-of-a-woman-in-a-pool-1259-large.mp4",
        thumbnail: "https://picsum.photos/400/700",
        creator: {
          id: 103,
          username: "poolqueen",
          avatar: "https://randomuser.me/api/portraits/women/65.jpg",
          isVerified: true,
        },
        caption: "Summer vibes never end 🌊 #pool #summer",
        likes: 24567,
        comments: 1243,
        shares: 567,
        views: 890000,
        audio: {
          title: "Summer Waves - Chill Mix",
          artist: "Beach Vibes",
        },
        duration: 18,
        timestamp: "1d ago",
        location: "Malibu, CA",
        hashtags: ["#summer", "#pool", "#vibes"],
        products: [],
        isSponsored: true,
        isLiked: false,
        isSaved: false,
        isFollowing: false,
        commentsList: [
          {
            id: 1003,
            user: {
              id: 203,
              username: "summerlover",
              avatar: "https://randomuser.me/api/portraits/women/28.jpg",
            },
            text: "Wish I was there right now! 😍",
            likes: 87,
            timestamp: "20h ago",
            isLiked: false,
            replies: [],
          },
        ],
      },
    ];
    setReels(mockReels);
  }, []);

  // Handle scroll for infinite reels
  const handleScroll = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;
    const scrollPosition = scrollTop + clientHeight;

    if (scrollPosition >= scrollHeight - 100) {
      // Load more reels
      // In a real app, you would fetch more data here
    }
  };

  // Handle video play/pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle mute/unmute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Handle like with animation
  const handleLike = (reelId) => {
    if (!likedReels.includes(reelId)) {
      // Add heart animation
      const newHeart = {
        id: Date.now(),
        x: Math.random() * window.innerWidth,
        y: window.innerHeight,
        size: Math.random() * 20 + 10,
        speed: Math.random() * 2 + 1,
        opacity: 1,
      };
      setHearts((prev) => [...prev, newHeart]);

      // Remove hearts after animation
      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
      }, 1000);
    }

    setLikedReels((prev) =>
      prev.includes(reelId)
        ? prev.filter((id) => id !== reelId)
        : [...prev, reelId]
    );
  };

  // Handle double tap for like with animation
  const handleDoubleTap = (e) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;

    if (tapLength < 300 && tapLength > 0) {
      // Double tap detected
      const reelId = reels[currentReelIndex].id;
      if (!likedReels.includes(reelId)) {
        handleLike(reelId);

        // Create multiple hearts at tap position
        const newHearts = Array(15)
          .fill()
          .map((_, i) => ({
            id: Date.now() + i,
            x: e.clientX - 50 + Math.random() * 100,
            y: e.clientY - 50 + Math.random() * 100,
            size: Math.random() * 30 + 20,
            speed: Math.random() * 3 + 1,
            opacity: 1,
          }));

        setHearts((prev) => [...prev, ...newHearts]);

        // Remove hearts after animation
        setTimeout(() => {
          setHearts((prev) =>
            prev.filter((h) => !newHearts.map((nh) => nh.id).includes(h.id))
          );
        }, 1000);
      }
    }
    setLastTap(currentTime);
  };

  // Handle save
  const handleSave = (reelId) => {
    setSavedReels((prev) =>
      prev.includes(reelId)
        ? prev.filter((id) => id !== reelId)
        : [...prev, reelId]
    );
  };

  // Handle follow
  const handleFollow = (creatorId) => {
    setReels((prev) =>
      prev.map((reel) =>
        reel.creator.id === creatorId
          ? { ...reel, isFollowing: !reel.isFollowing }
          : reel
      )
    );
  };

  // Handle comment submit
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      const newComment = {
        id: Date.now(),
        user: {
          id: 999, // Current user ID
          username: "current_user",
          avatar: "https://randomuser.me/api/portraits/men/10.jpg",
        },
        text: commentText,
        likes: 0,
        timestamp: "Just now",
        isLiked: false,
        replies: [],
      };

      setReels((prev) =>
        prev.map((reel, index) =>
          index === currentReelIndex
            ? {
                ...reel,
                commentsList: [...reel.commentsList, newComment],
                comments: reel.comments + 1,
              }
            : reel
        )
      );

      setCommentText("");
      commentInputRef.current.focus();
    }
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      if (newVolume > 0) {
        setIsMuted(false);
      }
    }
  };

  // Handle progress update
  const handleProgress = () => {
    if (videoRef.current) {
      const currentProgress =
        (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };

  // Handle reel navigation
  const navigateReel = (direction) => {
    if (direction === "up" && currentReelIndex > 0) {
      setCurrentReelIndex(currentReelIndex - 1);
    } else if (direction === "down" && currentReelIndex < reels.length - 1) {
      setCurrentReelIndex(currentReelIndex + 1);
    }
  };

  // Handle swipe gestures
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setShowComments(true),
    onSwipedRight: () => setShowComments(false),
    onSwipedUp: () => navigateReel("down"),
    onSwipedDown: () => navigateReel("up"),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  // Update heart positions for animation
  useEffect(() => {
    const animateHearts = () => {
      setHearts((prev) =>
        prev
          .map((heart) => ({
            ...heart,
            y: heart.y - heart.speed,
            opacity: heart.opacity - 0.01,
          }))
          .filter((heart) => heart.y > -50 && heart.opacity > 0)
      );
    };

    const animationFrame = requestAnimationFrame(animateHearts);
    return () => cancelAnimationFrame(animationFrame);
  }, [hearts]);

  // Handle video speed change
  const handleSpeedChange = (speed) => {
    setVideoSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedOptions(false);
  };

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div
      className=" relative  bg-blue text-white overflow-hidden mb-12"
      ref={containerRef}
      {...swipeHandlers}
    >
      {/* Heart animations */}
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute text-red-500 pointer-events-none"
          style={{
            left: `${heart.x}px`,
            top: `${heart.y}px`,
            fontSize: `${heart.size}px`,
            opacity: heart.opacity,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            scale: [0, 1, 1.2, 0.8, 0],
            y: heart.y - 100,
            x: heart.x + (Math.random() * 40 - 20),
            rotate: Math.random() * 60 - 30,
          }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
        >
          <FaHeart />
        </motion.div>
      ))}

      {/* Main reels container */}
      <div
        ref={reelsContainerRef}
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth"
        onScroll={handleScroll}
      >
        {reels.map((reel, index) => (
          <div
            key={reel.id}
            className={`h-full w-full snap-start relative flex flex-col ${
              index === currentReelIndex ? "block" : "hidden"
            }`}
          >
            {/* Video player */}
            <div
              className="relative h-full w-full flex items-center justify-center"
              onDoubleClick={handleDoubleTap}
            >
              <video
                ref={index === currentReelIndex ? videoRef : null}
                src={reel.videoUrl}
                poster={reel.thumbnail}
                className="h-full w-full object-cover"
                autoPlay={index === currentReelIndex}
                loop
                muted={isMuted}
                onClick={togglePlayPause}
                onTimeUpdate={handleProgress}
              />

              {/* Progress bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gray-600 z-10">
                <div
                  className="h-full bg-red-500 transition-all duration-200"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {/* Reel number indicator */}
              <div className="absolute top-4 left-4 bg-black bg-opacity-50 px-2 py-1 rounded-full text-xs">
                Reel {index + 1} of {reels.length}
              </div>

              {/* Mute button */}
              <button
                className="absolute top-4 right-4 bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-70 transition-all"
                onClick={toggleMute}
                onMouseEnter={() => setShowVolumeControl(true)}
                onMouseLeave={() => setShowVolumeControl(false)}
              >
                {isMuted ? (
                  <FaVolumeMute className="h-5 w-5" />
                ) : (
                  <FaVolumeUp className="h-5 w-5" />
                )}
              </button>

              {/* Volume control */}
              {showVolumeControl && (
                <motion.div
                  className="absolute top-16 right-4 bg-black bg-opacity-80 p-3 rounded-lg"
                  onMouseEnter={() => setShowVolumeControl(true)}
                  onMouseLeave={() => setShowVolumeControl(false)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-white"
                    orient="vertical"
                  />
                </motion.div>
              )}

              {/* Caption */}
              <div
                className={`absolute bottom-32 left-4 right-4 transition-all duration-300 ${
                  showCaption ? "opacity-100" : "opacity-0"
                }`}
                onClick={() => setShowCaption(!showCaption)}
              >
                <div className="bg-black bg-opacity-60 p-3 rounded-lg backdrop-blur-sm">
                  <p className="text-sm font-medium">{reel.caption}</p>
                  {reel.hashtags && (
                    <div className="flex flex-wrap mt-2">
                      {reel.hashtags.map((tag, i) => (
                        <span key={i} className="text-blue-400 text-xs mr-2">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right sidebar actions */}
              <div className="absolute right-4 bottom-32 flex flex-col items-center space-y-6">
                {/* Creator profile */}
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <motion.img
                      src={reel.creator.avatar}
                      alt={reel.creator.username}
                      className="h-12 w-12 rounded-full border-2 border-white hover:border-pink-500 transition-all cursor-pointer"
                      onClick={() => setShowProfilePreview(reel.creator)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    />
                    {reel.creator.isVerified && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5">
                        <RiVerifiedBadgeFill className="h-3 w-3 text-white" />
                      </div>
                    )}
                    <div className="absolute -bottom-6 bg-black bg-opacity-70 px-2 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      @{reel.creator.username}
                    </div>
                  </div>
                  <button
                    className={`mt-2 text-xs font-semibold ${
                      reel.isFollowing
                        ? "text-gray-400"
                        : "text-white hover:text-pink-400"
                    } transition-colors`}
                    onClick={() => handleFollow(reel.creator.id)}
                  >
                    {reel.isFollowing ? "Following" : "Follow"}
                  </button>
                </div>

                {/* Like button */}
                <div className="flex flex-col items-center">
                  <motion.button
                    onClick={() => handleLike(reel.id)}
                    whileTap={{ scale: 0.8 }}
                  >
                    {likedReels.includes(reel.id) ? (
                      <FaHeart className="h-8 w-8 text-red-500" />
                    ) : (
                      <FaRegHeart className="h-8 w-8 text-white" />
                    )}
                  </motion.button>
                  <span className="text-xs mt-1 font-medium">
                    {formatNumber(
                      reel.likes + (likedReels.includes(reel.id) ? 1 : 0)
                    )}
                  </span>
                </div>

                {/* Comment button */}
                <div className="flex flex-col items-center">
                  <motion.button
                    onClick={() => setShowComments(true)}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaComment className="h-8 w-8 text-white" />
                  </motion.button>
                  <span className="text-xs mt-1 font-medium">
                    {formatNumber(reel.comments)}
                  </span>
                </div>

                {/* Share button */}
                <div className="flex flex-col items-center">
                  <motion.button
                    onClick={() => setShowShareSheet(true)}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaPaperPlane className="h-8 w-8 text-white" />
                  </motion.button>
                  <span className="text-xs mt-1 font-medium">
                    {formatNumber(reel.shares)}
                  </span>
                </div>

                {/* Save button */}
                <div className="flex flex-col items-center">
                  <motion.button
                    onClick={() => handleSave(reel.id)}
                    whileTap={{ scale: 0.9 }}
                  >
                    {savedReels.includes(reel.id) ? (
                      <FaBookmark className="h-8 w-8 text-white" />
                    ) : (
                      <FaRegBookmark className="h-8 w-8 text-white" />
                    )}
                  </motion.button>
                </div>

                {/* Music */}
                <motion.div
                  className="flex items-center space-x-2 bg-black bg-opacity-60 px-2 py-1 rounded-full cursor-pointer hover:bg-opacity-80 transition-all"
                  onClick={() => setShowAudioDetails(true)}
                  whileHover={{ scale: 1.05 }}
                >
                  <FaMusic
                    className="h-4 w-4 animate-spin"
                    style={{ animationDuration: "3s" }}
                  />
                  <span className="text-xs font-medium truncate max-w-[100px]">
                    {reel.audio.title}
                  </span>
                </motion.div>
              </div>

              {/* Bottom bar */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                {/* Creator info */}
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-sm">
                    @{reel.creator.username}
                  </span>
                  <button
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full transition-all ${
                      reel.isFollowing
                        ? "bg-gray-600 text-white"
                        : "bg-white text-black hover:bg-gray-200"
                    }`}
                    onClick={() => handleFollow(reel.creator.id)}
                  >
                    {reel.isFollowing ? "Following" : "Follow"}
                  </button>
                </div>

                {/* View count */}
                <div className="flex items-center bg-black bg-opacity-50 px-2 py-1 rounded-full">
                  <span className="text-xs font-medium">
                    {formatNumber(reel.views)} views
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comments panel */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            className="absolute top-0 bottom-0 left-0 right-0 bg-black bg-opacity-90 z-20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-gray-800">
                <span className="font-semibold">
                  {reels[currentReelIndex]?.comments} comments
                </span>
                <motion.button
                  onClick={() => setShowComments(false)}
                  className="p-1 rounded-full hover:bg-gray-800 transition-all"
                  whileTap={{ scale: 0.9 }}
                >
                  <FaChevronDown className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Comments list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {reels[currentReelIndex]?.commentsList.map((comment) => (
                  <motion.div
                    key={comment.id}
                    className="flex space-x-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <img
                      src={comment.user.avatar}
                      alt={comment.user.username}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="bg-gray-800 rounded-lg p-3">
                        <span className="font-semibold text-sm">
                          @{comment.user.username}
                        </span>
                        <p className="text-sm mt-1">{comment.text}</p>
                      </div>
                      <div className="flex items-center mt-2 space-x-4 text-xs text-gray-400">
                        <span>{comment.timestamp}</span>
                        <button className="hover:text-white transition-colors">
                          Reply
                        </button>
                        <button className="flex items-center hover:text-white transition-colors">
                          <BiLike className="h-3 w-3 mr-1" />
                          <span>{comment.likes}</span>
                        </button>
                      </div>
                    </div>
                    <button className="self-start text-gray-400 hover:text-white transition-colors">
                      <BiLike className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </div>

              {/* Comment input */}
              <form
                onSubmit={handleCommentSubmit}
                className="p-4 border-t border-gray-800"
              >
                <div className="flex items-center space-x-2">
                  <img
                    src="https://randomuser.me/api/portraits/men/10.jpg"
                    alt="Your profile"
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="flex-1 relative">
                    <input
                      ref={commentInputRef}
                      type="text"
                      placeholder="Add a comment..."
                      className="w-full bg-gray-800 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-600"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                      <button
                        type="button"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <FaSmile className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <MdGif className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <motion.button
                    type="submit"
                    className={`font-semibold ${
                      commentText.trim()
                        ? "text-blue-400 hover:text-blue-300"
                        : "text-gray-500 cursor-default"
                    } transition-colors`}
                    disabled={!commentText.trim()}
                    whileTap={{ scale: 0.9 }}
                  >
                    Post
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation tabs */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex justify-center space-x-8 p-4 z-10 backdrop-blur-sm bg-black bg-opacity-30"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <button
          className={`font-semibold pb-1 relative ${
            activeTab === "forYou"
              ? "text-white"
              : "text-gray-400 hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("forYou")}
        >
          For You
          {activeTab === "forYou" && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"
              layoutId="underline"
            />
          )}
        </button>
        <button
          className={`font-semibold pb-1 relative ${
            activeTab === "following"
              ? "text-white"
              : "text-gray-400 hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("following")}
        >
          Following
          {activeTab === "following" && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"
              layoutId="underline"
            />
          )}
        </button>
        <button
          className={`font-semibold pb-1 relative ${
            activeTab === "trending"
              ? "text-white"
              : "text-gray-400 hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("trending")}
        >
          Trending
          {activeTab === "trending" && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-full"
              layoutId="underline"
            />
          )}
        </button>
      </motion.div>

      {/* Create reel button */}
      <motion.button
        className="absolute bottom-20 right-4 bg-gradient-to-r from-pink-500 to-orange-500 p-3 rounded-full shadow-lg z-10"
        onClick={() => setShowCreateReel(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaPlusCircle className="h-6 w-6" />
      </motion.button>

      {/* Create reel modal */}
      <AnimatePresence>
        {showCreateReel && (
          <motion.div
            className="absolute top-0 bottom-0 left-0 right-0 bg-black z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-gray-800">
                <motion.button
                  onClick={() => setShowCreateReel(false)}
                  className="p-1 rounded-full hover:bg-gray-800 transition-all"
                  whileTap={{ scale: 0.9 }}
                >
                  <FaChevronDown className="h-6 w-6" />
                </motion.button>
                <span className="font-semibold">Create Reel</span>
                <button className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
                  Next
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="bg-gray-800 rounded-lg p-8 mb-4">
                  <FaFilm className="h-16 w-16 text-gray-400" />
                </div>
                <p className="text-lg font-semibold mb-2">Create a new reel</p>
                <p className="text-gray-400 text-sm mb-6">
                  Record or upload a video to share
                </p>
                <motion.button
                  className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  whileTap={{ scale: 0.95 }}
                >
                  Record
                </motion.button>
                <button className="mt-4 text-blue-400 font-semibold hover:text-blue-300 transition-colors">
                  Upload Video
                </button>
              </div>

              {/* Bottom options */}
              <div className="p-4 border-t border-gray-800 grid grid-cols-5 gap-2">
                <motion.button
                  className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-800 transition-all"
                  onClick={() => setShowEffectsPanel(true)}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaMagic className="h-5 w-5 mb-1" />
                  <span className="text-xs">Effects</span>
                </motion.button>
                <motion.button
                  className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-800 transition-all"
                  whileTap={{ scale: 0.95 }}
                >
                  <FaMusic className="h-5 w-5 mb-1" />
                  <span className="text-xs">Audio</span>
                </motion.button>
                <motion.button
                  className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-800 transition-all"
                  onClick={() => setShowSpeedOptions(!showSpeedOptions)}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaExpand className="h-5 w-5 mb-1" />
                  <span className="text-xs">Speed</span>
                </motion.button>
                <motion.button
                  className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-800 transition-all"
                  whileTap={{ scale: 0.95 }}
                >
                  <FaClock className="h-5 w-5 mb-1" />
                  <span className="text-xs">Timer</span>
                </motion.button>
                <motion.button
                  className="flex flex-col items-center p-2 rounded-lg hover:bg-gray-800 transition-all"
                  onClick={() => setShowFilters(!showFilters)}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaRegSmile className="h-5 w-5 mb-1" />
                  <span className="text-xs">Filters</span>
                </motion.button>
              </div>
            </div>

            {/* Speed options panel */}
            <AnimatePresence>
              {showSpeedOptions && (
                <motion.div
                  className="absolute bottom-20 left-0 right-0 bg-gray-900 rounded-t-3xl p-4"
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold">Video Speed</span>
                    <button onClick={() => setShowSpeedOptions(false)}>
                      <FaChevronDown className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[0.5, 1, 1.5, 2].map((speed) => (
                      <motion.button
                        key={speed}
                        className={`py-3 rounded-lg ${
                          videoSpeed === speed ? "bg-blue-500" : "bg-gray-800"
                        }`}
                        onClick={() => handleSpeedChange(speed)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {speed}x
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Filters panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  className="absolute bottom-20 left-0 right-0 bg-gray-900 rounded-t-3xl p-4 h-1/2"
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold">Filters</span>
                    <button onClick={() => setShowFilters(false)}>
                      <FaChevronDown className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      "Original",
                      "Clarendon",
                      "Juno",
                      "Lark",
                      "Gingham",
                      "Moon",
                      "Perpetua",
                    ].map((filter) => (
                      <motion.div
                        key={filter}
                        className="flex flex-col items-center"
                        whileHover={{ scale: 1.03 }}
                      >
                        <div className="h-16 w-16 rounded-full bg-gray-700 mb-1"></div>
                        <span className="text-xs">{filter}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share sheet */}
      <AnimatePresence>
        {showShareSheet && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-gray-900 rounded-t-3xl p-4 z-30 backdrop-blur-sm"
            initial={{ y: 300 }}
            animate={{ y: 0 }}
            exit={{ y: 300 }}
          >
            <div className="flex justify-between items-center mb-6">
              <span className="font-semibold">Share Reel</span>
              <motion.button
                onClick={() => setShowShareSheet(false)}
                className="p-1 rounded-full hover:bg-gray-800 transition-all"
                whileTap={{ scale: 0.9 }}
              >
                <FaChevronDown className="h-6 w-6" />
              </motion.button>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { icon: <FaEnvelope className="h-6 w-6" />, label: "Direct" },
                { icon: <FaLink className="h-6 w-6" />, label: "Copy Link" },
                {
                  icon: <FaUserPlus className="h-6 w-6" />,
                  label: "Tag Friends",
                },
                { icon: <FaFlag className="h-6 w-6" />, label: "Report" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="bg-gray-700 p-3 rounded-full mb-2 hover:bg-gray-600 transition-all">
                    {item.icon}
                  </div>
                  <span className="text-xs">{item.label}</span>
                </motion.div>
              ))}
            </div>

            <div className="space-y-2">
              <motion.button
                className="w-full bg-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all"
                whileTap={{ scale: 0.98 }}
              >
                Add Reel to Your Story
              </motion.button>
              <motion.button
                className="w-full bg-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all"
                whileTap={{ scale: 0.98 }}
              >
                Share to Feed
              </motion.button>
              <motion.button
                className="w-full bg-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all"
                whileTap={{ scale: 0.98 }}
              >
                Save Link
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio details */}
      <AnimatePresence>
        {showAudioDetails && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-gray-900 rounded-t-3xl p-4 z-30 backdrop-blur-sm"
            initial={{ y: 300 }}
            animate={{ y: 0 }}
            exit={{ y: 300 }}
          >
            <div className="flex justify-between items-center mb-6">
              <span className="font-semibold">Audio Details</span>
              <motion.button
                onClick={() => setShowAudioDetails(false)}
                className="p-1 rounded-full hover:bg-gray-800 transition-all"
                whileTap={{ scale: 0.9 }}
              >
                <FaChevronDown className="h-6 w-6" />
              </motion.button>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-gray-700 p-4 rounded-lg">
                <FaMusic
                  className="h-8 w-8 animate-spin"
                  style={{ animationDuration: "3s" }}
                />
              </div>
              <div>
                <p className="font-semibold">
                  {reels[currentReelIndex]?.audio.title}
                </p>
                <p className="text-gray-400 text-sm">
                  {reels[currentReelIndex]?.audio.artist}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <motion.button
                className="w-full bg-gray-800 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-gray-700 transition-all"
                whileTap={{ scale: 0.98 }}
              >
                <FaMusic className="h-5 w-5" />
                <span>Use This Sound</span>
              </motion.button>
              <motion.button
                className="w-full bg-gray-800 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-gray-700 transition-all"
                whileTap={{ scale: 0.98 }}
              >
                <FaBookmark className="h-5 w-5" />
                <span>Save to Favorites</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile preview */}
      <AnimatePresence>
        {showProfilePreview && (
          <motion.div
            className="absolute top-0 bottom-0 left-0 right-0 bg-black bg-opacity-90 z-30 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-900 rounded-xl p-6 w-full max-w-sm"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="flex justify-between items-center mb-6">
                <span className="font-semibold">Profile</span>
                <motion.button
                  onClick={() => setShowProfilePreview(null)}
                  className="p-1 rounded-full hover:bg-gray-800 transition-all"
                  whileTap={{ scale: 0.9 }}
                >
                  <FaChevronDown className="h-6 w-6" />
                </motion.button>
              </div>

              <div className="flex flex-col items-center mb-6">
                <motion.img
                  src={showProfilePreview.avatar}
                  alt={showProfilePreview.username}
                  className="h-20 w-20 rounded-full mb-4 object-cover"
                  whileHover={{ scale: 1.05 }}
                />
                <p className="font-semibold text-lg">
                  @{showProfilePreview.username}
                </p>
                {showProfilePreview.isVerified && (
                  <div className="flex items-center mt-1 text-blue-400">
                    <RiVerifiedBadgeFill className="h-4 w-4 mr-1" />
                    <span className="text-xs">Verified</span>
                  </div>
                )}
              </div>

              <div className="flex justify-around mb-6">
                <div className="flex flex-col items-center">
                  <span className="font-semibold">1,234</span>
                  <span className="text-gray-400 text-xs">Posts</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-semibold">12.3M</span>
                  <span className="text-gray-400 text-xs">Followers</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="font-semibold">45</span>
                  <span className="text-gray-400 text-xs">Following</span>
                </div>
              </div>

              <div className="space-y-2">
                <motion.button
                  className="w-full bg-gradient-to-r from-pink-500 to-orange-500 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  whileTap={{ scale: 0.98 }}
                >
                  Follow
                </motion.button>
                <motion.button
                  className="w-full bg-gray-800 py-2 rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-gray-700 transition-all"
                  whileTap={{ scale: 0.98 }}
                >
                  <FaEnvelope className="h-5 w-5" />
                  <span>Message</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper function to format numbers
function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

export default ReelsPage;
