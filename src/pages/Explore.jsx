import { useState, useEffect } from 'react';
import { FiSearch, FiMapPin, FiFilter, FiHeart, FiMessageSquare, FiShare2, FiBookmark, FiClock, FiTrendingUp, FiUsers, FiShoppingBag, FiGlobe, FiBell, FiGrid, FiList, FiSliders } from 'react-icons/fi';

const ExplorePage = () => {
  const [activeTab, setActiveTab] = useState('forYou');
  const [viewMode, setViewMode] = useState('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
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

  // Mock data for posts
  const mockPosts = [
    {
      id: 1,
      username: 'travel_lover',
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
      image: 'https://source.unsplash.com/random/800x600/?travel',
      caption: 'Exploring the beautiful mountains of Switzerland! 🏔️ #travel #adventure',
      likes: 1243,
      comments: 89,
      shares: 45,
      time: '2h ago',
      location: 'Switzerland',
      category: 'travel',
      verified: true,
      trendingScore: 85,
      hasMusic: false,
      isAI: false,
    },
    {
      id: 2,
      username: 'foodie_explorer',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      image: 'https://source.unsplash.com/random/800x600/?food',
      caption: 'Homemade pasta that will make your mouth water! 🍝 #foodie #homecooking',
      likes: 982,
      comments: 67,
      shares: 23,
      time: '4h ago',
      location: 'Italy',
      category: 'food',
      verified: false,
      trendingScore: 72,
      hasMusic: true,
      isAI: false,
    },
    {
      id: 3,
      username: 'fashion_trends',
      avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
      image: 'https://source.unsplash.com/random/800x600/?fashion',
      caption: 'Summer 2023 trends you need to know! 👗 #fashion #summer2023',
      likes: 1567,
      comments: 124,
      shares: 89,
      time: '1h ago',
      location: 'Paris',
      category: 'fashion',
      verified: true,
      trendingScore: 92,
      hasMusic: true,
      isAI: true,
    },
    {
      id: 4,
      username: 'tech_guru',
      avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
      image: 'https://source.unsplash.com/random/800x600/?technology',
      caption: 'The future of AI in everyday life - mind blowing stuff! #tech #ai #future',
      likes: 2345,
      comments: 187,
      shares: 156,
      time: '30m ago',
      location: 'San Francisco',
      category: 'technology',
      verified: true,
      trendingScore: 95,
      hasMusic: false,
      isAI: false,
    },
    {
      id: 5,
      username: 'fitness_coach',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      image: 'https://source.unsplash.com/random/800x600/?fitness',
      caption: '5 exercises to transform your body in 30 days! 💪 #fitness #workout',
      likes: 876,
      comments: 45,
      shares: 32,
      time: '5h ago',
      location: 'New York',
      category: 'fitness',
      verified: false,
      trendingScore: 68,
      hasMusic: true,
      isAI: false,
    },
    {
      id: 6,
      username: 'art_visionary',
      avatar: 'https://randomuser.me/api/portraits/men/78.jpg',
      image: 'https://source.unsplash.com/random/800x600/?art',
      caption: 'My latest digital art piece - what do you think? #art #digitalart',
      likes: 1432,
      comments: 98,
      shares: 76,
      time: '3h ago',
      location: 'Berlin',
      category: 'art',
      verified: false,
      trendingScore: 79,
      hasMusic: false,
      isAI: true,
    },
  ];

  const [filteredPosts, setFilteredPosts] = useState(mockPosts);

  // Apply filters when they change
  useEffect(() => {
    let results = mockPosts;
    
    if (selectedFilters.category) {
      results = results.filter(post => post.category === selectedFilters.category);
    }
    
    if (selectedFilters.mediaType) {
      // This would be more complex with actual media type data
      results = results.filter(post => {
        if (selectedFilters.mediaType === 'image') return true;
        if (selectedFilters.mediaType === 'video') return post.hasMusic;
        return true;
      });
    }
    
    if (selectedFilters.timeRange) {
      // Simple time filter for demo
      const hours = parseInt(selectedFilters.timeRange);
      results = results.filter(post => {
        const postHours = parseInt(post.time);
        return postHours <= hours;
      });
    }
    
    if (selectedFilters.trendingScore > 0) {
      results = results.filter(post => post.trendingScore >= selectedFilters.trendingScore);
    }
    
    if (selectedFilters.likes > 0) {
      results = results.filter(post => post.likes >= selectedFilters.likes);
    }
    
    if (selectedFilters.shares > 0) {
      results = results.filter(post => post.shares >= selectedFilters.shares);
    }
    
    if (selectedFilters.verifiedOnly) {
      results = results.filter(post => post.verified);
    }
    
    if (selectedFilters.withMusic) {
      results = results.filter(post => post.hasMusic);
    }
    
    if (selectedFilters.aiGenerated) {
      results = results.filter(post => post.isAI);
    }
    
    setFilteredPosts(results);
  }, [selectedFilters]);

  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'travel', name: 'Travel' },
    { id: 'food', name: 'Food' },
    { id: 'fashion', name: 'Fashion' },
    { id: 'technology', name: 'Technology' },
    { id: 'fitness', name: 'Fitness' },
    { id: 'art', name: 'Art' },
    { id: 'music', name: 'Music' },
    { id: 'gaming', name: 'Gaming' },
    { id: 'education', name: 'Education' },
  ];

  const mediaTypes = [
    { id: 'all', name: 'All Media' },
    { id: 'image', name: 'Images' },
    { id: 'video', name: 'Videos' },
    { id: 'reel', name: 'Reels' },
    { id: 'story', name: 'Stories' },
  ];

  const timeRanges = [
    { id: 'all', name: 'All Time' },
    { id: '1', name: 'Last Hour' },
    { id: '24', name: 'Last 24 Hours' },
    { id: '168', name: 'Last Week' },
  ];

  const trendingCreators = [
    { id: 1, username: 'travel_lover', avatar: 'https://randomuser.me/api/portraits/women/32.jpg', category: 'Travel', followers: '1.2M' },
    { id: 2, username: 'foodie_explorer', avatar: 'https://randomuser.me/api/portraits/men/22.jpg', category: 'Food', followers: '856K' },
    { id: 3, username: 'tech_guru', avatar: 'https://randomuser.me/api/portraits/men/65.jpg', category: 'Technology', followers: '2.1M' },
    { id: 4, username: 'fashion_icon', avatar: 'https://randomuser.me/api/portraits/women/45.jpg', category: 'Fashion', followers: '3.4M' },
  ];

  const trendingHashtags = [
    { id: 1, tag: '#summer2023', posts: '1.2M' },
    { id: 2, tag: '#travelgram', posts: '856K' },
    { id: 3, tag: '#foodie', posts: '2.1M' },
    { id: 4, tag: '#technews', posts: '1.5M' },
    { id: 5, tag: '#fitnessmotivation', posts: '1.8M' },
  ];

  const nearbyLocations = [
    { id: 1, name: 'Downtown', posts: '12.4K' },
    { id: 2, name: 'Central Park', posts: '8.7K' },
    { id: 3, name: 'Beachfront', posts: '6.2K' },
    { id: 4, name: 'University District', posts: '5.9K' },
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
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-indigo-600">Explore</h1>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <FiFilter className="text-gray-600" />
              </button>
              
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search explore..."
                  className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex space-x-6 mt-4 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab('forYou')}
              className={`pb-2 px-1 whitespace-nowrap ${activeTab === 'forYou' ? 'border-b-2 border-indigo-500 font-medium text-indigo-600' : 'text-gray-500'}`}
            >
              For You
            </button>
            <button
              onClick={() => setActiveTab('trending')}
              className={`pb-2 px-1 whitespace-nowrap ${activeTab === 'trending' ? 'border-b-2 border-indigo-500 font-medium text-indigo-600' : 'text-gray-500'}`}
            >
              Trending
            </button>
            <button
              onClick={() => setActiveTab('nearby')}
              className={`pb-2 px-1 whitespace-nowrap ${activeTab === 'nearby' ? 'border-b-2 border-indigo-500 font-medium text-indigo-600' : 'text-gray-500'}`}
            >
              Nearby
            </button>
            <button
              onClick={() => setActiveTab('reels')}
              className={`pb-2 px-1 whitespace-nowrap ${activeTab === 'reels' ? 'border-b-2 border-indigo-500 font-medium text-indigo-600' : 'text-gray-500'}`}
            >
              Reels
            </button>
            <button
              onClick={() => setActiveTab('shopping')}
              className={`pb-2 px-1 whitespace-nowrap ${activeTab === 'shopping' ? 'border-b-2 border-indigo-500 font-medium text-indigo-600' : 'text-gray-500'}`}
            >
              Shopping
            </button>
            <button
              onClick={() => setActiveTab('global')}
              className={`pb-2 px-1 whitespace-nowrap ${activeTab === 'global' ? 'border-b-2 border-indigo-500 font-medium text-indigo-600' : 'text-gray-500'}`}
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
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <div className="flex space-x-2">
                <button 
                  onClick={resetFilters}
                  className="px-3 py-1 text-sm text-indigo-600 hover:bg-indigo-50 rounded"
                >
                  Reset
                </button>
                <button 
                  onClick={() => setFiltersOpen(false)}
                  className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Apply
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={selectedFilters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Media Type</label>
                <select
                  value={selectedFilters.mediaType}
                  onChange={(e) => handleFilterChange('mediaType', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {mediaTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
                <select
                  value={selectedFilters.timeRange}
                  onChange={(e) => handleFilterChange('timeRange', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {timeRanges.map(range => (
                    <option key={range.id} value={range.id}>{range.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Trending Score</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedFilters.trendingScore}
                  onChange={(e) => handleFilterChange('trendingScore', parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-gray-500">{selectedFilters.trendingScore}/100</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Likes</label>
                <input
                  type="number"
                  min="0"
                  value={selectedFilters.likes}
                  onChange={(e) => handleFilterChange('likes', parseInt(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Shares</label>
                <input
                  type="number"
                  min="0"
                  value={selectedFilters.shares}
                  onChange={(e) => handleFilterChange('shares', parseInt(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="verifiedOnly"
                  checked={selectedFilters.verifiedOnly}
                  onChange={(e) => handleFilterChange('verifiedOnly', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="verifiedOnly" className="ml-2 block text-sm text-gray-700">
                  Verified Only
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="withMusic"
                  checked={selectedFilters.withMusic}
                  onChange={(e) => handleFilterChange('withMusic', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="withMusic" className="ml-2 block text-sm text-gray-700">
                  With Music
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="aiGenerated"
                  checked={selectedFilters.aiGenerated}
                  onChange={(e) => handleFilterChange('aiGenerated', e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="aiGenerated" className="ml-2 block text-sm text-gray-700">
                  AI Generated
                </label>
              </div>
            </div>
          </div>
        )}
        
        {/* View Mode Toggle */}
        <div className="flex justify-end mb-4">
          <div className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 text-sm font-medium rounded-l-lg ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              <FiGrid className="inline mr-1" /> Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 text-sm font-medium rounded-r-lg ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              <FiList className="inline mr-1" /> List
            </button>
          </div>
        </div>
        
        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {/* Trending Tags */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">Trending Tags</h2>
                <button className="text-sm text-indigo-600 hover:text-indigo-800">See all</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingHashtags.map(tag => (
                  <button
                    key={tag.id}
                    className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm hover:bg-indigo-100"
                  >
                    {tag.tag} <span className="text-indigo-400 text-xs">({tag.posts})</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Nearby Locations */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">Nearby Locations</h2>
                <button className="text-sm text-indigo-600 hover:text-indigo-800">See all</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {nearbyLocations.map(location => (
                  <button
                    key={location.id}
                    className="px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-sm hover:bg-gray-100 flex items-center"
                  >
                    <FiMapPin className="mr-1 text-indigo-500" /> {location.name} <span className="text-gray-400 text-xs ml-1">({location.posts})</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Trending Creators */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">Trending Creators</h2>
                <button className="text-sm text-indigo-600 hover:text-indigo-800">See all</button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {trendingCreators.map(creator => (
                  <div key={creator.id} className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 rounded-full overflow-hidden border-2 border-indigo-500">
                      <img src={creator.avatar} alt={creator.username} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="font-medium text-sm">@{creator.username}</h3>
                    <p className="text-xs text-gray-500">{creator.category}</p>
                    <p className="text-xs text-indigo-500">{creator.followers}</p>
                    <button className="mt-1 px-2 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Posts */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Recommended For You</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{filteredPosts.length} posts</span>
                  <button className="p-1 rounded hover:bg-gray-100">
                    <FiSliders className="text-gray-600" />
                  </button>
                </div>
              </div>
              
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredPosts.map(post => (
                    <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <div className="relative">
                        <img src={post.image} alt={post.caption} className="w-full h-48 object-cover" />
                        {post.verified && (
                          <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Verified
                          </span>
                        )}
                        {post.hasMusic && (
                          <span className="absolute top-2 right-2 bg-pink-500 text-white text-xs px-2 py-1 rounded-full">
                            <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" />
                            </svg>
                            Music
                          </span>
                        )}
                        {post.isAI && (
                          <span className="absolute bottom-2 left-2 bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                            <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                            </svg>
                            AI Generated
                          </span>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-center mb-2">
                          <img src={post.avatar} alt={post.username} className="w-8 h-8 rounded-full mr-2" />
                          <span className="font-medium">@{post.username}</span>
                        </div>
                        <p className="text-sm mb-3 line-clamp-2">{post.caption}</p>
                        <div className="flex justify-between text-xs text-gray-500 mb-3">
                          <span><FiMapPin className="inline mr-1" /> {post.location}</span>
                          <span><FiClock className="inline mr-1" /> {post.time}</span>
                        </div>
                        <div className="flex justify-between">
                          <button className="flex items-center text-gray-500 hover:text-red-500">
                            <FiHeart className="mr-1" /> {post.likes.toLocaleString()}
                          </button>
                          <button className="flex items-center text-gray-500 hover:text-blue-500">
                            <FiMessageSquare className="mr-1" /> {post.comments.toLocaleString()}
                          </button>
                          <button className="flex items-center text-gray-500 hover:text-green-500">
                            <FiShare2 className="mr-1" /> {post.shares.toLocaleString()}
                          </button>
                          <button className="flex items-center text-gray-500 hover:text-yellow-500">
                            <FiBookmark className="mr-1" /> Save
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPosts.map(post => (
                    <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex">
                      <div className="w-1/3 relative">
                        <img src={post.image} alt={post.caption} className="w-full h-full object-cover" />
                        {post.verified && (
                          <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="w-2/3 p-4">
                        <div className="flex items-center mb-2">
                          <img src={post.avatar} alt={post.username} className="w-8 h-8 rounded-full mr-2" />
                          <span className="font-medium">@{post.username}</span>
                        </div>
                        <p className="text-sm mb-3">{post.caption}</p>
                        <div className="flex justify-between text-xs text-gray-500 mb-3">
                          <span><FiMapPin className="inline mr-1" /> {post.location}</span>
                          <span><FiClock className="inline mr-1" /> {post.time}</span>
                        </div>
                        <div className="flex justify-between">
                          <button className="flex items-center text-gray-500 hover:text-red-500">
                            <FiHeart className="mr-1" /> {post.likes.toLocaleString()}
                          </button>
                          <button className="flex items-center text-gray-500 hover:text-blue-500">
                            <FiMessageSquare className="mr-1" /> {post.comments.toLocaleString()}
                          </button>
                          <button className="flex items-center text-gray-500 hover:text-green-500">
                            <FiShare2 className="mr-1" /> {post.shares.toLocaleString()}
                          </button>
                          <button className="flex items-center text-gray-500 hover:text-yellow-500">
                            <FiBookmark className="mr-1" /> Save
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Trending Now */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <h2 className="text-lg font-semibold mb-4">Trending Now</h2>
              <div className="space-y-4">
                {mockPosts
                  .sort((a, b) => b.trendingScore - a.trendingScore)
                  .slice(0, 3)
                  .map(post => (
                    <div key={post.id} className="flex items-start">
                      <div className="w-16 h-16 flex-shrink-0 mr-3 rounded-md overflow-hidden">
                        <img src={post.image} alt={post.caption} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-medium text-sm line-clamp-2">{post.caption}</h3>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <span>@{post.username}</span>
                          <span className="mx-1">•</span>
                          <span>{post.time}</span>
                        </div>
                        <div className="flex items-center text-xs mt-1">
                          <FiTrendingUp className="text-green-500 mr-1" />
                          <span className="text-green-500 font-medium">{post.trendingScore}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            
            {/* Friends Activity */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Friends Activity</h2>
                <button className="text-sm text-indigo-600 hover:text-indigo-800">See all</button>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center">
                    <div className="relative mr-3">
                      <img 
                        src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${30 + i}.jpg`} 
                        alt="Friend" 
                        className="w-10 h-10 rounded-full" 
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">Friend {i}</h3>
                      <p className="text-xs text-gray-500">Liked a post about {['travel', 'food', 'fashion'][i-1]}</p>
                    </div>
                    <span className="text-xs text-gray-400">10m ago</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Shopping Spotlight */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Shopping Spotlight</h2>
                <button className="text-sm text-indigo-600 hover:text-indigo-800">See all</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="group">
                    <div className="relative aspect-square mb-1 rounded-md overflow-hidden">
                      <img 
                        src={`https://source.unsplash.com/random/300x300/?product,${i}`} 
                        alt="Product" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                      <button className="absolute bottom-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-indigo-100">
                        <FiShoppingBag className="text-gray-700" size={14} />
                      </button>
                    </div>
                    <p className="text-xs font-medium line-clamp-1">Product {i}</p>
                    <p className="text-xs text-gray-500">${(20 + i * 5).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Global Trends */}
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Global Trends</h2>
                <button className="text-sm text-indigo-600 hover:text-indigo-800">See all</button>
              </div>
              <div className="space-y-3">
                {[
                  { country: 'USA', trend: '#SummerVibes', posts: '2.4M' },
                  { country: 'Japan', trend: '#Anime2023', posts: '1.8M' },
                  { country: 'Brazil', trend: '#Carnival', posts: '1.5M' },
                  { country: 'France', trend: '#ParisFashion', posts: '1.2M' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-8 h-8 flex-shrink-0 mr-3 rounded-full overflow-hidden">
                      <img 
                        src={`https://flagcdn.com/w40/${item.country === 'USA' ? 'us' : item.country === 'Japan' ? 'jp' : item.country === 'Brazil' ? 'br' : 'fr'}.png`} 
                        alt={item.country} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium">{item.trend}</h3>
                      <p className="text-xs text-gray-500">{item.country} • {item.posts} posts</p>
                    </div>
                    <FiTrendingUp className="text-green-500" />
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