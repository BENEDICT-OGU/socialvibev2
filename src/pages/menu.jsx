import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome, FiSearch, FiPlusSquare, FiMessageCircle, FiBell, FiFilm,
  FiUser, FiMoreHorizontal, FiSun, FiMoon, FiCloud, FiShoppingCart,
  FiCamera, FiMap, FiX, FiMenu, FiSettings, FiBookmark, FiUsers,
  FiCalendar, FiMusic, FiRadio, FiTrendingUp, FiAward, FiHeart,
  FiStar, FiCreditCard, FiLock, FiHelpCircle, FiDownload, FiUpload,
  FiWifi, FiBluetooth, FiBattery, FiPieChart, FiBarChart2, FiBook,
  FiCoffee, FiGift, FiZap, FiGlobe, FiNavigation, FiMail, FiKey
} from "react-icons/fi";
import { 
  FaRobot, FaGamepad, FaRegLightbulb, FaRegMoneyBillAlt,
  FaRegNewspaper, FaRegClock, FaRegCalendarAlt, FaRegUserCircle,
  FaRegCompass, FaRegChartBar, FaRegFileAlt, FaRegImages,
  FaRegFileAudio, FaRegFileVideo, FaRegFileCode
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { BsPalette, BsEmojiSmile, BsQrCode } from "react-icons/bs";
import { IoMdNotificationsOutline } from "react-icons/io";
import { RiLiveLine } from "react-icons/ri";

const featureCategories = [
  {
    id: "social",
    name: "Social",
    features: [
      { icon: <FiHome size={20} />, label: "Home", to: "/" },
      { icon: <FiSearch size={20} />, label: "Search", to: "/search" },
      { icon: <FiFilm size={20} />, label: "Reels", to: "/reels" },
      { icon: <FiMessageCircle size={20} />, label: "Messages", to: "/message" },
      { icon: <IoMdNotificationsOutline size={20} />, label: "Notifications", to: "/notifications" },
      { icon: <FiPlusSquare size={20} />, label: "Create Post", to: "/createPost" },
      { icon: <FiUser size={20} />, label: "Profile", to: "/profile" },
      { icon: <FiUsers size={20} />, label: "Friends", to: "/friends" },
      { icon: <RiLiveLine size={20} />, label: "Live", to: "/live" },
      { icon: <BsEmojiSmile size={20} />, label: "Stories", to: "/stories" }
    ]
  },
  {
    id: "entertainment",
    name: "Entertainment",
    features: [
      { icon: <FaGamepad size={20} />, label: "Games", to: "/games" },
      { icon: <FiMusic size={20} />, label: "Music", to: "/music" },
      { icon: <FiFilm size={20} />, label: "Movies", to: "/movies" },
      { icon: <FaRegFileVideo size={20} />, label: "Videos", to: "/videos" },
      { icon: <FiRadio size={20} />, label: "Radio", to: "/radio" },
      { icon: <FiTrendingUp size={20} />, label: "Trending", to: "/trending" },
      { icon: <FaRegLightbulb size={20} />, label: "Shorts", to: "/shorts" }
    ]
  },
  {
    id: "productivity",
    name: "Productivity",
    features: [
      { icon: <FiCalendar size={20} />, label: "Calendar", to: "/calendar" },
      { icon: <FaRegClock size={20} />, label: "Reminders", to: "/reminders" },
      { icon: <FaRegFileAlt size={20} />, label: "Notes", to: "/notes" },
      { icon: <FiBook size={20} />, label: "Books", to: "/books" },
      { icon: <FaRegNewspaper size={20} />, label: "News", to: "/news" },
      { icon: <FaRegChartBar size={20} />, label: "Statistics", to: "/stats" }
    ]
  },
  {
    id: "creative",
    name: "Creative",
    features: [
      { icon: <FiCamera size={20} />, label: "Camera", to: "/camera" },
      { icon: <BsPalette size={20} />, label: "Art", to: "/art" },
      { icon: <FaRegImages size={20} />, label: "Gallery", to: "/gallery" },
      { icon: <FaRegFileCode size={20} />, label: "Code", to: "/code" },
      { icon: <FaRegFileAudio size={20} />, label: "Audio", to: "/audio" }
    ]
  },
  {
    id: "finance",
    name: "Finance",
    features: [
      { icon: <FaRegMoneyBillAlt size={20} />, label: "Wallet", to: "/wallet" },
      { icon: <FiCreditCard size={20} />, label: "Payments", to: "/payments" },
      { icon: <FiPieChart size={20} />, label: "Invest", to: "/invest" },
      { icon: <FiBarChart2 size={20} />, label: "Stocks", to: "/stocks" }
    ]
  },
  {
    id: "utilities",
    name: "Utilities",
    features: [
      { icon: <FiCloud size={20} />, label: "Weather", to: "/weather" },
      { icon: <FiMap size={20} />, label: "Maps", to: "/maps" },
      { icon: <FaRobot size={20} />, label: "AI Assistant", to: "/ai-assistant" },
      { icon: <FiShoppingCart size={20} />, label: "Marketplace", to: "/marketplace" },
      { icon: <BsQrCode size={20} />, label: "QR Scanner", to: "/qr-scanner" },
      { icon: <FiGlobe size={20} />, label: "Browser", to: "/browser" },
      { icon: <FiNavigation size={20} />, label: "Navigation", to: "/navigation" },
      { icon: <FiMail size={20} />, label: "Email", to: "/email" },
      { icon: <FiLock size={20} />, label: "Security", to: "/security" },
      { icon: <FiHelpCircle size={20} />, label: "Help", to: "/help" }
    ]
  }
];

export default function MegaMobileMenu({ darkMode, toggleDarkMode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("social");
  const [searchQuery, setSearchQuery] = useState("");
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const filteredFeatures = featureCategories
  .find(cat => cat.id === activeCategory)?.features
  .filter(feature => 
    feature.label.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const quickActions = [
    { icon: <FiPlusSquare size={20} />, label: "Post", action: () => navigate("/createPost") },
    { icon: <FiSearch size={20} />, label: "Search", action: () => navigate("/search") },
    { icon: <FiMessageCircle size={20} />, label: "Chat", action: () => navigate("/message") },
    { icon: <FiCamera size={20} />, label: "Camera", action: () => navigate("/camera") },
    { icon: <FiCalendar size={20} />, label: "Events", action: () => navigate("/event") },
    { icon: <FaRegLightbulb size={20} />, label: "Ideas", action: () => navigate("/ideas") }
  ];

  const premiumFeatures = [
    { icon: <FiZap size={20} />, label: "Boost Posts", desc: "Reach more people" },
    { icon: <FiStar size={20} />, label: "Verified Badge", desc: "Get recognized" },
    { icon: <FaRegUserCircle size={20} />, label: "Custom Profile", desc: "Stand out" },
    { icon: <FiAward size={20} />, label: "Exclusive Content", desc: "Premium only" }
  ];

  return (
    <div className=" transition-colors duration-300 min-h-screen ">
      {/* Header */}
      <header className={`flex items-center justify-between p-4 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm sticky top-0 z-10`}>
        <button onClick={toggleMenu} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
        
        <h1 className="text-xl font-bold text-pink-500">MENU</h1>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setShowPremiumModal(true)}
            className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-pink-500 text-white text-xs font-bold rounded-full"
          >
            PRO
          </button>
          <button 
            onClick={toggleDarkMode} 
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 overflow-y-auto h-[calc(100vh-56px)] pb-20">
        {/* Search Bar */}
        <div className="relative mb-6">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-full ${darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-gray-900"}`}
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action, idx) => (
              <motion.button
                key={idx}
                whileTap={{ scale: 0.95 }}
                onClick={action.action}
                className={`flex flex-col items-center justify-center p-3 rounded-xl ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}`}
              >
                {action.icon}
                <span className="text-xs mt-1">{action.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Categories</h2>
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {featureCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
                  activeCategory === category.id
                    ? "bg-pink-500 text-white"
                    : darkMode
                    ? "bg-gray-700 text-gray-300"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div>
          <h2 className="text-lg font-semibold mb-3">
            {featureCategories.find(cat => cat.id === activeCategory)?.name || "Features"}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {filteredFeatures.map((feature, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to={feature.to}
                  className={`flex flex-col items-center p-4 rounded-xl ${
                    location.pathname === feature.to
                      ? "bg-pink-500 text-white"
                      : darkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-100 hover:bg-gray-200"
                  } transition-colors duration-200`}
                >
                  <div className={`mb-2 p-3 rounded-full ${
                    darkMode ? "bg-gray-600" : "bg-gray-200"
                  }`}>
                    {feature.icon}
                  </div>
                  <span className="text-sm font-medium text-center">{feature.label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Recent Activity</h2>
          <div className={`p-4 rounded-xl ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
            <div className="flex items-center space-x-3 mb-2">
              <FiUser className="text-pink-500" />
              <span>You liked 3 new posts</span>
            </div>
            <div className="flex items-center space-x-3 mb-2">
              <FiMessageCircle className="text-pink-500" />
              <span>2 new messages</span>
            </div>
            <div className="flex items-center space-x-3">
              <FiBell className="text-pink-500" />
              <span>5 new notifications</span>
            </div>
          </div>
        </div>
      </main>

      {/* Premium Modal */}
      <AnimatePresence>
        {showPremiumModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 min-h-screen"
            onClick={() => setShowPremiumModal(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={` max-w-md rounded-2xl overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
                    Upgrade to PRO
                  </h3>
                  <p className="text-sm opacity-75 mt-2">Unlock exclusive features and benefits</p>
                </div>
                
                <div className="space-y-4 mb-6">
                  {premiumFeatures.map((feature, idx) => (
                    <div key={idx} className="flex items-start space-x-3">
                      <div className="p-2 rounded-full bg-pink-500 text-white">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold">{feature.label}</h4>
                        <p className="text-sm opacity-75">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col space-y-3">
                  <button className="w-full py-3 bg-gradient-to-r from-yellow-400 to-pink-500 text-white font-bold rounded-full">
                    $4.99/month
                  </button>
                  <button className="w-full py-3 bg-gray-200 dark:bg-gray-700 font-bold rounded-full">
                    $49.99/year (Save 20%)
                  </button>
                  <button 
                    onClick={() => setShowPremiumModal(false)}
                    className="w-full py-3 text-pink-500 font-bold rounded-full"
                  >
                    Not Now
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Screen Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed inset-0 z-50 ${darkMode ? "bg-gray-900" : "bg-white"} p-4`}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-pink-500">Menu</h2>
              <button onClick={closeMenu} className="p-2">
                <FiX size={24} />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Profile Section */}
              <div className={`p-4 rounded-xl ${darkMode ? "bg-gray-800" : "bg-gray-100"} bg-red`}>
                <div className="flex items-center space-x-3 mb-4">
                  <img 
                    src="https://i.pravatar.cc/150?img=5" 
                    alt="Profile" 
                    className="w-12 h-12 rounded-full border-2 border-pink-500"
                  />
                  <div>
                    <h3 className="font-bold">Alex Johnson</h3>
                    <p className="text-sm opacity-70">@alexjohnson</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <button className="text-xs p-2 rounded-lg bg-black bg-opacity-10">
                    <span className="block font-bold">142</span>
                    <span>Posts</span>
                  </button>
                  <button className="text-xs p-2 rounded-lg bg-black bg-opacity-10">
                    <span className="block font-bold">1.2K</span>
                    <span>Followers</span>
                  </button>
                  <button className="text-xs p-2 rounded-lg bg-black bg-opacity-10">
                    <span className="block font-bold">543</span>
                    <span>Following</span>
                  </button>
                </div>
              </div>
              
              {/* Settings Section */}
              <div className={`p-4 rounded-xl ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                <h3 className="font-bold mb-3">Settings</h3>
                <div className="space-y-2">
                  <button 
                    onClick={toggleDarkMode}
                    className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
                    {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
                  </button>
                  <button className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
                    <span>Notifications</span>
                    <FiBell size={18} />
                  </button>
                  <button className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
                    <span>Privacy</span>
                    <FiLock size={18} />
                  </button>
                  <button className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
                    <span>Account</span>
                    <FiUser size={18} />
                  </button>
                </div>
              </div>
              
              {/* More Options */}
              <div className={`p-4 rounded-xl ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
                <h3 className="font-bold mb-3">More Options</h3>
                <div className="space-y-2">
                  <button className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
                    <span>Saved</span>
                    <FiBookmark size={18} />
                  </button>
                  <button className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
                    <span>Switch Account</span>
                    <FiUsers size={18} />
                  </button>
                  <button className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
                    <span>Help Center</span>
                    <FiHelpCircle size={18} />
                  </button>
                  <button className="flex items-center justify-between w-full p-2 text-red-500 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
                    <span>Log Out</span>
                    <FiKey size={18} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}