import { useState, useEffect, useRef } from 'react';
import { 
  FiHome, FiCompass, FiPlusSquare, FiCamera, FiMessageSquare, FiBell, FiUser, 
  FiSettings, FiBookmark, FiFileText, FiUsers, FiLayers, FiCalendar, FiFilm, 
  FiImage, FiMic, FiVideo, FiDollarSign, FiShoppingCart, FiPieChart, FiBarChart2, 
  FiDownload, FiArchive, FiEye, FiHeart, FiShare2, FiMessageCircle, FiTag, FiClock, 
  FiSearch, FiCommand, FiZap, FiClipboard, FiSun, FiMoon, FiCircle, FiEyeOff, 
  FiGrid, FiRefreshCw, FiMapPin, FiCloud, FiGlobe, FiTrendingUp, 
  FiCheckCircle, FiHelpCircle, FiAlertCircle, FiGift, FiEdit, FiMenu, FiType, 
  FiVolume2, FiMaximize, FiToggleLeft, FiToggleRight, FiLock, FiLogIn, FiLogOut, 
  FiSmartphone, FiShield, FiKey, FiDatabase, FiWifi, FiWifiOff, FiLink, FiMail, 
  FiAward, FiStar, FiThumbsUp, FiCode, FiSliders, FiChevronDown, FiChevronUp, FiStar as FiFilledStar
} from 'react-icons/fi';
import { FaQrcode } from 'react-icons/fa';

