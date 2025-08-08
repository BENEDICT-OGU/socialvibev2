import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiHome,
  FiSearch,
  FiPlusSquare,
  FiMessageCircle,
  FiBell,
  FiFilm,
  FiUser,
  FiMoreHorizontal,
  FiSun,
  FiMoon,
  FiCloud,
  FiShoppingCart,
  FiCamera,
  FiMap,
  FiMenu,

} from "react-icons/fi";
import "../App.css";
import { FaRobot, FaStore } from "react-icons/fa";
import {MdLocalGroceryStore} from "react-icons/md";

const navItems = [
  { icon: <FiHome size={24} />, label: "Home", to: "/" },
  { icon: <FiSearch size={24} />, label: "Search", to: "/search" },
  { icon: <FiFilm size={24} />, label: "Reels", to: "/reels" },
  { icon: <FiMessageCircle size={24} />, label: "Messages", to: "/message" },
  { icon: <FiBell size={24} />, label: "Notifications", to: "/notifications" },
  { icon: <FiPlusSquare size={24} />, label: "create", to: "/createPost" },
  { icon: <FiUser size={24} />, label: "Profile", to: "/profile" },
  { icon: <FiCloud size={24} />, label: "weather", to: "/weather" },
  
  {
    icon: <FaStore size={24} />,
    label: "MARKET PLACE",
    to: "/marketplace",
  },
  { icon: <FiCamera size={24} />, label: "Image Gen", to: "/image-generator" },
  { icon: <FaRobot size={24} />, label: "AI", to: "/ai-assistant" },
  { icon: <FiMap size={24} />, label: "MAP", to: "/map" },
  { icon: <FiMenu size={24} />, label: "Menu", to: "/menu" }
];

export default function LeftSidebar({ darkMode, toggleDarkMode }) {
  const [expanded, setExpanded] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Sidebar: hidden on mobile, visible on md+ */}
      <aside
        className={`hidden md:flex fixed left-0 top-0 h-[100%] z-[1000] flex-col justify-between overflow-hidden overflow-y-scroll 
    ${expanded ? "w-56" : "w-20"}
    ${
      darkMode
        ? "bg-black text-white border-gray-800"
        : "bg-white text-gray-900 border-gray-200"
    }
    border-r transition-all duration-300 shadow-sm py-6 px-2`}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        <div>
          {/*socialvibe Logo */}
          <div className="flex items-center justify-center mb-8">
            <span className="font-extrabold text-2xl tracking-tight italic text-pink-500">
              {expanded ? "SOCIALVIBE" : "SV"}
            </span>
          </div>
          {/* Navigation */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item, idx) => (
              <Link
                key={idx}
                to={item.to}
                className={`flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-pink-300 hover:text-black dark:hover:bg-neutral-800 transition
                  ${
                    location.pathname === item.to
                      ? "bg-pink-500 dark:bg-pink-500 font-bold"
                      : ""
                  }
                `}
              >
                {item.icon}
                {expanded && <span className="text-base">{item.label}</span>}
              </Link>
            ))}
            <button
              onClick={toggleDarkMode}
              className="flex items-center gap-4 px-3 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition mt-2"
            >
              {darkMode ? <FiSun size={22} /> : <FiMoon size={22} />}
              {expanded && (
                <span className="text-base">
                  {darkMode ? "Light Mode" : "Dark Mode"}
                </span>
              )}
            </button>
          </nav>
        </div>
        {/* Profile & More */}
        <div className="flex flex-col gap-2 items-center mb-2 relative">
          {/* <div className="flex items-center gap-4 w-full px-3 py-4 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer">
            <img
              src="https://i.pravatar.cc/150?img=5"
              alt="profile"
              className="w-8 h-8 rounded-full border-2 border-pink-500 object-cover"
            />
            {expanded && (
              <span className="text-base font-semibold">Your Profile</span>
            )}
          </div> */}
         
          <button
            className="flex items-center gap-4 w-full px-3 py-4 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition relative"
            onClick={() => setShowMore((prev) => !prev)}
          >
            <FiMoreHorizontal size={24} />
            {expanded && <span className="text-base">More</span>}
          </button>
          {/* Dropdown menu */}
          {expanded && showMore && (
            <div
              className={`
                absolute bottom-14 left-0
                ${expanded ? "w-48" : "w-full"}
                bg-white dark:bg-neutral-900
                shadow-lg rounded-xl border border-neutral-200 dark:border-neutral-700 p-2 z-50
                transition-all duration-200
              `}
              onMouseLeave={() => setShowMore(false)}
            >
              <Link
                to="/settings"
                className="w-full block text-left px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-gray-900 dark:text-white"
                onClick={() => setShowMore(false)}
              >
                Settings
              </Link>
              <Link
                to="/saved"
                className="w-full block text-left px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-gray-900 dark:text-white"
                onClick={() => setShowMore(false)}
              >
                Saved
              </Link>

              <Link
                to="/switch-account"
                className="w-full block text-left px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-gray-900 dark:text-white"
                onClick={() => setShowMore(false)}
              >
                Switch Account
              </Link>
              <Link to="/logout">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-gray-900 dark:text-white"
                  onClick={() => setShowMore(false)}
                >
                  Log Out
                </button>
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Bottom navigation for mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around bg-white dark:bg-black border-t md:hidden py-2 ">
        {navItems
          .filter((item) =>
            ["Home", "Search", "Reels", "Create", "Profile"].includes(
              item.label
            )
          )
          .map((item, idx) => (
            <Link
              key={idx}
              to={item.to}
              className={`flex flex-col items-center ${
                location.pathname === item.to
                  ? "text-pink-500"
                  : "text-gray-500 dark:text-gray-300"
              }`}
            >
              {item.icon}
            </Link>
          ))}
      </nav>
    </>
  );
}
