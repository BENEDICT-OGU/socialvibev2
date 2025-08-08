// import { useState, useEffect, useContext, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { AuthContext } from "../AuthContext";
// import { motion, AnimatePresence } from "framer-motion";
// import { io } from "socket.io-client";
// import { Canvas } from "@react-three/fiber";
// import { Box, OrbitControls } from "@react-three/drei";
// import confetti from 'canvas-confetti';
// import Groq from "groq-sdk";


// // Icons
// import {
//   FaHeart,
//   FaRegComment,
//   FaShare,
//   FaBookmark,
//   FaEllipsisH,
//   FaTimes,
//   FaRegHeart,
//   FaRegBookmark,
//   FaDownload,
//   FaMicrophone,
// } from "react-icons/fa";
// import { FiSend, FiShare2 } from "react-icons/fi";
// import { IoMdSend } from "react-icons/io";
// import { BsThreeDotsVertical, BsEmojiSmile, BsArrowRight } from "react-icons/bs";
// import { RiLiveLine } from "react-icons/ri";
// import { HiOutlineSparkles } from "react-icons/hi";

// const groq = new Groq({
//   apiKey: import.meta.env.VITE_GROQ_API_KEY
// });
// const API_KEY = import.meta.env.VITE_API_KEY;

// const stories = [
//   { id: 1, username: "your_story", isYou: true },
//   { id: 2, username: "traveler", hasNew: true },
//   { id: 3, username: "foodie", hasNew: true },
//   { id: 4, username: "photographer" },
//   { id: 5, username: "fitness" },
//   { id: 6, username: "artist" },
// ];

// export default function HomePage() {
//   // State management
//   const [posts, setPosts] = useState([]);
//   const [recommendedPosts, setRecommendedPosts] = useState([]);
//   const [currentMediaIdx, setCurrentMediaIdx] = useState([]);
//   const [likedPosts, setLikedPosts] = useState([]);
//   const [bookmarkedPosts, setBookmarkedPosts] = useState([]);
//   const [showComments, setShowComments] = useState({ postId: null });
//   const [newComment, setNewComment] = useState({});
//   const [openMenu, setOpenMenu] = useState(null);
//   const menuRefs = useRef([]);
//   const [showHeart, setShowHeart] = useState({ postId: null });
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState("forYou");
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [showAppDownloadBanner, setShowAppDownloadBanner] = useState(true);
//   const [darkMode, setDarkMode] = useState(false);
//   const [showConfetti, setShowConfetti] = useState(false);
//   const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
//   const [isStreaming, setIsStreaming] = useState(false);
//   const [voiceSearchText, setVoiceSearchText] = useState("");
//   const [showChatbot, setShowChatbot] = useState(false);
//   const [chatbotMessages, setChatbotMessages] = useState([]);
//   const [chatbotInput, setChatbotInput] = useState("");
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);

//   const { user } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const storiesRef = useRef(null);
//   const observerRef = useRef(null);
//   const lastPostRef = useRef(null);

//   // Socket.IO connection for real-time updates
//   useEffect(() => {
//     const socket = io(process.env.REACT_APP_SOCKET_SERVER_URL);
    
//     socket.on("newLike", (updatedPost) => {
//       setPosts(posts.map(post => post._id === updatedPost._id ? updatedPost : post));
//     });

//     socket.on("newComment", (updatedPost) => {
//       setPosts(posts.map(post => post._id === updatedPost._id ? updatedPost : post));
//     });

//     socket.on("newPost", (newPost) => {
//       setPosts(prev => [newPost, ...prev]);
//     });

//     return () => socket.disconnect();
//   }, [posts]);

//   // Infinite scroll setup
//   useEffect(() => {
//     const options = {
//       root: null,
//       rootMargin: "20px",
//       threshold: 0.1
//     };

//     observerRef.current = new IntersectionObserver((entries) => {
//       if (entries[0].isIntersecting && hasMore) {
//         loadMorePosts();
//       }
//     }, options);

//     if (observerRef.current && lastPostRef.current) {
//       observerRef.current.observe(lastPostRef.current);
//     }

//     return () => {
//       if (observerRef.current) {
//         observerRef.current.disconnect();
//       }
//     };
//   }, [hasMore, posts]);

//   // Stories auto-play
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setCurrentStoryIndex((prev) => (prev + 1) % stories.length);
//     }, 5000);
//     return () => clearTimeout(timer);
//   }, [currentStoryIndex]);

//   // Dark mode persistence
//   useEffect(() => {
//     const savedMode = localStorage.getItem("darkMode") === "true";
//     setDarkMode(savedMode);
//     document.documentElement.classList.toggle("dark", savedMode);
//   }, []);

//   const toggleDarkMode = () => {
//     const newMode = !darkMode;
//     setDarkMode(newMode);
//     localStorage.setItem("darkMode", newMode);
//     document.documentElement.classList.toggle("dark", newMode);
//   };


