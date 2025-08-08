import React, { useState, useEffect } from 'react';
import API from '../api';
import Post from './Post';
import Loading from './common/Loading';

export default function ActivityFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        setLoading(true);
        const data = await API.getActivityFeed();
        setPosts(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load activity feed');
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  const handleLike = async (postId) => {
    try {
      await API.likePost(postId);
      setPosts(posts.map(post => 
        post._id === postId 
          ? { ...post, isLiked: true, likesCount: post.likesCount + 1 }
          : post
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to like post');
    }
  };

  const handleUnlike = async (postId) => {
    try {
      await API.unlikePost(postId);
      setPosts(posts.map(post => 
        post._id === postId 
          ? { ...post, isLiked: false, likesCount: post.likesCount - 1 }
          : post
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to unlike post');
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      {posts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No activity yet. Follow more people to see their posts!
        </div>
      ) : (
        posts.map(post => (
          <Post 
            key={post._id}
            post={post}
            onLike={handleLike}
            onUnlike={handleUnlike}
          />
        ))
      )}
    </div>
  );
}