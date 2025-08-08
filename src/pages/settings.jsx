import {
  FaChevronRight, FaLock, FaUser, FaBell, FaShieldAlt, FaInfoCircle, FaPalette, FaQuestionCircle,
  FaSignOutAlt, FaUserFriends, FaUserPlus, FaUserMinus, FaEye, FaMoon, FaLanguage, FaDownload,
  FaCloudUploadAlt, FaSync, FaTrash, FaChevronLeft, FaEnvelope, FaKey, FaMapMarkerAlt, FaStar,
  FaTrophy, FaUserEdit, FaRegSmile, FaComment, FaShare, FaBookmark, FaCalendarAlt, FaList, FaCheck,
  FaUserCircle, FaBug, FaPowerOff, FaUserLock, FaUserSecret, FaBellSlash, FaUserCog, FaQrcode,
  FaMobile, FaGlobe, FaFilter, FaRobot, FaEyeSlash, FaHistory,  FaClock, FaSlidersH,
  FaFont, FaVolumeUp, FaVolumeMute, FaHandPointer, FaColumns, FaImage, FaAd, FaCode,
  FaWallet, FaTools, FaUniversalAccess, FaBalanceScale, FaHeadset, FaDatabase, FaTag,
  FaThumbtack, FaLayerGroup, FaMagic, FaBrush, FaTextHeight, FaTablet, FaPaintRoller,
 FaCog, FaSearch, FaFileExport, FaFileImport, FaMicrochip, FaFingerprint,
  FaIdCard, FaMailBulk, FaSms, FaStream, FaPoll, FaVoteYea, FaHourglass,
  FaPuzzlePiece, FaChartLine, FaNewspaper, FaFileAlt, FaUserClock, FaUserShield, FaUserTag,
  FaUserCheck, FaUserNinja, FaUserGraduate, FaUserAstronaut, FaUserMd, FaUserTie, FaLink, FaTh, FaRunning, FaPhotoVideo
} from "react-icons/fa";
import {FiLogOut} from "react-icons/fi"
import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";