//   const fireConfetti = () => {
//     confetti({
//       particleCount: 100,
//       spread: 70,
//       origin: { y: 0.6 }
//     });
//   };

//   // Fetch posts with GROQ AI recommendations
//   const fetchPosts = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const endpoint = user?.token ? "/posts" : "/posts";
//       const res = await axios.get(endpoint, {
//         headers: user?.token ? { Authorization: `Bearer ${user.token}` } : {},
//         params: { page: 1 }
//       });

//       const fetchedPosts = res.data.posts || res.data;
//       setPosts(fetchedPosts);
//       setCurrentMediaIdx(fetchedPosts.map(() => 0));
//       setLikedPosts(
//         fetchedPosts.map(
//           (post) =>
//             post.reactions?.some(
//               (r) => r.user._id === user?._id && r.type === "like"
//             ) || false
//         )
//       );
//       setBookmarkedPosts(
//         fetchedPosts.map(
//           (post) =>
//             post.reactions?.some(
//               (r) => r.user._id === user?._id && r.type === "bookmark"
//             ) || false
//         )
//       );

//       // Get AI recommendations
//       if (user?.token) {
//         fetchAIPostRecommendations();
//       }
//     } catch (err) {
//       console.error("Failed to fetch posts:", err);
//       setError(err.response?.data?.message || "Failed to load posts");
//       if (err.response?.status === 401) {
//         navigate("/login");
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const loadMorePosts = async () => {
//     try {
//       const nextPage = page + 1;
//       const res = await axios.get(`/posts?page=${nextPage}`);
      
//       if (res.data.posts.length === 0) {
//         setHasMore(false);
//         return;
//       }

//       setPosts(prev => [...prev, ...res.data.posts]);
//       setPage(nextPage);
//       setCurrentMediaIdx(prev => [...prev, ...res.data.posts.map(() => 0)]);
//     } catch (err) {
//       console.error("Failed to load more posts:", err);
//     }
//   };

//   // GROQ AI-powered recommendations
//   const fetchAIPostRecommendations = async () => {
//     try {
//       const userInterests = user.interests?.join(", ") || "general content";
//       const recentLikes = posts
//         .filter(post => post.reactions?.some(r => r.user._id === user._id))
//         .slice(0, 3)
//         .map(post => post.content)
//         .join("\n");
      
//       const completion = await groq.chat.completions.create({
//         messages: [
//           {
//             role: "system",
//             content: `You are a recommendation engine. Based on user interests: ${userInterests} and recent likes: ${recentLikes}, suggest 3-5 post recommendations in JSON format with title and description.`
//           }
//         ],
//         model: "mixtral-8x7b-32768",
//         response_format: { type: "json_object" }
//       });

//       const recommendations = JSON.parse(completion.choices[0]?.message?.content || "{}");
//       setRecommendedPosts(recommendations.posts || []);
//     } catch (err) {
//       console.error("Failed to get AI recommendations:", err);
//     }
//   };

//   // Voice search
//   const startVoiceSearch = () => {
//     if (!('webkitSpeechRecognition' in window)) {
//       alert("Voice search not supported in your browser");
//       return;
//     }

//     const recognition = new window.webkitSpeechRecognition();
//     recognition.lang = 'en-US';
//     recognition.start();

//     recognition.onresult = (e) => {
//       const transcript = e.results[0][0].transcript;
//       setVoiceSearchText(transcript);
//       // Filter posts based on voice search
//       const filtered = posts.filter(post => 
//         post.content.toLowerCase().includes(transcript.toLowerCase()) ||
//         (post.user?.username.toLowerCase().includes(transcript.toLowerCase()))
//       );
//       setPosts(filtered);
//     };

//     recognition.onerror = (e) => {
//       console.error("Voice recognition error", e.error);
//     };
//   };

//   // Live streaming
//   const startLiveStream = async () => {
//     try {
//       if (isStreaming) {
//         // End stream logic
//         setIsStreaming(false);
//         return;
//       }

//       const stream = await navigator.mediaDevices.getUserMedia({ 
//         video: true, 
//         audio: true 
//       });
      
//       // Here you would connect to Agora or other streaming service
//       // This is a simplified implementation
//       setIsStreaming(true);
      
//       // Create a new live post
//       const livePost = {
//         _id: `live-${Date.now()}`,
//         user: user,
//         isLive: true,
//         createdAt: new Date().toISOString(),
//         content: `${user.username} is live now!`,
//         media: [{ url: URL.createObjectURL(stream) }]
//       };
      
//       setPosts(prev => [livePost, ...prev]);
//     } catch (err) {
//       console.error("Failed to start stream:", err);
//     }
//   };
//   const fireRealisticConfetti = () => {
//   confetti({
//     angle: 60,
//     spread: 55,
//     particleCount: 100,
//     origin: { x: 0 }
//   });
  
//   confetti({
//     angle: 120,
//     spread: 55,
//     particleCount: 100,
//     origin: { x: 1 }
//   });
// };

//   // AI Chatbot
//   const sendChatbotMessage = async () => {
//     if (!chatbotInput.trim()) return;

//     const userMessage = { text: chatbotInput, isUser: true };
//     setChatbotMessages(prev => [...prev, userMessage]);
//     setChatbotInput("");

//     try {
//       const completion = await groq.chat.completions.create({
//         messages: [
//           {
//             role: "system",
//             content: `You are a helpful assistant for our social media app. The user is ${user.username}. Keep responses concise and friendly.`
//           },
//           {
//             role: "user",
//             content: chatbotInput
//           }
//         ],
//         model: "mixtral-8x7b-32768"
//       });

//       const botReply = completion.choices[0]?.message?.content || "I couldn't process that request.";
//       setChatbotMessages(prev => [...prev, { text: botReply, isUser: false }]);
//     } catch (err) {
//       console.error("Chatbot error:", err);
//       setChatbotMessages(prev => [...prev, { 
//         text: "Sorry, I'm having trouble responding right now.", 
//         isUser: false 
//       }]);
//     }
//   };

//   // AI caption improvement
//   const improveCaption = async (postId, currentCaption) => {
//     try {
//       const completion = await groq.chat.completions.create({
//         messages: [
//           {
//             role: "system",
//             content: "You are a caption improvement assistant. Make this social media caption more engaging while keeping the original meaning:"
//           },
//           {
//             role: "user",
//             content: currentCaption
//           }
//         ],
//         model: "mixtral-8x7b-32768"
//       });

//       const improvedCaption = completion.choices[0]?.message?.content;
      
//       // Update the post with improved caption
//       setPosts(posts.map(post => 
//         post._id === postId 
//           ? { ...post, content: improvedCaption } 
//           : post
//       ));
//     } catch (err) {
//       console.error("Failed to improve caption:", err);
//     }
//   };

//   // Like a post
//   const toggleLike = async (postId, postIdx) => {
//     try {
//       const isLiked = likedPosts[postIdx];
//       const endpoint = isLiked ? `/${postId}/unlike` : `/${postId}/like`;

//       await axios.put(
//         `/posts${endpoint}`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${user.token}` },
//         }
//       );

//       setLikedPosts(prev =>
//         prev.map((liked, i) => (i === postIdx ? !liked : liked))
//       );

//       setPosts(prev => {
//         const updated = [...prev];
//         if (isLiked) {
//           updated[postIdx].reactions =
//             updated[postIdx].reactions?.filter(
//               (r) => !(r.user._id === user._id && r.type === "like")
//             ) || [];
//         } else {
//           updated[postIdx].reactions = [
//             ...(updated[postIdx].reactions || []),
//             { user: { _id: user._id }, type: "like" },
//           ];
//           setShowConfetti(true);
//           setTimeout(() => setShowConfetti(false), 3000);
//         }
//         return updated;
//       });

//       if (!isLiked) {
//       confetti({
//         particleCount: 50,
//         spread: 50,
//         origin: { x: 0.5, y: 0.5 } // Center of screen
//       });
//     }
//   } catch (err) {
//     console.error("Failed to toggle like:", err);
//   }
//   };

//   // Bookmark a post
//   const toggleBookmark = async (postId, postIdx) => {
//     try {
//       const isBookmarked = bookmarkedPosts[postIdx];
//       const endpoint = isBookmarked
//         ? `/${postId}/unbookmark`
//         : `/${postId}/bookmark`;

//       await axios.put(
//         `/posts${endpoint}`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${user.token}` },
//         }
//       );

//       setBookmarkedPosts(prev =>
//         prev.map((bookmarked, i) => (i === postIdx ? !bookmarked : bookmarked))
//       );

//       setPosts(prev => {
//         const updated = [...prev];
//         if (isBookmarked) {
//           updated[postIdx].reactions =
//             updated[postIdx].reactions?.filter(
//               (r) => !(r.user._id === user._id && r.type === "bookmark")
//             ) || [];
//         } else {
//           updated[postIdx].reactions = [
//             ...(updated[postIdx].reactions || []),
//             { user: { _id: user._id }, type: "bookmark" },
//           ];
//         }
//         return updated;
//       });
//     } catch (err) {
//       console.error("Failed to toggle bookmark:", err);
//     }
//   };

//   // Add comment
//   const handleAddComment = async (postId, postIdx) => {
//     const commentText = newComment[postId];
//     if (!commentText?.trim()) return;

//     try {
//       const res = await axios.post(
//         `/posts/${postId}/comment`,
//         { text: commentText },
//         { headers: { Authorization: `Bearer ${user.token}` } }
//       );

//       setPosts(prev => {
//         const updated = [...prev];
//         updated[postIdx].comments = res.data.comments || [];
//         return updated;
//       });

//       setNewComment(prev => ({ ...prev, [postId]: "" }));
//     } catch (err) {
//       console.error("Failed to add comment:", err);
//     }
//   };

//   // Initial data fetch
//   useEffect(() => {
//     fetchPosts();
//   }, [user?.token]);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
//         <div className="text-red-500">{error}</div>
//       </div>
//     );
//   }

//   return (
//     <div className={`min-h-screen ${darkMode ? 'dark' : ''} bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800`}>
//       {/* Confetti for celebrations */}
//        <button 
//       onClick={fireConfetti}
//       className="bg-blue-500 text-white px-4 py-2 rounded"
//     >
//       Celebrate!
//     </button>
//       {showConfetti && (
//         <Confetti
//           width={window.innerWidth}
//           height={window.innerHeight}
//           recycle={false}
//           numberOfPieces={500}
//           onConfettiComplete={() => setShowConfetti(false)}
//         />
//       )}

//       {/* Dark mode toggle */}
//       <button 
//         onClick={toggleDarkMode}
//         className="fixed bottom-4 right-4 z-50 bg-gray-800 dark:bg-white text-white dark:text-gray-800 p-3 rounded-full shadow-lg"
//       >
//         {darkMode ? '☀️' : '🌙'}
//       </button>

//       {/* App Download Banner */}
//       {showAppDownloadBanner && (
//         <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-3 flex items-center justify-between">
//           <div className="flex items-center">
//             <HiOutlineSparkles className="text-xl mr-2" />
//             <div>
//               <p className="font-bold">Get the best experience</p>
//               <p className="text-xs opacity-90">Download our app now!</p>
//             </div>
//           </div>
//           <div className="flex items-center space-x-2">
//             <button 
//               onClick={() => setShowAppDownloadBanner(false)}
//               className="p-1 rounded-full hover:bg-white/20"
//             >
//               <FaTimes />
//             </button>
//             <a 
//               href="#download" 
//               className="bg-white text-pink-600 px-3 py-1 rounded-full text-sm font-semibold flex items-center"
//             >
//               Download <FaDownload className="ml-1" />
//             </a>
//           </div>
//         </div>
//       )}

//       {/* Voice search button */}
//       <button 
//         onClick={startVoiceSearch}
//         className="fixed top-4 right-4 z-50 bg-blue-500 text-white p-3 rounded-full shadow-lg"
//       >
//         <FaMicrophone />
//       </button>
//       {voiceSearchText && (
//         <div className="fixed top-16 right-4 z-50 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg max-w-xs">
//           <p className="font-medium">Searching for:</p>
//           <p className="text-sm">{voiceSearchText}</p>
//         </div>
//       )}

//       {/* Main Content */}
//       <div className="max-w-lg mx-auto px-2 pb-20">
//         {/* Stories with progress bar */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-4 overflow-x-auto relative">
//           <div className="flex space-x-4">
//             {stories.map((story, index) => (
//               <div key={story.id} className="flex flex-col items-center space-y-1 relative">
//                 {/* Progress bar */}
//                 {index === currentStoryIndex && (
//                   <div className="absolute -top-2 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700">
//                     <motion.div
//                       className="h-full bg-pink-500"
//                       initial={{ width: 0 }}
//                       animate={{ width: "100%" }}
//                       transition={{ duration: 5 }}
//                     />
//                   </div>
//                 )}
                
//                 <div className={`w-16 h-16 rounded-full flex items-center justify-center ${story.isYou ? 'bg-gradient-to-tr from-pink-500 to-yellow-500 p-0.5' : story.hasNew ? 'bg-gradient-to-tr from-pink-500 to-purple-500 p-0.5' : 'bg-gray-200 dark:bg-gray-700 p-0.5'}`}>
//                   <div className="bg-white dark:bg-gray-800 rounded-full w-full h-full flex items-center justify-center overflow-hidden">
//                     {story.isYou ? (
//                       <div className="text-2xl">+</div>
//                     ) : (
//                       <img
//                         src={`https://i.pravatar.cc/150?img=${story.id}`}
//                         className="w-full h-full object-cover"
//                         alt={story.username}
//                       />
//                     )}
//                   </div>
//                 </div>
//                 <span className="text-xs truncate w-16 text-center">{story.username}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* AI Recommendations Section */}
//         {recommendedPosts.length > 0 && (
//           <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-4">
//             <h3 className="font-bold text-lg mb-3 flex items-center">
//               <HiOutlineSparkles className="mr-2 text-yellow-500" />
//               Recommended For You
//             </h3>
//             <div className="space-y-4">
//               {recommendedPosts.map((post, index) => (
//                 <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
//                   <p className="font-medium">{post.title || "Recommended Post"}</p>
//                   <p className="text-sm text-gray-600 dark:text-gray-300">{post.description}</p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* 3D Post Preview */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 mb-4 h-64">
//           <Canvas>
//             <ambientLight intensity={0.5} />
//             <pointLight position={[10, 10, 10]} />
//             <Box position={[0, 0, 0]}>
//               <meshStandardMaterial color="hotpink" />
//             </Box>
//             <OrbitControls enableZoom={false} />
//           </Canvas>
//           <p className="text-center mt-2">Explore posts in 3D</p>
//         </div>

//         {/* Live Streaming Button */}
//         <button 
//           onClick={startLiveStream}
//           className="w-full bg-red-500 text-white py-3 rounded-2xl mb-4 flex items-center justify-center"
//         >
//           <RiLiveLine className="mr-2" />
//           {isStreaming ? "End Live Stream" : "Go Live"}
//         </button>

//         {/* Premium CTA */}
//         <div className="bg-gradient-to-r from-purple-600 to-blue-500 rounded-2xl shadow-lg p-4 mb-4 text-white relative overflow-hidden">
//           <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full"></div>
//           <div className="absolute -right-5 -bottom-5 w-20 h-20 bg-white/10 rounded-full"></div>
//           <div className="relative z-10">
//             <h3 className="font-bold text-lg mb-1">Go Premium</h3>
//             <p className="text-sm opacity-90 mb-3">Unlock exclusive features and content</p>
//             <button className="bg-white text-purple-600 px-4 py-2 rounded-full text-sm font-semibold flex items-center">
//               Upgrade Now <BsArrowRight className="ml-1" />
//             </button>
//           </div>
//         </div>

//         {/* Feed Tabs */}
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-2 mb-4">
//           <div className="flex border-b border-gray-200 dark:border-gray-700">
//             <button
//               onClick={() => setActiveTab("forYou")}
//               className={`flex-1 py-2 text-sm font-medium ${activeTab === "forYou" ? "text-pink-500 border-b-2 border-pink-500" : "text-gray-500 dark:text-gray-400"}`}
//             >
//               For You
//             </button>
//             <button
//               onClick={() => setActiveTab("following")}
//               className={`flex-1 py-2 text-sm font-medium ${activeTab === "following" ? "text-pink-500 border-b-2 border-pink-500" : "text-gray-500 dark:text-gray-400"}`}
//             >
//               Following
//             </button>
//             <button
//               onClick={() => setActiveTab("popular")}
//               className={`flex-1 py-2 text-sm font-medium ${activeTab === "popular" ? "text-pink-500 border-b-2 border-pink-500" : "text-gray-500 dark:text-gray-400"}`}
//             >
//               Popular
//             </button>
//           </div>
//         </div>

//         {/* Posts Feed */}
//         <div className="flex flex-col gap-4">
//           {posts.length === 0 ? (
//             <div className="text-center py-10 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
//               <p className="text-gray-500 dark:text-gray-400">No posts yet. Create one!</p>
//               <Link
//                 to="/createPost"
//                 className="mt-4 inline-block bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-full hover:shadow-lg transition-all"
//               >
//                 Create Post
//               </Link>
//             </div>
//           ) : (
//             posts.map((post, postIdx) => {
//               const mediaIdx = currentMediaIdx[postIdx];
//               const mediaItem = post.media?.[mediaIdx] || {};
//               const isLiked = likedPosts[postIdx];
//               const isBookmarked = bookmarkedPosts[postIdx];
//               const likeCount =
//                 post.reactions?.filter((r) => r.type === "like").length || 0;
//               const commentCount = post.comments?.length || 0;
//               const postAuthor = post.user || post.author;

//               return (
//                 <div 
//                   key={post._id} 
//                   className="mb-6"
//                   ref={postIdx === posts.length - 1 ? lastPostRef : null}
//                 >
//                   {/* Premium Post Card Container */}
//                   <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
//                     {/* Post Header */}
//                     <div className="p-4 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-700">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center space-x-3">
//                           <Link to={`/profile/${postAuthor.username}`} className="relative group">
//                             <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                             <img
//                               src={postAuthor?.avatar || "https://i.pravatar.cc/150"}
//                               className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-800 relative z-10"
//                               alt={postAuthor?.username}
//                             />
//                             {post.isLive && (
//                               <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center z-20">
//                                 <RiLiveLine className="mr-1" /> LIVE
//                               </div>
//                             )}
//                           </Link>

//                           <div>
//                             <Link to={`/profile/${postAuthor.username}`}>
//                               <p className="font-bold text-gray-900 dark:text-white group-hover:text-pink-500 transition-colors">
//                                 {postAuthor?.username || "Unknown User"}
//                                 {post.isVerified && (
//                                   <span className="ml-1 text-blue-500">✓</span>
//                                 )}
//                               </p>
//                             </Link>
//                             <div className="flex items-center space-x-2">
//                               <p className="text-xs text-gray-500">
//                                 {new Date(post.createdAt).toLocaleDateString('en-US', {
//                                   month: 'short',
//                                   day: 'numeric'
//                                 })}
//                               </p>
//                               <span className="text-gray-300 dark:text-gray-600">•</span>
//                               <span className="text-xs text-pink-500 font-medium">
//                                 {typeof post.location === 'string' ? post.location : 
//                                  post.location?.name || post.location?.address || "Global"}
//                               </span>
//                             </div>
//                           </div>
//                         </div>

//                         <div ref={(el) => (menuRefs.current[postIdx] = el)} className="relative">
//                           <button
//                             onClick={() => setOpenMenu(openMenu === postIdx ? null : postIdx)}
//                             className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//                           >
//                             <BsThreeDotsVertical className="text-gray-500 text-lg" />
//                           </button>

//                           {openMenu === postIdx && (
//                             <motion.div
//                               initial={{ opacity: 0, y: 10 }}
//                               animate={{ opacity: 1, y: 0 }}
//                               exit={{ opacity: 0, y: 10 }}
//                               className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl z-50 overflow-hidden border border-gray-100 dark:border-gray-700"
//                             >
//                               <button className="flex items-center w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
//                                 <FiShare2 className="mr-3 text-gray-500" />
//                                 <span>Share Post</span>
//                               </button>
//                               <button 
//                                 className="flex items-center w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
//                                 onClick={() => toggleBookmark(post._id, postIdx)}
//                               >
//                                 <FaBookmark className="mr-3 text-gray-500" />
//                                 <span>{isBookmarked ? "Remove Bookmark" : "Save Post"}</span>
//                               </button>
//                               {post.content && (
//                                 <button 
//                                   className="flex items-center w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
//                                   onClick={() => improveCaption(post._id, post.content)}
//                                 >
//                                   <HiOutlineSparkles className="mr-3 text-gray-500" />
//                                   <span>Improve Caption</span>
//                                 </button>
//                               )}
//                               {user?._id === postAuthor?._id && (
//                                 <button className="flex items-center w-full px-4 py-3 text-left text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
//                                   <FaTimes className="mr-3" />
//                                   <span>Delete Post</span>
//                                 </button>
//                               )}
//                             </motion.div>
//                           )}
//                         </div>
//                       </div>
//                     </div>

//                     {/* Post Content */}
//                     {post.content && (
//                       <div className="p-5">
//                         <p className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
//                           {post.content}
//                         </p>
//                       </div>
//                     )}

//                     {/* Media Display */}
//                     {post.media?.length > 0 && (
//                       <div className="relative group">
//                         <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                        
//                         <img
//                           src={mediaItem.url}
//                           className="w-full max-h-[600px] object-cover"
//                           alt="Post media"
//                           onDoubleClick={() => toggleLike(post._id, postIdx)}
//                         />

//                         {/* Heart Animation */}
//                         <AnimatePresence>
//                           {showHeart.postId === post._id && (
//                             <motion.div
//                               initial={{ scale: 0, opacity: 0 }}
//                               animate={{ scale: [0, 1.5, 1], opacity: [0, 1, 0] }}
//                               transition={{ duration: 1 }}
//                               className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
//                             >
//                               <FaHeart
//                                 className="text-white drop-shadow-2xl"
//                                 style={{ fontSize: 120, color: "#e11d48" }}
//                               />
//                             </motion.div>
//                           )}
//                         </AnimatePresence>

//                         {/* Media Navigation Arrows */}
//                         {post.media.length > 1 && (
//                           <>
//                             <button
//                               onClick={() => handlePrev(postIdx)}
//                               disabled={mediaIdx === 0}
//                               className={`absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-2 z-20 transition-all ${mediaIdx === 0 ? 'opacity-0 cursor-default' : 'opacity-0 group-hover:opacity-100 hover:bg-black/50'}`}
//                             >
//                               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                               </svg>
//                             </button>
//                             <button
//                               onClick={() => handleNext(postIdx, post.media.length)}
//                               disabled={mediaIdx === post.media.length - 1}
//                               className={`absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-2 z-20 transition-all ${mediaIdx === post.media.length - 1 ? 'opacity-0 cursor-default' : 'opacity-0 group-hover:opacity-100 hover:bg-black/50'}`}
//                             >
//                               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                               </svg>
//                             </button>
//                           </>
//                         )}

//                         {/* Media Indicators */}
//                         {post.media.length > 1 && (
//                           <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
//                             {post.media.map((_, i) => (
//                               <span
//                                 key={i}
//                                 className={`h-1.5 rounded-full transition-all duration-300 ${i === mediaIdx ? "bg-white w-6" : "bg-white/50 w-3"}`}
//                               />
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     )}

