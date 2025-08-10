import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaMusic, FaSmile, FaAt, FaHashtag, FaPollH,
  FaQuestionCircle, FaFont, FaImage, FaVideo,
  FaTimes, FaCheck, FaChevronDown, FaChevronUp,
  FaGlobe, FaUserFriends, FaLock, FaMagic,
  FaRobot, FaPalette, FaTextHeight, FaAlignLeft,
  FaAlignCenter, FaAlignRight, FaBold, FaItalic,
  FaUnderline, FaLink, FaListUl, FaQuoteRight,
  FaCode, FaMicrophone, FaCamera, FaCropAlt,
  FaFilter, FaDrawPolygon, FaVolumeUp, FaAdjust,
  FaMapMarkerAlt, FaRegClock, FaEyeSlash
} from "react-icons/fa";
import axiosInstance from "../api";
import { useAuth } from "../AuthContext";
import ReactMarkdown from "react-markdown";
import gfm from "remark-gfm";
import { SketchPicker } from 'react-color';
import 'react-markdown-editor-lite/lib/index.css';
import { Picker } from 'emoji-mart';
import 'emoji-mart/css/emoji-mart.css';

export default function CreatePost() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  // Post content states
  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null); // 'image', 'video', or null
  const [isRecording, setIsRecording] = useState(false);
  
  // Post options
  const [privacy, setPrivacy] = useState("public");
  const [allowComments, setAllowComments] = useState(true);
  const [allowDuets, setAllowDuets] = useState(true);
  const [allowStitch, setAllowStitch] = useState(true);
  const [isPrivate, setIsPrivate] = useState(false);
  
  // Advanced options
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [watermark, setWatermark] = useState(true);
  const [scheduled, setScheduled] = useState(false);
  const [scheduleTime, setScheduleTime] = useState("");
  const [location, setLocation] = useState("");
  
  // UI states
  const [activeTab, setActiveTab] = useState("upload"); // 'upload' or 'record'
  const [showPrivacyOptions, setShowPrivacyOptions] = useState(false);
  const [showTagging, setShowTagging] = useState(false);
  const [hashtags, setHashtags] = useState("");
  const [mentions, setMentions] = useState("");
  const [showEffects, setShowEffects] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showTextTools, setShowTextTools] = useState(false);
  const [showSoundPicker, setShowSoundPicker] = useState(false);
  
  // Refs
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const mediaContainerRef = useRef(null);
  
  // Handle media upload
  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const fileType = file.type.split("/")[0];
    if (fileType !== "image" && fileType !== "video") {
      toast.error("Please upload an image or video file");
      return;
    }
    
    setMediaType(fileType);
    setMedia(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setMediaPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };
  
  // Remove media
  const removeMedia = () => {
    setMedia(null);
    setMediaPreview(null);
    setMediaType(null);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!media) {
      toast.error("Please upload or record a video first");
      return;
    }
    
    const formData = new FormData();
    formData.append("media", media);
    formData.append("caption", caption);
    formData.append("privacy", privacy);
    formData.append("allowComments", allowComments);
    formData.append("allowDuets", allowDuets);
    formData.append("allowStitch", allowStitch);
    formData.append("isPrivate", isPrivate);
    formData.append("watermark", watermark);
    
    if (hashtags) formData.append("hashtags", hashtags);
    if (mentions) formData.append("mentions", mentions);
    if (location) formData.append("location", location);
    if (scheduled && scheduleTime) {
      formData.append("scheduledAt", new Date(scheduleTime).toISOString());
    }
    
    try {
      const response = await axiosInstance.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });
      
      toast.success("Post created successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error(error.response?.data?.message || "Failed to create post");
    }
  };
  
  // TikTok-style layout with mobile responsiveness
  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b border-gray-800">
        <button 
          onClick={() => navigate(-1)}
          className="text-white"
        >
          <FaTimes size={24} />
        </button>
        <h1 className="text-xl font-bold">New Post</h1>
        <button 
          type="submit" 
          form="post-form"
          className="text-pink-500 font-semibold"
        >
          Post
        </button>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <form id="post-form" onSubmit={handleSubmit} className="h-full">
          {/* Media Preview Area */}
          <div 
            ref={mediaContainerRef}
            className="relative w-full bg-gray-900 flex items-center justify-center"
            style={{ height: "60vh" }}
          >
            {mediaPreview ? (
              <>
                {mediaType === "image" ? (
                  <img 
                    src={mediaPreview} 
                    alt="Preview" 
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <video
                    ref={videoRef}
                    src={mediaPreview}
                    controls
                    className="max-h-full max-w-full"
                  />
                )}
                <button
                  type="button"
                  onClick={removeMedia}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 p-2 rounded-full"
                >
                  <FaTimes size={20} />
                </button>
              </>
            ) : (
              <div className="text-center p-4">
                <p className="text-gray-400 mb-4">No media selected</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="bg-pink-600 px-4 py-2 rounded-full font-medium"
                >
                  Upload Video
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*,video/*"
                  onChange={handleMediaChange}
                  className="hidden"
                />
              </div>
            )}
          </div>
          
          {/* Tabs for Upload/Record */}
          <div className="flex border-b border-gray-800">
            <button
              type="button"
              className={`flex-1 py-3 text-center font-medium ${
                activeTab === "upload" 
                  ? "text-pink-500 border-b-2 border-pink-500" 
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab("upload")}
            >
              Upload
            </button>
            <button
              type="button"
              className={`flex-1 py-3 text-center font-medium ${
                activeTab === "record" 
                  ? "text-pink-500 border-b-2 border-pink-500" 
                  : "text-gray-400"
              }`}
              onClick={() => setActiveTab("record")}
            >
              Record
            </button>
          </div>
          
          {/* Caption Section */}
          <div className="p-4 border-b border-gray-800">
            <textarea
              placeholder="Write a caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full bg-transparent border-none outline-none resize-none placeholder-gray-500"
              rows={3}
              maxLength={150}
            />
            <div className="flex justify-between items-center mt-2">
              <div className="flex space-x-3">
                <button type="button" onClick={() => setShowTagging(!showTagging)}>
                  <FaAt className="text-gray-400" />
                </button>
                <button type="button">
                  <FaHashtag className="text-gray-400" />
                </button>
                <button type="button">
                  <FaSmile className="text-gray-400" />
                </button>
              </div>
              <span className="text-gray-400 text-sm">
                {caption.length}/150
              </span>
            </div>
            
            {/* Tagging Panel */}
            {showTagging && (
              <div className="mt-3 p-3 bg-gray-900 rounded-lg">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Hashtags</label>
                    <input
                      type="text"
                      placeholder="#trending #viral"
                      value={hashtags}
                      onChange={(e) => setHashtags(e.target.value)}
                      className="w-full p-2 bg-gray-800 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Mentions</label>
                    <input
                      type="text"
                      placeholder="@username"
                      value={mentions}
                      onChange={(e) => setMentions(e.target.value)}
                      className="w-full p-2 bg-gray-800 rounded text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Effects and Filters */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium">Effects</h3>
              <button 
                type="button"
                onClick={() => setShowEffects(!showEffects)}
                className="text-gray-400"
              >
                {showEffects ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>
            
            {showEffects && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {[1, 2, 3, 4, 5].map((effect) => (
                  <button
                    key={effect}
                    type="button"
                    className="flex-shrink-0 w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center"
                  >
                    <span className="text-xs">Effect {effect}</span>
                  </button>
                ))}
              </div>
            )}
            
            <div className="flex justify-between items-center mt-4 mb-3">
              <h3 className="font-medium">Filters</h3>
              <button 
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="text-gray-400"
              >
                {showFilters ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>
            
            {showFilters && (
              <div className="flex space-x-3 overflow-x-auto pb-2">
                {["Original", "Warm", "Cool", "B&W", "Vintage"].map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    className="flex-shrink-0 w-16 h-16 bg-gray-800 rounded-lg flex flex-col items-center justify-center"
                  >
                    <div className="w-12 h-12 bg-gray-700 mb-1"></div>
                    <span className="text-xs">{filter}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Sound Selection */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Sound</h3>
                <p className="text-sm text-gray-400">Original sound</p>
              </div>
              <button 
                type="button"
                onClick={() => setShowSoundPicker(!showSoundPicker)}
                className="text-pink-500 text-sm"
              >
                Change
              </button>
            </div>
            
            {showSoundPicker && (
              <div className="mt-3 p-3 bg-gray-900 rounded-lg">
                <div className="flex items-center mb-3">
                  <input
                    type="text"
                    placeholder="Search for sounds"
                    className="flex-1 p-2 bg-gray-800 rounded text-sm"
                  />
                  <button 
                    type="button"
                    className="ml-2 p-2 bg-pink-600 rounded"
                  >
                    Search
                  </button>
                </div>
                <div className="space-y-2">
                  {["Trending Sound", "Popular Song", "Nature Sounds"].map((sound) => (
                    <button
                      key={sound}
                      type="button"
                      className="w-full p-2 bg-gray-800 rounded text-left text-sm"
                    >
                      {sound}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Advanced Options */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Advanced Settings</h3>
              <button 
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-gray-400"
              >
                {showAdvanced ? <FaChevronUp /> : <FaChevronDown />}
              </button>
            </div>
            
            {showAdvanced && (
              <div className="mt-3 space-y-4">
                {/* Privacy Options */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Who can view this video?</h4>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setPrivacy("public")}
                      className={`w-full p-3 rounded-lg flex items-center justify-between ${
                        privacy === "public" ? "bg-pink-900 bg-opacity-50" : "bg-gray-800"
                      }`}
                    >
                      <div className="flex items-center">
                        <FaGlobe className="mr-2" />
                        <span>Public</span>
                      </div>
                      {privacy === "public" && <FaCheck />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrivacy("friends")}
                      className={`w-full p-3 rounded-lg flex items-center justify-between ${
                        privacy === "friends" ? "bg-pink-900 bg-opacity-50" : "bg-gray-800"
                      }`}
                    >
                      <div className="flex items-center">
                        <FaUserFriends className="mr-2" />
                        <span>Friends</span>
                      </div>
                      {privacy === "friends" && <FaCheck />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPrivacy("private")}
                      className={`w-full p-3 rounded-lg flex items-center justify-between ${
                        privacy === "private" ? "bg-pink-900 bg-opacity-50" : "bg-gray-800"
                      }`}
                    >
                      <div className="flex items-center">
                        <FaLock className="mr-2" />
                        <span>Private</span>
                      </div>
                      {privacy === "private" && <FaCheck />}
                    </button>
                  </div>
                </div>
                
                {/* Interaction Options */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Interaction Settings</h4>
                  <div className="space-y-3">
                    <label className="flex items-center justify-between">
                      <span>Allow comments</span>
                      <input
                        type="checkbox"
                        checked={allowComments}
                        onChange={(e) => setAllowComments(e.target.checked)}
                        className="h-5 w-5 text-pink-600 rounded"
                      />
                    </label>
                    <label className="flex items-center justify-between">
                      <span>Allow duets</span>
                      <input
                        type="checkbox"
                        checked={allowDuets}
                        onChange={(e) => setAllowDuets(e.target.checked)}
                        className="h-5 w-5 text-pink-600 rounded"
                      />
                    </label>
                    <label className="flex items-center justify-between">
                      <span>Allow stitch</span>
                      <input
                        type="checkbox"
                        checked={allowStitch}
                        onChange={(e) => setAllowStitch(e.target.checked)}
                        className="h-5 w-5 text-pink-600 rounded"
                      />
                    </label>
                  </div>
                </div>
                
                {/* Schedule Post */}
                <div>
                  <label className="flex items-center justify-between mb-2">
                    <span>Schedule this post</span>
                    <input
                      type="checkbox"
                      checked={scheduled}
                      onChange={(e) => setScheduled(e.target.checked)}
                      className="h-5 w-5 text-pink-600 rounded"
                    />
                  </label>
                  {scheduled && (
                    <input
                      type="datetime-local"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full p-2 bg-gray-800 rounded text-sm"
                    />
                  )}
                </div>
                
                {/* Location */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Add Location</h4>
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Add location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="flex-1 p-2 bg-gray-800 rounded-l text-sm"
                    />
                    <button
                      type="button"
                      className="px-3 bg-gray-700 rounded-r"
                    >
                      <FaMapMarkerAlt />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
      </main>
      
      {/* Bottom Navigation */}
      <nav className="flex justify-around items-center p-3 bg-black border-t border-gray-800">
        <button type="button" className="p-2">
          <FaFont size={20} />
        </button>
        <button type="button" className="p-2">
          <FaImage size={20} />
        </button>
        <button type="button" className="p-2">
          <FaVideo size={20} />
        </button>
        <button type="button" className="p-2">
          <FaPollH size={20} />
        </button>
        <button type="button" className="p-2">
          <FaQuestionCircle size={20} />
        </button>
      </nav>
    </div>
  );
}