const UltraModernMenu = () => {
  // State management
  const [activeSection, setActiveSection] = useState('core');
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [notificationCount, setNotificationCount] = useState(5);
  const [unreadMessages, setUnreadMessages] = useState(3);
  const [currentStatus, setCurrentStatus] = useState('online');
  const [pinnedItems, setPinnedItems] = useState([1, 2, 6, 7]);
  const [recentlyUsed, setRecentlyUsed] = useState([3, 42, 81]);
  const [expandedItems, setExpandedItems] = useState([]);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [voiceSearchActive, setVoiceSearchActive] = useState(false);
  
  const commandInputRef = useRef(null);
  const aiInputRef = useRef(null);

  // Customization settings
  const [customization, setCustomization] = useState({
    accentColor: '#6366f1',
    cardStyle: 'neumorphic', // 'flat', 'neumorphic', 'glass'
    animationLevel: 'subtle', // 'none', 'subtle', 'dynamic'
    iconStyle: 'filled', // 'outline', 'filled', 'duotone'
    layout: 'grid', // 'grid', 'list', 'compact'
    enableHoverEffects: true,
    enableSounds: false,
  });

  // Sample data for all menu items
  const allMenuItems = {
    core: [...Array(40).keys()].map(i => ({
      id: i + 1,
      name: [
        'Home', 'Explore', 'Create Post', 'Create Reel', 'Create Story', 
        'Messages', 'Notifications', 'Profile', 'Settings', 'Saved Posts',
        'Drafts', 'Friends', 'Groups', 'Events', 'Reels', 'Stories', 
        'Audio Room', 'Go Live', 'Bookmarks', 'Trending', 'Pages', 
        'Subscriptions', 'Wallet', 'Payments', 'Shopping', 'My Orders', 
        'Ads Center', 'Business Dashboard', 'Creator Studio', 'Analytics',
        'Downloads', 'Archives', 'Recently Viewed', 'Most Liked', 
        'Watch History', 'Liked Posts', 'Shared Posts', 'My Comments', 
        'Tagged Posts', 'Scheduled Posts'
      ][i],
      icon: [
        <FiHome />, <FiCompass />, <FiPlusSquare />, <FiCamera />, <FiImage />,
        <FiMessageSquare />, <FiBell />, <FiUser />, <FiSettings />, <FiBookmark />,
        <FiFileText />, <FiUsers />, <FiLayers />, <FiCalendar />, <FiFilm />,
        <FiImage />, <FiMic />, <FiVideo />, <FiBookmark />, <FiTrendingUp />,
        <FiLayers />, <FiCheckCircle />, <FiDollarSign />, <FiDollarSign />, <FiShoppingCart />,
        <FiShoppingCart />, <FiBarChart2 />, <FiPieChart />, <FiVideo />, <FiBarChart2 />,
        <FiDownload />, <FiArchive />, <FiEye />, <FiHeart />, <FiEye />,
        <FiHeart />, <FiShare2 />, <FiMessageCircle />, <FiTag />, <FiClock />
      ][i],
      category: 'core',
      hasSubmenu: [3, 4, 5].includes(i + 1),
      isNew: [3, 4, 5, 17, 18].includes(i + 1),
      isPro: [17, 18, 27, 28, 29].includes(i + 1)
    })),
    smart: [...Array(40).keys()].map(i => ({
      id: i + 41,
      name: [
        'Smart Search', 'Voice Search', 'AI Assistant', 'Command Palette', 'Quick Actions',
        'Clipboard Detector', 'Smart Suggestions', 'Notification Settings', 'Theme Switcher', 'Mood Selector',
        'Profile Status', 'Do Not Disturb', 'QR Code Scanner', 'Custom Shortcut Bar', 'Multi-Account Switcher',
        'Auto-Night Mode', 'Location Toggle', 'AI Recommendations', 'Weather Widget', 'News Feed',
        'Trending Topics', 'Poll of the Day', 'Daily Tip', 'Keyboard Shortcuts', 'Language Selector',
        'Help Center', 'Report a Problem', 'Feature Request', "What's New", 'App Feedback',
        'AI Rewriter', 'Create Poll', 'Timer', 'Reminders', 'Pin Tabs',
        'Drafts Shortcut', 'Auto Mode Toggle', 'Custom Drawer Sections', 'Add Widget to Menu', 'Share App'
      ][i],
      icon: [
        <FiSearch />, <FiMic />, <FiCommand />, <FiCommand />, <FiZap />,
        <FiClipboard />, <FiRefreshCw />, <FiBell />, <FiSun />, <FiMoon />,
        <FiCircle />, <FiEyeOff />, <FaQrcode />, <FiGrid />, <FiRefreshCw />,
        <FiMoon />, <FiMapPin />, <FiCommand />, <FiCloud />, <FiGlobe />,
        <FiTrendingUp />, <FiCheckCircle />, <FiHelpCircle />, <FiCommand />, <FiGlobe />,
        <FiHelpCircle />, <FiAlertCircle />, <FiGift />, <FiGift />, <FiEdit />,
        <FiEdit />, <FiCheckCircle />, <FiClock />, <FiBell />, <FiMenu />,
        <FiFileText />, <FiToggleRight />, <FiGrid />, <FiPlusSquare />, <FiShare2 />
      ][i],
      category: 'smart',
      isNew: [41, 42, 43, 44, 45].includes(i + 41),
      isPro: [43, 44, 45, 58, 59].includes(i + 41)
    })),
    custom: [...Array(40).keys()].map(i => ({
      id: i + 81,
      name: [
        'Edit Menu Items', 'Rearrange Menu Order', 'Add Custom Menu Items', 'Show/Hide Sections', 'Add Emoji to Labels',
        'Menu Background Themes', 'Menu Icon Style', 'Toggle Compact View', 'Label Size Customization', 'Expand/Collapse Sections',
        'Menu Color Picker', 'Transparent Mode', 'Accent Color Control', 'Dark/Light Toggle', 'Menu Font Selector',
        'Menu Layout', 'Menu Animation Settings', 'Menu Preview Mode', 'Custom Sounds on Click', 'Hover Effects Toggle',
        'Icon Size Control', 'Add Avatars in Menu', 'Menu Stick/Float Toggle', 'Menu Side Toggle', 'Submenu Preview on Hover',
        'Multi-language menu support', 'Sticky Sections', 'Hide Menu When Inactive', 'Lock Menu Width', 'Mobile-Friendly Collapse',
        'Adaptive Width', 'Animation Duration Controls', 'Slide vs Overlay mode', 'Gesture-Based Menu Slide', 'Menu Auto-Close Delay',
        'Menu Interaction History', 'Theme Auto-Sync with OS', 'Separate Menus for Mobile/Desktop', 'Quick Theme Presets', 'Dynamic Color Contrast Mode'
      ][i],
      icon: [
        <FiEdit />, <FiMenu />, <FiPlusSquare />, <FiEye />, <FiEdit />,
        <FiSun />, <FiGrid />, <FiMaximize />, <FiType />, <FiMaximize />,
        <FiSun />, <FiEye />, <FiSun />, <FiMoon />, <FiType />,
        <FiGrid />, <FiRefreshCw />, <FiEye />, <FiVolume2 />, <FiToggleLeft />,
        <FiMaximize />, <FiUser />, <FiToggleRight />, <FiMenu />, <FiEye />,
        <FiGlobe />, <FiLock />, <FiEyeOff />, <FiLock />, <FiSmartphone />,
        <FiMaximize />, <FiClock />, <FiMenu />, <FiMenu />, <FiClock />,
        <FiArchive />, <FiSun />, <FiSmartphone />, <FiSun />, <FiSun />
      ][i],
      category: 'custom',
      isSetting: true
    })),
    privacy: [...Array(40).keys()].map(i => ({
      id: i + 121,
      name: [
        'Login / Logout', 'Switch Account', 'Private Mode', 'Anonymous Mode', 'Profile Lock',
        'Set App PIN', 'Face ID / Biometrics', 'Show My Devices', 'Login History', 'Account Activity',
        'Profile QR Code', 'Scan QR to Login', 'Link Device', 'View Blocked Users', 'Two-Factor Settings',
        'Add Recovery Options', 'Deactivate Account', 'Delete Account', 'Export Data', 'Privacy Settings',
        'Manage Permissions', 'Security Center', 'Session Timeout', 'Data Usage', 'Offline Mode',
        'Auto-Sync Toggle', 'Clear Cache', 'View App Size', 'Connected Apps', 'Active Subscriptions',
        'Access Control', 'Developer Console', 'API Token Manager', 'Invite Admin', 'View Reports',
        'Content Moderation', 'Audit Logs', 'App Integrity Check', 'Re-authenticate', 'Emergency Lock'
      ][i],
      icon: [
        <FiLogIn />, <FiRefreshCw />, <FiEyeOff />, <FiUser />, <FiLock />,
        <FiKey />, <FiUser />, <FiSmartphone />, <FiArchive />, <FiBarChart2 />,
        <FaQrcode />, <FaQrcode />, <FiLink />, <FiUser />, <FiShield />,
        <FiKey />, <FiUser />, <FiUser />, <FiDatabase />, <FiShield />,
        <FiShield />, <FiShield />, <FiClock />, <FiDatabase />, <FiWifiOff />,
        <FiWifi />, <FiDatabase />, <FiDatabase />, <FiLink />, <FiDollarSign />,
        <FiUser />, <FiCode />, <FiKey />, <FiMail />, <FiBarChart2 />,
        <FiShield />, <FiArchive />, <FiShield />, <FiKey />, <FiLock />
      ][i],
      category: 'privacy',
      isSecurity: true
    })),
    community: [...Array(40).keys()].map(i => ({
      id: i + 161,
      name: [
        'Invite Friends', 'Manage Followers', 'Recent Followers', 'Join New Groups', 'Suggest Groups',
        'Explore Events', 'Join Event via Code', 'Public Rooms', 'Open Chats', 'Ask the Community',
        'Community Guidelines', 'Verified Badges', 'Volunteer as Moderator', 'Suggest New Rules', 'Creator Hub',
        'My Subscriptions', 'Comment History', 'Mentioned Posts', 'My Reactions', 'Top Commenter Badge',
        'Referral Leaderboard', 'Invite Leaderboard', 'Share Profile Link', 'Public QR Profile', 'Copy Invite Link',
        'Build a Circle', 'Mute Communities', 'Featured Communities', 'Trending in Your Area', 'AI Topic Suggestions',
        'Volunteer Program', 'Public Profile Toggle', 'Collaboration Requests', 'User Feedback', 'Partner Dashboard',
        'Link Your Content', 'Affiliate Program', 'Contact Admin', 'Community Survey', 'Join Beta Features'
      ][i],
      icon: [
        <FiMail />, <FiUsers />, <FiUser />, <FiUsers />, <FiUsers />,
        <FiCalendar />, <FiCode />, <FiUsers />, <FiMessageSquare />, <FiHelpCircle />,
        <FiFileText />, <FiAward />, <FiShield />, <FiEdit />, <FiStar />,
        <FiCheckCircle />, <FiMessageCircle />, <FiMessageCircle />, <FiThumbsUp />, <FiAward />,
        <FiAward />, <FiAward />, <FiShare2 />, <FaQrcode />, <FiLink />,
        <FiUsers />, <FiVolume2 />, <FiStar />, <FiMapPin />, <FiCommand />,
        <FiAward />, <FiUser />, <FiUsers />, <FiEdit />, <FiPieChart />,
        <FiLink />, <FiDollarSign />, <FiMail />, <FiEdit />, <FiCode />
      ][i],
      category: 'community'
    }))
  };

  // Filter items based on search and active section
  const filteredItems = () => {
    let items = allMenuItems[activeSection];
    
    // Apply search filter if query exists
    if (searchQuery) {
      return items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    return items;
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('darkMode', newMode);
  };

  // Toggle item expansion
  const toggleItemExpansion = (itemId) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Toggle item pin
  const toggleItemPin = (itemId, e) => {
    e.stopPropagation();
    setPinnedItems(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Handle command palette
  const toggleCommandPalette = () => {
    const newState = !showCommandPalette;
    setShowCommandPalette(newState);
    if (newState && commandInputRef.current) {
      setTimeout(() => commandInputRef.current.focus(), 100);
    }
  };

  // Handle AI assistant
  const toggleAIAssistant = () => {
    const newState = !showAIAssistant;
    setShowAIAssistant(newState);
    if (newState && aiInputRef.current) {
      setTimeout(() => aiInputRef.current.focus(), 100);
    }
  };

  // Handle voice search
  const toggleVoiceSearch = () => {
    setVoiceSearchActive(!voiceSearchActive);
    // In a real app, you would integrate with the Web Speech API here
    if (!voiceSearchActive) {
      setTimeout(() => {
        setVoiceSearchActive(false);
        setSearchQuery('Search results from voice input');
      }, 2000);
    }
  };

  // Handle menu item click
  const handleMenuItemClick = (item) => {
    // Add to recently used if not already there
    if (!recentlyUsed.includes(item.id)) {
      setRecentlyUsed(prev => [item.id, ...prev].slice(0, 5));
    }
    
    // Special actions for specific items
    switch(item.id) {
      case 7: // Notifications
        setNotificationCount(0);
        break;
      case 6: // Messages
        setUnreadMessages(0);
        break;
      case 49: // Theme Switcher
        toggleDarkMode();
        break;
      case 44: // Command Palette
        toggleCommandPalette();
        break;
      case 43: // AI Assistant
        toggleAIAssistant();
        break;
      case 42: // Voice Search
        toggleVoiceSearch();
        break;
      case 51: // Profile Status
        setCurrentStatus(prev => prev === 'online' ? 'busy' : 'online');
        break;
      case 52: // Do Not Disturb
        // Toggle DND mode
        break;
      case 93: // Accent Color Control
        // Cycle through accent colors
        const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#ef4444'];
        const currentIndex = colors.indexOf(customization.accentColor);
        const nextIndex = (currentIndex + 1) % colors.length;
        setCustomization(prev => ({
          ...prev,
          accentColor: colors[nextIndex]
        }));
        break;
      case 94: // Dark/Light Toggle
        toggleDarkMode();
        break;
      case 121: // Login/Logout
        // Toggle login state
        break;
      default:
        // Default action (could be navigation)
        console.log(`Navigating to ${item.name}`);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandPalette();
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'j') {
        e.preventDefault();
        toggleAIAssistant();
      } else if (e.key === 'Escape') {
        setShowCommandPalette(false);
        setShowAIAssistant(false);
        setActiveSubmenu(null);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Command palette commands
  const commandPaletteCommands = [
    {
      category: 'Navigation',
      commands: [
        { id: 'home', name: 'Go to Home', icon: <FiHome />, action: () => handleMenuItemClick(allMenuItems.core[0]) },
        { id: 'explore', name: 'Go to Explore', icon: <FiCompass />, action: () => handleMenuItemClick(allMenuItems.core[1]) },
        { id: 'profile', name: 'Go to Profile', icon: <FiUser />, action: () => handleMenuItemClick(allMenuItems.core[7]) },
        { id: 'settings', name: 'Go to Settings', icon: <FiSettings />, action: () => handleMenuItemClick(allMenuItems.core[8]) }
      ]
    },
    {
      category: 'Create',
      commands: [
        { id: 'post', name: 'Create Post', icon: <FiPlusSquare />, action: () => handleMenuItemClick(allMenuItems.core[2]) },
        { id: 'reel', name: 'Create Reel', icon: <FiCamera />, action: () => handleMenuItemClick(allMenuItems.core[3]) },
        { id: 'story', name: 'Create Story', icon: <FiImage />, action: () => handleMenuItemClick(allMenuItems.core[4]) }
      ]
    },
    {
      category: 'Tools',
      commands: [
        { id: 'ai', name: 'AI Assistant', icon: <FiCommand />, action: toggleAIAssistant },
        { id: 'voice', name: 'Voice Search', icon: <FiMic />, action: toggleVoiceSearch },
        { id: 'dark', name: 'Toggle Dark Mode', icon: <FiMoon />, action: toggleDarkMode }
      ]
    }
  ];

  // Get card style classes based on customization
  const getCardStyleClasses = () => {
    switch(customization.cardStyle) {
      case 'neumorphic':
        return isDarkMode 
          ? 'bg-gray-800 shadow-neumorphic-dark'
          : 'bg-white shadow-neumorphic-light';
      case 'glass':
        return isDarkMode 
          ? 'bg-gray-800/70 backdrop-blur-md border border-gray-700/50'
          : 'bg-white/70 backdrop-blur-md border border-gray-200/50';
      default: // flat
        return isDarkMode 
          ? 'bg-gray-800 shadow'
          : 'bg-white shadow';
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Top Navigation Bar */}
      <header className={`sticky top-0 z-20 ${isDarkMode ? 'bg-gray-800/90 backdrop-blur-md' : 'bg-white/90 backdrop-blur-md'} shadow-sm border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold" style={{ color: customization.accentColor }}>Menu</h1>
            
            {/* Section Tabs */}
            <div className="hidden md:flex space-x-1">
              {Object.entries({
                core: { name: 'Core', icon: <FiHome /> },
                smart: { name: 'Smart', icon: <FiZap /> },
                custom: { name: 'Custom', icon: <FiSliders /> },
                privacy: { name: 'Privacy', icon: <FiLock /> },
                community: { name: 'Community', icon: <FiUsers /> }
              }).map(([key, { name, icon }]) => (
                <button
                  key={key}
                  onClick={() => setActiveSection(key)}
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors duration-200 ${activeSection === key ? 'bg-opacity-20' : 'opacity-80 hover:opacity-100'}`}
                  style={{ 
                    backgroundColor: activeSection === key ? `${customization.accentColor}20` : 'transparent',
                    color: activeSection === key ? customization.accentColor : (isDarkMode ? 'white' : 'inherit')
                  }}
                >
                  <span className="mr-2">{icon}</span>
                  <span>{name}</span>
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Quick Actions Button */}
            <button 
              onClick={() => setShowQuickActions(!showQuickActions)}
              className={`p-2 rounded-full ${showQuickActions ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-200') : ''}`}
            >
              <FiZap className="w-5 h-5" style={{ color: customization.accentColor }} />
            </button>
            
            {/* Search Bar */}
            <div className={`relative hidden md:flex items-center rounded-full transition-all duration-300 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} ${showQuickActions ? 'w-64' : 'w-48'}`}>
              <button 
                onClick={toggleVoiceSearch}
                className={`absolute left-3 ${voiceSearchActive ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}
              >
                <FiMic />
              </button>
              <input
                type="text"
                placeholder={voiceSearchActive ? "Listening..." : "Search menu items..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`py-2 ${showQuickActions ? 'pl-10 pr-24' : 'pl-10 pr-12'} ${isDarkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-100 text-gray-800 placeholder-gray-500'} rounded-full focus:outline-none focus:ring-2`}
                style={{ '--tw-ring-color': customization.accentColor }}
              />
              {showQuickActions && (
                <div className="absolute right-3 flex space-x-2">
                  <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                    <FiCamera className="w-4 h-4" />
                  </button>
                  <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                    <FiImage className="w-4 h-4" />
                  </button>
                  <button className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                    <FiMic className="w-4 h-4" />
                  </button>
                </div>
              )}
              {!showQuickActions && searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              )}
            </div>
            
            {/* Theme Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {isDarkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>
            
            {/* AI Assistant Button */}
            <button 
              onClick={toggleAIAssistant}
              className={`p-2 rounded-full ${showAIAssistant ? (isDarkMode ? 'bg-gray-700' : 'bg-gray-200') : ''}`}
            >
              <FiCommand className="w-5 h-5" style={{ color: customization.accentColor }} />
            </button>
          </div>
        </div>
        
        {/* Quick Actions Panel */}
        {showQuickActions && (
          <div className={`container mx-auto px-4 py-3 mt-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg shadow`}>
            <div className="flex space-x-4 overflow-x-auto pb-2">
              {[allMenuItems.core[2], allMenuItems.core[3], allMenuItems.core[4], allMenuItems.smart[2], allMenuItems.smart[31]].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMenuItemClick(item)}
                  className={`flex-shrink-0 flex items-center px-4 py-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                >
                  <span className="mr-2" style={{ color: customization.accentColor }}>{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Mobile Section Selector */}
        <div className="md:hidden mb-6">
          <select
            value={activeSection}
            onChange={(e) => setActiveSection(e.target.value)}
            className={`w-full p-3 rounded-xl ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow`}
          >
            {Object.entries({
              core: 'Core',
              smart: 'Smart',
              custom: 'Custom',
              privacy: 'Privacy',
              community: 'Community'
            }).map(([key, name]) => (
              <option key={key} value={key}>{name}</option>
            ))}
          </select>
        </div>
        
        {/* Mobile Search */}
        <div className="md:hidden mb-6">
          <div className={`relative flex items-center rounded-xl ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
            <button 
              onClick={toggleVoiceSearch}
              className={`absolute left-3 ${voiceSearchActive ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}
            >
              <FiMic />
            </button>
            <input
              type="text"
              placeholder={voiceSearchActive ? "Listening..." : "Search menu items..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full py-3 pl-10 pr-4 ${isDarkMode ? 'bg-gray-800 text-white placeholder-gray-400' : 'bg-white text-gray-800 placeholder-gray-500'} rounded-xl focus:outline-none focus:ring-2`}
              style={{ '--tw-ring-color': customization.accentColor }}
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold dark:text-white capitalize">
            {activeSection} Features
            <span className="ml-2 text-sm font-normal text-gray-500 dark:text-gray-400">
              ({filteredItems().length} items)
            </span>
          </h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setCustomization(prev => ({ ...prev, layout: prev.layout === 'grid' ? 'list' : 'grid' }))}
              className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              {customization.layout === 'grid' ? <FiMenu /> : <FiGrid />}
            </button>
            <button 
              onClick={() => setCustomization(prev => ({ ...prev, cardStyle: prev.cardStyle === 'neumorphic' ? 'glass' : prev.cardStyle === 'glass' ? 'flat' : 'neumorphic' }))}
              className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              {customization.cardStyle === 'neumorphic' ? <FiMaximize /> : customization.cardStyle === 'glass' ? <FiGrid /> : <FiSun />}
            </button>
          </div>
        </div>

        {/* Menu Items */}
        {customization.layout === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems().map((item) => (
              <div 
                key={item.id} 
                className={`relative rounded-xl p-4 transition-all duration-200 ${getCardStyleClasses()} ${expandedItems.includes(item.id) ? 'ring-2' : ''}`}
                style={{ 
                  '--tw-ring-color': customization.accentColor,
                  borderColor: expandedItems.includes(item.id) ? customization.accentColor : 'transparent'
                }}
              >
                <div className="flex items-start">
                  <div 
                    className={`p-3 rounded-lg mr-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                    style={{ color: customization.accentColor }}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium dark:text-white">{item.name}</h3>
                      <button 
                        onClick={(e) => toggleItemPin(item.id, e)}
                        className="text-gray-400 hover:text-yellow-500"
                      >
                        {pinnedItems.includes(item.id) ? <FiFilledStar className="text-yellow-500" /> : <FiStar />}
                      </button>
                    </div>
                    
                    {/* Badges */}
                    <div className="mt-1 flex flex-wrap gap-1">
                      {item.isNew && (
                        <span className="px-1.5 py-0.5 text-xs rounded-full bg-green-500 text-white">
                          New
                        </span>
                      )}
                      {item.isPro && (
                        <span className="px-1.5 py-0.5 text-xs rounded-full bg-purple-500 text-white">
                          Pro
                        </span>
                      )}
                      {item.id === 7 && notificationCount > 0 && (
                        <span className="px-1.5 py-0.5 text-xs rounded-full bg-red-500 text-white">
                          {notificationCount}
                        </span>
                      )}
                      {item.id === 6 && unreadMessages > 0 && (
                        <span className="px-1.5 py-0.5 text-xs rounded-full bg-blue-500 text-white">
                          {unreadMessages}
                        </span>
                      )}
                      {item.id === 51 && (
                        <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                          currentStatus === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                        } text-white`}>
                          {currentStatus}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Expandable Content */}
                {expandedItems.includes(item.id) && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {item.description || "Feature description would go here explaining what this feature does."}
                    </p>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleMenuItemClick(item)}
                        className={`px-3 py-1 text-sm rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                      >
                        Open
                      </button>
                      {item.hasSubmenu && (
                        <button 
                          onClick={() => setActiveSubmenu(activeSubmenu === item.id ? null : item.id)}
                          className={`px-3 py-1 text-sm rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} flex items-center`}
                        >
                          Options
                          {activeSubmenu === item.id ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />}
                        </button>
                      )}
                    </div>
                    
                    {/* Submenu */}
                    {activeSubmenu === item.id && item.hasSubmenu && (
                      <div className="mt-3 space-y-2">
                        {item.id === 3 && ( // Create Post
                          <>
                            <button 
                              className="w-full text-left px-3 py-2 text-sm rounded-lg flex items-center hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => console.log('Create Post: From Gallery')}
                            >
                              <FiImage className="mr-2" /> From Gallery
                            </button>
                            <button 
                              className="w-full text-left px-3 py-2 text-sm rounded-lg flex items-center hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => console.log('Create Post: Take Photo')}
                            >
                              <FiCamera className="mr-2" /> Take Photo
                            </button>
                          </>
                        )}
                        {item.id === 4 && ( // Create Reel
                          <>
                            <button 
                              className="w-full text-left px-3 py-2 text-sm rounded-lg flex items-center hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => console.log('Create Reel: From Gallery')}
                            >
                              <FiFilm className="mr-2" /> From Gallery
                            </button>
                            <button 
                              className="w-full text-left px-3 py-2 text-sm rounded-lg flex items-center hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => console.log('Create Reel: Record Video')}
                            >
                              <FiVideo className="mr-2" /> Record Video
                            </button>
                          </>
                        )}
                        {item.id === 5 && ( // Create Story
                          <>
                            <button 
                              className="w-full text-left px-3 py-2 text-sm rounded-lg flex items-center hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => console.log('Create Story: Photo')}
                            >
                              <FiImage className="mr-2" /> Photo
                            </button>
                            <button 
                              className="w-full text-left px-3 py-2 text-sm rounded-lg flex items-center hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => console.log('Create Story: Video')}
                            >
                              <FiVideo className="mr-2" /> Video
                            </button>
                            <button 
                              className="w-full text-left px-3 py-2 text-sm rounded-lg flex items-center hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => console.log('Create Story: Text')}
                            >
                              <FiType className="mr-2" /> Text
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Expand/Collapse Button */}
                <button 
                  onClick={() => toggleItemExpansion(item.id)}
                  className={`absolute top-2 right-2 p-1 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                >
                  {expandedItems.includes(item.id) ? <FiChevronUp /> : <FiChevronDown />}
                </button>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-3">
            {filteredItems().map((item) => (
              <div 
                key={item.id} 
                className={`relative rounded-xl p-4 transition-all duration-200 ${getCardStyleClasses()} ${expandedItems.includes(item.id) ? 'ring-2' : ''}`}
                style={{ 
                  '--tw-ring-color': customization.accentColor,
                  borderColor: expandedItems.includes(item.id) ? customization.accentColor : 'transparent'
                }}
              >
                <div className="flex items-center">
                  <div 
                    className={`p-3 rounded-lg mr-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                    style={{ color: customization.accentColor }}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium dark:text-white">{item.name}</h3>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={(e) => toggleItemPin(item.id, e)}
                          className="text-gray-400 hover:text-yellow-500"
                        >
                          {pinnedItems.includes(item.id) ? <FiFilledStar className="text-yellow-500" /> : <FiStar />}
                        </button>
                        <button 
                          onClick={() => toggleItemExpansion(item.id)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {expandedItems.includes(item.id) ? <FiChevronUp /> : <FiChevronDown />}
                        </button>
                      </div>
                    </div>
                    
                    {/* Badges */}
                    <div className="mt-1 flex flex-wrap gap-1">
                      {item.isNew && (
                        <span className="px-1.5 py-0.5 text-xs rounded-full bg-green-500 text-white">
                          New
                        </span>
                      )}
                      {item.isPro && (
                        <span className="px-1.5 py-0.5 text-xs rounded-full bg-purple-500 text-white">
                          Pro
                        </span>
                      )}
                      {item.id === 7 && notificationCount > 0 && (
                        <span className="px-1.5 py-0.5 text-xs rounded-full bg-red-500 text-white">
                          {notificationCount}
                        </span>
                      )}
                      {item.id === 6 && unreadMessages > 0 && (
                        <span className="px-1.5 py-0.5 text-xs rounded-full bg-blue-500 text-white">
                          {unreadMessages}
                        </span>
                      )}
                      {item.id === 51 && (
                        <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                          currentStatus === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                        } text-white`}>
                          {currentStatus}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Expandable Content */}
                {expandedItems.includes(item.id) && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      {item.description || "Feature description would go here explaining what this feature does."}
                    </p>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleMenuItemClick(item)}
                        className={`px-3 py-1 text-sm rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                      >
                        Open
                      </button>
                      {item.hasSubmenu && (
                        <button 
                          onClick={() => setActiveSubmenu(activeSubmenu === item.id ? null : item.id)}
                          className={`px-3 py-1 text-sm rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} flex items-center`}
                        >
                          Options
                          {activeSubmenu === item.id ? <FiChevronUp className="ml-1" /> : <FiChevronDown className="ml-1" />}
                        </button>
                      )}
                    </div>
                    
                    {/* Submenu */}
                    {activeSubmenu === item.id && item.hasSubmenu && (
                      <div className="mt-3 space-y-2">
                        {item.id === 3 && ( // Create Post
                          <>
                            <button 
                              className="w-full text-left px-3 py-2 text-sm rounded-lg flex items-center hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => console.log('Create Post: From Gallery')}
                            >
                              <FiImage className="mr-2" /> From Gallery
                            </button>
                            <button 
                              className="w-full text-left px-3 py-2 text-sm rounded-lg flex items-center hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => console.log('Create Post: Take Photo')}
                            >
                              <FiCamera className="mr-2" /> Take Photo
                            </button>
                          </>
                        )}
                        {item.id === 4 && ( // Create Reel
                          <>
                            <button 
                              className="w-full text-left px-3 py-2 text-sm rounded-lg flex items-center hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => console.log('Create Reel: From Gallery')}
                            >
                              <FiFilm className="mr-2" /> From Gallery
                            </button>
                            <button 
                              className="w-full text-left px-3 py-2 text-sm rounded-lg flex items-center hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => console.log('Create Reel: Record Video')}
                            >
                              <FiVideo className="mr-2" /> Record Video
                            </button>
                          </>
                        )}
                        {item.id === 5 && ( // Create Story
                          <>
                            <button 
                              className="w-full text-left px-3 py-2 text-sm rounded-lg flex items-center hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => console.log('Create Story: Photo')}
                            >
                              <FiImage className="mr-2" /> Photo
                            </button>
                            <button 
                              className="w-full text-left px-3 py-2 text-sm rounded-lg flex items-center hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => console.log('Create Story: Video')}
                            >
                              <FiVideo className="mr-2" /> Video
                            </button>
                            <button 
                              className="w-full text-left px-3 py-2 text-sm rounded-lg flex items-center hover:bg-gray-100 dark:hover:bg-gray-700"
                              onClick={() => console.log('Create Story: Text')}
                            >
                              <FiType className="mr-2" /> Text
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredItems().length === 0 && (
          <div className={`text-center py-16 rounded-xl ${getCardStyleClasses()}`}>
            <FiSearch className="mx-auto w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium dark:text-white">No results found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Try a different search term or check another section</p>
            <button 
              onClick={() => setSearchQuery('')}
              className={`mt-4 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              Clear search
            </button>
          </div>
        )}
      </main>

      {/* Command Palette Modal */}
      {showCommandPalette && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-30">
          <div 
            className={`w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'} animate-fade-in`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className={`relative flex items-center rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <FiSearch className="absolute left-3 text-gray-400" />
                <input
                  ref={commandInputRef}
                  type="text"
                  placeholder="Type a command or search..."
                  className={`w-full py-3 pl-10 pr-4 ${isDarkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-100 text-gray-800 placeholder-gray-500'} rounded-lg focus:outline-none focus:ring-2`}
                  style={{ '--tw-ring-color': customization.accentColor }}
                  autoFocus
                />
              </div>
            </div>
            <div className="py-2 max-h-[60vh] overflow-y-auto">
              {commandPaletteCommands.map((group, index) => (
                <div key={index}>
                  <div className="px-4 py-2 text-sm font-medium dark:text-gray-400">{group.category}</div>
                  {group.commands.map((command) => (
                    <button 
                      key={command.id}
                      className="flex items-center w-full px-4 py-3 text-left hover:bg-gray-200 dark:hover:bg-gray-700"
                      onClick={() => {
                        command.action();
                        setShowCommandPalette(false);
                      }}
                    >
                      <span className={`p-2 rounded-lg mr-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`} style={{ color: customization.accentColor }}>
                        {command.icon}
                      </span>
                      <div>
                        <div className="font-medium">{command.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {command.id === 'home' && 'Navigate to home screen'}
                          {command.id === 'explore' && 'Discover new content'}
                          {command.id === 'profile' && 'View your profile'}
                          {command.id === 'settings' && 'Adjust app settings'}
                          {command.id === 'post' && 'Create a new post'}
                          {command.id === 'reel' && 'Create a new reel'}
                          {command.id === 'story' && 'Create a new story'}
                          {command.id === 'ai' && 'Open AI assistant'}
                          {command.id === 'voice' && 'Start voice search'}
                          {command.id === 'dark' && 'Toggle dark/light mode'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
            <div className={`p-3 text-center text-sm ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
              Press <kbd className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700">Esc</kbd> to close
            </div>
          </div>
        </div>
      )}

      {/* AI Assistant Modal */}
      {showAIAssistant && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-30">
          <div 
            className={`w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-white'} animate-fade-in`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} flex items-center`}>
              <div className={`p-2 rounded-lg mr-3 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`} style={{ color: customization.accentColor }}>
                <FiCommand />
              </div>
              <h3 className="font-medium">AI Assistant</h3>
              <button 
                onClick={toggleAIAssistant}
                className="ml-auto p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              <div className={`p-4 rounded-lg mb-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <p className="font-medium mb-1">AI Assistant</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">How can I help you today? Ask me anything about the app features or how to accomplish specific tasks.</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setAiPrompt('How do I create a new post?')}
                    className={`px-3 py-1.5 text-sm rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    Create post
                  </button>
                  <button 
                    onClick={() => setAiPrompt('How do I change my settings?')}
                    className={`px-3 py-1.5 text-sm rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    Change settings
                  </button>
                  <button 
                    onClick={() => setAiPrompt('What are the new features?')}
                    className={`px-3 py-1.5 text-sm rounded-lg ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    New features
                  </button>
                </div>
                
                <div className={`relative rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <textarea
                    ref={aiInputRef}
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Ask me anything about the app..."
                    className={`w-full p-3 ${isDarkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-100 text-gray-800 placeholder-gray-500'} rounded-lg focus:outline-none focus:ring-2`}
                    style={{ '--tw-ring-color': customization.accentColor }}
                    rows={3}
                  />
                  <button 
                    onClick={() => console.log('AI Prompt:', aiPrompt)}
                    className={`absolute right-3 bottom-3 px-3 py-1 rounded-lg ${aiPrompt ? `text-white` : 'text-gray-400'}`}
                    style={{ backgroundColor: aiPrompt ? customization.accentColor : (isDarkMode ? 'bg-gray-600' : 'bg-gray-300') }}
                    disabled={!aiPrompt}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
            <div className={`p-3 text-center text-sm ${isDarkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
              SOCIALVIBE AI
            </div>
          </div>
        </div>
      )}

      {/* Customization Floating Button */}
      <button 
        onClick={() => setCustomization(prev => ({ ...prev, cardStyle: prev.cardStyle === 'neumorphic' ? 'glass' : prev.cardStyle === 'glass' ? 'flat' : 'neumorphic' }))}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg z-20 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'}`}
        style={{ color: customization.accentColor }}
      >
        <FiSliders className="w-6 h-6" />
      </button>
    </div>
  );
};

export default UltraModernMenu;