//                     {/* Action Bar */}
//                     <div className="p-4">
//                       <div className="flex justify-between items-center mb-3">
//                         <div className="flex space-x-5">
//                           <button 
//                             onClick={() => toggleLike(post._id, postIdx)}
//                             className="group relative"
//                           >
//                             <div className="absolute -inset-1 bg-pink-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                             {isLiked ? (
//                               <FaHeart className="text-red-500 text-2xl" />
//                             ) : (
//                               <FaRegHeart className="text-gray-500 text-2xl group-hover:text-red-400 transition-colors" />
//                             )}
//                           </button>
                          
//                           <button
//                             onClick={() => setShowComments({ postId: post._id })}
//                             className="group relative"
//                           >
//                             <div className="absolute -inset-1 bg-blue-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                             <FaRegComment className="text-gray-500 text-2xl group-hover:text-blue-400 transition-colors" />
//                           </button>
                          
//                           <button className="group relative">
//                             <div className="absolute -inset-1 bg-green-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                             <FiShare2 className="text-gray-500 text-2xl group-hover:text-green-400 transition-colors" />
//                           </button>
//                         </div>
                        
//                         <button 
//                           onClick={() => toggleBookmark(post._id, postIdx)}
//                           className="group relative"
//                         >
//                           <div className="absolute -inset-1 bg-purple-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//                           {isBookmarked ? (
//                             <FaBookmark className="text-purple-500 text-2xl" />
//                           ) : (
//                             <FaRegBookmark className="text-gray-500 text-2xl group-hover:text-purple-400 transition-colors" />
//                           )}
//                         </button>
//                       </div>

