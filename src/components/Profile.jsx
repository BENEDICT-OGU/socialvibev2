import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import {
  ProfileHeader,
  ProfileTabs,
  ProfilePosts,
  ProfileAbout,
  ProfileFriends,
  ProfilePhotos,
} from '../components/profile';
import { Loading, Error } from '../components/common';

function Profile() {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        let profileData;
        
        if (username) {
          profileData = await API.getUser(username);
          // Check if this is the current user's profile
          const currentUser = await API.getProfile();
          setIsCurrentUser(currentUser.username === username);
        } else {
          profileData = await API.getProfile();
          setIsCurrentUser(true);
        }
        
        setProfile(profileData);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const handleFollow = async () => {
    try {
      await API.followUser(profile._id);
      setProfile(prev => ({
        ...prev,
        followers: [...prev.followers, { _id: 'current-user-id' }], // Temporary until refetch
        followerCount: prev.followerCount + 1
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to follow user');
    }
  };

  const handleUnfollow = async () => {
    try {
      await API.unfollowUser(profile._id);
      setProfile(prev => ({
        ...prev,
        followers: prev.followers.filter(f => f._id !== 'current-user-id'),
        followerCount: prev.followerCount - 1
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to unfollow user');
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!profile) return <Error message="Profile not found" />;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <ProfileHeader 
        profile={profile}
        isCurrentUser={isCurrentUser}
        onFollow={handleFollow}
        onUnfollow={handleUnfollow}
      />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ProfileTabs 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isCurrentUser={isCurrentUser}
        />
        
        <div className="mt-6">
          {activeTab === 'posts' && <ProfilePosts profile={profile} />}
          {activeTab === 'about' && <ProfileAbout profile={profile} isCurrentUser={isCurrentUser} />}
          {activeTab === 'friends' && <ProfileFriends profile={profile} />}
          {activeTab === 'photos' && <ProfilePhotos profile={profile} />}
        </div>
      </div>
    </div>
  );
}

export default Profile;