export default function SettingsPage() {
  const { 
    user, 
    toggleDarkMode, 
    darkMode, 
    toggleNotifications, 
    notificationsEnabled,
    togglePrivacyMode,
    privacyMode,
    toggleTwoFactor,
    twoFactorEnabled,
  } = useContext(AuthContext);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    window.location.href = "/logout";
  };

  const handleCancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-black flex flex-col items-center py-4 px-1 sm:px-2">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-2 sm:p-4 overflow-y-auto max-h-screen">
        {/* Header */}
        <div className="flex items-center mb-4 sm:mb-6 sticky top-0 bg-white dark:bg-neutral-900 z-10 pt-2">
          <Link to="/menu" className="mr-3 text-gray-500 hover:text-pink-500">
            <FaChevronLeft size={22} />
          </Link>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex-1 text-center">Settings</h2>
        </div>
        
        {/* User quick info */}
        <div className="flex flex-col items-center mb-4">
          <img
            src={user?.avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
            alt="profile"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-pink-500 mb-2 object-cover"
          />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{user?.name || "Your Name"}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">@{user?.username || "username"}</p>
          <Link
            to="/settings/edit-profile"
            className="mt-2 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300 text-xs font-semibold hover:bg-pink-200 dark:hover:bg-pink-800 transition"
          >
            <FaUserEdit className="inline mr-1" /> Edit Profile
          </Link>
        </div>

        {/* Quick toggles */}
        <div className="flex flex-col gap-4 mb-4 px-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={toggleDarkMode}
              className="form-checkbox h-5 w-5 text-pink-500"
            />
            <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={toggleNotifications}
              className="form-checkbox h-5 w-5 text-pink-500"
            />
            <span className="text-gray-700 dark:text-gray-300">Enable Notifications</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={privacyMode}
              onChange={togglePrivacyMode}
              className="form-checkbox h-5 w-5 text-pink-500"
            />
            <span className="text-gray-700 dark:text-gray-300">Private Account</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={twoFactorEnabled}
              onChange={toggleTwoFactor}
              className="form-checkbox h-5 w-5 text-pink-500"
            />
            <span className="text-gray-700 dark:text-gray-300">Two-Factor Authentication</span>
          </label>
        </div>

        {/* Settings sections */}
        <nav className="flex flex-col gap-1">
          {/* Account Settings Section */}
          <Section title="Account Settings">
            <SettingsLink icon={<FaUserEdit />} label="Edit Profile" to="/settings/edit-profile" />
            <SettingsLink icon={<FaUser />} label="Change Username" to="/settings/change-username" />
            <SettingsLink icon={<FaUserCircle />} label="Change Display Name" to="/settings/display-name" />
            <SettingsLink icon={<FaImage />} label="Profile Picture" to="/settings/profile-picture" />
            <SettingsLink icon={<FaImage />} label="Cover Photo" to="/settings/cover-photo" />
            <SettingsLink icon={<FaFileAlt />} label="Update Bio" to="/settings/bio" />
            <SettingsLink icon={<FaEnvelope />} label="Email Address" to="/settings/email" />
            <SettingsLink icon={<FaMobile />} label="Phone Number" to="/settings/phone" />
            <SettingsLink icon={<FaKey />} label="Password" to="/settings/password" />
            <SettingsLink icon={<FaShieldAlt />} label="2FA Setup" to="/settings/two-factor" />
            <SettingsLink icon={<FaMailBulk />} label="Account Recovery" to="/settings/recovery-email" />
            <SettingsLink icon={<FaUserShield />} label="Account Type" to="/settings/account-type" />
            <SettingsLink icon={<FaHistory />} label="Username History" to="/settings/username-history" />
            <SettingsLink icon={<FaLink />} label="Custom Profile URL" to="/settings/custom-url" />
            <SettingsLink icon={<FaFileExport />} label="Export Activity" to="/settings/export-activity" />
            {/* <SettingsLink icon={<FaMerge />} label="Merge Accounts" to="/settings/merge-accounts" /> */}
            <SettingsLink icon={<FaPowerOff />} label="Deactivate Account" to="/settings/deactivate" />
            <SettingsLink icon={<FaClock />} label="Login History" to="/settings/login-history" />
            <SettingsLink icon={<FaMapMarkerAlt />} label="Login Locations" to="/settings/login-locations" />
            <SettingsLink icon={<FaFingerprint />} label="Biometric Login" to="/settings/biometric" />
            <SettingsLink icon={<FaQrcode />} label="QR Login" to="/settings/qr-login" />
            <SettingsLink icon={<FaMicrochip />} label="PIN Security" to="/settings/pin" />
            <SettingsLink icon={<FaUserClock />} label="Inactivity Auto-Lock" to="/settings/auto-lock" />
            <SettingsLink icon={<FaUserCheck />} label="Trusted Devices" to="/settings/trusted-devices" />
            <SettingsLink icon={<FaUserNinja />} label="IP Whitelist" to="/settings/ip-whitelist" />
            <SettingsLink icon={<FaUserGraduate />} label="Time Restrictions" to="/settings/time-restrictions" />
            <SettingsLink icon={<FaUserAstronaut />} label="Emergency Access" to="/settings/emergency-access" />
            <SettingsLink icon={<FaUserTag />} label="Personal Pronouns" to="/settings/pronouns" />
            <SettingsLink icon={<FaUniversalAccess />} label="Accessibility Mode" to="/settings/accessibility" />
            <SettingsLink icon={<FaEyeSlash />} label="Location Visibility" to="/settings/location-visibility" />
            <SettingsLink icon={<FaBrush />} label="Account Color Scheme" to="/settings/color-scheme" />
            <SettingsLink icon={<FaIdCard />} label="Verified Badge" to="/settings/verified-badge" />
            <SettingsLink icon={<FaDatabase />} label="Download Data" to="/settings/download-data" />
            <SettingsLink icon={<FaTrash />} label="Delete Account" to="/settings/delete-account" className="text-red-600 dark:text-red-400" />
          </Section>

          {/* Privacy Settings Section */}
          <Section title="Privacy Settings">
            <SettingsLink icon={<FaLock />} label="Account Privacy" to="/settings/account-privacy" />
            <SettingsLink icon={<FaUserFriends />} label="Follower Approval" to="/settings/follower-approval" />
            <SettingsLink icon={<FaUserPlus />} label="Friend Requests" to="/settings/friend-requests" />
            <SettingsLink icon={<FaEnvelope />} label="Message Controls" to="/settings/message-controls" />
            <SettingsLink icon={<FaTag />} label="Tagging Controls" to="/settings/tagging" />
            <SettingsLink icon={<FaComment />} label="Comment Controls" to="/settings/comment-controls" />
            <SettingsLink icon={<FaBookmark />} label="Story Privacy" to="/settings/story-privacy" />
            <SettingsLink icon={<FaUserMinus />} label="Restricted Accounts" to="/settings/restricted" />
            <SettingsLink icon={<FaFilter />} label="Keyword Filters" to="/settings/keyword-filters" />
            <SettingsLink icon={<FaEyeSlash />} label="Activity Status" to="/settings/activity-status" />
            <SettingsLink icon={<FaGlobe />} label="Country Restrictions" to="/settings/country-restrictions" />
            <SettingsLink icon={<FaMapMarkerAlt />} label="Location Tracking" to="/settings/location-tracking" />
            <SettingsLink icon={<FaRobot />} label="Facial Recognition" to="/settings/facial-recognition" />
            <SettingsLink icon={<FaShare />} label="Repost Controls" to="/settings/repost-controls" />
            <SettingsLink icon={<FaEye />} label="Screenshot Prevention" to="/settings/screenshot-prevention" />
            <SettingsLink icon={<FaVolumeMute />} label="Muted Accounts" to="/settings/muted" />
            <SettingsLink icon={<FaEyeSlash />} label="Hide Follower Count" to="/settings/hide-followers" />
            <SettingsLink icon={<FaCheck />} label="Seen Receipts" to="/settings/seen-receipts" />
            <SettingsLink icon={<FaUserSecret />} label="Anonymous Mode" to="/settings/anonymous-mode" />
            <SettingsLink icon={<FaSearch />} label="Search Visibility" to="/settings/search-visibility" />
            <SettingsLink icon={<FaNewspaper />} label="Hide Recent Activity" to="/settings/hide-activity" />
            <SettingsLink icon={<FaThumbtack />} label="Saved Posts Privacy" to="/settings/saved-posts-privacy" />
            {/* <SettingsLink icon={<FaSlidersH />} label="Privacy Presets" to="/settings/privacy-presets" /> */}
            <SettingsLink icon={<FaUserCog />} label="Follower Group Visibility" to="/settings/follower-groups" />
          </Section>

          {/* Notification Settings Section */}
          <Section title="Notification Settings">
            <SettingsLink icon={<FaBell />} label="Notification Preferences" to="/settings/notifications" />
            <SettingsLink icon={<FaEnvelope />} label="Email Notifications" to="/settings/email-notifications" />
            <SettingsLink icon={<FaMobile />} label="Push Notifications" to="/settings/push-notifications" />
            <SettingsLink icon={<FaSms />} label="SMS Alerts" to="/settings/sms-alerts" />
            <SettingsLink icon={<FaBellSlash />} label="Quiet Hours" to="/settings/quiet-hours" />
            <SettingsLink icon={<FaStream />} label="Notification Sounds" to="/settings/notification-sounds" />
            <SettingsLink icon={<FaVolumeUp />} label="Vibration Patterns" to="/settings/vibration" />
            <SettingsLink icon={<FaPoll />} label="Poll Notifications" to="/settings/poll-notifications" />
            <SettingsLink icon={<FaVoteYea />} label="Voting Reminders" to="/settings/voting-reminders" />
            <SettingsLink icon={<FaHourglass />} label="Digest Schedule" to="/settings/digest-schedule" />
            <SettingsLink icon={<FaChartLine />} label="Smart Alerts" to="/settings/smart-alerts" />
            <SettingsLink icon={<FaMagic />} label="AI Digest" to="/settings/ai-digest" />
            <SettingsLink icon={<FaFilter />} label="Notification Filters" to="/settings/notification-filters" />
            <SettingsLink icon={<FaPuzzlePiece />} label="Group Notifications" to="/settings/group-notifications" />
            <SettingsLink icon={<FaBellSlash />} label="Snooze Alerts" to="/settings/snooze-alerts" />
            <SettingsLink icon={<FaCalendarAlt />} label="Notification Schedule" to="/settings/notification-schedule" />
            <SettingsLink icon={<FaTrophy />} label="Milestone Alerts" to="/settings/milestone-alerts" />
            {/* <SettingsLink icon={<FaSlidersH />} label="Custom Alerts" to="/settings/custom-alerts" /> */}
          </Section>

          {/* App Behavior & UI Preferences */}
          <Section title="App Preferences">
            <SettingsLink icon={<FaLanguage />} label="Language" to="/settings/language" />
            <SettingsLink icon={<FaMoon />} label="Dark Mode" to="/settings/dark-mode" />
            {/* <SettingsLink icon={<FaSlidersHSquare />} label="Auto-Theme" to="/settings/auto-theme" /> */}
            <SettingsLink icon={<FaFont />} label="Font Size" to="/settings/font-size" />
            <SettingsLink icon={<FaColumns />} label="Compact Mode" to="/settings/compact-mode" />
            <SettingsLink icon={<FaHandPointer />} label="Gestures" to="/settings/gestures" />
            <SettingsLink icon={<FaTh />} label="Tab Order" to="/settings/tab-order" />
            <SettingsLink icon={<FaQuestionCircle />} label="Tutorial" to="/settings/tutorial" />
            <SettingsLink icon={<FaPalette />} label="Icon Style" to="/settings/icon-style" />
            <SettingsLink icon={<FaPaintRoller />} label="Wallpaper" to="/settings/wallpaper" />
            <SettingsLink icon={<FaTextHeight />} label="Font Selection" to="/settings/font-selection" />
            <SettingsLink icon={<FaUniversalAccess />} label="UI Scaling" to="/settings/ui-scaling" />
            <SettingsLink icon={<FaTablet />} label="Orientation" to="/settings/orientation" />
            <SettingsLink icon={<FaCog />} label="Menu Position" to="/settings/menu-position" />
            <SettingsLink icon={<FaAd />} label="Hide Ads" to="/settings/hide-ads" />
            <SettingsLink icon={<FaImage />} label="Image Previews" to="/settings/image-previews" />
            <SettingsLink icon={<FaMagic />} label="Theme Marketplace" to="/settings/theme-marketplace" />
            <SettingsLink icon={<FaBrush />} label="Custom Skins" to="/settings/custom-skins" />
            <SettingsLink icon={<FaLayerGroup />} label="Layout Presets" to="/settings/layout-presets" />
            <SettingsLink icon={<FaFileImport />} label="Import/Export Themes" to="/settings/theme-import" />
            <SettingsLink icon={<FaPuzzlePiece />} label="Widgets" to="/settings/widgets" />
            <SettingsLink icon={<FaSlidersH />} label="Dashboard Layout" to="/settings/dashboard-layout" />
            <SettingsLink icon={<FaUniversalAccess />} label="Accessibility" to="/settings/accessibility" />
            <SettingsLink icon={<FaRunning />} label="Reduced Motion" to="/settings/reduced-motion" />
            <SettingsLink icon={<FaThumbtack />} label="Pinned Tabs" to="/settings/pinned-tabs" />
            <SettingsLink icon={<FaPaintRoller />} label="Live Theme Editor" to="/settings/theme-editor" />
          </Section>

          {/* Additional Sections */}
          <Section title="Content & Media">
            <SettingsLink icon={<FaPhotoVideo />} label="Media Quality" to="/settings/media-quality" />
            <SettingsLink icon={<FaDownload />} label="Download Preferences" to="/settings/download-preferences" />
            <SettingsLink icon={<FaCloudUploadAlt />} label="Upload Settings" to="/settings/upload-settings" />
            <SettingsLink icon={<FaEyeSlash />} label="Content Filters" to="/settings/content-filters" />
            <SettingsLink icon={<FaSlidersH />} label="Autoplay Controls" to="/settings/autoplay" />
          </Section>

          <Section title="Billing & Subscriptions">
            <SettingsLink icon={<FaWallet />} label="Payment Methods" to="/settings/payment-methods" />
            <SettingsLink icon={<FaStar />} label="Premium Features" to="/settings/premium" />
            <SettingsLink icon={<FaNewspaper />} label="Subscription Management" to="/settings/subscriptions" />
          </Section>

          <Section title="Developer & API">
            <SettingsLink icon={<FaCode />} label="Developer Options" to="/settings/developer" />
            <SettingsLink icon={<FaKey />} label="API Keys" to="/settings/api-keys" />
            <SettingsLink icon={<FaTools />} label="Webhooks" to="/settings/webhooks" />
          </Section>

          <Section title="Support & About">
            <SettingsLink icon={<FaQuestionCircle />} label="Help Center" to="/settings/help" />
            <SettingsLink icon={<FaHeadset />} label="Contact Support" to="/settings/support" />
            <SettingsLink icon={<FaBug />} label="Report a Bug" to="/settings/report-bug" />
            <SettingsLink icon={<FaInfoCircle />} label="About" to="/settings/about" />
            <SettingsLink icon={<FaBalanceScale />} label="Legal" to="/settings/legal" />
            <SettingsLink icon={<FaDatabase />} label="Data Policy" to="/settings/data-policy" />
          </Section>

          {/* Logout Section */}
          <Section title="Session">
            <button
              onClick={handleLogoutClick}
              className="flex items-center justify-between px-3 sm:px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition text-red-600 dark:text-red-400 w-full"
            >
              <span className="flex items-center gap-3">
                <FiLogOut />
                <span className="truncate">Log Out</span>
              </span>
            </button>
          </Section>
        </nav>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 max-w-sm w-full shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Confirm Logout</h3>
            <p className="mb-6 text-gray-700 dark:text-gray-300">Are you sure you want to log out?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancelLogout}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-4 py-2 rounded-lg bg-pink-500 text-white hover:bg-pink-600 transition"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-3 sm:mb-4">
      <h3 className="text-xs font-bold text-gray-400 uppercase mb-2 px-2">{title}</h3>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  );
}

function SettingsLink({ icon, label, to, className = "" }) {
  return (
    <Link
      to={to}
      className={`flex items-center justify-between px-3 sm:px-4 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition text-gray-700 dark:text-gray-200 ${className}`}
    >
      <span className="flex items-center gap-3">
        {icon}
        <span className="truncate">{label}</span>
      </span>
      <FaChevronRight className="text-gray-400" />
    </Link>
  );
}