//                       {/* Likes Count */}
//                       <div className="flex items-center mb-3">
//                         <div className="flex -space-x-2 mr-3">
//                           {post.reactions?.slice(0, 3).map((reaction, i) => (
//                             <img
//                               key={i}
//                               src={reaction.user?.avatar || "https://i.pravatar.cc/150"}
//                               className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800"
//                               alt={reaction.user?.username}
//                             />
//                           ))}
//                         </div>
//                         <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
//                           Liked by <span className="text-gray-900 dark:text-white">{post.reactions?.[0]?.user?.username || "someone"}</span> 
//                           {likeCount > 1 && ` and ${likeCount - 1} others`}
//                         </p>
//                       </div>

//                       {/* Comments Preview */}
//                       {post.comments?.length > 0 && (
//                         <div className="mb-3">
//                           <p className="text-sm text-gray-800 dark:text-gray-200">
//                             <Link 
//                               to={`/profile/${post.comments[0].user?.username}`} 
//                               className="font-semibold hover:underline"
//                             >
//                               {post.comments[0].user?.username || "User"}
//                             </Link>{" "}
//                             {post.comments[0].text}
//                           </p>
//                           {post.comments.length > 1 && (
//                             <button
//                               onClick={() => setShowComments({ postId: post._id })}
//                               className="text-sm text-gray-500 dark:text-gray-400 mt-1 hover:underline"
//                             >
//                               View all {commentCount} comments
//                             </button>
//                           )}
//                         </div>
//                       )}

