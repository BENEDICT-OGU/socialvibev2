import React from 'react';
import { motion } from 'framer-motion';

const StoriesRing = ({ children, hasStory, onClick, size = 4 }) => {
  return (
    <div className="relative">
      {hasStory && (
        <div className="absolute inset-0 p-1">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ 
              repeat: Infinity,
              repeatType: "reverse",
              duration: 1.5
            }}
            className="w-full h-full rounded-full bg-gradient-to-tr from-pink-500 to-yellow-500 p-0.5"
          >
            <div className="w-full h-full rounded-full bg-white dark:bg-gray-900"></div>
          </motion.div>
        </div>
      )}
      <div 
        className="relative"
        onClick={onClick}
        style={{ cursor: hasStory ? 'pointer' : 'default' }}
      >
        {children}
      </div>
    </div>
  );
};

export default StoriesRing;