import React, { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";

function ChatItem({ 
  message, 
  currentUserId, 
  onDelete, 
  onEdit, 
  onReact, 
  onCopy,
  onReply,
  onForward,
  setReplyingTo,
  replyingTo
}) {
  const isCurrentUser = message.sender === currentUserId;
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMessageActions, setShowMessageActions] = useState(false);
  const [hoveredMessage, setHoveredMessage] = useState(false);
  const editInputRef = useRef(null);
  const messageRef = useRef(null);
  const actionsRef = useRef(null);

  const messageType = message.type || "text";

  // Status indicators
  const statusIcons = {
    sent: '✓',
    delivered: '✓✓',
    read: '✓✓✓',
    error: '✗'
  };

  // Close actions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (actionsRef.current && !actionsRef.current.contains(event.target) && 
          !messageRef.current.contains(event.target)) {
        setShowMessageActions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDeleteClick = () => {
    if (onDelete) onDelete(message.id);
    setShowMessageActions(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setEditContent(message.content);
    setShowMessageActions(false);
    setTimeout(() => editInputRef.current?.focus(), 0);
  };

  const handleReplyClick = () => {
    if (onReply) onReply(message);
    setShowMessageActions(false);
    setReplyingTo(message);
  };

  const handleForwardClick = () => {
    if (onForward) onForward(message);
    setShowMessageActions(false);
  };

  const handleEditSave = () => {
    if (onEdit && editContent.trim() !== "") {
      onEdit(message.id, editContent.trim());
      setIsEditing(false);
    }
  };

  const handleEditCancel = () => {
    setIsEditing(false);
    setEditContent(message.content);
  };

  const handleCopyClick = () => {
    if (onCopy) onCopy(message.content);
    setShowMessageActions(false);
  };

  const handleReactClick = (emoji) => {
    if (onReact) onReact(message.id, emoji);
    setShowEmojiPicker(false);
  };

  const toggleMessageActions = (e) => {
    e.stopPropagation();
    setShowMessageActions(!showMessageActions);
  };

  const quickEmojis = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

  return (
    <div 
      className={`flex mb-4 ${isCurrentUser ? "justify-end" : "justify-start"}`}
      onMouseEnter={() => setHoveredMessage(true)}
      onMouseLeave={() => setHoveredMessage(false)}
    >
      {/* Reply indicator */}
      {replyingTo?.id === message.id && (
        <div className={`absolute ${isCurrentUser ? 'right-0' : 'left-0'} -top-6 text-xs text-gray-500 dark:text-gray-400`}>
          Replying to this message
        </div>
      )}

      <div
        ref={messageRef}
        onClick={toggleMessageActions}
        className={`relative rounded-xl p-4 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg break-words shadow-lg transition-all duration-200 cursor-pointer
          ${isCurrentUser 
            ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white" 
            : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
          }
          ${hoveredMessage ? "scale-102" : "scale-100"}
        `}
      >
        {/* Message Status Indicator */}
        {isCurrentUser && (
          <span className="absolute -bottom-4 right-0 text-xs text-gray-500 dark:text-gray-400">
            {statusIcons[message.status || 'sent']}
          </span>
        )}

        {/* Edited Indicator */}
        {message.edited && (
          <span className={`absolute -bottom-4 ${isCurrentUser ? 'left-0' : 'right-0'} text-xs text-gray-500 dark:text-gray-400`}>
            (edited)
          </span>
        )}

        {/* Message Reactions */}
        {message.reactions?.length > 0 && (
          <div className={`absolute -top-2 ${isCurrentUser ? 'right-2' : 'left-2'} flex space-x-1 bg-white dark:bg-gray-800 rounded-full px-2 py-0.5 shadow`}>
            {message.reactions.map((reaction, i) => (
              <span key={i} className="text-xs">{reaction}</span>
            ))}
          </div>
        )}

        {isEditing ? (
          <div className="flex flex-col">
            <input
              ref={editInputRef}
              type="text"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-2 rounded border bg-white dark:bg-gray-600 border-gray-300 dark:border-gray-500 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Edit your message..."
            />
            <div className="mt-2 flex space-x-2">
              <button
                onClick={handleEditSave}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
              >
                Save
              </button>
              <button
                onClick={handleEditCancel}
                className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded transition"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            {messageType === "text" && <p className="text-sm">{message.content}</p>}
            {messageType === "image" && (
              <img
                src={message.content}
                alt="Sent image"
                className="max-w-full rounded-lg shadow-md"
              />
            )}
            {messageType === "video" && (
              <video controls className="max-w-full rounded-lg shadow-md">
                <source src={message.content} type="video/mp4" />
                we are sorry but this feature is not yet available
              </video>
            )}
            {messageType === "voice" && (
              <audio controls className="w-full mt-2">
                <source src={message.content} type="audio/mpeg" />
                we are sorry but this feature is not yet available
              </audio>
            )}

            {hoveredMessage && (
              <div className={`absolute -top-5 left-0 right-0 flex justify-center ${
                isCurrentUser ? 'justify-end' : 'justify-start'
              }`}>
                <div className="flex space-x-1 p-1 bg-white dark:bg-gray-800 rounded-lg shadow-md transition-opacity duration-200">
                  {quickEmojis.map((emoji, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReactClick(emoji);
                      }}
                      className="text-sm hover:scale-125 transform transition-transform duration-100"
                      aria-label={`React with ${emoji}`}
                    >
                      {emoji}
                    </button>
                  ))}
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowEmojiPicker(!showEmojiPicker);
                    }}
                    className="text-sm hover:scale-125 transform transition-transform duration-100"
                    aria-label="More emojis"
                  >
                    😊
                  </button>
                </div>
              </div>
            )}

            {showEmojiPicker && (
              <div 
                className="absolute z-10 -top-40"
                onClick={(e) => e.stopPropagation()}
              >
                <EmojiPicker 
                  onEmojiClick={(emojiData) => handleReactClick(emojiData.emoji)}
                  theme={document.documentElement.classList.contains('dark') ? 'dark' : 'light'}
                  width={300}
                  height={350}
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Message Actions Menu */}
      {showMessageActions && (
        <div 
          ref={actionsRef}
          className={`absolute z-50 w-40 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${
            isCurrentUser ? 'right-0' : 'left-0'
          }`}
          style={{ top: messageRef.current?.getBoundingClientRect().top + 30 }}
        >
          <button
            onClick={handleCopyClick}
            className="block w-full text-left px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Copy
          </button>
          {isCurrentUser && (
            <button
              onClick={handleEditClick}
              className="block w-full text-left px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Edit
            </button>
          )}
          <button
            onClick={handleReplyClick}
            className="block w-full text-left px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Reply
          </button>
          <button
            onClick={handleForwardClick}
            className="block w-full text-left px-4 py-2 text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Forward
          </button>
          <div className="border-t border-gray-200 dark:border-gray-700"></div>
          {isCurrentUser && (
            <button
              onClick={handleDeleteClick}
              className="block w-full text-left px-4 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ChatItem;