//                       {/* Add Comment */}
//                       <div className="relative mt-4">
//                         <input
//                           type="text"
//                           placeholder=" "
//                           value={newComment[post._id] || ""}
//                           onChange={(e) =>
//                             setNewComment((prev) => ({
//                               ...prev,
//                               [post._id]: e.target.value,
//                             }))
//                           }
//                           className="w-full bg-gray-50 dark:bg-gray-700 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 peer"
//                           onKeyPress={(e) =>
//                             e.key === "Enter" && handleAddComment(post._id, postIdx)
//                           }
//                         />
//                         <label className="absolute left-4 top-3 text-gray-500 dark:text-gray-400 pointer-events-none transition-all duration-200 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-pink-500 peer-focus:bg-white dark:peer-focus:bg-gray-800 peer-focus:px-1 peer-focus:left-3">
//                           Add a comment...
//                         </label>
//                         <button
//                           onClick={() => handleAddComment(post._id, postIdx)}
//                           disabled={!newComment[post._id]?.trim()}
//                           className={`absolute right-1 top-1 p-2 rounded-full ${newComment[post._id]?.trim() ? 'text-pink-500 hover:text-pink-600' : 'text-gray-400'}`}
//                         >
//                           <IoMdSend className="text-xl" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Comments Modal */}
//                   <AnimatePresence>
//                     {showComments.postId === post._id && (
//                       <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end"
//                       >
//                         <motion.div
//                           initial={{ y: "100%" }}
//                           animate={{ y: 0 }}
//                           exit={{ y: "100%" }}
//                           transition={{ type: "spring", damping: 30, stiffness: 500 }}
//                           className="w-full bg-white dark:bg-gray-800 rounded-t-3xl shadow-xl max-h-[85vh] flex flex-col"
//                         >
//                           <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
//                             <h3 className="text-lg font-bold">Comments</h3>
//                             <button
//                               onClick={() => setShowComments({ postId: null })}
//                               className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
//                             >
//                               <FaTimes className="text-gray-500" />
//                             </button>
//                           </div>

