import { useState, useEffect } from 'react';
import { 
  FaMapMarkerAlt, 
  FaCalendarAlt, 
  FaUsers, 
  FaTicketAlt, 
  FaQrcode, 
  FaShare, 
  FaBell, 
  FaCommentAlt, 
  FaCamera, 
  FaGift,
  FaEllipsisH,
  FaHeart,
  FaRegHeart,
  FaChevronDown,
  FaChevronUp,
  FaFacebook,
  FaTwitter,
  FaWhatsapp,
  FaLinkedin,
  FaInstagram
} from 'react-icons/fa';
import { 
  MdOutlineOnlinePrediction,
  MdOutlineSecurity,
  MdOutlineEmojiPeople,
  MdOutlineSchedule,
  MdOutlineAttachMoney
} from 'react-icons/md';
import { BsThreeDotsVertical, BsEmojiSmile } from 'react-icons/bs';
import {Link } from "react-router-dom";
import It from "../assets/images/logo_white.png";

const ModernEventPage = () => {
  // State management
  const [rsvpStatus, setRsvpStatus] = useState(null);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [attendees, setAttendees] = useState(
    Array(12).fill(null).map((_, i) => ({
      id: i,
      name: `User ${i + 1}`,
      avatar: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'men' : 'women'}/${i + 10}.jpg`,
      isFriend: i < 4
    }))
  );

  // Mock event data
  const event = {
    title: "FULL stack graduation",
    host: {
      name: "ItSkillsCenter.",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      isVerified: true
    },
    date: "2025-07-05T12:00:00",
    location: "ogba, Lagos",
    isOnline: false,
    category: "Technology",
    description: "Join us for the biggest tech graduation of the year featuring industry leaders, cutting-edge workshops, and networking opportunities. This event will cover AI, blockchain, and the future of digital transformation in business.",
    shortDescription: "The biggest tech graduation of the year featuring industry leaders...",
    bannerImage: It,
    maxAttendees: 500,
    currentAttendees: 427,
    price: 99,
    isFree: false,
    tags: ["#Tech", "#Innovation", "#AI", "#Networking"],
    schedule: [
      { time: "12:00 AM", title: "opening" },
      { time: "1:00 AM", title: "introduction" },
      { time: "2:00 PM", title: "Presentation" },
      { time: "3:30 PM", title: "Closing Ceremony" }
    ],
    speakers: [
      { name: "Dr. Sarah Chen", role: "AI Researcher", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
      { name: "Mark Johnson", role: "Blockchain Expert", avatar: "https://randomuser.me/api/portraits/men/22.jpg" },
      { name: "Lisa Rodriguez", role: "Tech Entrepreneur", avatar: "https://randomuser.me/api/portraits/women/33.jpg" }
    ]
  };

  // Calculate days until event
  const daysUntilEvent = Math.floor(
    (new Date(event.date) - new Date()) / (1000 * 60 * 60 * 24)
  );

  // Handle RSVP
  const handleRsvp = (status) => {
    setRsvpStatus(status);
    // In a real app, you would send this to your backend
  };

  // Handle comment submission
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      setComments([...comments, {
        id: comments.length + 1,
        text: comment,
        author: "You",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
        timestamp: new Date().toLocaleTimeString()
      }]);
      setComment('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Event Banner */}
      <div className="relative h-64 w-full overflow-hidden rounded-b-lg">
        <img 
          src={event.bannerImage} 
          alt="Event banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-white">{event.title}</h1>
              <p className="text-white/90 flex items-center">
                <FaMapMarkerAlt className="mr-1" /> 
                {event.location}
              </p>
            </div>
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className="p-2 rounded-full bg-white/20 backdrop-blur-sm"
            >
              {isLiked ? (
                <FaHeart className="text-red-500 text-xl" />
              ) : (
                <FaRegHeart className="text-white text-xl" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {/* Host Info */}
        <div className="flex items-center mb-4">
          <img 
            src={event.host.avatar} 
            alt="Host" 
            className="w-12 h-12 rounded-full mr-3"
          />
          <div>
            <div className="flex items-center">
              <h3 className="font-medium">{event.host.name}</h3>
              {event.host.isVerified && (
                <span className="ml-1 text-blue-500">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 12l-2.44-2.78.34-3.68-3.61-.82-1.89-3.18L12 3 8.6 1.54 6.71 4.72l-3.61.81.34 3.68L1 12l2.44 2.78-.34 3.69 3.61.82 1.89 3.18L12 21l3.4 1.46 1.89-3.18 3.61-.82-.34-3.68L23 12zM10 17l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                  </svg>
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Host</p>
          </div>
        </div>

        {/* Event Stats */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-center">
            <div className="flex justify-center text-blue-500 mb-1">
              <FaCalendarAlt className="text-xl" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
            <p className="font-medium">
              {new Date(event.date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-center">
            <div className="flex justify-center text-green-500 mb-1">
              <FaUsers className="text-xl" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Attending</p>
            <p className="font-medium">
              {event.currentAttendees}/{event.maxAttendees}
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-center">
            <div className="flex justify-center text-purple-500 mb-1">
              {event.isOnline ? (
                <MdOutlineOnlinePrediction className="text-xl" />
              ) : (
                <FaMapMarkerAlt className="text-xl" />
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {event.isOnline ? 'Online' : 'Location'}
            </p>
            <p className="font-medium text-sm">
              {event.isOnline ? 'Virtual' : 'lagos'}
            </p>
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-center">
            <div className="flex justify-center text-yellow-500 mb-1">
              <FaTicketAlt className="text-xl" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Price</p>
            <p className="font-medium">
              {event.isFree ? 'Free' : `$${event.price}`}
            </p>
          </div>
        </div>

        {/* Countdown */}
        {daysUntilEvent > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 p-3 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <p className="font-medium">
                {daysUntilEvent === 1 
                  ? 'Tomorrow' 
                  : `${daysUntilEvent} days to go`}
              </p>
              <div className="flex items-center space-x-2">
                <FaBell className="text-blue-500" />
                <button className="text-sm font-medium text-blue-600 dark:text-blue-300">
                  Set Reminder
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Description */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">About This Event</h2>
          <div className="relative">
            <p className={`${showFullDescription ? '' : 'line-clamp-3'} mb-2`}>
              {showFullDescription ? event.description : event.shortDescription}
            </p>
            <button 
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-blue-500 text-sm font-medium flex items-center"
            >
              {showFullDescription ? (
                <>
                  Show less <FaChevronUp className="ml-1" />
                </>
              ) : (
                <>
                  Read more <FaChevronDown className="ml-1" />
                </>
              )}
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {event.tags.map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
          <nav className="flex space-x-4">
            {['details', 'schedule', 'speakers', 'attendees', 'discussion'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 font-medium text-sm border-b-2 ${activeTab === tab 
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mb-6">
          {activeTab === 'details' && (
            <div>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-bold mb-3 flex items-center">
                    <MdOutlineSchedule className="mr-2 text-blue-500" />
                    Date & Time
                  </h3>
                  <p className="mb-1">
                    {new Date(event.date).toLocaleString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Duration: 3 hours
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-bold mb-3 flex items-center">
                    <FaMapMarkerAlt className="mr-2 text-green-500" />
                    Location
                  </h3>
                  <p className="mb-2">{event.location}</p>
                  <Link to= "https://maps.app.goo.gl/8JTH5ci5qvqvLCkJ9">
                  <button className="text-blue-500 text-sm font-medium">
                    View on map
                  </button>
                  </Link>
                  
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-4">
                {/* <h3 className="font-bold mb-3 flex items-center">
                  <MdOutlineSecurity className="mr-2 text-purple-500" />
                  COVID-19 Safety Measures
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Masks required for all attendees</li>
                  <li>Sanitization stations throughout venue</li>
                  <li>Social distancing enforced</li>
                  <li>Proof of vaccination required</li>
                </ul> */}
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-bold mb-3 flex items-center">
                  <MdOutlineEmojiPeople className="mr-2 text-yellow-500" />
                  Dress Code
                </h3>
                <p>Business casual or tech industry attire</p>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="space-y-4">
              {event.schedule.map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="mr-4 text-center">
                    <div className="bg-blue-500 text-white rounded-lg py-1 px-3 w-20">
                      {item.time}
                    </div>
                  </div>
                  <div className="flex-1 border-l-2 border-blue-200 dark:border-blue-800 pl-4 pb-4">
                    <h4 className="font-medium">{item.title}</h4>
                    {index === 1 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Speaker: Mr. Banji
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'speakers' && (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {event.speakers.map((speaker, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
                  <img 
                    src={speaker.avatar} 
                    alt={speaker.name} 
                    className="w-16 h-16 rounded-full mx-auto mb-3"
                  />
                  <h4 className="font-medium">{speaker.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{speaker.role}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'attendees' && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">
                  {event.currentAttendees} people attending
                </h3>
                <button className="text-blue-500 text-sm font-medium">
                  See all
                </button>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {attendees.map((attendee) => (
                  <div key={attendee.id} className="text-center">
                    <img 
                      src={attendee.avatar} 
                      alt={attendee.name} 
                      className="w-12 h-12 rounded-full mx-auto mb-1"
                    />
                    <p className="text-xs truncate">{attendee.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'discussion' && (
            <div>
              <form onSubmit={handleCommentSubmit} className="mb-4">
                <div className="flex items-start">
                  <img 
                    src="https://randomuser.me/api/portraits/men/1.jpg" 
                    alt="You" 
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full bg-gray-100 dark:bg-gray-800 rounded-full py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button 
                      type="button"
                      className="absolute right-2 top-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <BsEmojiSmile />
                    </button>
                  </div>
                </div>
              </form>

              <div className="space-y-4">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex items-start">
                      <img 
                        src={comment.avatar} 
                        alt={comment.author} 
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div className="flex-1">
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <h4 className="font-medium">{comment.author}</h4>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {comment.timestamp}
                            </span>
                          </div>
                          <p className="mt-1">{comment.text}</p>
                        </div>
                        <div className="flex space-x-4 mt-1 ml-3 text-sm text-gray-500 dark:text-gray-400">
                          <button className="hover:text-blue-500">Like</button>
                          <button className="hover:text-blue-500">Reply</button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">
                    No comments yet. Be the first to comment!
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-900 py-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
              >
                <FaShare />
              </button>
              {showShareMenu && (
                <div className="absolute bottom-16 left-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2 flex space-x-2">
                  <button className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-500">
                    <FaFacebook />
                  </button>
                  <button className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-400">
                    <FaTwitter />
                  </button>
                  <button className="p-2 rounded-full bg-green-100 dark:bg-green-900/50 text-green-500">
                    <FaWhatsapp />
                  </button>
                  <button className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600">
                    <FaLinkedin />
                  </button>
                  <button className="p-2 rounded-full bg-pink-100 dark:bg-pink-900/50 text-pink-500">
                    <FaInstagram />
                  </button>
                </div>
              )}
              <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                <BsThreeDotsVertical />
              </button>
            </div>
            <div className="flex space-x-2">
              {rsvpStatus === 'going' ? (
                <button 
                  onClick={() => handleRsvp(null)}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-full font-medium"
                >
                  NO RSVP
                </button>
              ) : (
                <button 
                  onClick={() => handleRsvp('going')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-full font-medium"
                >
                  RSVP? 
                </button>
              )}
              {!event.isFree && (
                <button className="px-4 py-2 bg-green-500 text-white rounded-full font-medium flex items-center">
                  <MdOutlineAttachMoney className="mr-1" />
                  Buy Ticket
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernEventPage;