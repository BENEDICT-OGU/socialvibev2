import React, { useState, useEffect } from 'react';
import API from '../api';

export default function Chat() {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const data = await API.getConversations();
        setConversations(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load conversations');
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    if (!activeConversation) return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const data = await API.getMessages(activeConversation._id);
        setMessages(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load messages');
        setLoading(false);
      }
    };

    fetchMessages();
  }, [activeConversation]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const message = await API.sendMessage(activeConversation._id, newMessage);
      setMessages([...messages, message]);
      setNewMessage('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* Conversation list */}
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Messages</h2>
        </div>
        
        {loading && conversations.length === 0 ? (
          <div className="p-4 text-center">Loading...</div>
        ) : error ? (
          <div className="p-4 text-red-500">{error}</div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {conversations.map(conversation => (
              <div 
                key={conversation._id}
                onClick={() => setActiveConversation(conversation)}
                className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                  activeConversation?._id === conversation._id ? 'bg-gray-100 dark:bg-gray-600' : ''
                }`}
              >
                <div className="flex items-center">
                  <img 
                    src={conversation.participant.avatar || '/default-avatar.png'}
                    alt={conversation.participant.name}
                    className="h-10 w-10 rounded-full mr-3"
                  />
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {conversation.participant.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {conversation.lastMessage?.text || 'No messages yet'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
              <img 
                src={activeConversation.participant.avatar || '/default-avatar.png'}
                alt={activeConversation.participant.name}
                className="h-8 w-8 rounded-full mr-3"
              />
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                {activeConversation.participant.name}
              </h3>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map(message => (
                  <div 
                    key={message._id}
                    className={`mb-4 flex ${
                      message.sender._id === 'current-user-id' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div 
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender._id === 'current-user-id'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      <p>{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender._id === 'current-user-id'
                          ? 'text-blue-100'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p className="text-lg">Select a conversation</p>
              <p className="text-sm mt-2">Or start a new one by messaging a friend</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}