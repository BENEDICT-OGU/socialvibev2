import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api';
import {
  FiUser, FiMail, FiCalendar, FiUsers,
  FiMessageSquare, FiHeart, FiBookmark,
  FiMapPin, FiLink, FiMoreHorizontal,
  FiCheck, FiPlus, FiGrid, FiList
} from 'react-icons/fi';
// import PostList from './PostList';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const PublicProfile = () => {
  const { username } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);

  const navigate = useNavigate();

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

  const renderTabContent = () => {
    if (!profileData) return null;
    // const navigate = useNavigate();

    switch (activeTab) {
      case 'about':
        return (
          <div className="p-6 space-y-4">
            {profileData.user.bio && (
              <div>
                <h3 className="font-semibold dark:text-white">Bio</h3>
                <p className="text-gray-700 dark:text-gray-300">{profileData.user.bio}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profileData.user.location && (
                <div className="flex items-center">
                  <FiMapPin className="mr-2 text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300">
                    {profileData.user.location}
                  </span>
                </div>
              )}

              {profileData.user.website && (
                <div className="flex items-center">
                  <FiLink className="mr-2 text-gray-500 dark:text-gray-400" />
                  <a 
                    href={profileData.user.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {profileData.user.website.replace(/(^\w+:|^)\/\//, '')}
                  </a>
                </div>
              )}

              <div className="flex items-center">
                <FiCalendar className="mr-2 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">
                  Joined {new Date(profileData.user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long'
                  })}
                </span>
              </div>
            </div>

            {profileData.user.skills?.length > 0 && (
              <div>
                <h3 className="font-semibold dark:text-white">Skills</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profileData.user.skills.map(skill => (
                    <span 
                      key={skill} 
                      className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'photos':
        return (
          <div className="p-6">
            {postsLoading ? (
              <div className="grid grid-cols-3 gap-2">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} height={200} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {posts
                  .filter(post => post.media?.length > 0)
                  .flatMap(post => post.media)
                  .slice(0, 9)
                  .map((media, i) => (
                    <div key={i} className="aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
                      <img 
                        src={media.url} 
                        alt="" 
                        className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                      />
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        );

      case 'posts':
      default:
        return (
          <div className="p-6">
            <div className="flex justify-end mb-4">
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

            {postsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} height={150} />
                ))}
              </div>
            ) : posts.length > 0 ? (
              <PostList 
                posts={posts} 
                viewMode={viewMode}
                onPostUpdate={fetchPosts}
              />
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <FiMessageSquare className="mx-auto text-4xl mb-4" />
                <p>No posts yet</p>
              </div>
            )}
          </div>
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
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* Cover Photo */}
      <div className="h-48 bg-gradient-to-r from-blue-500 to-purple-600 relative rounded-t-lg overflow-hidden">
        {user.coverPhoto ? (
          <img 
            src={user.coverPhoto} 
            alt="Cover" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500" />
        )}
      </div>

      {/* Profile Header */}
      <div className="px-6 pb-6 relative">
        <div className="flex flex-col md:flex-row md:items-end -mt-16">
          {/* Avatar */}
          <div className="relative group">
            <img
              src={user.avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
              alt={user.name}
              className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-avatar.png';
              }}
            />
          </div>

          {/* User Info */}
          <div className="md:ml-6 mt-4 md:mt-0 flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold dark:text-white">{user.name}</h1>
                <p className="text-gray-600 dark:text-gray-300">@{user.username}</p>
              </div>
              
              <div className="flex space-x-2">
                <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                  <FiMoreHorizontal className="text-gray-500 dark:text-gray-400" />
                </button>
                <button
                  onClick={handleFollow}
                  className={`px-4 py-2 rounded-full font-medium flex items-center space-x-1 ${
                    isFollowing
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <FiCheck size={16} />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <FiPlus size={16} />
                      <span>Follow</span>
                    </>
                  )}
                </button>
                <button
  onClick={() => navigate(`/messages/${user._id}`)}
  className="px-4 py-2 rounded-full font-medium flex items-center bg-pink-500 text-white ml-2"
>
  <FiMail className="mr-1" />
  Message
</button>
              </div>
            </div>

            {user.bio && (
              <p className="mt-3 text-gray-700 dark:text-gray-300">{user.bio}</p>
            )}

            {/* Stats */}
            <div className="flex mt-4 space-x-6">
              <Link 
                to={`/profile/${username}/followers`} 
                className="flex items-center hover:underline"
              >
                <span className="font-medium dark:text-white">{stats.followers}</span>
                <span className="ml-1 text-gray-500 dark:text-gray-400">Followers</span>
              </Link>
              <Link 
                to={`/profile/${username}/following`} 
                className="flex items-center hover:underline"
              >
                <span className="font-medium dark:text-white">{stats.following}</span>
                <span className="ml-1 text-gray-500 dark:text-gray-400">Following</span>
              </Link>
              <div className="flex items-center">
                <span className="font-medium dark:text-white">{stats.posts}</span>
                <span className="ml-1 text-gray-500 dark:text-gray-400">Posts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        <div className="flex">
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-6 py-3 font-medium flex items-center ${activeTab === 'posts' ? 'border-b-2 border-blue-500 text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
          >
            <FiMessageSquare className="mr-2" />
            Posts
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-6 py-3 font-medium flex items-center ${activeTab === 'about' ? 'border-b-2 border-blue-500 text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
          >
            <FiUser className="mr-2" />
            About
          </button>
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-6 py-3 font-medium flex items-center ${activeTab === 'photos' ? 'border-b-2 border-blue-500 text-blue-500 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
          >
            <FiGrid className="mr-2" />
            Photos
          </button>
        </div>
      </div>

      {/* Content */}
      {renderTabContent()}
    </div>
  );
};

export default PublicProfile;