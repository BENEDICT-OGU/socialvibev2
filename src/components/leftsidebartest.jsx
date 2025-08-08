import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  FiHome, FiSearch, FiPlusSquare, FiMessageCircle, FiBell, FiFilm, 
  FiUser, FiMoreHorizontal, FiSun, FiMoon, FiCloud, FiShoppingCart, 
  FiCamera, FiMap, FiSettings, FiBookmark, FiCalendar, FiClock, 
  FiUsers, FiLayers, FiPieChart, FiFileText, FiDownload, FiTag, 
  FiShoppingBag, FiMic, FiMusic, FiAward, FiGift, FiHelpCircle,
  FiLock, FiShield, FiGlobe, FiStar, FiGrid, FiTool, FiZap
} from "react-icons/fi";
import { FaRobot, FaRegLightbulb, FaRegCalendarAlt, FaQrcode } from "react-icons/fa";
import { IoMdColorPalette, IoMdNotificationsOff } from "react-icons/io";
import { RiLiveLine, RiGroupLine } from "react-icons/ri";
import { BsGraphUp, BsClipboardData } from "react-icons/bs";
import { AiOutlineExperiment, AiOutlineSafety } from "react-icons/ai";
import { MdOutlineEmojiEvents, MdOutlineScreenSearchDesktop } from "react-icons/md";
import "../App.css";

