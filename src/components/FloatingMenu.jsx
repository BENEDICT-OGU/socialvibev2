import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiPlus,
  FiCompass,
  FiMessageCircle,
  FiMenu,
  FiUser,
  FiMoreHorizontal,
  FiFilm,
  FiSearch,
  FiHome,
  FiSettings,
  FiCloud,
  FiBell,
} from "react-icons/fi";
import { FaRobot, FaStore } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const FloatingMenu = () => {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen((prev) => !prev);

  const buttons = [
    { to: "/", icon: <FiHome size={18} />, label: "Home" },
    { to: "/search", icon: <FiSearch size={18} />, label: "Search" },
    { to: "/message", icon: <FiMessageCircle size={18} />, label: "Messages" },
    { to: "/profile", icon: <FiUser size={18} />, label: "Profile" },
    { to: "/menu", icon: <FiMenu size={18} />, label: "Menu" },
    { to: "/settings", icon: <FiSettings size={18} />, label: "Settings" },
    { to: "/weather", icon: <FiCloud size={18} />, label: "Weather" },
    { to: "/marketplace", icon: <FaStore size={18} />, label: "MarketPlace" },
    { to: "/ai-assistant", icon: <FaRobot size={18} />, label: "AI" },
    { to: "/notifications", icon: <FiBell size={18} />, label: "Notifications" },
  ];

  return (
    <div className="relative">
      <button
        onClick={toggleMenu}
        className={`p-2 rounded-full transition-colors ${
          open
            ? "bg-gray-300 dark:bg-gradient-to-r from-pink-500 to-purple-500 rounded-full p-2 shadow-lg shadow-pink-500/30"
            : "bg-gray-700"
        }`}
      >
        <FiMoreHorizontal
          size={20}
          className={`transition-transform ${
            open ? "rotate-90" : ""
          } text-white dark:text-gray-300 `}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-12 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden w-40"
          >
            {buttons.map((btn) => (
              <Link
                key={btn.to}
                to={btn.to}
                className=" rounded-md flex items-center px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gradient-to-r from-pink-500 to-purple-500  p-2 shadow-lg shadow-pink-500/30"
                onClick={() => setOpen(false)}
              >
                <span className="mr-3">{btn.icon}</span>
                <span className="text-sm font-medium">{btn.label}</span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingMenu;
