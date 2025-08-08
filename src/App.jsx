import { useState, useEffect, useContext } from "react";
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
  Navigate,
  Outlet
} from "react-router-dom";
import { useParams } from 'react-router-dom';
import { motion } from "framer-motion";
import { FiMessageCircle, FiHome, FiFilm, FiPlusSquare, FiMenu, FiSettings, FiCompass, FiPlus, FiBell, FiSearch } from "react-icons/fi";
import { useSwipeable } from "react-swipeable";
import LeftSidebar from "./components/LeftSidebar";
import RightSidebar from "./components/RightSidebar";
// import MainFeed from "./components/MainFeed";
import SearchPage from "./pages/search";
import ReelsPage from "./pages/reels";
import SettingsPage from "./pages/settings";
import MenuPage from "./pages/menu";
import ReelsSearch from "./pages/reelssearch";
import CreatePost from "./pages/createpost";
import CreateReel from "./pages/CreateReels";
import ChatPage from "./pages/ChatPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import GoogleSuccess from "./pages/GoogleSuccess";
import TC from "./pages/TermsAndConditions";
import Forgot from "./pages/ForgotPassword";
import { AuthContext } from "./AuthContext";
import WeatherPage from "./pages/weather";
import Marketplace from "./pages/Market";
import Notifications from "./pages/Notifications";
// import "./app.css";
import ImageGenerator from "./pages/ImageGenerator";
// import AiAssistant from "./pages/AiAssistant";
import Ai from "./pages/AIChatLayout";
import HomePage from "./pages/HomePage";
import PublicProfile from "./pages/PublicProfile";
import MapPage from "./pages/MapPage";
// import Hometest from "./pages/hometest2";
import CreateStory from "./pages/CreateStory"
// import Chat from "./pages/ChatPagetest"
import Explore from "./pages/Explore";
import FloatingMenu from "./components/FloatingMenu";
import DirectMessage from "./pages/DirectMessage"
import Logout from "./pages/logoutPage";
import Event from "./pages/Events";
import Reports from "./pages/Reports";
import OnboardingScreen from './OnboardingScreen';

function PrivateRoute() {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

function DirectMessageWrapper() {
  const { userId } = useParams();
  return <DirectMessage userId={userId} />;
}

function PublicRoute() {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}

export default function App() {
 const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      return savedMode ? JSON.parse(savedMode) : false;
    }
    return false;
  });
  const [openStory, setOpenStory] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(true);

  // Moved the viewport useEffect inside the App component
   useEffect(() => {
    // Check if meta viewport already exists
    let existingMeta = document.querySelector('meta[name="viewport"]');
    
    if (!existingMeta) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
      document.head.appendChild(meta);
      
      return () => {
        document.head.removeChild(meta);
      };
    }
  }, []);

   useEffect(() => {
    // Apply the dark class to the root element
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);


 const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const swipeHandlers = useSwipeable({
    onSwipedRight: () => {
      if (window.innerWidth < 768) {
        navigate("/menu");
      }
    },
    trackTouch: true,
    trackMouse: false,
  });

  const isAuthRoute = ['/login', '/register', '/Forgot', '/TC'].includes(location.pathname);

  return (
   <div className={`${darkMode ? 'dark' : ''} `}>

      <main className="flex-1 flex justify-center dark:bg-black">
        <div className="h-full w-full max-w-6xl px-2 md:px-6 py-6 lg:pr-80 relative">
          {!isAuthRoute && <LeftSidebar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}

          <Routes>
            <Route element={<PrivateRoute />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/reels" element={<ReelsPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/reels-search" element={<ReelsSearch />} />
              <Route path="/createPost" element={<CreatePost />} />
              <Route path="/createreel" element={<CreateReel />} />
              <Route path="/message" element={<ChatPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/weather" element={<WeatherPage/>} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/image-generator" element={<ImageGenerator />} />
              <Route path="/ai-assistant" element={<Ai />} />
              <Route path="/profile/:username" element={<PublicProfile />} />
              <Route path="/map" element={<MapPage />} />
              <Route path="/createstory" element={<CreateStory />} />
              {/* <Route path="/chat" element={<Chat />} /> */}
              <Route path="/explore" element={<Explore />} />
              <Route path="/messages/:userId" element={<DirectMessageWrapper />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/event" element={<Event />} />
              <Route path="/report" element={<Reports />} />

            </Route>

            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/google-success" element={<GoogleSuccess />} />
              <Route path="/tc" element={<TC />} />
              <Route path="/Forgot" element={<Forgot />}  />
            </Route>
          </Routes>
        </div>

        {!isAuthRoute && <RightSidebar onStoryClick={setOpenStory} />}
      </main>

      {openStory && (
        <motion.div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setOpenStory(null)}
        >
          <img
            src={`https://source.unsplash.com/random/500x700?sig=${openStory}`}
            alt="story-large"
            className="rounded-lg max-h-[80%] object-cover border-4 border-white"
          />
        </motion.div>
      )}

      {!isAuthRoute && (
  <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 md:hidden">
    <div className="flex justify-around items-center px-1 py-2">
      {[
        { 
          to: "/", 
          icon: <FiHome size={20} />,
          name: "Home"
        },
        { 
          to: "/explore", 
          icon: <FiCompass size={20} />,
          name: "Explore"
        },
        { 
          to: "/createPost", 
          icon: (
            <div className="flex items-center justify-center -mt-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full p-2 shadow-lg shadow-pink-500/30">
              <FiPlus size={16} className="text-white" />
            </div>
          ),
          isSpecial: true
        },
        { 
          to: "/reels", 
          icon: <FiFilm size={20} />,
          name: "Reels"
        },
        { 
          to: "/profile", 
          icon: <FiUser size={20} />,
          name: "Profile"
        }
      ].map((item, idx) => (
        <Link
          key={idx}
          to={item.to}
          className={`relative flex flex-col items-center justify-center w-full ${
            item.isSpecial ? "" : "py-1"
          }`}
        >
          <div className={`flex flex-col items-center ${
            location.pathname === item.to 
              ? "text-pink-500 dark:text-pink-400" 
              : "text-gray-500 dark:text-gray-400"
          }`}>
            {item.icon}
            {!item.isSpecial && (
              <span className="text-[10px] mt-0.5 font-medium">
                {item.name}
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  </nav>
)}
    </div>
  );
}