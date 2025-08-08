import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  FiHome, FiUser, FiSettings, FiBookmark, FiUsers, 
  FiCalendar, FiMessageCircle, FiBell, FiHelpCircle,
  FiMoon, FiSun, FiLogOut, FiFlag, FiClock, FiStar,
  FiGrid, FiVideo, FiShoppingBag, FiGift, FiHeart
} from 'react-icons/fi';
import { 
  FaUserFriends, FaStore, FaGamepad, FaHistory,
  FaChevronDown, FaRegClock, FaRegBookmark,
  FaRegCalendarAlt, FaRegQuestionCircle
} from 'react-icons/fa';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { RiLiveLine } from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../AuthContext';
import axiosInstance from '../api';
// import defaultProfile from '../assets/default-profile.jpg';

const MenuPage = ({ darkMode, toggleDarkMode }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('menu');
  const [showShortcuts, setShowShortcuts] = useState(true);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axiosInstance.get('/api/user/profile');
        setUser(response.data);
      } catch (err) {
        setError('Failed to load user data');
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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
          icon: <FiSettings className="text-gray-600 dark:text-gray-400" />,
          label: 'Settings & Privacy',
          path: '/settings'
        },
        {
          icon: <IoMdNotificationsOutline className="text-gray-600 dark:text-gray-400" />,
          label: 'Notification Settings',
          path: '/notifications'
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
          path: '/live'
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
          path: '/gaming'
        }
      ]
    },
    {
      title: 'Create',
      items: [
        {
          icon: <FiStar className="text-yellow-500" />,
          label: 'Post',
          path: '/create/post'
        },
        {
          icon: <FiVideo className="text-red-500" />,
          label: 'Story',
          path: '/create/story'
        },
        {
          icon: <FiCalendar className="text-green-500" />,
          label: 'Event',
          path: '/create/event'
        },
        {
          icon: <FiShoppingBag className="text-blue-500" />,
          label: 'Marketplace Listing',
          path: '/marketplace/create'
        }
      ]
    },
    {
      title: 'Your Shortcuts',
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
          path: '/events'
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
        }
      ]
    },
    {
      title: 'Help & Support',
      items: [
        {
          icon: <FaRegQuestionCircle className="text-gray-600 dark:text-gray-400" />,
          label: 'Help Center',
          path: '/help'
        },
        {
          icon: <FiFlag className="text-gray-600 dark:text-gray-400" />,
          label: 'Report a Problem',
          path: '/report'
        },
        {
          icon: darkMode ? <FiSun className="text-gray-600 dark:text-gray-400" /> : <FiMoon className="text-gray-600 dark:text-gray-400" />,
          label: darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode',
          action: toggleDarkMode
        },
        {
          icon: <FiLogOut className="text-gray-600 dark:text-gray-400" />,
          label: 'Log Out',
          action: () => {
            logout();
            navigate('/login');
          }
        }
      ]
    }
  ];

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-10 p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-blue-500">Menu</h1>
          <button 
            onClick={() => navigate(-1)}
            className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>

      {/* User Profile Section */}
      <div 
        className={`p-4 ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} cursor-pointer transition-colors`}
        onClick={() => navigate(`/profile/${user?.username}`)}
      >
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img 
              src={user?.profilePicture || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
              alt="Profile"
              className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
            />
            {user?.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            )}
          </div>
          <div>
            <h2 className="font-bold">{user?.name || 'User'}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user?.bio || 'View your profile'}
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className={`p-3 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className={`flex items-center px-3 py-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search Menu"
            className={`ml-2 bg-transparent w-full focus:outline-none ${darkMode ? 'placeholder-gray-400' : 'placeholder-gray-500'}`}
          />
        </div>
      </div>

      {/* Main Menu Content */}
      <div className="flex-1 overflow-y-auto pb-20">
        {menuSections.map((section, index) => (
          <div key={index} className={`mb-1 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            {section.title && (
              <div className={`px-4 py-2 flex justify-between items-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  {section.title}
                </h3>
                {section.collapsible && (
                  <button 
                    onClick={() => setShowShortcuts(!showShortcuts)}
                    className="text-blue-500"
                  >
                    {showShortcuts ? 'Hide' : 'Show'}
                  </button>
                )}
              </div>
            )}
            
            {(showShortcuts || !section.collapsible) && (
              <div className={`${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                {section.items.map((item, idx) => (
                  <motion.div
                    key={idx}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.path ? (
                      <Link
                        to={item.path}
                        className={`flex items-center justify-between p-3 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'} ${
                          location.pathname === item.path ? (darkMode ? 'bg-gray-700' : 'bg-gray-100') : ''
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`p-2 rounded-full ${item.highlight ? 'bg-blue-100 dark:bg-blue-900' : darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            {item.icon}
                          </div>
                          <span className="ml-3">{item.label}</span>
                        </div>
                        {item.count && (
                          <span className="text-xs bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-1">
                            {item.count}
                          </span>
                        )}
                      </Link>
                    ) : (
                      <button
                        onClick={item.action}
                        className={`flex items-center justify-between w-full p-3 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                      >
                        <div className="flex items-center">
                          <div className={`p-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                            {item.icon}
                          </div>
                          <span className="ml-3">{item.label}</span>
                        </div>
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Footer Links */}
        <div className={`p-4 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <div className="flex flex-wrap gap-2 mb-2">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Advertising</span>
            <span>Ad Choices</span>
            <span>Cookies</span>
            <span>More</span>
          </div>
          <p>Meta © {new Date().getFullYear()}</p>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className={`fixed bottom-0 left-0 right-0 flex justify-around items-center p-2 ${darkMode ? 'bg-gray-800' : 'bg-white'} border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        {[
          { icon: <FiHome size={22} />, path: '/', label: 'Home' },
          { icon: <FaUserFriends size={22} />, path: '/friends', label: 'Friends' },
          { icon: <FiVideo size={22} />, path: '/watch', label: 'Watch' },
          { icon: <FaStore size={22} />, path: '/marketplace', label: 'Marketplace' },
          { icon: <FiGrid size={22} />, path: '/menu', label: 'Menu' }
        ].map((item, index) => (
          <button
            key={index}
            onClick={() => {
              setActiveTab(item.path);
              navigate(item.path);
            }}
            className={`flex flex-col items-center p-1 ${activeTab === item.path ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default MenuPage;