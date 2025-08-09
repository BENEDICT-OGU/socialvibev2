import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiSun, 
  FiMoon,
  FiLock,
  FiBell,
  FiUser,
  FiMail,
  FiEye,
  FiEyeOff,
  FiGlobe,
  FiHelpCircle,
  FiShield,
  FiCreditCard,
  FiDownload,
  FiTrash2,
  FiAward,
  FiHeart
} from "react-icons/fi";
import { FaLanguage } from "react-icons/fa";

export default function SettingsPage({ darkMode, toggleDarkMode }) {
  const [activeTab, setActiveTab] = useState("account");
  const location = useLocation();

  // Settings states
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [showSensitiveContent, setShowSensitiveContent] = useState(false);
  const [language, setLanguage] = useState("english");
  const [autoPlayVideos, setAutoPlayVideos] = useState(true);
  const [saveLoginInfo, setSaveLoginInfo] = useState(true);
  const [dataSaver, setDataSaver] = useState(false);

  const settingsTabs = [
    { id: "account", label: "Account", icon: <FiUser /> },
    { id: "privacy", label: "Privacy", icon: <FiLock /> },
    { id: "notifications", label: "Notifications", icon: <FiBell /> },
    { id: "content", label: "Content Preferences", icon: <FiEye /> },
    { id: "language", label: "Language", icon: <FaLanguage /> },
    { id: "security", label: "Security", icon: <FiShield /> },
    { id: "payments", label: "Payments", icon: <FiCreditCard /> },
    { id: "data", label: "Data Usage", icon: <FiDownload /> },
    { id: "delete", label: "Delete Account", icon: <FiTrash2 /> }
  ];

  return (
    <div className={`flex min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar Navigation */}
      <div className={`w-64 border-r ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} p-4 hidden md:block`}>
        <h2 className="text-xl font-bold mb-6 text-pink-500">Settings</h2>
        <nav className="space-y-1">
          {settingsTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center w-full px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === tab.id 
                  ? 'bg-pink-500 text-white' 
                  : darkMode 
                    ? 'hover:bg-gray-700' 
                    : 'hover:bg-gray-100'
              }`}
            >
              <span className="mr-3">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-6">{settingsTabs.find(t => t.id === activeTab)?.label || "Settings"}</h1>
        
        {/* Mobile tabs */}
        <div className="md:hidden mb-6 overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            {settingsTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm ${
                  activeTab === tab.id
                    ? 'bg-pink-500 text-white'
                    : darkMode
                      ? 'bg-gray-700 text-gray-300'
                      : 'bg-gray-200 text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content */}
        <div className={`rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 shadow-sm`}>
          {activeTab === "account" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Dark Mode</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {darkMode ? "Currently in dark mode" : "Currently in light mode"}
                  </p>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    darkMode ? 'bg-pink-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      darkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                  <span className="sr-only">Toggle dark mode</span>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Account Information</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    View and update your account details
                  </p>
                </div>
                <Link 
                  to="/profile/edit" 
                  className="text-pink-500 hover:text-pink-600 dark:hover:text-pink-400 text-sm font-medium"
                >
                  Edit
                </Link>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Email Address</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    user@example.com
                  </p>
                </div>
                <Link 
                  to="/settings/email" 
                  className="text-pink-500 hover:text-pink-600 dark:hover:text-pink-400 text-sm font-medium"
                >
                  Change
                </Link>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Password</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Last changed 3 months ago
                  </p>
                </div>
                <Link 
                  to="/settings/password" 
                  className="text-pink-500 hover:text-pink-600 dark:hover:text-pink-400 text-sm font-medium"
                >
                  Change
                </Link>
              </div>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Private Account</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Only approved followers can see your content
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={false}
                    onChange={() => {}}
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Activity Status</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Show when you're active on the app
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={true}
                    onChange={() => {}}
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Show Sensitive Content</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Display content that may be sensitive
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={showSensitiveContent}
                    onChange={() => setShowSensitiveContent(!showSensitiveContent)}
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Blocked Users</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Manage blocked accounts
                  </p>
                </div>
                <Link 
                  to="/settings/blocked" 
                  className="text-pink-500 hover:text-pink-600 dark:hover:text-pink-400 text-sm font-medium"
                >
                  Manage
                </Link>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Notifications</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enable or disable all notifications
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={notificationsEnabled}
                    onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive notifications via email
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={emailNotifications}
                    onChange={() => setEmailNotifications(!emailNotifications)}
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Push Notifications</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Receive notifications on your device
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={pushNotifications}
                    onChange={() => setPushNotifications(!pushNotifications)}
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Message Notifications</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Alerts for new messages
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={true}
                    onChange={() => {}}
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                </label>
              </div>
            </div>
          )}

          {activeTab === "language" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">App Language</h3>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className={`w-full p-3 rounded-lg border ${
                    darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                  }`}
                >
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={twoFactorAuth}
                    onChange={() => setTwoFactorAuth(!twoFactorAuth)}
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Login Alerts</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Get notified when your account is accessed
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={true}
                    onChange={() => {}}
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Saved Login Information</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Remember login details for faster access
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={saveLoginInfo}
                    onChange={() => setSaveLoginInfo(!saveLoginInfo)}
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                </label>
              </div>
            </div>
          )}

          {activeTab === "data" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Data Saver</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Reduce data usage when on mobile networks
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={dataSaver}
                    onChange={() => setDataSaver(!dataSaver)}
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Auto-play Videos</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Play videos automatically when scrolling
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={autoPlayVideos}
                    onChange={() => setAutoPlayVideos(!autoPlayVideos)}
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-500"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Download Data</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Request a copy of your data
                  </p>
                </div>
                <button className="text-pink-500 hover:text-pink-600 dark:hover:text-pink-400 text-sm font-medium">
                  Request
                </button>
              </div>
            </div>
          )}

          {activeTab === "delete" && (
            <div className="space-y-6">
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                <h3 className="font-medium text-red-500">Delete Account</h3>
                <p className="text-sm text-red-500/80 mt-1">
                  This will permanently delete your account and all associated data.
                </p>
                <button className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors">
                  Delete My Account
                </button>
              </div>

              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                <h3 className="font-medium text-yellow-500">Deactivate Account</h3>
                <p className="text-sm text-yellow-500/80 mt-1">
                  Temporarily deactivate your account instead of deleting it.
                </p>
                <button className="mt-3 px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors">
                  Deactivate Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}