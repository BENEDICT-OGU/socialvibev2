import { useState, useContext, useEffect } from "react";
import horror from "../assets/images/horror.png";
import { 
  FaUserPlus, FaFire, FaUserFriends, FaRegBell, FaCog, FaSearch, 
  FaHashtag, FaEllipsisH, FaCheck, FaTimes, FaCompass, FaPlus, 
  FaChartLine, FaComment, FaHeart, FaRegBookmark, 
  FaMusic, FaVideo, FaImage, FaPoll, FaCalendarAlt, FaLightbulb,
  FaRegSmile, FaLink, FaRegCalendar, FaRegSun, FaRegStar,
  FaRegChartBar, FaRegEnvelope, FaRegDotCircle, FaRegThumbsUp,
  FaRegShareSquare, FaRegCommentDots, FaRegUser, FaRegListAlt,
  FaRegBellSlash, FaRegClock, FaRegPaperPlane, FaRegGem
} from "react-icons/fa";
import { AuthContext } from "../AuthContext";
import { Link,  useLocation, useNavigate  } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Mock API functions
const fetchAllData = async () => {
  // In a real app, these would be API calls
  return {
    trendingHashtags: [
      { tag: "Poetry", posts: 1250000, isNew: false, isTrending: true },
      { tag: "Love", posts: 9800000, isNew: false, isTrending: true },
      { tag: "Tech", posts: 3200000, isNew: true, isTrending: false },
      { tag: "Foodie", posts: 5600000, isNew: false, isTrending: true },
      { tag: "Travel", posts: 3400000, isNew: true, isTrending: false },
    ],
    suggestedUsers: [
      { id: 1, name: "lisa", avatar: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png", mutuals: 3, isVerified: true, online: true },
      { id: 2, name: "samuel", avatar: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png", mutuals: 5, online: false },
      { id: 3, name: "emma", avatar: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png", mutuals: 2, isVerified: true, online: true },
      { id: 4, name: "david", avatar: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png", mutuals: 4, online: false },
      { id: 5, name: "olivia", avatar: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png", mutuals: 1, online: true },
    ],
    friendRequests: [
      { id: 6, name: "new_user", avatar: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png", time: "2h ago", mutuals: 0 },
      { id: 7, name: "creative_soul", avatar: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png", time: "5h ago", mutuals: 2 },
    ],
    notifications: [
      { id: 1, type: "like", user: "maya_reads", time: "5m ago", read: false },
      { id: 2, type: "follow", user: "johnny", time: "1h ago", read: true },
      { id: 3, type: "comment", user: "alex", text: "Nice shot!", time: "3h ago", read: true },
      { id: 4, type: "mention", user: "susan", time: "1d ago", read: false },
    ],
    trendingContent: [
      { id: 1, type: "challenge", title: "#30DayFitness", participants: 1200000 },
      { id: 2, type: "song", title: "Summer Vibes", artist: "DJ Cool", plays: 4500000 },
      { id: 3, type: "filter", title: "Golden Hour", uses: 3200000 },
    ],
    analytics: {
      followers: 1243,
      growth: "+124 this week",
      engagement: "8.7%",
      topPost: { likes: 342, comments: 28 },
      activeTime: "4-6 PM",
    },
    quickActions: [
      { icon: <FaPlus />, label: "Create Post", to: "/create" },
      { icon: <FaVideo />, label: "Create Reel", to: "/createreel" },
      { icon: <FaRegClock />, label: "Create Story", to: "/createstory" },
      { icon: <FaPoll />, label: "Create Poll" },
    ],
    recentChats: [
      { id: 1, user: "maya_reads", avatar: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png", message: "Hey, check this out!", time: "2m ago", unread: true },
      { id: 2, user: "johnny", avatar: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png", message: "Thanks for the follow!", time: "1h ago", unread: false },
    ]
  };
};

const users = [
  { id: 1, name: "maya_reads", avatar: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png", hasNewStory: true },
  { id: 2, name: "johnny", avatar: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png", hasNewStory: false },
  { id: 3, name: "susan", avatar: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png", hasNewStory: true },
  { id: 4, name: "alex", avatar: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png", hasNewStory: false },
  { id: 5, name: "lisa", avatar: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png", hasNewStory: true },
];

export function StoriesBar({ onStoryClick }) {
  return (
    <section className="mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">
      <div className="flex justify-between items-center px-4 mb-3">
        <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100">Stories</h2>
        <button className="text-xs text-blue-500 font-medium hover:underline">See All</button>
      </div>
      <div className="flex space-x-4 overflow-x-auto px-4 pb-2 scrollbar-hide">
        {users.map((user) => (
          <motion.div 
            key={user.id} 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onStoryClick(user.id)} 
            className="cursor-pointer flex flex-col items-center flex-shrink-0"
          >
            <div className={`p-[2px] rounded-full ${user.hasNewStory ? 
              "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600" : 
              "bg-gray-300 dark:bg-gray-600"}`}>
              <div className="relative">
                <img
                  src={user?.avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
                  className="w-16 h-16 rounded-full border-4 border-white dark:border-gray-900"
                  alt={user.name}
                />
                {user.hasNewStory && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center">
                    <span className="text-white text-xs">+</span>
                  </div>
                )}
              </div>
            </div>
            <span className="text-xs mt-1 text-gray-600 dark:text-gray-300 truncate w-16 text-center">{user.name}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default function RightSidebar({ onStoryClick }) {
  const { user, darkMode } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("discovery");
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetchAllData();
        setData(response);
      } catch (error) {
        console.error("Failed to fetch sidebar data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    
    // Set up refresh interval (every 5 minutes)
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, []);

  const handleFollow = (userId) => {
    setData(prev => ({
      ...prev,
      suggestedUsers: prev.suggestedUsers.map(user => 
        user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
      )
    }));
  };

  const handleFriendRequest = (requestId, action) => {
    setData(prev => ({
      ...prev,
      friendRequests: prev.friendRequests.filter(req => req.id !== requestId)
    }));
  };

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (isLoading || !data) {
    return (
      <div className="hidden lg:block w-80 fixed right-0 top-0 h-screen border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-gray-900 dark:text-gray-100 overflow-y-auto z-40 custom-scrollbar">
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden lg:block w-96 fixed right-0 top-0 h-screen border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-gray-900 dark:text-gray-100 overflow-y-auto z-40 custom-scrollbar">
      {/* User Profile Quick Info */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={user?.avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} 
              alt="profile" 
              className="w-12 h-12 rounded-full border-2 border-pink-500" 
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
          </div>
          <div>
            <h3 className="font-bold text-base">{user?.name || "Your Name"}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">@{user?.username || "username"}</p>
          </div>
        </div>
        <Link to="/settings">
          <motion.button 
            whileHover={{ rotate: 30 }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
          >
            <FaCog className="text-lg" />
          </motion.button>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-800 grid grid-cols-4 gap-2">
        {data.quickActions.map((action, idx) => (
          <motion.button
            key={idx}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <div className="text-blue-500 text-lg">{action.icon}</div>
            <span className="text-xs mt-1 text-gray-700 dark:text-gray-300">{action.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Search */}
      <div className="px-5 py-3 border-b border-gray-200 dark:border-gray-800">
        <div className="relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search people, hashtags, trends..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-black rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Stories */}
      <StoriesBar onStoryClick={onStoryClick} />

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveTab("discovery")}
          className={`flex-1 py-3 text-sm font-medium ${activeTab === "discovery" ? 
            "text-blue-500 border-b-2 border-blue-500" : 
            "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}
        >
          <FaCompass className="inline-block mr-1" /> Discover
        </button>
        <button
          onClick={() => setActiveTab("social")}
          className={`flex-1 py-3 text-sm font-medium ${activeTab === "social" ? 
            "text-blue-500 border-b-2 border-blue-500" : 
            "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}
        >
          <FaUserFriends className="inline-block mr-1" /> Social
        </button>
        <button
          onClick={() => setActiveTab("tools")}
          className={`flex-1 py-3 text-sm font-medium ${activeTab === "tools" ? 
            "text-blue-500 border-b-2 border-blue-500" : 
            "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}
        >
          <FaRegStar className="inline-block mr-1" /> Tools
        </button>
      </div>

      {/* Tab Content */}
      <div className="overflow-y-auto flex-1">
        {activeTab === "discovery" && (
          <div className="space-y-4">
            {/* User Discovery */}
            <div className="px-5 pt-4">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection("userDiscovery")}
              >
                <h2 className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <FaUserPlus className="text-green-500" /> People to Discover
                </h2>
                <motion.div
                  animate={{ rotate: expandedSection === "userDiscovery" ? 180 : 0 }}
                >
                  <FaEllipsisH className="text-gray-400" />
                </motion.div>
              </div>
              
              <AnimatePresence>
                {expandedSection === "userDiscovery" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 space-y-4 overflow-hidden"
                  >
                    {data.suggestedUsers.map((user) => (
                      <motion.div 
                        key={user.id}
                        whileHover={{ scale: 1.01 }}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img 
                              src={user.avatar} 
                              className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800" 
                              alt={user.name} 
                            />
                            {user.isVerified && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                <FaCheck className="text-white text-xs" />
                              </div>
                            )}
                            {user.online && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{user.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {user.mutuals} mutual friends
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleFollow(user.id)}
                          className={`text-xs px-3 py-1.5 rounded-full font-medium ${
                            user.isFollowing 
                              ? "bg-gray-200 dark:bg-black text-gray-700 dark:text-gray-200"
                              : "bg-blue-500 text-white hover:bg-blue-600"
                          }`}
                        >
                          {user.isFollowing ? "Following" : "Follow"}
                        </button>
                      </motion.div>
                    ))}
                    <div className="text-center">
                      <button className="text-xs text-blue-500 font-medium hover:underline">
                        Show More Suggestions
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Trending Content */}
            <div className="px-5 pt-2">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection("trendingContent")}
              >
                <h2 className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <FaFire className="text-orange-500" /> Trending Now
                </h2>
                <motion.div
                  animate={{ rotate: expandedSection === "trendingContent" ? 180 : 0 }}
                >
                  <FaEllipsisH className="text-gray-400" />
                </motion.div>
              </div>
              
              <AnimatePresence>
                {expandedSection === "trendingContent" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 space-y-3 overflow-hidden"
                  >
                    {data.trendingHashtags.map((hashtag, idx) => (
                      <motion.div 
                        key={`hashtag-${idx}`}
                        whileHover={{ x: 5 }}
                        className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
                            <FaHashtag className="text-blue-500" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-gray-100">#{hashtag.tag}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {hashtag.posts.toLocaleString()} posts
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {hashtag.isNew && (
                            <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                              New
                            </span>
                          )}
                          {hashtag.isTrending && (
                            <span className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded-full">
                              Trending
                            </span>
                          )}
                        </div>
                      </motion.div>
                    ))}

                    {data.trendingContent.map((content) => (
                      <motion.div
                        key={`content-${content.id}`}
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                      >
                        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-full">
                          {content.type === "song" ? (
                            <FaMusic className="text-purple-500" />
                          ) : content.type === "challenge" ? (
                            <FaRegThumbsUp className="text-purple-500" />
                          ) : (
                            <FaRegStar className="text-purple-500" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-gray-100">{content.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {content.type === "song" ? `${content.plays.toLocaleString()} plays` : 
                             content.type === "challenge" ? `${content.participants.toLocaleString()} participants` : 
                             `${content.uses.toLocaleString()} uses`}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Categories */}
            <div className="px-5 pt-2">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection("categories")}
              >
                <h2 className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <FaRegListAlt className="text-yellow-500" /> Explore Categories
                </h2>
                <motion.div
                  animate={{ rotate: expandedSection === "categories" ? 180 : 0 }}
                >
                  <FaEllipsisH className="text-gray-400" />
                </motion.div>
              </div>
              
              <AnimatePresence>
                {expandedSection === "categories" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 overflow-hidden"
                  >
                    <div className="grid grid-cols-3 gap-2">
                      {['Fashion', 'Music', 'Travel', 'Food', 'Tech', 'Art', 'Fitness', 'Gaming', 'Books'].map((category) => (
                        <motion.button
                          key={category}
                          whileHover={{ scale: 1.05 }}
                          className="p-2 bg-gray-100 dark:bg-black rounded-lg text-sm font-medium"
                        >
                          {category}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {activeTab === "social" && (
          <div className="space-y-4">
            {/* Friend Requests */}
            <div className="px-5 pt-4">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection("friendRequests")}
              >
                <h2 className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <FaUserFriends className="text-green-500" /> Friend Requests
                  {data.friendRequests.length > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {data.friendRequests.length}
                    </span>
                  )}
                </h2>
                <motion.div
                  animate={{ rotate: expandedSection === "friendRequests" ? 180 : 0 }}
                >
                  <FaEllipsisH className="text-gray-400" />
                </motion.div>
              </div>
              
              <AnimatePresence>
                {expandedSection === "friendRequests" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 space-y-3 overflow-hidden"
                  >
                    {data.friendRequests.length > 0 ? (
                      data.friendRequests.map((request) => (
                        <motion.div 
                          key={request.id}
                          whileHover={{ scale: 1.01 }}
                          className="flex items-center justify-between bg-gray-50 dark:bg-black p-3 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <img 
                              src={request.avatar} 
                              className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800" 
                              alt={request.name} 
                            />
                            <div>
                              <p className="font-semibold text-sm">{request.name}</p>
                              <div className="flex gap-2">
                                {request.mutuals > 0 && (
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {request.mutuals} mutual friends
                                  </p>
                                )}
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {request.time}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <motion.button 
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleFriendRequest(request.id, "accept")}
                              className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center"
                            >
                              <FaCheck className="text-xs" />
                            </motion.button>
                            <motion.button 
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleFriendRequest(request.id, "ignore")}
                              className="w-8 h-8 bg-gray-200 dark:bg-black text-gray-700 dark:text-gray-200 rounded-full flex items-center justify-center"
                            >
                              <FaTimes className="text-xs" />
                            </motion.button>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                        No pending requests
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications */}
            <div className="px-5 pt-2">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection("notifications")}
              >
                <h2 className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <FaRegBell className="text-yellow-500" /> Notifications
                  {data.notifications.filter(n => !n.read).length > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {data.notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </h2>
                <motion.div
                  animate={{ rotate: expandedSection === "notifications" ? 180 : 0 }}
                >
                  <FaEllipsisH className="text-gray-400" />
                </motion.div>
              </div>
              
              <AnimatePresence>
                {expandedSection === "notifications" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 space-y-3 overflow-hidden"
                  >
                    {data.notifications.length > 0 ? (
                      data.notifications.map((notification) => (
                        <motion.div 
                          key={notification.id}
                          whileHover={{ scale: 1.01 }}
                          className={`flex items-start gap-3 p-3 rounded-lg ${
                            !notification.read ? "bg-blue-50 dark:bg-blue-900/30" : "bg-gray-50 dark:bg-black"
                          }`}
                        >
                          <div className={`mt-1 w-2 h-2 rounded-full ${
                            !notification.read ? "bg-blue-500" : "bg-transparent"
                          }`}></div>
                          <div>
                            <p className="text-sm">
                              <span className="font-semibold">{notification.user}</span>{" "}
                              {notification.type === "like" && "liked your post"}
                              {notification.type === "follow" && "started following you"}
                              {notification.type === "comment" && `commented: "${notification.text}"`}
                              {notification.type === "mention" && "mentioned you in a post"}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                        No new notifications
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Recent Chats */}
            <div className="px-5 pt-2">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection("recentChats")}
              >
                <h2 className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <FaComment className="text-blue-500" /> Recent Chats
                </h2>
                <motion.div
                  animate={{ rotate: expandedSection === "recentChats" ? 180 : 0 }}
                >
                  <FaEllipsisH className="text-gray-400" />
                </motion.div>
              </div>
              
              <AnimatePresence>
                {expandedSection === "recentChats" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 space-y-3 overflow-hidden"
                  >
                    {data.recentChats.map((chat) => (
                      <motion.div
                        key={chat.id}
                        whileHover={{ scale: 1.01 }}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                      >
                        <div className="relative">
                          <img 
                            src={chat.avatar} 
                            className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800" 
                            alt={chat.user} 
                          />
                          {chat.unread && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">!</span>
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <p className="font-semibold text-sm">{chat.user}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{chat.time}</p>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{chat.message}</p>
                        </div>
                      </motion.div>
                    ))}
                    <div className="text-center pt-2">
                      <button className="text-xs text-blue-500 font-medium hover:underline">
                        View All Messages
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {activeTab === "tools" && (
          <div className="space-y-4">
            {/* Analytics */}
            <div className="px-5 pt-4">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection("analytics")}
              >
                <h2 className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <FaChartLine className="text-purple-500" /> Your Analytics
                </h2>
                <motion.div
                  animate={{ rotate: expandedSection === "analytics" ? 180 : 0 }}
                >
                  <FaEllipsisH className="text-gray-400" />
                </motion.div>
              </div>
              
              <AnimatePresence>
                {expandedSection === "analytics" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 space-y-3 overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Followers</p>
                        <p className="font-bold text-xl">{data.analytics.followers}</p>
                        <p className="text-xs text-green-500">{data.analytics.growth}</p>
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Engagement</p>
                        <p className="font-bold text-xl">{data.analytics.engagement}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Avg. rate</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-black p-3 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Top Post</p>
                      <div className="flex justify-between mt-1">
                        <div>
                          <p className="font-semibold">{data.analytics.topPost.likes} likes</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{data.analytics.topPost.comments} comments</p>
                        </div>
                        <button className="text-xs text-blue-500 hover:underline">View</button>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-black p-3 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Best time to post</p>
                      <p className="font-semibold mt-1">{data.analytics.activeTime}</p>
                    </div>
                    <div className="text-center">
                      <button className="text-xs text-blue-500 font-medium hover:underline">
                        View Full Analytics
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Post Tools */}
            <div className="px-5 pt-2">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection("postTools")}
              >
                <h2 className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <FaPlus className="text-green-500" /> Post Creation Tools
                </h2>
                <motion.div
                  animate={{ rotate: expandedSection === "postTools" ? 180 : 0 }}
                >
                  <FaEllipsisH className="text-gray-400" />
                </motion.div>
              </div>
              
              <AnimatePresence>
                {expandedSection === "postTools" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 overflow-hidden"
                  >
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { icon: <FaImage />, label: "Photo", color: "bg-blue-100 dark:bg-blue-900/20 text-blue-500" },
                        { icon: <FaVideo />, label: "Video", color: "bg-red-100 dark:bg-red-900/20 text-red-500" },
                        { icon: <FaPoll />, label: "Poll", color: "bg-green-100 dark:bg-green-900/20 text-green-500" },
                        { icon: <FaRegSmile />, label: "Mood", color: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-500" },
                        { icon: <FaLink />, label: "Link", color: "bg-purple-100 dark:bg-purple-900/20 text-purple-500" },
                        { icon: <FaCalendarAlt />, label: "Event", color: "bg-pink-100 dark:bg-pink-900/20 text-pink-500" },
                        { icon: <FaRegClock />, label: "Schedule", color: "bg-indigo-100 dark:bg-indigo-900/20 text-indigo-500" },
                        { icon: <FaLightbulb />, label: "Idea", color: "bg-orange-100 dark:bg-orange-900/20 text-orange-500" },
                        { icon: <FaRegBookmark />, label: "Drafts", color: "bg-gray-100 dark:bg-gray-800 text-gray-500" },
                      ].map((tool, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ scale: 1.05 }}
                          className={`flex flex-col items-center p-2 rounded-lg ${tool.color}`}
                        >
                          <div className="text-lg">{tool.icon}</div>
                          <span className="text-xs mt-1">{tool.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* AI Assistant */}
            <div className="px-5 pt-2 pb-4">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleSection("aiAssistant")}
              >
                <h2 className="font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                  <FaRegGem className="text-teal-500" /> AI Assistant
                </h2>
                <motion.div
                  animate={{ rotate: expandedSection === "aiAssistant" ? 180 : 0 }}
                >
                  <FaEllipsisH className="text-gray-400" />
                </motion.div>
              </div>
              
              <AnimatePresence>
                {expandedSection === "aiAssistant" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 space-y-3 overflow-hidden"
                  >
                    <div className="bg-gray-50 dark:bg-black p-3 rounded-lg">
                      <p className="text-sm font-semibold">Post Idea Generator</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Get personalized content ideas</p>
                      <button className="mt-2 text-xs bg-blue-500 text-white px-3 py-1 rounded-full">
                        Generate Ideas
                      </button>
                    </div>
                    <div className="bg-gray-50 dark:bg-black p-3 rounded-lg">
                      <p className="text-sm font-semibold">Hashtag Suggestions</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Get trending hashtags for your posts</p>
                      <button className="mt-2 text-xs bg-purple-500 text-white px-3 py-1 rounded-full">
                        Get Hashtags
                      </button>
                    </div>
                    <div className="bg-gray-50 dark:bg-black p-3 rounded-lg">
                      <p className="text-sm font-semibold">Caption Writer</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Create engaging captions</p>
                      <button className="mt-2 text-xs bg-green-500 text-white px-3 py-1 rounded-full">
                        Write Caption
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