//                           <div className="flex-1 overflow-y-auto p-4 space-y-4">
//                             {post.comments?.length > 0 ? (
//                               post.comments.map((comment, idx) => (
//                                 <div key={idx} className="flex items-start space-x-3">
//                                   <Link to={`/profile/${comment.user?.username}`} className="flex-shrink-0">
//                                     <img
//                                       src={comment.user?.avatar || "https://i.pravatar.cc/150"}
//                                       className="w-10 h-10 rounded-full object-cover"
//                                       alt={comment.user?.username}
//                                     />
//                                   </Link>
//                                   <div className="flex-1">
//                                     <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-3">
//                                       <Link
//                                         to={`/profile/${comment.user?.username}`}
//                                         className="font-semibold text-sm hover:underline"
//                                       >
//                                         {comment.user?.username || "User"}
//                                       </Link>
//                                       <p className="mt-1 text-sm">{comment.text}</p>
//                                     </div>
//                                     <div className="flex items-center mt-2 ml-2 space-x-4">
//                                       <span className="text-xs text-gray-500 dark:text-gray-400">
//                                         {new Date(comment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
//                                       </span>
//                                       <button className="text-xs text-gray-500 dark:text-gray-400 hover:underline">
//                                         Like
//                                       </button>
//                                       <button className="text-xs text-gray-500 dark:text-gray-400 hover:underline">
//                                         Reply
//                                       </button>
//                                     </div>
//                                   </div>
//                                 </div>
//                               ))
//                             ) : (
//                               <div className="text-center py-10 text-gray-500 dark:text-gray-400">
//                                 No comments yet
//                               </div>
//                             )}
//                           </div>

