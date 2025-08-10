import React from "react";
import { FiPlus } from "react-icons/fi";

const Stories = ({ stories, onAddHighlight }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800 dark:text-white">Highlights</h3>
        <label className="flex items-center text-pink-500 text-sm cursor-pointer">
          <FiPlus size={16} className="mr-1" />
          Add Highlight
          <input
            type="file"
            accept="image/*,video/*"
            onChange={onAddHighlight}
            className="hidden"
          />
        </label>
      </div>
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {stories.length > 0 ? (
          stories.map((story) => (
            <div key={story._id} className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-500 p-0.5">
                <div className="bg-white dark:bg-gray-800 rounded-full p-0.5">
                  <img
                    src={story.thumbnail}
                    alt={story.caption}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
              <p className="text-xs mt-1 text-gray-600 dark:text-gray-400 truncate w-16 text-center">
                {story.caption}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Add highlights to showcase your moments
          </p>
        )}
      </div>
    </div>
  );
};

export default Stories;
