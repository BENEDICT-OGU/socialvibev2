import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api';
import {
  FiUser, FiMail, FiCalendar, FiUsers,
  FiMessageSquare, FiHeart, FiBookmark,
  FiMapPin, FiLink, FiMoreHorizontal,
  FiCheck, FiPlus, FiGrid, FiList,
  FiVideo, FiImage, FiMusic, FiAward,
  FiLock, FiGlobe, FiUserPlus, FiShare2, FiZoomIn, FiX
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const PublicProfile = () => {
  const { username } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [viewMode, setViewMode] = useState('grid');
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [showFullScreenAvatar, setShowFullScreenAvatar] = useState(false);
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [followType, setFollowType] = useState('followers');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const navigate = useNavigate();
  const shareMenuRef = useRef(null);

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
        setShowShareMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/profile/${username}`);
        
        if (!response.data.success) {
          throw new Error(response.data.error || 'Failed to load profile');
        }

        setProfileData(response.data.data);
        setError(null);
      } catch (err) {
        console.error('Profile fetch error:', err);
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  useEffect(() => {
    if (profileData && activeTab === 'posts') {
      fetchPosts();
    }
  }, [profileData, activeTab]);

  const fetchPosts = async () => {
    try {
      setPostsLoading(true);
      const response = await axiosInstance.get(`/profile/${username}/posts`);
      setPosts(response.data.posts);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setPostsLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!profileData) return;
    
    try {
      const endpoint = profileData.isFollowing 
        ? `/profile/unfollow/${profileData.user._id}`
        : `/profile/follow/${profileData.user._id}`;
      
      await axiosInstance.post(endpoint);
      
      setProfileData(prev => ({
        ...prev,
        isFollowing: !prev.isFollowing,
        stats: {
          ...prev.stats,
          followers: prev.isFollowing 
            ? prev.stats.followers - 1 
            : prev.stats.followers + 1
        }
      }));
    } catch (err) {
      setError(err.response?.data?.error || 'Action failed');
    }
  };

  const openFollowModal = (type) => {
    setFollowType(type);
    setShowFollowModal(true);
  };

  const renderTabContent = () => {
    if (!profileData) return null;

    switch (activeTab) {
      case 'about':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="p-6 space-y-6"
          >
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-4 dark:text-white flex items-center gap-2">
                <FiUser /> About
              </h3>
              
              {profileData.user.bio && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Bio</h4>
                  <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
                    {profileData.user.bio}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {profileData.user.location && (
                  <div className="flex items-start gap-3">
                    <FiMapPin className="text-gray-500 dark:text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</h4>
                      <p className="text-gray-800 dark:text-gray-200">
                        {profileData.user.location}
                      </p>
                    </div>
                  </div>
                )}

                {profileData.user.website && (
                  <div className="flex items-start gap-3">
                    <FiLink className="text-gray-500 dark:text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Website</h4>
                      <a 
                        href={profileData.user.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline break-all"
                      >
                        {profileData.user.website.replace(/(^\w+:|^)\/\//, '')}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <FiCalendar className="text-gray-500 dark:text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Joined</h4>
                    <p className="text-gray-800 dark:text-gray-200">
                      {new Date(profileData.user.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <FiGlobe className="text-gray-500 dark:text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Privacy</h4>
                    <p className="text-gray-800 dark:text-gray-200">
                      {profileData.user.isPrivate ? 'Private Account' : 'Public Account'}
                    </p>
                  </div>
                </div>
              </div>

              {profileData.user.skills?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Skills & Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {profileData.user.skills.map(skill => (
                      <motion.span
                        key={skill}
                        whileHover={{ scale: 1.05 }}
                        className="bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-4 dark:text-white flex items-center gap-2">
                <FiAward /> Highlights
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-gray-600 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-pink-500">{profileData.stats.posts}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">Posts</div>
                </div>
                <div className="bg-white dark:bg-gray-600 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-pink-500">{profileData.stats.followers}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">Followers</div>
                </div>
                <div className="bg-white dark:bg-gray-600 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-pink-500">{profileData.stats.following}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">Following</div>
                </div>
                <div className="bg-white dark:bg-gray-600 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-pink-500">{profileData.stats.likes}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">Likes</div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'media':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            <div className="mb-6">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg dark:text-white flex items-center gap-2">
                  <FiImage /> Media
                </h3>
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
                  >
                    <FiGrid />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow' : ''}`}
                  >
                    <FiList />
                  </button>
                </div>
              </div>
            </div>

            {postsLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <Skeleton key={i} height={180} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {posts
                  .filter(post => post.media?.length > 0)
                  .flatMap(post => post.media)
                  .slice(0, 12)
                  .map((media, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      className="relative aspect-square bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden"
                    >
                      <img 
                        src={media.url} 
                        alt="" 
                        className="w-full h-full object-cover"
                      />
                      {media.type === 'video' && (
                        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded">
                          <FiVideo size={14} />
                        </div>
                      )}
                    </motion.div>
                  ))
                }
              </div>
            )}
          </motion.div>
        );

      case 'posts':
      default:
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            {postsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} height={150} />
                ))}
              </div>
            ) : posts.length > 0 ? (
              <div className="space-y-6">
                {posts.map(post => (
                  <motion.div
                    key={post._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white dark:bg-gray-700 rounded-xl shadow p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={profileData.user.avatar} 
                          alt={profileData.user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-medium dark:text-white">{profileData.user.name}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(post.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <button className="text-gray-500 dark:text-gray-400">
                        <FiMoreHorizontal />
                      </button>
                    </div>
                    
                    <p className="mb-4 dark:text-gray-200">{post.content}</p>
                    
                    {post.media?.length > 0 && (
                      <div className="mb-4 rounded-lg overflow-hidden">
                        {post.media[0].type === 'image' ? (
                          <img 
                            src={post.media[0].url} 
                            alt="" 
                            className="w-full max-h-96 object-contain rounded-lg"
                          />
                        ) : (
                          <div className="relative pt-[56.25%] bg-black rounded-lg">
                            <video
                              src={post.media[0].url}
                              controls
                              className="absolute inset-0 w-full h-full"
                            />
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="flex justify-between text-gray-500 dark:text-gray-400">
                      <button className="flex items-center gap-1 hover:text-pink-500">
                        <FiHeart /> {post.likes}
                      </button>
                      <button className="flex items-center gap-1 hover:text-blue-500">
                        <FiMessageSquare /> {post.comments}
                      </button>
                      <button className="flex items-center gap-1 hover:text-green-500">
                        <FiShare2 /> Share
                      </button>
                      <button className="flex items-center gap-1 hover:text-yellow-500">
                        <FiBookmark /> Save
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <FiMessageSquare className="mx-auto text-4xl mb-4" />
                <p>No posts yet</p>
              </div>
            )}
          </motion.div>
        );
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <Skeleton height={192} className="rounded-t-lg" />
        <div className="px-6 pb-6 relative">
          <div className="flex -mt-16">
            <Skeleton circle width={128} height={128} />
            <div className="ml-6 mt-4 flex-1">
              <Skeleton width={200} height={30} />
              <Skeleton width={150} height={20} className="mt-2" />
              <div className="flex mt-6 space-x-6">
                <Skeleton width={80} height={20} />
                <Skeleton width={80} height={20} />
                <Skeleton width={80} height={20} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="text-center py-8 text-red-500">
          {error}
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="text-center py-8">
          User not found
        </div>
      </div>
    );
  }

  const { user, stats, isFollowing } = profileData;

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      {/* Cover Photo */}
      <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-600 relative overflow-hidden">
        {user.coverPhoto ? (
          <img 
            src={user.coverPhoto} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-purple-400 to-pink-500" />
        )}
      </div>

      {/* Profile Header */}
      <div className="px-6 pb-6 relative">
        <div className="flex flex-col md:flex-row md:items-end -mt-16">
          {/* Avatar */}
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="relative group cursor-pointer"
            onClick={() => setShowFullScreenAvatar(true)}
          >
            <img
              src={user.avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
              alt={user.name}
              className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-avatar.png';
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-full transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <FiZoomIn size={24} className="text-white" />
            </div>
          </motion.div>

          {/* User Info */}
          <div className="md:ml-6 mt-4 md:mt-0 flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold dark:text-white">{user.name}</h1>
                <p className="text-gray-600 dark:text-gray-300">@{user.username}</p>
              </div>
              
              <div className="flex space-x-2">
                <div className="relative" ref={shareMenuRef}>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <FiShare2 className="text-gray-500 dark:text-gray-400" />
                  </motion.button>
                  
                  <AnimatePresence>
                    {showShareMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg py-1 z-20"
                      >
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2">
                          Copy Link
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2">
                          Share to Story
                        </button>
                        <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2">
                          Send in Message
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/messages/${user._id}`)}
                  className="px-4 py-2 rounded-full font-medium flex items-center bg-blue-500 text-white"
                >
                  <FiMessageSquare className="mr-1" />
                  Message
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleFollow}
                  className={`px-4 py-2 rounded-full font-medium flex items-center ${
                    isFollowing
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      : 'bg-pink-500 text-white'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <FiCheck className="mr-1" />
                      Following
                    </>
                  ) : (
                    <>
                      <FiUserPlus className="mr-1" />
                      Follow
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {user.bio && (
              <p className="mt-3 text-gray-700 dark:text-gray-300">{user.bio}</p>
            )}

            {/* Stats */}
            <div className="flex mt-4 space-x-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => openFollowModal('posts')}
                className="text-center"
              >
                <div className="text-lg font-bold dark:text-white">{stats.posts}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Posts</div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => openFollowModal('followers')}
                className="text-center"
              >
                <div className="text-lg font-bold dark:text-white">{stats.followers}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Followers</div>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => openFollowModal('following')}
                className="text-center"
              >
                <div className="text-lg font-bold dark:text-white">{stats.following}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Following</div>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        <div className="flex overflow-x-auto">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('posts')}
            className={`px-6 py-3 font-medium flex items-center whitespace-nowrap ${
              activeTab === 'posts' 
                ? 'border-b-2 border-pink-500 text-pink-500 dark:text-pink-400' 
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <FiMessageSquare className="mr-2" />
            Posts
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('media')}
            className={`px-6 py-3 font-medium flex items-center whitespace-nowrap ${
              activeTab === 'media' 
                ? 'border-b-2 border-pink-500 text-pink-500 dark:text-pink-400' 
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <FiImage className="mr-2" />
            Media
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('about')}
            className={`px-6 py-3 font-medium flex items-center whitespace-nowrap ${
              activeTab === 'about' 
                ? 'border-b-2 border-pink-500 text-pink-500 dark:text-pink-400' 
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <FiUser className="mr-2" />
            About
          </motion.button>
        </div>
      </div>

      {/* Content */}
      {renderTabContent()}

      {/* Full Screen Avatar Modal */}
      <AnimatePresence>
        {showFullScreenAvatar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setShowFullScreenAvatar(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="relative max-w-md w-full"
            >
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-full h-auto rounded-lg"
                onClick={(e) => e.stopPropagation()}
              />
              <button 
                className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full"
                onClick={() => setShowFullScreenAvatar(false)}
              >
                <FiX size={24} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Followers/Following Modal */}
      <AnimatePresence>
        {showFollowModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setShowFollowModal(false)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold dark:text-white">
                    {followType === 'followers' ? 'Followers' : 
                     followType === 'following' ? 'Following' : 'Posts'}
                  </h3>
                  <button 
                    onClick={() => setShowFollowModal(false)}
                    className="text-gray-500 dark:text-gray-400"
                  >
                    <FiX size={24} />
                  </button>
                </div>
              </div>
              
              <div className="overflow-y-auto max-h-[70vh]">
                {followType === 'followers' && (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div key={i} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img 
                            src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${i + 10}.jpg`}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <h4 className="font-medium dark:text-white">Follower {i + 1}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">@follower{i + 1}</p>
                          </div>
                        </div>
                        <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                          Follow
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {followType === 'following' && (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div key={i} className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img 
                            src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${i + 20}.jpg`}
                            alt=""
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <h4 className="font-medium dark:text-white">Following {i + 1}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">@following{i + 1}</p>
                          </div>
                        </div>
                        <button className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                          Following
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PublicProfile;