//                           <div className="p-4 border-t border-gray-100 dark:border-gray-700">
//                             <div className="relative">
//                               <input
//                                 type="text"
//                                 placeholder=" "
//                                 value={newComment[post._id] || ""}
//                                 onChange={(e) =>
//                                   setNewComment((prev) => ({
//                                     ...prev,
//                                     [post._id]: e.target.value,
//                                   }))
//                                 }
//                                 className="w-full bg-gray-50 dark:bg-gray-700 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 peer"
//                                 onKeyPress={(e) =>
//                                   e.key === "Enter" && handleAddComment(post._id, postIdx)
//                                 }
//                               />
//                               <label className="absolute left-4 top-3 text-gray-500 dark:text-gray-400 pointer-events-none transition-all duration-200 peer-placeholder-shown:text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-pink-500 peer-focus:bg-white dark:peer-focus:bg-gray-800 peer-focus:px-1 peer-focus:left-3">
//                                 Write a comment...
//                               </label>
//                               <button
//                                 onClick={() => handleAddComment(post._id, postIdx)}
//                                 disabled={!newComment[post._id]?.trim()}
//                                 className={`absolute right-1 top-1 p-2 rounded-full ${newComment[post._id]?.trim() ? 'text-pink-500 hover:text-pink-600' : 'text-gray-400'}`}
//                               >
//                                 <IoMdSend className="text-xl" />
//                               </button>
//                             </div>
//                           </div>
//                         </motion.div>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </div>