const LeftSidebar = ({ darkMode, toggleDarkMode }) => {
  const [expanded, setExpanded] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [activeCategory, setActiveCategory] = useState("main");
  const [recentItems, setRecentItems] = useState([]);
  const [sidebarLocked, setSidebarLocked] = useState(false);
  const [showCustomizePanel, setShowCustomizePanel] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const location = useLocation();
  const sidebarRef = useRef(null);

  // Core navigation items
  const navCategories = {
    main: [
      { icon: <FiHome size={24} />, label: "Home", to: "/" },
      { icon: <FiSearch size={24} />, label: "Search", to: "/search" },
      { icon: <FiFilm size={24} />, label: "Reels", to: "/reels" },
      { icon: <FiMessageCircle size={24} />, label: "Messages", to: "/messages" },
      { icon: <FiBell size={24} />, label: "Notifications", to: "/notifications" },
      { icon: <FiPlusSquare size={24} />, label: "Create", to: "/createpost" },
      { icon: <FiUser size={24} />, label: "Profile", to: "/profile" },
    ],
    explore: [
      { icon: <RiGroupLine size={24} />, label: "Groups", to: "/groups" },
      { icon: <FaRegCalendarAlt size={24} />, label: "Events", to: "/events" },
      { icon: <FiShoppingCart size={24} />, label: "Marketplace", to: "/marketplace" },
      { icon: <FiBookmark size={24} />, label: "Saved", to: "/saved" },
      { icon: <FiCalendar size={24} />, label: "Memories", to: "/memories" },
      { icon: <FiUsers size={24} />, label: "Friends", to: "/friends" },
    ],
    creator: [
      { icon: <FiCamera size={24} />, label: "Image Generator", to: "/image-generator" },
      { icon: <FaRobot size={24} />, label: "AI Assistant", to: "/ai-assistant" },
      { icon: <RiLiveLine size={24} />, label: "Live", to: "/live" },
      { icon: <FiMic size={24} />, label: "Audio Room", to: "/audio-room" },
      { icon: <BsGraphUp size={24} />, label: "Analytics", to: "/analytics" },
      { icon: <FiLayers size={24} />, label: "Drafts", to: "/drafts" },
    ],
    tools: [
      { icon: <FiMap size={24} />, label: "Map", to: "/map" },
      { icon: <FiCloud size={24} />, label: "Weather", to: "/weather" },
      { icon: <FiClock size={24} />, label: "Clock", to: "/clock" },
      { icon: <FiPieChart size={24} />, label: "Polls", to: "/polls" },
      { icon: <FiShoppingBag size={24} />, label: "Shopping", to: "/shopping" },
      { icon: <FiFileText size={24} />, label: "Notes", to: "/notes" },
    ],
    settings: [
      { icon: <FiSettings size={24} />, label: "Settings", to: "/settings" },
      { icon: <FiLock size={24} />, label: "Privacy", to: "/privacy" },
      { icon: <AiOutlineSafety size={24} />, label: "Security", to: "/security" },
      { icon: <FiDownload size={24} />, label: "Downloads", to: "/downloads" },
      { icon: <FiHelpCircle size={24} />, label: "Help", to: "/help" },
      { icon: <FiTool size={24} />, label: "Developer", to: "/developer" },
    ]
  };

  // Recently used items
  useEffect(() => {
    const recents = [
      { icon: <FiTag size={24} />, label: "Tagged Posts", to: "/tagged" },
      { icon: <MdOutlineEmojiEvents size={24} />, label: "Achievements", to: "/achievements" },
      { icon: <BsClipboardData size={24} />, label: "Clipboard", to: "/clipboard" },
    ];
    setRecentItems(recents);
  }, []);

  // Handle sidebar width adjustment
  const handleResize = (e) => {
    if (sidebarLocked) return;
    const newWidth = Math.max(200, Math.min(400, e.clientX));
    setSidebarWidth(newWidth);
  };

  const startResizing = () => {
    window.addEventListener('mousemove', handleResize);
    window.addEventListener('mouseup', stopResizing);
  };

  const stopResizing = () => {
    window.removeEventListener('mousemove', handleResize);
    window.removeEventListener('mouseup', stopResizing);
  };

  return (
    <>
      {/* Main Sidebar */}
      <aside
        ref={sidebarRef}
        className={`hidden md:flex fixed left-0 top-0 h-[100%] z-20 flex-col justify-between overflow-hidden overflow-y-auto
          ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}
          border-r transition-all duration-300 shadow-sm py-6 px-2`}
        style={{ width: `${sidebarWidth}px` }}
        onMouseEnter={() => !sidebarLocked && setExpanded(true)}
        onMouseLeave={() => !sidebarLocked && setExpanded(false)}
      >
        {/* Resize handle */}
        <div 
          className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-pink-500"
          onMouseDown={startResizing}
        />

        <div className="flex-1">
          {/* Logo and quick actions */}
          <div className="flex items-center justify-between mb-8 px-3">
            <span className="font-extrabold text-2xl tracking-tight italic text-pink-500">
              SOCIALVIBE
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setSidebarLocked(!sidebarLocked)}
                className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                title={sidebarLocked ? "Unlock Sidebar" : "Lock Sidebar"}
              >
                <FiLock size={18} className={sidebarLocked ? "text-pink-500" : ""} />
              </button>
              <button 
                onClick={() => setShowCustomizePanel(!showCustomizePanel)}
                className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                title="Customize Sidebar"
              >
                <IoMdColorPalette size={18} />
              </button>
            </div>
          </div>

          {/* Customize Panel */}
          {showCustomizePanel && (
            <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Customize Sidebar</h3>
                <button onClick={() => setShowCustomizePanel(false)}>✕</button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={toggleDarkMode}
                  className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  {darkMode ? <FiSun size={16} /> : <FiMoon size={16} />}
                  <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
                </button>
                <button className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                  <FiGrid size={16} />
                  <span>Layout</span>
                </button>
                <button className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                  <FiGlobe size={16} />
                  <span>Language</span>
                </button>
                <button className="flex items-center gap-2 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                  <IoMdNotificationsOff size={16} />
                  <span>Mute</span>
                </button>
              </div>
            </div>
          )}

          {/* Category selector */}
          <div className="flex justify-around mb-4 border-b dark:border-gray-700">
            {Object.keys(navCategories).map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`pb-2 px-4 capitalize ${activeCategory === category ? 
                  'border-b-2 border-pink-500 text-pink-500' : 
                  'text-gray-500 dark:text-gray-400'}`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Active category items */}
          <nav className="flex flex-col gap-1 mb-4">
            {navCategories[activeCategory].map((item, idx) => (
              <Link
                key={idx}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg 
                  ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}
                  ${location.pathname === item.to ? 
                    'bg-pink-500 text-white font-semibold' : ''}`}
              >
                <span className={`${location.pathname === item.to ? 'text-white' : 'text-pink-500'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Recent items section */}
          {recentItems.length > 0 && (
            <>
              <h3 className="px-3 py-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
                Recently Used
              </h3>
              <nav className="flex flex-col gap-1 mb-4">
                {recentItems.map((item, idx) => (
                  <Link
                    key={`recent-${idx}`}
                    to={item.to}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg 
                      ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </>
          )}

          {/* Quick actions */}
          <div className="px-3 py-2">
            <button className="w-full flex items-center justify-center gap-2 bg-pink-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-pink-600 transition">
              <FiZap size={18} />
              <span>Create Story</span>
            </button>
          </div>
        </div>

        {/* Bottom section - Profile & More */}
        <div className="flex flex-col gap-2 items-center mb-2 relative">
          <div className="flex items-center gap-3 w-full px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition cursor-pointer">
            <img
              src="https://i.pravatar.cc/150?img=5"
              alt="profile"
              className="w-8 h-8 rounded-full border-2 border-pink-500 object-cover"
            />
            <div className="flex-1">
              <p className="font-semibold">Your Profile</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">@username</p>
            </div>
            <FaQrcode className="text-gray-400 hover:text-pink-500" />
          </div>

          <button
            className="flex items-center gap-3 w-full px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition relative"
            onClick={() => setShowMore(!showMore)}
          >
            <FiMoreHorizontal size={24} className="text-gray-500" />
            <span>More</span>
          </button>

          {/* Dropdown menu */}
          {showMore && (
            <div
              className={`absolute bottom-14 left-0 w-full bg-white dark:bg-gray-800 shadow-lg rounded-xl border dark:border-gray-700 p-2 z-50`}
              onMouseLeave={() => setShowMore(false)}
            >
              <Link to="/settings" className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <FiSettings size={18} />
                <span>Settings</span>
              </Link>
              <Link to="/saved" className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <FiBookmark size={18} />
                <span>Saved</span>
              </Link>
              <Link to="/switch-account" className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <FiUser size={18} />
                <span>Switch Account</span>
              </Link>
              <button className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-red-500">
                <FiLock size={18} />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around bg-white dark:bg-gray-900 border-t dark:border-gray-700 md:hidden py-2">
        {navCategories.main
          .filter(item => ["Home", "Search", "Create", "Messages", "Profile"].includes(item.label))
          .map((item, idx) => (
            <Link
              key={idx}
              to={item.to}
              className={`flex flex-col items-center p-2 ${location.pathname === item.to ? 
                'text-pink-500' : 'text-gray-500 dark:text-gray-300'}`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          ))}
      </nav>
    </>
  );
};

export default LeftSidebar;