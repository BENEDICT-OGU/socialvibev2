import React from 'react';

function TypingIndicator() {
  return (
    <div className="flex items-center">
      <span className="text-xs text-gray-500 dark:text-gray-400">typing</span>
      <div className="flex ml-1 space-x-1">
        <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
        <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
}

export default TypingIndicator;