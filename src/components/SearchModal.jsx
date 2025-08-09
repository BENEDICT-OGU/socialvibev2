import React, { useState } from 'react';
import { FiX, FiSearch } from 'react-icons/fi';

function SearchModal({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Search Messages</h3>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            <FiX size={24} />
          </button>
        </div>
        
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            <FiSearch className="absolute left-3 top-3 text-gray-500 dark:text-gray-400" />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {searchTerm ? (
            <div className="text-center text-gray-500 dark:text-gray-400">
              Search results for "{searchTerm}" would appear here
            </div>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400">
              Enter a search term to find messages
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchModal;