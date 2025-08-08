import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api";
import { FaHeart, FaComment, FaShare, FaEllipsisH, FaUser } from "react-icons/fa";
import { toast } from "react-toastify";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosInstance.get('/posts');
        // Ensure each post has an author object with default values
        const postsWithDefaultAuthor = response.data.posts.map(post => ({
          ...post,
          author: post.author || {
            name: "Unknown User",
            avatar: null
          },
          likes: post.likes || [],
          comments: post.comments || []
        }));
        setPosts(postsWithDefaultAuthor);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load posts');
        toast.error('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      await axiosInstance.post(`/posts/${postId}/like`);
      setPosts(posts.map(post => 
        post._id === postId 
          ? { 
              ...post, 
              likes: [...(post.likes || []), "user-id"], 
              isLiked: true 
            } 
          : post
      ));
    } catch (err) {
      toast.error('Failed to like post');
    }
  };

 if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Recent Posts</h1>
      
      {posts.length === 0 ? (
        <div className="text-center py-8">
          <p>No posts yet. Be the first to post!</p>
          <Link 
            to="/createPost" 
            className="mt-4 inline-block bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
          >
            Create Post
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map(post => (
            <div key={post._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {post.author?.avatar ? (
                    <img 
                      src={post.author.avatar} 
                      alt={post.author.name}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <FaUser className="text-gray-500" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold">{post.author?.name || "Unknown User"}</h3>
                    <p className="text-xs text-gray-500">
                      {post.createdAt ? new Date(post.createdAt).toLocaleString() : "Unknown date"}
                    </p>
                  </div>
                </div>
                <button className="text-gray-500 hover:text-gray-700">
                  <FaEllipsisH />
                </button>
              </div>

              <p className="mb-4">{post.content}</p>

              {post.media && (
                <div className="mb-4">
                  {post.type === 'image' ? (
                    <img 
                      src={post.media} 
                      alt="Post media" 
                      className="w-full rounded-lg"
                    />
                  ) : post.type === 'video' ? (
                    <video controls className="w-full rounded-lg">
                      <source src={post.media} type="video/mp4" />
                    </video>
                  ) : null}
                </div>
              )}

              <div className="flex justify-between text-gray-500 text-sm mb-3">
                <span>{(post.likes || []).length} likes</span>
                <span>{(post.comments || []).length} comments</span>
              </div>

              <div className="border-t border-b border-gray-200 dark:border-gray-700 py-2 flex justify-around">
                <button 
                  onClick={() => handleLike(post._id)} 
                  className={`flex items-center space-x-1 ${post.isLiked ? 'text-pink-600' : ''}`}
                >
                  <FaHeart /> <span>Like</span>
                </button>
                <button className="flex items-center space-x-1">
                  <FaComment /> <span>Comment</span>
                </button>
                <button className="flex items-center space-x-1">
                  <FaShare /> <span>Share</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}