//       {/* AI Chatbot Floating Button */}
//       <div className="fixed bottom-20 right-4 z-50">
//         <button 
//           onClick={() => setShowChatbot(!showChatbot)}
//           className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-full shadow-lg"
//         >
//           🤖
//         </button>
//       </div>

//       {/* AI Chatbot Modal */}
//       {showChatbot && (
//         <div className="fixed bottom-24 right-4 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl z-50 border border-gray-200 dark:border-gray-700">
//           <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
//             <h3 className="font-bold">AI Assistant</h3>
//             <button onClick={() => setShowChatbot(false)}>
//               <FaTimes />
//             </button>
//           </div>
//           <div className="h-64 overflow-y-auto p-3">
//             {chatbotMessages.length === 0 ? (
//               <div className="text-center py-10 text-gray-500 dark:text-gray-400">
//                 Ask me anything about the app!
//               </div>
//             ) : (
//               chatbotMessages.map((msg, i) => (
//                 <div key={i} className={`mb-3 ${msg.isUser ? 'text-right' : 'text-left'}`}>
//                   <div className={`inline-block p-2 rounded-lg ${msg.isUser ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>
//                     {msg.text}
//                   </div>
//                 </div>
//               ))
//             )}
//           </div>
//           <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex">
//             <input
//               type="text"
//               value={chatbotInput}
//               onChange={(e) => setChatbotInput(e.target.value)}
//               placeholder="Ask me anything..."
//               className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-l-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
//               onKeyPress={(e) => e.key === "Enter" && sendChatbotMessage()}
//             />
//             <button
//               onClick={sendChatbotMessage}
//               className="bg-pink-500 text-white px-3 py-2 rounded-r-full"
//             >
//               <FiSend />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }