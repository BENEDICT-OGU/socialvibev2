import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FiHome, FiUser, FiSettings, FiBookmark, FiUsers, 
  FiCalendar, FiMessageCircle, FiBell, FiHelpCircle,
  FiMoon, FiSun, FiLogOut, FiFlag, FiClock, FiStar,
  FiGrid, FiVideo, FiShoppingBag, FiGift, FiHeart, FiSearch,
  FiPlus, FiChevronRight, FiChevronDown, FiAward, FiTrendingUp,
  FiMusic, FiCamera, FiMap, FiDollarSign, FiLock, FiShield
} from 'react-icons/fi';
import { 
  FaUserFriends, FaStore, FaGamepad, FaHistory,
  FaRegClock, FaRegBookmark, FaRegCalendarAlt, 
  FaRegQuestionCircle, FaBars, FaRocket, FaPalette, 
  FaMicrophone, FaQrcode, FaCrown, FaGem, FaChartLine
} from 'react-icons/fa';
import { 
  IoMdNotificationsOutline, IoMdColorPalette 
} from 'react-icons/io';
import { 
  RiLiveLine, RiEmotionHappyLine, RiFeedbackLine,
  RiVipCrownLine, RiFlashlightLine
} from 'react-icons/ri';
import { 
  BsFillLightningFill, BsFillChatSquareQuoteFill, 
  BsThreeDots, BsGearFill, BsFillCreditCardFill
} from 'react-icons/bs';
import { 
  motion, AnimatePresence, useScroll, useTransform 
} from 'framer-motion';
import { useAuth } from '../AuthContext';
import axiosInstance from '../api';
// import  useTheme  from '../context/ThemeContext';

