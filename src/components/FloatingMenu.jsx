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
  FiSearch
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const FloatingMenu = () => {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen((prev) => !prev);

  const buttons = [
    { to: "/search", icon: <FiSearch size={18} />, label: "Search" },
    { to: "/message", icon: <FiMessageCircle size={18} />, label: "Messages" },
    { to: "/menu", icon: <FiMenu size={18} />, label: "Menu" },
    { to: "/profile", icon: <FiUser size={18} />, label: "Profile" },
  
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-2">
      <AnimatePresence>
        {open &&
          buttons.map((btn, i) => (
            <motion.div
              key={btn.to}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
            >
              <Link
                to={btn.to}
                className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg hover:scale-105 transition text-gray-700 dark:text-white flex items-center space-x-2 min-w-[130px] px-4"
                title={btn.label}
              >
                {btn.icon}
                <span className="text-sm font-medium">{btn.label}</span>
              </Link>
            </motion.div>
          ))}
      </AnimatePresence>

      {/* Main button */}
      <motion.button
        onClick={toggleMenu}
        whileTap={{ scale: 0.9 }}
        className="bg-gradient-to-r from-pink-500 to-purple-500 p-2 rounded-full shadow-lg text-white"
      >
        <FiMoreHorizontal size={16} />
      </motion.button>
    </div>
  );
};

export default FloatingMenu;
