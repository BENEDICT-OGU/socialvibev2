import React, { useState } from 'react';
import { FiHeart, FiMessageSquare, FiBookmark, FiMoreHorizontal } from 'react-icons/fi';
import { BsEmojiSmile, BsThreeDotsVertical } from 'react-icons/bs';

const PostCard = ({ post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      {/* Post Header */}
      <div className="flex items-center justify-between p-3 border-b dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img
              src={post.user.avatar}
              alt={post.user.username}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-semibold text-gray-800 dark:text-white">
            {post.user.username}
          </span>
        </div>
        <button 
          onClick={() => setShowOptions(!showOptions)}
          className="text-gray-500 dark:text-gray-400"
        >
          <BsThreeDotsVertical size={18} />
        </button>
      </div>

      {/* Post Image/Video */}
      <div className="relative">
        {post.type === 'image' ? (
          <img
            src={post.mediaUrl}
            alt={post.caption}
            className="w-full h-auto object-cover"
          />
        ) : (
          <video
            src={post.mediaUrl}
            controls
            className="w-full h-auto"
          />
        )}
      </div>

      {/* Post Actions */}
      <div className="p-3">
        <div className="flex justify-between items-center mb-2">
          <div className="flex space-x-4">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={`${isLiked ? 'text-red-500' : 'text-gray-800 dark:text-gray-200'}`}
            >
              <FiHeart size={24} fill={isLiked ? 'currentColor' : 'none'} />
            </button>
            <button className="text-gray-800 dark:text-gray-200">
              <FiMessageSquare size={24} />
            </button>
          </div>
          <button 
            onClick={() => setIsSaved(!isSaved)}
            className={`${isSaved ? 'text-yellow-500' : 'text-gray-800 dark:text-gray-200'}`}
          >
            <FiBookmark size={24} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Likes */}
        <div className="mb-1">
          <span className="font-semibold text-gray-800 dark:text-white">
            {post.likes + (isLiked ? 1 : 0)} likes
          </span>
        </div>

        {/* Caption */}
        <div className="mb-2">
          <span className="font-semibold text-gray-800 dark:text-white mr-2">
            {post.user.username}
          </span>
          <span className="text-gray-800 dark:text-gray-200">{post.caption}</span>
        </div>

        {/* Comments */}
        {post.comments.length > 0 && (
          <button className="text-gray-500 dark:text-gray-400 text-sm mb-2">
            View all {post.comments.length} comments
          </button>
        )}

        {/* Timestamp */}
        <p className="text-gray-500 dark:text-gray-400 text-xs uppercase">
          {post.timestamp}
        </p>
      </div>

      {/* Comment Input */}
      <div className="flex items-center p-3 border-t dark:border-gray-700">
        <BsEmojiSmile size={20} className="text-gray-500 dark:text-gray-400 mr-3" />
        <input
          type="text"
          placeholder="Add a comment..."
          className="flex-1 bg-transparent text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none"
        />
        <button className="text-pink-500 font-semibold text-sm ml-2">
          Post
        </button>
      </div>

      {/* Options Menu */}
      {showOptions && (
        <div className="absolute right-2 top-10 bg-white dark:bg-gray-800 shadow-lg rounded-md z-10 w-48">
          <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
            Report
          </button>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
            Copy Link
          </button>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
            Share to...
          </button>
          <button 
            onClick={() => setShowOptions(false)}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default PostCard;