const MenuPage = () => {
  // State management
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [unreadMessages, setUnreadMessages] = useState(2);
  const [activeTab, setActiveTab] = useState('menu');
  const [expandedSections, setExpandedSections] = useState({});
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Hooks
  const navigate = useNavigate();
  const { logout } = useAuth();
  const location = useLocation();
  const constraintsRef = useRef(null);
  const { darkMode, toggleDarkMode, systemTheme } = useState();
  
  // Animation hooks
  const { scrollY } = useScroll();
  const headerY = useTransform(scrollY, [0, 100], [0, -50]);
  const headerOpacity = useTransform(scrollY, [0, 50], [1, 0.9]);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get('/user/profile');
        setUser(response.data);
      } catch (err) {
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Menu sections data
  const menuSections = [
    {
      title: 'Your Profile',
      items: [
        {
          icon: <FiUser className="text-blue-500" />,
          label: 'View Profile',
          path: `/profile/${user?.username}`,
          highlight: true
        },
        {
          icon: <FiMessageCircle className="text-green-500" />,
          label: 'Messages',
          path: '/messages',
          badge: unreadMessages,
          premium: true
        },
        {
          icon: <IoMdNotificationsOutline className="text-yellow-500" />,
          label: 'Notifications',
          path: '/notifications',
          badge: unreadNotifications
        },
        {
          icon: <FiSettings className="text-gray-600 dark:text-gray-400" />,
          label: 'Settings & Privacy',
          path: '/settings',
          subItems: [
            { label: 'Privacy Checkup', path: '/settings/privacy' },
            { label: 'Language', path: '/settings/language' },
            { label: 'Dark Mode', path: '/settings/theme' },
            { label: 'Security', path: '/settings/security' }
          ]
        }
      ]
    },
    {
      title: 'Community',
      items: [
        {
          icon: <FaUserFriends className="text-blue-500" />,
          label: 'Friends',
          path: '/friends',
          count: user?.friendCount || 0
        },
        {
          icon: <RiLiveLine className="text-red-500" />,
          label: 'Live Videos',
          path: '/live',
          trending: true
        },
        {
          icon: <FaStore className="text-blue-500" />,
          label: 'Marketplace',
          path: '/marketplace'
        },
        {
          icon: <FiVideo className="text-blue-500" />,
          label: 'Watch',
          path: '/watch'
        },
        {
          icon: <FaGamepad className="text-blue-500" />,
          label: 'Gaming',
          path: '/gaming',
          new: true
        },
        {
          icon: <BsFillChatSquareQuoteFill className="text-purple-500" />,
          label: 'Groups',
          path: '/groups'
        },
        {
          icon: <FiMusic className="text-pink-500" />,
          label: 'Music',
          path: '/music'
        }
      ]
    },
    {
      title: 'Create',
      collapsible: true,
      items: [
        {
          icon: <FiStar className="text-yellow-500" />,
          label: 'Post',
          path: '/createpost'
        },
        {
          icon: <FiVideo className="text-red-500" />,
          label: 'Story',
          path: '/createstory'
        },
        {
          icon: <FiCalendar className="text-green-500" />,
          label: 'Event',
          path: '/event'
        },
        {
          icon: <FiShoppingBag className="text-blue-500" />,
          label: 'Marketplace Listing',
          path: '/marketplace',
          premium: true
        },
        {
          icon: <FiCamera className="text-purple-500" />,
          label: 'Reel',
          path: '/createreel'
        }
      ]
    },
    {
      title: 'Shortcuts',
      collapsible: true,
      items: [
        {
          icon: <FaRegBookmark className="text-gray-600 dark:text-gray-400" />,
          label: 'Saved',
          path: '/saved'
        },
        {
          icon: <FaRegCalendarAlt className="text-gray-600 dark:text-gray-400" />,
          label: 'Events',
          path: '/event'
        },
        {
          icon: <FaHistory className="text-gray-600 dark:text-gray-400" />,
          label: 'Memories',
          path: '/memories'
        },
        {
          icon: <FiGift className="text-gray-600 dark:text-gray-400" />,
          label: 'Fundraisers',
          path: '/fundraisers'
        },
        {
          icon: <FiMap className="text-gray-600 dark:text-gray-400" />,
          label: 'Places',
          path: '/places'
        }
      ]
    },
    {
      title: 'Premium Features',
      collapsible: true,
      premium: true,
      items: [
        {
          icon: <FaCrown className="text-yellow-500" />,
          label: 'Premium Badge',
          path: '/premium/badge'
        },
        {
          icon: <FaGem className="text-blue-500" />,
          label: 'Exclusive Content',
          path: '/premium/content'
        },
        {
          icon: <FaChartLine className="text-green-500" />,
          label: 'Advanced Analytics',
          path: '/premium/analytics'
        },
        {
          icon: <BsFillCreditCardFill className="text-purple-500" />,
          label: 'Payment Methods',
          path: '/premium/payments'
        }
      ]
    }
  ];

  // Filter menu sections based on search query
  const filteredSections = menuSections
    .filter(section => !section.premium || user?.isPremium)
    .map(section => ({
      ...section,
      items: section.items.filter(item => 
        item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.path && item.path.toLowerCase().includes(searchQuery.toLowerCase()))
    )}))
    .filter(section => section.items.length > 0);

  // Toggle section expansion
  const toggleSection = (sectionTitle) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Toggle different menus
  const toggleMenu = (menu) => {
    setShowProfileMenu(menu === 'profile' ? !showProfileMenu : false);
    setShowThemeMenu(menu === 'theme' ? !showThemeMenu : false);
    setShowCreateMenu(menu === 'create' ? !showCreateMenu : false);
    setShowHelpMenu(menu === 'help' ? !showHelpMenu : false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
        ></motion.div>
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col h-screen overflow-hidden bg-white text-black dark:bg-black dark:text-white  "
      ref={constraintsRef}
    >
      {/* Modern Floating Header */}
      <motion.header 
        style={{ y: headerY, opacity: headerOpacity }}
        className="fixed top-0 left-0 right-0 z-30 p-4  shadow-lg border-b bg-white text-black dark:bg-black dark:text-white dark:border-gray-700  border-gray-200"
      >
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <motion.div 
              whileHover={{ rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shadow-lg"
            >
              <FiGrid size={20} />
            </motion.div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Menu
            </h1>
          </motion.div>
          
          <div className="flex items-center space-x-4">
            {/* Time Display */}
            <motion.div 
              className="px-3 py-1 rounded-full  bg-white text-black dark:bg-black dark:text-white text-sm font-medium"
              whileHover={{ scale: 1.05 }}
            >
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </motion.div>
            
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700  transition-all"
            >
              <FiSearch className="text-gray-600 dark:text-gray-300" size={20} />
            </motion.button>
            
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Enhanced Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-16 z-20 bg-white/95 backdrop-blur-md dark:bg-gray-800/95 dark:backdrop-blur-md border-b dark:border-gray-700 border-gray-200 shadow-sm"
          >
            <div className="max-w-6xl mx-auto px-4 py-3">
              <div className="flex items-center px-4 py-3  bg-white text-black dark:bg-black dark:text-white rounded-xl">
                <FiSearch className="text-gray-500 dark:text-gray-400 mr-2" size={18} />
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent focus:outline-none dark:placeholder-gray-400  placeholder-gray-500"
                  autoFocus
                />
                {searchQuery && (
                  <motion.button 
                    whileTap={{ scale: 0.8 }}
                    onClick={() => setSearchQuery('')}
                    className="text-gray-500 dark:text-gray-400 ml-2"
                  >
                    ×
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* User Profile Card with Glass Morphism */}
      <motion.div 
        drag
        dragConstraints={constraintsRef}
        whileDrag={{ scale: 1.02 }}
        className="mt-16 mx-4 my-4 p-4 rounded-xl dark:bg-gray-800/80 dark:hover:bg-gray-700/80  bg-white/80 hover:bg-gray-50/80 border dark:border-gray-700/50 border-gray-200/50 cursor-pointer transition-all backdrop-blur-sm shadow-lg"
        onClick={() => navigate(`/profile/${user?.username}`)}
      >
        <div className="flex items-center space-x-4">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <img 
              src={user?.profilePicture || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
              alt="Profile"
              className="w-16 h-16 rounded-xl object-cover border-2 border-blue-500"
            />
            {user?.isOnline && (
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"
              ></motion.div>
            )}
            {user?.isPremium && (
              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-2 -right-2"
              >
                <RiVipCrownLine className="text-yellow-500 text-xl" />
              </motion.div>
            )}
          </motion.div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg">{user?.name || 'User'}</h2>
              <FiChevronRight className="text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {user?.bio || 'View your profile'}
            </p>
            {user?.isPremium ? (
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="mt-2 flex items-center bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xs px-2 py-1 rounded-full w-max"
              >
                <FaCrown className="mr-1" />
                <span>Premium Member</span>
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPremiumModal(true);
                }}
                className="mt-2 flex items-center bg-gradient-to-r from-purple-500 to-blue-600 text-white text-xs px-2 py-1 rounded-full w-max"
              >
                <RiFlashlightLine className="mr-1" />
                <span>Upgrade to Premium</span>
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Quick Actions Bar with Toggle */}
      <motion.div 
        className="mx-4 my-2 p-2 rounded-xl  bg-white text-black dark:bg-black dark:text-white backdrop-blur-sm border dark:border-gray-700/50 border-gray-200/50 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-between items-center mb-2 px-2">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Quick Actions</span>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowQuickActions(!showQuickActions)}
            className="text-blue-500 text-xs"
          >
            {showQuickActions ? 'Hide' : 'Show'}
          </motion.button>
        </div>
        
        <AnimatePresence>
          {showQuickActions && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex justify-around"
            >
              {[
                { icon: <FiUser size={20} />, label: 'Profile', action: () => toggleMenu('profile') },
                { icon: <FiPlus size={20} />, label: 'Create', action: () => toggleMenu('create') },
                { icon: darkMode ? <FiSun size={20} /> : <FiMoon size={20} />, label: 'Theme', action: () => toggleMenu('theme') },
                { icon: <FaQrcode size={20} />, label: 'Scan', action: () => navigate('/qr-scanner') }
              ].map((item, index) => (
                <motion.button
                  key={index}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={item.action}
                  className="flex flex-col items-center p-2 rounded-lg dark:hover:bg-gray-700/50 hover:bg-gray-100/50 transition-all"
                >
                  <div className="p-2 rounded-full  bg-white text-black dark:bg-black dark:text-white">
                    {item.icon}
                  </div>
                  <span className="text-xs mt-1">{item.label}</span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Main Menu Content */}
      <motion.div 
        className="flex-1 overflow-y-auto pb-24 mx-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {filteredSections.map((section, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="mb-3 rounded-xl overflow-hidden  bg-white text-black dark:bg-black dark:text-white backdrop-blur-sm border dark:border-gray-700/50 border-gray-200/50 shadow-sm"
          >
            {section.title && (
              <div className="px-4 py-3 flex justify-between items-center  bg-white text-black dark:bg-black dark:text-white border-b dark:border-gray-700/50 border-gray-200/50">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  {section.title}
                </h3>
                {section.collapsible && (
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleSection(section.title)}
                    className="text-blue-500 flex items-center text-sm"
                  >
                    {expandedSections[section.title] ? 'Collapse' : 'Expand'}
                    <motion.div
                      animate={{ rotate: expandedSections[section.title] ? 180 : 0 }}
                    >
                      <FiChevronDown size={16} className="ml-1" />
                    </motion.div>
                  </motion.button>
                )}
              </div>
            )}
            
            <AnimatePresence>
              {(!section.collapsible || expandedSections[section.title]) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className=" bg-white text-black dark:bg-black dark:text-white"
                >
                  {section.items.map((item, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative"
                    >
                      {item.path ? (
                        <Link
                          to={item.path}
                          className={`flex items-center justify-between p-4 dark:hover:bg-gray-700/50 hover:bg-gray-100/50'} ${
                            location.pathname === item.path ?  "bg-white text-black dark:bg-black dark:text-white" : ''
                          }`}
                        >
                          <div className="flex items-center">
                            <motion.div 
                              whileHover={{ rotate: [0, 10, -10, 0] }}
                              transition={{ duration: 0.5 }}
                              className={`p-3 rounded-xl ${item.highlight ? 'bg-blue-100 dark:bg-blue-900/50' : "dark:bg-gray-700/50 bg-gray-100"} mr-3`}
                            >
                              {item.icon}
                            </motion.div>
                            <div>
                              <div className="flex items-center">
                                <span className="block">{item.label}</span>
                                {item.premium && !user?.isPremium && (
                                  <motion.div 
                                    whileHover={{ scale: 1.1 }}
                                    className="ml-2 text-yellow-500"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setShowPremiumModal(true);
                                    }}
                                  >
                                    <FaCrown size={14} />
                                  </motion.div>
                                )}
                                {item.trending && (
                                  <motion.div 
                                    animate={{ scale: [1, 1.1, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="ml-2 text-red-500"
                                  >
                                    <FiTrendingUp size={14} />
                                  </motion.div>
                                )}
                                {item.new && (
                                  <motion.div 
                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="ml-2 text-xs bg-blue-500 text-white px-1.5 py-0.5 rounded-full"
                                  >
                                    NEW
                                  </motion.div>
                                )}
                              </div>
                              {item.subItems && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {item.subItems.length} options available
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center">
                            {(item.count || item.badge) && (
                              <span className={`text-xs rounded-full px-2 py-1 mr-2 ${
                                item.badge ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
                              }`}>
                                {item.badge || item.count}
                              </span>
                            )}
                            {(item.subItems || item.path) && (
                              <FiChevronRight className="text-gray-400" />
                            )}
                          </div>
                        </Link>
                      ) : (
                        <button
                          onClick={item.action}
                          className="flex items-center justify-between w-full p-4 dark:hover:bg-gray-700/50 hover:bg-gray-100/50"
                        >
                          <div className="flex items-center">
                            <div className="p-3 rounded-xl dark:bg-gray-700/50 bg-gray-100 mr-3">
                              {item.icon}
                            </div>
                            <span>{item.label}</span>
                          </div>
                        </button>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        {/* Footer Links */}
        <motion.div 
          className="p-6 text-xs dark:text-gray-400 text-gray-500 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex flex-wrap gap-3 mb-3 justify-center">
            {['Privacy', 'Terms', 'Advertising', 'Cookies', 'More'].map((item, index) => (
              <motion.span
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="cursor-pointer hover:underline"
              >
                {item}
              </motion.span>
            ))}
          </div>
          <motion.p 
            className="text-center"
            whileHover={{ scale: 1.05 }}
          >
            © {new Date().getFullYear()} SocialVibe
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Premium Modal */}
      <AnimatePresence>
        {showPremiumModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
            onClick={() => setShowPremiumModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="relative w-full max-w-md p-6 mx-4 rounded-2xl shadow-xl  bg-white text-black dark:bg-black dark:text-white"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowPremiumModal(false)}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FaCrown className="text-white text-3xl" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Upgrade to Premium</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Unlock exclusive features and enhance your experience
                </p>
                
                <div className="space-y-4 mb-6">
                  {[
                    { icon: <FaCrown className="text-yellow-500" />, text: "Premium badge on your profile" },
                    { icon: <FiLock className="text-blue-500" />, text: "Advanced privacy controls" },
                    { icon: <FiTrendingUp className="text-green-500" />, text: "Priority support" },
                    { icon: <FiAward className="text-purple-500" />, text: "Exclusive content" }
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                        {feature.icon}
                      </div>
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { plan: "Monthly", price: "$9.99", popular: false },
                    { plan: "Yearly", price: "$99.99", popular: true, save: "Save 16%" }
                  ].map((option, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ y: -5 }}
                      className="p-4 rounded-xl border-2 ${option.popular ? 'border-yellow-500' : 'border-gray-300 dark:border-gray-600'}  bg-white text-black dark:bg-black dark:text-white"
                    >
                      {option.popular && (
                        <div className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full absolute -top-2 -right-2">
                          POPULAR
                        </div>
                      )}
                      <h4 className="font-bold">{option.plan}</h4>
                      <p className="text-2xl font-bold my-2">{option.price}</p>
                      {option.save && (
                        <p className="text-xs text-green-500">{option.save}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-bold rounded-xl shadow-lg"
                >
                  Upgrade Now
                </motion.button>
                
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                  7-day free trial • Cancel anytime
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      {/* <motion.nav 
        className="fixed bottom-0 left-0 right-0 flex justify-around items-center p-2 dark:bg-gray-800/95 dark:backdrop-blur-md bg-white/95 backdrop-blur-md border-t dark:border-gray-700/50 border-gray-200/50 shadow-lg z-30"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {[
          { icon: <FiHome size={22} />, path: '/', label: 'Home' },
          { icon: <FaUserFriends size={22} />, path: '/friends', label: 'Friends' },
          { icon: <FiVideo size={22} />, path: '/watch', label: 'Watch' },
          { icon: <FaStore size={22} />, path: '/marketplace', label: 'Shop' },
          { icon: <FiGrid size={22} />, path: '/menu', label: 'Menu' }
        ].map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.9 }}
            className="flex flex-col items-center relative"
          >
            <button
              onClick={() => {
                setActiveTab(item.path);
                navigate(item.path);
              }}
              className={`p-2 rounded-xl transition-all ${activeTab === item.path ? 
                "dark:bg-gray-700 dark:text-blue-400 bg-gray-100 text-blue-500" : 
                'text-gray-500 dark:text-gray-400'}`}
            >
              {item.icon}
            </button>
            <span className={`text-xs mt-1 ${activeTab === item.path ? 'text-blue-500 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
              {item.label}
            </span>
            {item.path === '/menu' && (
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute top-0 right-2 w-2 h-2 bg-blue-500 rounded-full"
              />
            )}
          </motion.div>
        ))}
      </motion.nav> */}

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full flex items-center justify-center shadow-xl z-40 
          dark:bg-blue-600 dark:hover:bg-blue-700 bg-blue-500 hover:bg-blue-600
         text-white"
        onClick={() => setShowCreateMenu(!showCreateMenu)}
      >
        <AnimatePresence mode="wait">
          {showCreateMenu ? (
            <motion.span
              key="close"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.span>
          ) : (
            <motion.span
              key="plus"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <FiPlus size={24} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Enhanced Create Menu */}
      <AnimatePresence>
        {showCreateMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed bottom-24 right-4 z-30"
          >
            <div className="relative w-72 h-72">
              {[
                { icon: <FiStar size={20} />, label: 'createPost', angle: 0, color: 'from-yellow-400 to-yellow-600' },
                { icon: <FiVideo size={20} />, label: 'createStory', angle: 60, color: 'from-red-400 to-red-600' },
                { icon: <FiCalendar size={20} />, label: 'Event', angle: 120, color: 'from-green-400 to-green-600' },
                { icon: <FiShoppingBag size={20} />, label: 'Marketplace', angle: 180, color: 'from-blue-400 to-blue-600' },
                { icon: <RiEmotionHappyLine size={20} />, label: 'Feeling', angle: 240, color: 'from-purple-400 to-purple-600' },
                { icon: <FiMusic size={20} />, label: 'Music', angle: 300, color: 'from-pink-400 to-pink-600' }
              ].map((item, index) => {
                const radian = (item.angle * Math.PI) / 180;
                const x = 110 * Math.cos(radian);
                const y = 110 * Math.sin(radian);
                
                return (
                  <motion.div
                    key={index}
                    initial={{ x: 0, y: 0, opacity: 0 }}
                    animate={{ 
                      x, 
                      y, 
                      opacity: 1,
                      transition: { 
                        type: 'spring', 
                        stiffness: 100 + (index * 20), 
                        damping: 10,
                        delay: index * 0.1
                      }
                    }}
                    exit={{ x: 0, y: 0, opacity: 0 }}
                    whileHover={{ scale: 1.15, zIndex: 10 }}
                    whileTap={{ scale: 0.9 }}
                    className={`absolute w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-white shadow-lg cursor-pointer`}
                    onClick={() => {
                      navigate(`/${item.label.toLowerCase()}`);
                      setShowCreateMenu(false);
                    }}
                  >
                    {item.icon}
                    <motion.span 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ 
                        opacity: 1, 
                        scale: 1,
                        transition: { delay: index * 0.1 + 0.3 }
                      }}
                      className="absolute whitespace-nowrap text-xs bg-black/80 text-white px-3 py-1.5 rounded-full backdrop-blur-sm"
                      style={{
                        left: x > 0 ? '130%' : 'auto',
                        right: x < 0 ? '130%' : 'auto',
                        top: '50%',
                        transform: 'translateY(-50%)'
                      }}
                    >
                      {item.label}
                    </motion.span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuPage;