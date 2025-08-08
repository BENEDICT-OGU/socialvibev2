import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api';
import {
  FaHeart, FaComment, FaUserPlus, FaShare, FaBell,
  FaTimes, FaCheck, FaEllipsisH, FaRegBell
} from 'react-icons/fa';
import { FiClock } from 'react-icons/fi';
import TimeAgo from 'react-timeago';
import NotificationSkeleton from '../components/NotificationSkeleton';

const notificationTypes = {
  like: { icon: <FaHeart className="text-red-500" />, color: 'bg-red-50' },
  comment: { icon: <FaComment className="text-blue-500" />, color: 'bg-blue-50' },
  follow: { icon: <FaUserPlus className="text-green-500" />, color: 'bg-green-50' },
  mention: { icon: <FaBell className="text-yellow-500" />, color: 'bg-yellow-50' },
  default: { icon: <FaRegBell className="text-gray-500" />, color: 'bg-gray-50' }
};

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    try {
      const params = { page };
      if (filter !== 'all') params.type = filter;
      
      const { data } = await axiosInstance.get('/notifications', { params });
      setNotifications(prev => [...prev, ...data.notifications]);
      setHasMore(data.notifications.length > 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [page, filter]);

  const handleMarkAsRead = async (id) => {
    try {
      await axiosInstance.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, read: true } : n
      ));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) handleMarkAsRead(notification._id);
    
    if (notification.sourceType === 'Post') {
      navigate(`/post/${notification.sourceId}`);
    } else if (notification.sourceType === 'User') {
      navigate(`/profile/${notification.source._id}`);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.type === filter;
  });

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <FaBell className="mr-2" /> Notifications
        </h1>
        <div className="flex space-x-2">
          <select 
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
              setNotifications([]);
            }}
            className="border rounded p-1 text-sm"
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="like">Likes</option>
            <option value="comment">Comments</option>
            <option value="follow">Follows</option>
          </select>
        </div>
      </div>

      {loading && page === 1 ? (
        <NotificationSkeleton count={5} />
      ) : error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : filteredNotifications.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No notifications found
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map(notification => (
            <div
              key={notification._id}
              className={`p-4 rounded-lg flex items-start cursor-pointer transition-all ${
                !notification.read 
                  ? 'bg-blue-50 border-l-4 border-blue-500' 
                  : 'bg-white border border-gray-200'
              } hover:shadow-md`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className={`p-3 rounded-full mr-3 ${
                notificationTypes[notification.type]?.color || 'bg-gray-100'
              }`}>
                {notificationTypes[notification.type]?.icon || notificationTypes.default.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="font-medium">{notification.message}</p>
                  {!notification.read && (
                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <FiClock className="mr-1" />
                  <TimeAgo date={notification.createdAt} />
                </div>
                {notification.metadata?.preview && (
                  <p className="text-sm text-gray-600 mt-1 truncate">
                    {notification.metadata.preview}
                  </p>
                )}
              </div>
              <div className="flex space-x-2 ml-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkAsRead(notification._id);
                  }}
                  className="text-gray-400 hover:text-green-500 p-1"
                  title={notification.read ? 'Mark as unread' : 'Mark as read'}
                >
                  <FaCheck />
                </button>
              </div>
            </div>
          ))}
          {hasMore && (
            <button
              onClick={() => setPage(p => p + 1)}
              className="w-full py-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}