import { useState, useEffect, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../api";
import { AuthContext } from "../AuthContext";
import {
  FaHeart,
  FaRegComment,
  FaShare,
  FaBookmark,
  FaEllipsisH,
  FaTimes,
  FaRegHeart,
  FaRegBookmark,
  FaDownload,
  FaExpand,
  FaTrash,
  FaFire,
  FaRegCommentAlt,
  FaRegBookmark as FaRegBookmarkAlt,
  FaBookmark as FaBookmarkSolid,
  FaSearch,
  FaMapMarkerAlt
} from "react-icons/fa";
import { FiSend, FiShare2, FiFilter, FiClock, FiTrendingUp, FiUsers, FiShoppingBag, FiGlobe, FiGrid, FiList, FiSliders, FiX, FiChevronDown, FiChevronUp, FiCheck, FiSearch as FiSearchIcon } from "react-icons/fi";
import { IoMdSend } from "react-icons/io";
import { motion, AnimatePresence } from "framer-motion";
import {
  BsThreeDotsVertical,
  BsEmojiSmile,
  BsArrowRight,
  BsLightningChargeFill
} from "react-icons/bs";
import { RiLiveLine, RiVerifiedBadgeFill } from "react-icons/ri";
import { HiOutlineSparkles } from "react-icons/hi";
import { IoMusicalNotesOutline } from "react-icons/io5";
import { AiOutlineRobot } from "react-icons/ai";

const MAX_TEXT_LENGTH = 150; // Characters before truncating

const formatText = (text) => {
  if (!text) return { formattedText: "", hashtags: [] };

  // Extract hashtags
  const hashtagRegex = /#(\w+)/g;
  const hashtags = [...new Set(text.match(hashtagRegex) || [])];

  // Replace URLs with anchor tags
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  let formattedText = text.replace(
    urlRegex,
    (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">${url}</a>`
  );

  // Replace hashtags with styled spans (we'll handle clicks separately)
  formattedText = formattedText.replace(
    hashtagRegex,
    (hashtag) => `<span class="text-blue-500 cursor-pointer">${hashtag}</span>`
  );

  return { formattedText, hashtags };
};

const ExplorePage = () => {
  const [activeTab, setActiveTab] = useState("forYou");
  const [viewMode, setViewMode] = useState("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    category: "",
    mediaType: "",
    timeRange: "",
    trendingScore: 0,
    likes: 0,
    shares: 0,
    creatorType: "",
    verifiedOnly: false,
    withMusic: false,
    aiGenerated: false,
  });
  const [savedPosts, setSavedPosts] = useState([]);
  const [expandedFilter, setExpandedFilter] = useState(null);
  const [expandedPosts, setExpandedPosts] = useState({});
  const [fullscreenMedia, setFullscreenMedia] = useState(null);
  const [currentMediaIdx, setCurrentMediaIdx] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const menuRefs = useRef([]);
  const [showHeart, setShowHeart] = useState({ postId: null });

  const { user } = useContext(AuthContext);

  // Mock data for posts
  const mockPosts = [
    {
      id: 1,
      _id: '1',
      user: {
        username: 'travel_lover',
        avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
        verified: true
      },
      media: [{ url: 'https://source.unsplash.com/random/800x600/?travel', type: 'image' }],
      content: 'Exploring the beautiful mountains of Switzerland! 🏔️ #travel #adventure',
      reactions: Array(1243).fill({ type: 'like' }),
      comments: Array(89).fill({}),
      shares: 45,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      location: 'Switzerland',
      category: 'travel',
      trendingScore: 85,
      hasMusic: false,
      isAI: false,
      tags: ['travel', 'adventure', 'mountains'],
      isLive: true
    },
    {
      id: 2,
      _id: '2',
      user: {
        username: 'foodie_explorer',
        avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
        verified: false
      },
      media: [{ url: 'https://source.unsplash.com/random/800x600/?food', type: 'image' }],
      content: 'Homemade pasta that will make your mouth water! 🍝 #foodie #homecooking',
      reactions: Array(982).fill({ type: 'like' }),
      comments: Array(67).fill({}),
      shares: 23,
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      location: 'Italy',
      category: 'food',
      trendingScore: 72,
      hasMusic: true,
      isAI: false,
      tags: ['food', 'pasta', 'cooking'],
    },
    {
      id: 3,
      _id: '3',
      user: {
        username: 'fashion_trends',
        avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
        verified: true
      },
      media: [{ url: 'https://source.unsplash.com/random/800x600/?fashion', type: 'image' }],
      content: 'Summer 2023 trends you need to know! 👗 #fashion #summer2023',
      reactions: Array(1567).fill({ type: 'like' }),
      comments: Array(124).fill({}),
      shares: 89,
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      location: 'Paris',
      category: 'fashion',
      trendingScore: 92,
      hasMusic: true,
      isAI: true,
      tags: ['fashion', 'summer', 'trends'],
    },
    {
      id: 4,
      _id: '4',
      user: {
        username: 'tech_guru',
        avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
        verified: true
      },
      media: [{ url: 'https://source.unsplash.com/random/800x600/?technology', type: 'image' }],
      content: 'The future of AI in everyday life - mind blowing stuff! #tech #ai #future',
      reactions: Array(2345).fill({ type: 'like' }),
      comments: Array(187).fill({}),
      shares: 156,
      createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      location: 'San Francisco',
      category: 'technology',
      trendingScore: 95,
      hasMusic: false,
      isAI: false,
      tags: ['tech', 'ai', 'innovation'],
    },
    {
      id: 5,
      _id: '5',
      user: {
        username: 'fitness_coach',
        avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
        verified: false
      },
      media: [{ url: 'https://source.unsplash.com/random/800x600/?fitness', type: 'image' }],
      content: '5 exercises to transform your body in 30 days! 💪 #fitness #workout',
      reactions: Array(876).fill({ type: 'like' }),
      comments: Array(45).fill({}),
      shares: 32,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      location: 'New York',
      category: 'fitness',
      trendingScore: 68,
      hasMusic: true,
      isAI: false,
      tags: ['fitness', 'workout', 'exercise'],
    },
    {
      id: 6,
      _id: '6',
      user: {
        username: 'art_visionary',
        avatar: 'https://randomuser.me/api/portraits/men/78.jpg',
        verified: false
      },
      media: [{ url: 'https://source.unsplash.com/random/800x600/?art', type: 'image' }],
      content: 'My latest digital art piece - what do you think? #art #digitalart',
      reactions: Array(1432).fill({ type: 'like' }),
      comments: Array(98).fill({}),
      shares: 76,
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      location: 'Berlin',
      category: 'art',
      trendingScore: 79,
      hasMusic: false,
      isAI: true,
      tags: ['art', 'digital', 'creative'],
    },
  ];

  const [filteredPosts, setFilteredPosts] = useState(mockPosts);

  // Initialize states for posts
  useEffect(() => {
    setCurrentMediaIdx(mockPosts.map(() => 0));
    setLikedPosts(mockPosts.map(post => 
      post.reactions?.some(r => r.user?._id === user?._id && r.type === "like") || false
    ));
  }, []);

  // Apply filters when they change
  useEffect(() => {
    let results = mockPosts;
    
    if (searchQuery) {
      results = results.filter(post => 
        post.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )}
    
    if (selectedFilters.category) {
      results = results.filter(post => post.category === selectedFilters.category);
    }
    
    if (selectedFilters.mediaType) {
      results = results.filter(post => {
        if (selectedFilters.mediaType === 'image') return post.media[0].type === 'image';
        if (selectedFilters.mediaType === 'video') return post.media[0].type === 'video';
        return true;
      });
    }
    
    if (selectedFilters.timeRange) {
      const hours = parseInt(selectedFilters.timeRange);
      results = results.filter(post => {
        const postDate = new Date(post.createdAt);
        const diffHours = (new Date() - postDate) / (1000 * 60 * 60);
        return diffHours <= hours;
      });
    }
    
    if (selectedFilters.trendingScore > 0) {
      results = results.filter(post => post.trendingScore >= selectedFilters.trendingScore);
    }
    
    if (selectedFilters.likes > 0) {
      results = results.filter(post => post.reactions.length >= selectedFilters.likes);
    }
    
    if (selectedFilters.shares > 0) {
      results = results.filter(post => post.shares >= selectedFilters.shares);
    }
    
    if (selectedFilters.verifiedOnly) {
      results = results.filter(post => post.user.verified);
    }
    
    if (selectedFilters.withMusic) {
      results = results.filter(post => post.hasMusic);
    }
    
    if (selectedFilters.aiGenerated) {
      results = results.filter(post => post.isAI);
    }
    
    setFilteredPosts(results);
  }, [selectedFilters, searchQuery]);

  const categories = [
    { id: '', name: 'All Categories' },
    { id: 'travel', name: 'Travel', icon: '🌍' },
    { id: 'food', name: 'Food', icon: '🍔' },
    { id: 'fashion', name: 'Fashion', icon: '👗' },
    { id: 'technology', name: 'Technology', icon: '💻' },
    { id: 'fitness', name: 'Fitness', icon: '💪' },
    { id: 'art', name: 'Art', icon: '🎨' },
    { id: 'music', name: 'Music', icon: '🎵' },
    { id: 'gaming', name: 'Gaming', icon: '🎮' },
  ];

  const mediaTypes = [
    { id: '', name: 'All Media' },
    { id: 'image', name: 'Images' },
    { id: 'video', name: 'Videos' },
  ];

  const timeRanges = [
    { id: '', name: 'All Time' },
    { id: '1', name: 'Last Hour' },
    { id: '24', name: 'Last 24 Hours' },
    { id: '168', name: 'Last Week' },
  ];

  const trendingCreators = [
    { id: 1, username: 'travel_lover', avatar: 'https://randomuser.me/api/portraits/women/32.jpg', category: 'Travel', followers: '1.2M', isLive: true },
    { id: 2, username: 'foodie_explorer', avatar: 'https://randomuser.me/api/portraits/men/22.jpg', category: 'Food', followers: '856K', isLive: false },
    { id: 3, username: 'tech_guru', avatar: 'https://randomuser.me/api/portraits/men/65.jpg', category: 'Technology', followers: '2.1M', isLive: true },
  ];

  const trendingHashtags = [
    { id: 1, tag: '#summer2023', posts: '1.2M', trending: true },
    { id: 2, tag: '#travelgram', posts: '856K', trending: false },
    { id: 3, tag: '#foodie', posts: '2.1M', trending: true },
    { id: 4, tag: '#technews', posts: '1.5M', trending: false },
    { id: 5, tag: '#fitnessmotivation', posts: '1.8M', trending: true },
  ];

  const nearbyLocations = [
    { id: 1, name: 'Downtown', posts: '12.4K', distance: '0.5 mi' },
    { id: 2, name: 'Central Park', posts: '8.7K', distance: '1.2 mi' },
    { id: 3, name: 'Beachfront', posts: '6.2K', distance: '2.5 mi' },
  ];

  const globalTrends = [
    { country: 'USA', trend: '#SummerVibes', posts: '2.4M', rising: true },
    { country: 'Japan', trend: '#Anime2023', posts: '1.8M', rising: false },
    { country: 'Brazil', trend: '#Carnival', posts: '1.5M', rising: true },
  ];

  const handleFilterChange = (filterName, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const resetFilters = () => {
    setSelectedFilters({
      category: '',
      mediaType: '',
      timeRange: '',
      trendingScore: 0,
      likes: 0,
      shares: 0,
      creatorType: '',
      verifiedOnly: false,
      withMusic: false,
      aiGenerated: false,
    });
    setSearchQuery('');
  };

  const toggleSavePost = (postId) => {
    if (savedPosts.includes(postId)) {
      setSavedPosts(savedPosts.filter(id => id !== postId));
    } else {
      setSavedPosts([...savedPosts, postId]);
    }
  };

  const toggleFilterSection = (section) => {
    if (expandedFilter === section) {
      setExpandedFilter(null);
    } else {
      setExpandedFilter(section);
    }
  };

  const toggleTextExpansion = (postId) => {
    setExpandedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handlePrev = (postIdx) => {
    setCurrentMediaIdx((idxArr) =>
      idxArr.map((idx, i) => (i === postIdx ? Math.max(0, idx - 1) : idx))
    );
  };

  const handleNext = (postIdx, mediaLen) => {
    setCurrentMediaIdx((idxArr) =>
      idxArr.map((idx, i) =>
        i === postIdx ? Math.min(mediaLen - 1, idx + 1) : idx
      )
    );
  };

  const toggleLike = async (postId, postIdx) => {
    try {
      const isLiked = likedPosts[postIdx];
      
      // In a real app, you would make an API call here
      // await axiosInstance.put(`/posts/${postId}/${isLiked ? 'unlike' : 'like'}`);
      
      setLikedPosts((prev) =>
        prev.map((liked, i) => (i === postIdx ? !liked : liked))
      );

      if (!isLiked) {
        setShowHeart({ postId });
        setTimeout(() => setShowHeart({ postId: null }), 700);
      }
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
  };

  const handleMediaClick = (postIdx, mediaIdx) => {
    const post = filteredPosts[postIdx];
    if (post?.media?.[mediaIdx]) {
      setFullscreenMedia({
        url: post.media[mediaIdx].url,
        type: post.media[mediaIdx].type
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-black dark:to-gray-900 pb-40">
      {/* Fullscreen Media Viewer */}
      <AnimatePresence>
        {fullscreenMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black flex items-center justify-center"
            onClick={() => setFullscreenMedia(null)}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              <button
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  setFullscreenMedia(null);
                }}
              >
                <FaTimes size={24} />
              </button>
              
              {fullscreenMedia.type === "image" ? (
                <img
                  src={fullscreenMedia.url}
                  className="max-w-full max-h-full object-contain"
                  alt="Fullscreen media"
                />
              ) : (
                <video
                  src={fullscreenMedia.url}
                  className="max-w-full max-h-full"
                  controls
                  autoPlay
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-20 bg-white dark:bg-black shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {!mobileSearchOpen ? (
              <>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Explore
                </h1>
                
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setMobileSearchOpen(true)}
                    className="p-2 md:hidden rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiSearchIcon className="text-gray-600 dark:text-gray-300" />
                  </button>
                  
                  <button 
                    onClick={() => setFiltersOpen(!filtersOpen)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 relative"
                  >
                    <FiFilter className="text-gray-600 dark:text-gray-300" />
                    {Object.values(selectedFilters).some(val => val !== '' && val !== false && val !== 0) && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>
                  
                  <div className="relative hidden md:block">
                    <input
                      type="text"
                      placeholder="Search explore..."
                      className="pl-10 pr-4 py-2 w-64 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <FiSearchIcon className="absolute left-3 top-3 text-gray-400 dark:text-gray-400" />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <FiX />
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center w-full">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search explore..."
                    className="pl-10 pr-10 py-2 w-full rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <FiSearchIcon className="absolute left-3 top-3 text-gray-400 dark:text-gray-400" />
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setMobileSearchOpen(false);
                    }}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <FiX />
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-4 mt-4 overflow-x-auto scrollbar-hide pb-1">
            <button
              onClick={() => setActiveTab('forYou')}
              className={`pb-2 px-1 whitespace-nowrap ${activeTab === 'forYou' ? 'border-b-2 border-indigo-500 font-medium text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              For You
            </button>
            <button
              onClick={() => setActiveTab('trending')}
              className={`pb-2 px-1 whitespace-nowrap ${activeTab === 'trending' ? 'border-b-2 border-indigo-500 font-medium text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              Trending
            </button>
            <button
              onClick={() => setActiveTab('nearby')}
              className={`pb-2 px-1 whitespace-nowrap ${activeTab === 'nearby' ? 'border-b-2 border-indigo-500 font-medium text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              Nearby
            </button>
            <button
              onClick={() => setActiveTab('reels')}
              className={`pb-2 px-1 whitespace-nowrap ${activeTab === 'reels' ? 'border-b-2 border-indigo-500 font-medium text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              Reels
            </button>
            <button
              onClick={() => setActiveTab('global')}
              className={`pb-2 px-1 whitespace-nowrap ${activeTab === 'global' ? 'border-b-2 border-indigo-500 font-medium text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              Global
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Filters Panel */}
        {filtersOpen && (
          <div className="bg-white dark:bg-black rounded-xl shadow-lg p-4 mb-6 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center dark:text-white">
                <FiFilter className="mr-2" /> Filters
              </h2>
              <div className="flex space-x-2">
                <button 
                  onClick={resetFilters}
                  className="px-3 py-1 text-sm text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700 rounded-lg"
                >
                  Reset All
                </button>
                <button 
                  onClick={() => setFiltersOpen(false)}
                  className="px-3 py-1 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
                >
                  <FiCheck className="mr-1" /> Apply
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Search Filter */}
              <div className="pb-2 border-b border-gray-100 dark:border-gray-900">
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleFilterSection('search')}
                >
                  <h3 className="font-medium dark:text-white">Search</h3>
                  {expandedFilter === 'search' ? <FiChevronUp className="dark:text-white" /> : <FiChevronDown className="dark:text-white" />}
                </div>
                {expandedFilter === 'search' && (
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Search within results..."
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                )}
              </div>
              
              {/* Category Filter */}
              <div className="pb-2 border-b border-gray-100 dark:border-gray-700">
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleFilterSection('category')}
                >
                  <h3 className="font-medium dark:text-white">Category</h3>
                  {expandedFilter === 'category' ? <FiChevronUp className="dark:text-white" /> : <FiChevronDown className="dark:text-white" />}
                </div>
                {expandedFilter === 'category' && (
                  <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => handleFilterChange('category', cat.id)}
                        className={`px-3 py-2 rounded-lg flex items-center justify-center ${selectedFilters.category === cat.id ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-700' : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
                      >
                        {cat.icon && <span className="mr-2">{cat.icon}</span>}
                        {cat.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Media Type Filter */}
              <div className="pb-2 border-b border-gray-100 dark:border-gray-700">
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleFilterSection('mediaType')}
                >
                  <h3 className="font-medium dark:text-white">Media Type</h3>
                  {expandedFilter === 'mediaType' ? <FiChevronUp className="dark:text-white" /> : <FiChevronDown className="dark:text-white" />}
                </div>
                {expandedFilter === 'mediaType' && (
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {mediaTypes.map(type => (
                      <button
                        key={type.id}
                        onClick={() => handleFilterChange('mediaType', type.id)}
                        className={`px-3 py-2 rounded-lg ${selectedFilters.mediaType === type.id ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 border border-indigo-300 dark:border-indigo-700' : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
                      >
                        {type.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Advanced Filters */}
              <div className="pb-2 border-b border-gray-100 dark:border-gray-700">
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleFilterSection('advanced')}
                >
                  <h3 className="font-medium dark:text-white">Advanced Filters</h3>
                  {expandedFilter === 'advanced' ? <FiChevronUp className="dark:text-white" /> : <FiChevronDown className="dark:text-white" />}
                </div>
                {expandedFilter === 'advanced' && (
                  <div className="mt-2 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time Range</label>
                      <select
                        value={selectedFilters.timeRange}
                        onChange={(e) => handleFilterChange('timeRange', e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        {timeRanges.map(range => (
                          <option key={range.id} value={range.id}>{range.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Minimum Trending Score: {selectedFilters.trendingScore}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={selectedFilters.trendingScore}
                        onChange={(e) => handleFilterChange('trendingScore', parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Minimum Likes</label>
                        <input
                          type="number"
                          min="0"
                          value={selectedFilters.likes}
                          onChange={(e) => handleFilterChange('likes', parseInt(e.target.value))}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Minimum Shares</label>
                        <input
                          type="number"
                          min="0"
                          value={selectedFilters.shares}
                          onChange={(e) => handleFilterChange('shares', parseInt(e.target.value))}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="verifiedOnly"
                          checked={selectedFilters.verifiedOnly}
                          onChange={(e) => handleFilterChange('verifiedOnly', e.target.checked)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                        />
                        <label htmlFor="verifiedOnly" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          Verified Only
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="withMusic"
                          checked={selectedFilters.withMusic}
                          onChange={(e) => handleFilterChange('withMusic', e.target.checked)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                        />
                        <label htmlFor="withMusic" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          With Music
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="aiGenerated"
                          checked={selectedFilters.aiGenerated}
                          onChange={(e) => handleFilterChange('aiGenerated', e.target.checked)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                        />
                        <label htmlFor="aiGenerated" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                          AI Generated
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* View Mode and Active Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide w-full sm:w-auto pb-2 sm:pb-0">
            {Object.entries(selectedFilters).map(([key, value]) => {
              if (!value || value === 0 || value === false) return null;
              
              let displayValue = value;
              if (key === 'category') {
                displayValue = categories.find(c => c.id === value)?.name || value;
              } else if (key === 'mediaType') {
                displayValue = mediaTypes.find(m => m.id === value)?.name || value;
              } else if (key === 'timeRange') {
                displayValue = timeRanges.find(t => t.id === value)?.name || value;
              } else if (key === 'verifiedOnly') {
                displayValue = 'Verified';
              } else if (key === 'withMusic') {
                displayValue = 'With Music';
              } else if (key === 'aiGenerated') {
                displayValue = 'AI Generated';
              }
              
              return (
                <div 
                  key={key} 
                  className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm whitespace-nowrap"
                >
                  <span className="mr-1 dark:text-gray-200">{displayValue}</span>
                  <button 
                    onClick={() => handleFilterChange(key, key === 'verifiedOnly' || key === 'withMusic' || key === 'aiGenerated' ? false : '')}
                    className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              );
            })}
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">{filteredPosts.length} results</span>
            <div className="inline-flex rounded-md shadow-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 text-sm font-medium rounded-l-lg flex items-center ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
              >
                <FiGrid className="mr-1" /> Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 text-sm font-medium rounded-r-lg flex items-center ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
              >
                <FiList className="mr-1" /> List
              </button>
            </div>
          </div>
        </div>
        
        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* Trending Tags */}
            <div className="bg-white dark:bg-black rounded-xl shadow-sm p-4 mb-6 border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold flex items-center dark:text-white">
                  <FaFire className="text-orange-500 mr-2" /> Trending Tags
                </h2>
                <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium">See all</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingHashtags.map(tag => (
                  <button
                    key={tag.id}
                    className={`px-3 py-1 rounded-full text-sm flex items-center ${tag.trending ? 'bg-gradient-to-r from-orange-100 dark:from-orange-900 to-pink-100 dark:to-pink-900 text-orange-700 dark:text-orange-300' : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
                  >
                    {tag.tag} <span className="text-gray-400 dark:text-gray-400 text-xs ml-1">({tag.posts})</span>
                    {tag.trending && <BsLightningChargeFill className="ml-1 text-orange-500" />}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Nearby Locations */}
            <div className="bg-white dark:bg-black rounded-xl shadow-sm p-4 mb-6 border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold flex items-center dark:text-white">
                  <FaMapMarkerAlt className="text-red-500 mr-2" /> Nearby Locations
                </h2>
                <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium">See all</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {nearbyLocations.map(location => (
                  <button
                    key={location.id}
                    className="px-3 py-1 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                  >
                    <FaMapMarkerAlt className="mr-1 text-red-500" /> {location.name} 
                    <span className="text-gray-400 dark:text-gray-400 text-xs ml-1">({location.posts})</span>
                    <span className="text-xs ml-2 text-gray-500 dark:text-gray-400">{location.distance}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Trending Creators */}
            <div className="bg-white dark:bg-black rounded-xl shadow-sm p-4 mb-6 border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold flex items-center dark:text-white">
                  <FiUsers className="text-purple-500 mr-2" /> Trending Creators
                </h2>
                <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium">See all</button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {trendingCreators.map(creator => (
                  <div key={creator.id} className="text-center group">
                    <div className="relative w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden border-2 border-indigo-500 group-hover:border-indigo-700 transition-colors">
                      <img src={creator.avatar} alt={creator.username} className="w-full h-full object-cover" />
                      {creator.isLive && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1 rounded-full flex items-center">
                          <span className="w-2 h-2 bg-white rounded-full mr-1"></span>
                          Live
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium text-sm truncate px-1 dark:text-white">@{creator.username}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate px-1">{creator.category}</p>
                    <p className="text-xs text-indigo-500 dark:text-indigo-400">{creator.followers}</p>
                    <button className="mt-1 px-2 py-1 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700 transition-colors w-full">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Posts */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold dark:text-white">
                  {activeTab === 'forYou' && 'Recommended For You'}
                  {activeTab === 'trending' && 'Trending Now'}
                  {activeTab === 'nearby' && 'Nearby Posts'}
                  {activeTab === 'reels' && 'Popular Reels'}
                  {activeTab === 'global' && 'Global Content'}
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500 dark:text-gray-400">{filteredPosts.length} posts</span>
                  <button 
                    onClick={() => setFiltersOpen(!filtersOpen)}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiSliders className="text-gray-600 dark:text-gray-300" />
                  </button>
                </div>
              </div>
              
              {filteredPosts.length === 0 ? (
                <div className="bg-white dark:bg-black rounded-xl shadow-sm p-8 text-center border border-gray-100 dark:border-gray-700">
                  <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <FiSearchIcon className="text-gray-400 dark:text-gray-500 text-2xl" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">No results found</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">Try adjusting your search or filter criteria</p>
                  <button 
                    onClick={resetFilters}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredPosts.map((post, postIdx) => {
                    const mediaIdx = currentMediaIdx[postIdx] || 0;
                    const mediaItem = post.media?.[mediaIdx] || {};
                    const isLiked = likedPosts[postIdx];
                    const isBookmarked = savedPosts.includes(post.id);
                    const likeCount = post.reactions?.length || 0;
                    const commentCount = post.comments?.length || 0;
                    const isExpanded = expandedPosts[post._id];
                    const { formattedText, hashtags } = formatText(post.content);
                    const shouldTruncate = post.content?.length > MAX_TEXT_LENGTH && !isExpanded;

                    return (
                      <div key={post.id} className="bg-white dark:bg-black rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                        {/* Post Header */}
                        <div className="p-4 backdrop-blur-sm bg-white/80 dark:bg-black border-b border-gray-100 dark:border-gray-700">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Link
                                to={`/profile/${post.user.username}`}
                                className="relative group"
                              >
                                <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <img
                                  src={post.user.avatar}
                                  className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-800 relative z-10"
                                  alt={post.user.username}
                                />
                                {post.isLive && (
                                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center z-20">
                                    <RiLiveLine className="mr-1" /> LIVE
                                  </div>
                                )}
                              </Link>

                              <div>
                                <Link to={`/profile/${post.user.username}`}>
                                  <p className="font-bold text-gray-900 dark:text-white group-hover:text-pink-500 transition-colors">
                                    {post.user.username}
                                    {post.user.verified && (
                                      <span className="ml-1 text-blue-500">✓</span>
                                    )}
                                  </p>
                                </Link>
                                <div className="flex items-center space-x-2">
                                  <p className="text-xs text-gray-500">
                                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </p>
                                  <span className="text-gray-300 dark:text-gray-600">•</span>
                                  <span className="text-xs text-gray-500 flex items-center">
                                    <FaMapMarkerAlt className="mr-1" /> {post.location}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div
                              ref={(el) => (menuRefs.current[postIdx] = el)}
                              className="relative"
                            >
                              <button
                                onClick={() =>
                                  setOpenMenu(openMenu === postIdx ? null : postIdx)
                                }
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              >
                                <BsThreeDotsVertical className="text-gray-500 dark:text-gray-400 text-lg" />
                              </button>

                              {openMenu === postIdx && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 10 }}
                                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-black rounded-xl shadow-xl z-50 overflow-hidden border border-gray-100 dark:border-gray-700"
                                >
                                  <button className="flex items-center w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    <FiShare2 className="mr-3 text-gray-500 dark:text-gray-400" />
                                    <span className="dark:text-white">Share Post</span>
                                  </button>
                                  <button 
                                    onClick={() => toggleSavePost(post.id)}
                                    className="flex items-center w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                  >
                                    {isBookmarked ? (
                                      <FaBookmarkSolid className="mr-3 text-yellow-500" />
                                    ) : (
                                      <FaRegBookmarkAlt className="mr-3 text-gray-500 dark:text-gray-400" />
                                    )}
                                    <span className="dark:text-white">{isBookmarked ? 'Unsave' : 'Save'} Post</span>
                                  </button>
                                  {user?._id === post.user?._id && (
                                    <button className="flex items-center w-full px-4 py-3 text-left text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                      <FaTrash className="mr-3" />
                                      <span>Delete Post</span>
                                    </button>
                                  )}
                                </motion.div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Post Content with Read More */}
                        {post.content && (
                          <div className="p-5">
                            <div 
                              className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed"
                              dangerouslySetInnerHTML={{ 
                                __html: shouldTruncate 
                                  ? `${formattedText.substring(0, MAX_TEXT_LENGTH)}...` 
                                  : formattedText 
                              }}
                            />
                            {post.content.length > MAX_TEXT_LENGTH && (
                              <button
                                onClick={() => toggleTextExpansion(post._id)}
                                className="text-pink-500 text-sm font-medium mt-2 hover:underline"
                              >
                                {isExpanded ? "Read Less" : "Read More"}
                              </button>
                            )}
                            
                            {/* Hashtags */}
                            {hashtags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {hashtags.map((hashtag, idx) => (
                                  <Link
                                    key={idx}
                                    to={`/explore/tags/${hashtag.substring(1)}`}
                                    className="text-blue-500 hover:underline text-sm"
                                  >
                                    {hashtag}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Media Display */}
                        {post.media?.length > 0 && (
                          <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

                            <div 
                              className="cursor-pointer"
                              onClick={() => handleMediaClick(postIdx, mediaIdx)}
                            >
                              {mediaItem.type === "video" ? (
                                <video
                                  src={mediaItem.url}
                                  className="w-full max-h-[600px] object-cover"
                                  controls
                                />
                              ) : (
                                <img
                                  src={mediaItem.url}
                                  className="w-full max-h-[600px] object-cover"
                                  alt="Post media"
                                  onDoubleClick={() => toggleLike(post._id, postIdx)}
                                />
                              )}
                            </div>

                            {/* Fullscreen button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMediaClick(postIdx, mediaIdx);
                              }}
                              className="absolute top-3 right-3 p-2 bg-black/30 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
                            >
                              <FaExpand size={16} />
                            </button>

                            {/* Heart Animation */}
                            <AnimatePresence>
                              {showHeart.postId === post._id && (
                                <motion.div
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{
                                    scale: [0, 1.5, 1],
                                    opacity: [0, 1, 0],
                                  }}
                                  transition={{ duration: 1 }}
                                  className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                                >
                                  <FaHeart
                                    className="text-white drop-shadow-2xl"
                                    style={{ fontSize: 120, color: "#e11d48" }}
                                  />
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* Media Navigation Arrows */}
                            {post.media.length > 1 && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePrev(postIdx);
                                  }}
                                  disabled={mediaIdx === 0}
                                  className={`absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-2 z-20 transition-all ${
                                    mediaIdx === 0
                                      ? "opacity-0 cursor-default"
                                      : "opacity-0 group-hover:opacity-100 hover:bg-black/50"
                                  }`}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 19l-7-7 7-7"
                                    />
                                  </svg>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleNext(postIdx, post.media.length);
                                  }}
                                  disabled={mediaIdx === post.media.length - 1}
                                  className={`absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-2 z-20 transition-all ${
                                    mediaIdx === post.media.length - 1
                                      ? "opacity-0 cursor-default"
                                      : "opacity-0 group-hover:opacity-100 hover:bg-black/50"
                                  }`}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 5l7 7-7 7"
                                    />
                                  </svg>
                                </button>
                              </>
                            )}

                            {/* Media Indicators */}
                            {post.media.length > 1 && (
                              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                                {post.media.map((_, i) => (
                                  <span
                                    key={i}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                      i === mediaIdx
                                        ? "bg-white w-6"
                                        : "bg-white/50 w-3"
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Action Bar */}
                        <div className="p-4">
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex space-x-5">
                              <button
                                onClick={() => toggleLike(post._id, postIdx)}
                                className="group relative"
                              >
                                <div className="absolute -inset-1 bg-pink-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                {isLiked ? (
                                  <FaHeart className="text-red-500 text-2xl" />
                                ) : (
                                  <FaRegHeart className="text-gray-500 dark:text-gray-400 text-2xl group-hover:text-red-400 transition-colors" />
                                )}
                              </button>

                              <button className="group relative">
                                <div className="absolute -inset-1 bg-blue-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <FaRegComment className="text-gray-500 dark:text-gray-400 text-2xl group-hover:text-blue-400 transition-colors" />
                              </button>

                              <button className="group relative">
                                <div className="absolute -inset-1 bg-green-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <FiShare2 className="text-gray-500 dark:text-gray-400 text-2xl group-hover:text-green-400 transition-colors" />
                              </button>
                            </div>

                            <button
                              onClick={() => toggleSavePost(post.id)}
                              className="group relative"
                            >
                              <div className="absolute -inset-1 bg-purple-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              {isBookmarked ? (
                                <FaBookmark className="text-purple-500 text-2xl" />
                              ) : (
                                <FaRegBookmark className="text-gray-500 dark:text-gray-400 text-2xl group-hover:text-purple-400 transition-colors" />
                              )}
                            </button>
                          </div>

                          {/* Likes Count */}
                          <div className="mb-3">
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                              {likeCount.toLocaleString()} likes
                            </p>
                          </div>

                          {/* Comments Preview */}
                          {post.comments?.length > 0 && (
                            <div className="mb-3">
                              <p className="text-sm text-gray-800 dark:text-gray-200">
                                <Link
                                  to={`/profile/${post.comments[0].user?.username}`}
                                  className="font-semibold hover:underline"
                                >
                                  {post.comments[0].user?.username || "User"}
                                </Link>{" "}
                                {post.comments[0].text}
                              </p>
                              {post.comments.length > 1 && (
                                <button className="text-sm text-gray-500 dark:text-gray-400 mt-1 hover:underline">
                                  View all {commentCount} comments
                                </button>
                              )}
                            </div>
                          )}

                          {/* Add Comment */}
                          <div className="relative mt-4">
                            <input
                              type="text"
                              placeholder="Add a comment..."
                              className="w-full bg-gray-50 dark:bg-gray-900 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 peer text-gray-900 dark:text-white"
                            />
                            <button
                              className={`absolute right-1 top-1 p-2 rounded-full ${
                                true ? "text-pink-500 hover:text-pink-600" : "text-gray-400"
                              }`}
                            >
                              <IoMdSend className="text-xl" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPosts.map((post, postIdx) => {
                    const mediaIdx = currentMediaIdx[postIdx] || 0;
                    const mediaItem = post.media?.[mediaIdx] || {};
                    const isLiked = likedPosts[postIdx];
                    const isBookmarked = savedPosts.includes(post.id);
                    const likeCount = post.reactions?.length || 0;
                    const commentCount = post.comments?.length || 0;
                    const isExpanded = expandedPosts[post._id];
                    const { formattedText, hashtags } = formatText(post.content);
                    const shouldTruncate = post.content?.length > MAX_TEXT_LENGTH && !isExpanded;

                    return (
                      <div key={post.id} className="bg-white dark:bg-black rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
                        {/* Post Header */}
                        <div className="p-4 backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-700">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Link
                                to={`/profile/${post.user.username}`}
                                className="relative group"
                              >
                                <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <img
                                  src={post.user.avatar}
                                  className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-gray-800 relative z-10"
                                  alt={post.user.username}
                                />
                                {post.isLive && (
                                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center z-20">
                                    <RiLiveLine className="mr-1" /> LIVE
                                  </div>
                                )}
                              </Link>

                              <div>
                                <Link to={`/profile/${post.user.username}`}>
                                  <p className="font-bold text-gray-900 dark:text-white group-hover:text-pink-500 transition-colors">
                                    {post.user.username}
                                    {post.user.verified && (
                                      <span className="ml-1 text-blue-500">✓</span>
                                    )}
                                  </p>
                                </Link>
                                <div className="flex items-center space-x-2">
                                  <p className="text-xs text-gray-500">
                                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </p>
                                  <span className="text-gray-300 dark:text-gray-600">•</span>
                                  <span className="text-xs text-gray-500 flex items-center">
                                    <FaMapMarkerAlt className="mr-1" /> {post.location}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div
                              ref={(el) => (menuRefs.current[postIdx] = el)}
                              className="relative"
                            >
                              <button
                                onClick={() =>
                                  setOpenMenu(openMenu === postIdx ? null : postIdx)
                                }
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              >
                                <BsThreeDotsVertical className="text-gray-500 dark:text-gray-400 text-lg" />
                              </button>

                              {openMenu === postIdx && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 10 }}
                                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-black rounded-xl shadow-xl z-50 overflow-hidden border border-gray-100 dark:border-gray-700"
                                >
                                  <button className="flex items-center w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    <FiShare2 className="mr-3 text-gray-500 dark:text-gray-400" />
                                    <span className="dark:text-white">Share Post</span>
                                  </button>
                                  <button 
                                    onClick={() => toggleSavePost(post.id)}
                                    className="flex items-center w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                  >
                                    {isBookmarked ? (
                                      <FaBookmarkSolid className="mr-3 text-yellow-500" />
                                    ) : (
                                      <FaRegBookmarkAlt className="mr-3 text-gray-500 dark:text-gray-400" />
                                    )}
                                    <span className="dark:text-white">{isBookmarked ? 'Unsave' : 'Save'} Post</span>
                                  </button>
                                  {user?._id === post.user?._id && (
                                    <button className="flex items-center w-full px-4 py-3 text-left text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                      <FaTrash className="mr-3" />
                                      <span>Delete Post</span>
                                    </button>
                                  )}
                                </motion.div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Post Content with Read More */}
                        {post.content && (
                          <div className="p-5">
                            <div 
                              className="text-gray-800 dark:text-gray-200 font-medium leading-relaxed"
                              dangerouslySetInnerHTML={{ 
                                __html: shouldTruncate 
                                  ? `${formattedText.substring(0, MAX_TEXT_LENGTH)}...` 
                                  : formattedText 
                              }}
                            />
                            {post.content.length > MAX_TEXT_LENGTH && (
                              <button
                                onClick={() => toggleTextExpansion(post._id)}
                                className="text-pink-500 text-sm font-medium mt-2 hover:underline"
                              >
                                {isExpanded ? "Read Less" : "Read More"}
                              </button>
                            )}
                            
                            {/* Hashtags */}
                            {hashtags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3">
                                {hashtags.map((hashtag, idx) => (
                                  <Link
                                    key={idx}
                                    to={`/explore/tags/${hashtag.substring(1)}`}
                                    className="text-blue-500 hover:underline text-sm"
                                  >
                                    {hashtag}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Media Display */}
                        {post.media?.length > 0 && (
                          <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

                            <div 
                              className="cursor-pointer"
                              onClick={() => handleMediaClick(postIdx, mediaIdx)}
                            >
                              {mediaItem.type === "video" ? (
                                <video
                                  src={mediaItem.url}
                                  className="w-full max-h-[600px] object-cover"
                                  controls
                                />
                              ) : (
                                <img
                                  src={mediaItem.url}
                                  className="w-full max-h-[600px] object-cover"
                                  alt="Post media"
                                  onDoubleClick={() => toggleLike(post._id, postIdx)}
                                />
                              )}
                            </div>

                            {/* Fullscreen button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMediaClick(postIdx, mediaIdx);
                              }}
                              className="absolute top-3 right-3 p-2 bg-black/30 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
                            >
                              <FaExpand size={16} />
                            </button>

                            {/* Heart Animation */}
                            <AnimatePresence>
                              {showHeart.postId === post._id && (
                                <motion.div
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{
                                    scale: [0, 1.5, 1],
                                    opacity: [0, 1, 0],
                                  }}
                                  transition={{ duration: 1 }}
                                  className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
                                >
                                  <FaHeart
                                    className="text-white drop-shadow-2xl"
                                    style={{ fontSize: 120, color: "#e11d48" }}
                                  />
                                </motion.div>
                              )}
                            </AnimatePresence>

                            {/* Media Navigation Arrows */}
                            {post.media.length > 1 && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePrev(postIdx);
                                  }}
                                  disabled={mediaIdx === 0}
                                  className={`absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-2 z-20 transition-all ${
                                    mediaIdx === 0
                                      ? "opacity-0 cursor-default"
                                      : "opacity-0 group-hover:opacity-100 hover:bg-black/50"
                                  }`}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 19l-7-7 7-7"
                                    />
                                  </svg>
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleNext(postIdx, post.media.length);
                                  }}
                                  disabled={mediaIdx === post.media.length - 1}
                                  className={`absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 text-white rounded-full p-2 z-20 transition-all ${
                                    mediaIdx === post.media.length - 1
                                      ? "opacity-0 cursor-default"
                                      : "opacity-0 group-hover:opacity-100 hover:bg-black/50"
                                  }`}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 5l7 7-7 7"
                                    />
                                  </svg>
                                </button>
                              </>
                            )}

                            {/* Media Indicators */}
                            {post.media.length > 1 && (
                              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                                {post.media.map((_, i) => (
                                  <span
                                    key={i}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${
                                      i === mediaIdx
                                        ? "bg-white w-6"
                                        : "bg-white/50 w-3"
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Action Bar */}
                        <div className="p-4">
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex space-x-5">
                              <button
                                onClick={() => toggleLike(post._id, postIdx)}
                                className="group relative"
                              >
                                <div className="absolute -inset-1 bg-pink-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                {isLiked ? (
                                  <FaHeart className="text-red-500 text-2xl" />
                                ) : (
                                  <FaRegHeart className="text-gray-500 dark:text-gray-400 text-2xl group-hover:text-red-400 transition-colors" />
                                )}
                              </button>

                              <button className="group relative">
                                <div className="absolute -inset-1 bg-blue-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <FaRegComment className="text-gray-500 dark:text-gray-400 text-2xl group-hover:text-blue-400 transition-colors" />
                              </button>

                              <button className="group relative">
                                <div className="absolute -inset-1 bg-green-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <FiShare2 className="text-gray-500 dark:text-gray-400 text-2xl group-hover:text-green-400 transition-colors" />
                              </button>
                            </div>

                            <button
                              onClick={() => toggleSavePost(post.id)}
                              className="group relative"
                            >
                              <div className="absolute -inset-1 bg-purple-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              {isBookmarked ? (
                                <FaBookmark className="text-purple-500 text-2xl" />
                              ) : (
                                <FaRegBookmark className="text-gray-500 dark:text-gray-400 text-2xl group-hover:text-purple-400 transition-colors" />
                              )}
                            </button>
                          </div>

                          {/* Likes Count */}
                          <div className="mb-3">
                            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                              {likeCount.toLocaleString()} likes
                            </p>
                          </div>

                          {/* Comments Preview */}
                          {post.comments?.length > 0 && (
                            <div className="mb-3">
                              <p className="text-sm text-gray-800 dark:text-gray-200">
                                <Link
                                  to={`/profile/${post.comments[0].user?.username}`}
                                  className="font-semibold hover:underline"
                                >
                                  {post.comments[0].user?.username || "User"}
                                </Link>{" "}
                                {post.comments[0].text}
                              </p>
                              {post.comments.length > 1 && (
                                <button className="text-sm text-gray-500 dark:text-gray-400 mt-1 hover:underline">
                                  View all {commentCount} comments
                                </button>
                              )}
                            </div>
                          )}

                          {/* Add Comment */}
                          <div className="relative mt-4">
                            <input
                              type="text"
                              placeholder="Add a comment..."
                              className="w-full bg-gray-50 dark:bg-gray-700 rounded-full px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 peer text-gray-900 dark:text-white"
                            />
                            <button
                              className={`absolute right-1 top-1 p-2 rounded-full ${
                                true ? "text-pink-500 hover:text-pink-600" : "text-gray-400"
                              }`}
                            >
                              <IoMdSend className="text-xl" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Trending Now */}
            <div className="bg-white dark:bg-black rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
              <h2 className="text-lg font-semibold mb-4 flex items-center dark:text-white">
                <FiTrendingUp className="text-green-500 mr-2" /> Trending Now
              </h2>
              <div className="space-y-4">
                {filteredPosts
                  .sort((a, b) => b.trendingScore - a.trendingScore)
                  .slice(0, 3)
                  .map(post => (
                    <div key={post.id} className="flex items-start group">
                      <div className="w-16 h-16 flex-shrink-0 mr-3 rounded-md overflow-hidden relative">
                        <img src={post.media[0].url} alt={post.content} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        {post.media[0].type === "video" && (
                          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-sm line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 dark:text-white">{post.content}</h3>
                        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span>@{post.user.username}</span>
                          <span className="mx-1">•</span>
                          <span>{new Date(post.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                        <div className="flex items-center text-xs mt-1">
                          <FiTrendingUp className={`mr-1 ${post.trendingScore > 80 ? 'text-green-500' : 'text-orange-500'}`} />
                          <span className={`${post.trendingScore > 80 ? 'text-green-500' : 'text-orange-500'} font-medium`}>
                            {post.trendingScore}% trending
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            
            {/* Friends Activity */}
            <div className="bg-white dark:bg-black rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center dark:text-white">
                  <FiUsers className="text-blue-500 mr-2" /> Friends Activity
                </h2>
                <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium">See all</button>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center group">
                    <div className="relative mr-3">
                      <img 
                        src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${30 + i}.jpg`} 
                        alt="Friend" 
                        className="w-10 h-10 rounded-full group-hover:ring-2 group-hover:ring-indigo-500 transition-all" 
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium truncate dark:text-white">Friend {i}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        Liked a post about {['travel', 'food', 'fashion'][i-1]}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">10m ago</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Global Trends */}
            <div className="bg-white dark:bg-black rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold flex items-center dark:text-white">
                  <FiGlobe className="text-indigo-500 mr-2" /> Global Trends
                </h2>
                <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium">See all</button>
              </div>
              <div className="space-y-3">
                {globalTrends.map((item, i) => (
                  <div key={i} className="flex items-center group">
                    <div className="w-8 h-8 flex-shrink-0 mr-3 rounded-full overflow-hidden border border-gray-200 dark:border-gray-600">
                      <img 
                        src={`https://flagcdn.com/w40/${item.country === 'USA' ? 'us' : item.country === 'Japan' ? 'jp' : item.country === 'Brazil' ? 'br' : 'fr'}.png`} 
                        alt={item.country} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 dark:text-white">{item.trend}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {item.country} • {item.posts} posts
                      </p>
                    </div>
                    {item.rising ? (
                      <FiTrendingUp className="text-green-500 flex-shrink-0" />
                    ) : (
                      <FiTrendingUp className="text-gray-400 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ExplorePage;