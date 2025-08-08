import React, { useState, useEffect } from "react";
import axiosInstance from "../api";
import {
  FiUser, FiMail, FiPhone, FiEdit2, FiX, FiCheck, FiLock,
  FiTwitter, FiLinkedin, FiGithub, FiCamera, FiPlus, FiTrash2,
  FiKey, FiShare2, FiInfo, FiAward, FiMapPin, FiCalendar,
  FiHeart, FiLink, FiMusic, FiMic, FiGrid, FiList, FiClock,
  FiUsers, FiEye, FiEyeOff, FiSettings, FiDownload, FiStar,
  FiMessageSquare, FiZap, FiLayers, FiSmile, FiVideo, FiImage
} from "react-icons/fi";
import {BiPalette} from "react-icons/bi";
import { FaGenderless, FaTransgender, FaMars, FaVenus, FaNeuter } from "react-icons/fa";
// import { QRCode } from "qrcode.react";
import { QRCode } from 'react-qr-code';
import ColorPicker from "react-color";
import { SketchPicker } from "react-color";
import { TwitterPicker } from "react-color";
import { ChromePicker } from "react-color";
import { CompactPicker } from "react-color";
import { CirclePicker } from "react-color";
import { HuePicker } from "react-color";
import { SliderPicker } from "react-color";
import { SwatchesPicker } from "react-color";
import { BlockPicker } from "react-color";

function Profile() {
  // State management
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [activeContentTab, setActiveContentTab] = useState("posts");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [formData, setFormData] = useState({
    name: "",
    displayName: "",
    username: "",
    email: "",
    phone: "",
    avatar: "",
    banner: "",
    bio: "",
    pronouns: "",
    gender: "",
    relationshipStatus: "",
    location: "",
    birthday: "",
    showBirthday: true,
    website: "",
    links: [],
    callToAction: "",
    mood: "",
    currentActivity: "",
    quote: "",
    favoriteColor: "#3B82F6",
    hobbies: [],
    social: {
      twitter: "",
      linkedin: "",
      github: "",
      instagram: "",
      tiktok: "",
      youtube: ""
    },
    theme: "light",
    font: "default",
    featuredEmoji: "",
    verificationStatus: "unverified",
    backgroundMusic: "",
    layout: "grid",
    isPrivate: false
  });
  const [newLink, setNewLink] = useState({ title: "", url: "" });
  const [newHobby, setNewHobby] = useState("");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [uploading, setUploading] = useState({ type: null, progress: 0 });
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [pinnedPosts, setPinnedPosts] = useState([]);
  const [storyHighlights, setStoryHighlights] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [activePrivacySetting, setActivePrivacySetting] = useState("public");

  // Fetch profile data
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const [profileRes, pinnedRes, highlightsRes, analyticsRes] = await Promise.all([
          axiosInstance.get("/profile/me"),
          axiosInstance.get("/posts/pinned"),
          axiosInstance.get("/stories/highlights"),
          axiosInstance.get("/analytics/profile")
        ]);

        const userData = profileRes.data.data || profileRes.data;
        setUser(userData);
        setFormData({
          ...userData,
          links: userData.links || [],
          hobbies: userData.hobbies || []
        });
        setPinnedPosts(pinnedRes.data);
        setStoryHighlights(highlightsRes.data);
        setAnalytics(analyticsRes.data);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Toggle boolean fields
  const handleToggle = (field) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field] }));
  };

  // Handle file uploads
  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
      setError('Only JPEG, PNG, or GIF images are allowed');
      return;
    }

    if (file.size > maxSize) {
      setError('Image size must be less than 5MB');
      return;
    }

    const uploadData = new FormData();
    uploadData.append(type, file);
    setUploading({ type, progress: 0 });
    setError(null);

    try {
      const endpoint = type === "avatar" ? "/profile/me/avatar" : "/profile/me/banner";
      const response = await axiosInstance.post(endpoint, uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploading({ type, progress: percentCompleted });
        }
      });

      const url = response.data.data?.url || response.data.url;
      if (!url) throw new Error("No URL in response");

      setUser(prev => ({ ...prev, [type]: url }));
      setFormData(prev => ({ ...prev, [type]: url }));
      setSuccess(`${type === "avatar" ? "Profile" : "Banner"} image updated`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading({ type: null, progress: 0 });
    }
  };

  // Add/remove links
  const addLink = () => {
    if (newLink.title && newLink.url) {
      setFormData(prev => ({
        ...prev,
        links: [...prev.links, newLink]
      }));
      setNewLink({ title: "", url: "" });
    }
  };

  const removeLink = (index) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  // Add/remove hobbies
  const addHobby = () => {
    if (newHobby.trim() && !formData.hobbies.includes(newHobby.trim())) {
      setFormData(prev => ({
        ...prev,
        hobbies: [...prev.hobbies, newHobby.trim()]
      }));
      setNewHobby("");
    }
  };

  const removeHobby = (hobby) => {
    setFormData(prev => ({
      ...prev,
      hobbies: prev.hobbies.filter(h => h !== hobby)
    }));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.put("/profile/me", formData);
      setUser(response.data.data || response.data);
      setEditMode(false);
      setSuccess("Profile updated successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // Password change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.put("/profile/me/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setSuccess("Password changed");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Password change failed");
    } finally {
      setLoading(false);
    }
  };

  // Toggle privacy setting
  const togglePrivacy = async (setting) => {
    try {
      await axiosInstance.put("/profile/me/privacy", { setting });
      setActivePrivacySetting(setting);
      setSuccess(`Profile set to ${setting}`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Privacy update failed");
    }
  };

  // Get full URL for assets
  const getAssetUrl = (url) => {
    if (!url) return "/default-avatar.png";
    if (url.startsWith("http")) return url;
    return `${import.meta.env.VITE_API_BASE_URL || ''}${url}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${formData.theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Banner */}
      <div className="relative h-64 w-full bg-gradient-to-r from-blue-500 to-purple-600">
        {user?.banner && (
          <img 
            src={getAssetUrl(user.banner)} 
            alt="Banner" 
            className="h-full w-full object-cover"
          />
        )}
        
        {editMode && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <label className="cursor-pointer bg-white bg-opacity-90 text-gray-800 px-4 py-2 rounded-md flex items-center gap-2">
              <FiCamera className="h-4 w-4" />
              {uploading.type === "banner" ? `Uploading... ${uploading.progress}%` : "Change Banner"}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "banner")}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>

      {/* Profile Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row gap-6 -mt-16 relative z-10">
          {/* Profile Picture */}
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-700 shadow-lg relative">
            {user?.avatar ? (
              <>
                <img
                  src={getAssetUrl(user.avatar)}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
                {editMode && (
                  <label className="absolute bottom-0 right-0 bg-pink-500 text-white p-2 rounded-full cursor-pointer">
                    <FiCamera className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "avatar")}
                      className="hidden"
                    />
                  </label>
                )}
              </>
            ) : (
              <div className="w-full h-full rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                <FiUser className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">
                  {user?.name}
                  {user?.verificationStatus === "verified" && (
                    <span className="ml-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                      Verified
                    </span>
                  )}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-gray-600 dark:text-gray-300">@{user?.username}</p>
                  {user?.pronouns && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      ({user.pronouns})
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                {editMode ? (
                  <button
                    onClick={() => setEditMode(false)}
                    className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-100 px-4 py-2 rounded-md flex items-center gap-2"
                  >
                    <FiX className="h-4 w-4" />
                    Cancel
                  </button>
                ) : (
                  <button
                    onClick={() => setEditMode(true)}
                    className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md flex items-center gap-2"
                  >
                    <FiEdit2 className="h-4 w-4" />
                    Edit Profile
                  </button>
                )}

                <button 
                  onClick={() => setShowQR(!showQR)}
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 px-4 py-2 rounded-md flex items-center gap-2"
                >
                  <FiShare2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </div>

            {/* QR Code Modal */}
            {showQR && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
                  <h3 className="text-lg font-bold mb-4">Share Profile</h3>
                  <div className="flex flex-col items-center">
                    <QRCode 
                      value={`${window.location.origin}/profile/${user?.username}`}
                      size={200}
                      level="H"
                    />
                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                      Scan to visit my profile
                    </p>
                  </div>
                  <button
                    onClick={() => setShowQR(false)}
                    className="mt-4 w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-md"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* Bio */}
            <div className="mt-4">
              {editMode ? (
                <>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    rows={3}
                    maxLength={300}
                    placeholder="Tell the world about yourself..."
                  />
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formData.bio.length}/300 characters
                    </span>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, bio: "" }))}
                      className="text-xs text-pink-500 hover:text-pink-600"
                    >
                      Clear
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {user?.bio || "No bio yet"}
                </p>
              )}
            </div>

            {/* Quick Stats */}
            <div className="flex gap-4 mt-4 text-sm">
              <div className="flex items-center gap-1">
                <FiMapPin className="h-4 w-4" />
                <span>{user?.location || "Earth"}</span>
              </div>
              {user?.website && (
                <a 
                  href={user.website.startsWith('http') ? user.website : `https://${user.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-pink-500 hover:underline"
                >
                  <FiLink className="h-4 w-4" />
                  <span>{user.website.replace(/(^\w+:|^)\/\//, '')}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-8 flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="w-full lg:w-1/4 space-y-6">
            {/* About Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FiInfo className="h-5 w-5" />
                About
              </h3>
              
              {editMode ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                      placeholder="Optional nickname"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Pronouns
                    </label>
                    <input
                      type="text"
                      name="pronouns"
                      value={formData.pronouns}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                      placeholder="e.g. she/her, they/them"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Gender Identity
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    >
                      <option value="">Prefer not to say</option>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="non-binary">Non-binary</option>
                      <option value="transgender">Transgender</option>
                      <option value="genderqueer">Genderqueer</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Relationship Status
                    </label>
                    <select
                      name="relationshipStatus"
                      value={formData.relationshipStatus}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    >
                      <option value="">Not specified</option>
                      <option value="single">Single</option>
                      <option value="in-a-relationship">In a relationship</option>
                      <option value="engaged">Engaged</option>
                      <option value="married">Married</option>
                      <option value="complicated">It's complicated</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                      placeholder="Where are you based?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Birthday
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        name="birthday"
                        value={formData.birthday}
                        onChange={handleChange}
                        className="flex-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label className="flex items-center gap-1 text-sm">
                        <input
                          type="checkbox"
                          checked={formData.showBirthday}
                          onChange={() => handleToggle("showBirthday")}
                          className="rounded"
                        />
                        Show publicly
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Favorite Color
                    </label>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded-full border cursor-pointer"
                        style={{ backgroundColor: formData.favoriteColor }}
                        onClick={() => setShowColorPicker(!showColorPicker)}
                      />
                      {showColorPicker && (
                        <div className="absolute z-10">
                          <TwitterPicker
                            color={formData.favoriteColor}
                            onChangeComplete={(color) => {
                              setFormData(prev => ({ ...prev, favoriteColor: color.hex }));
                              setShowColorPicker(false);
                            }}
                          />
                        </div>
                      )}
                      <span className="text-sm">{formData.favoriteColor}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {user?.displayName && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Display Name</p>
                      <p className="font-medium">{user.displayName}</p>
                    </div>
                  )}

                  {user?.pronouns && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Pronouns</p>
                      <p className="font-medium">{user.pronouns}</p>
                    </div>
                  )}

                  {user?.gender && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Gender</p>
                      <div className="flex items-center gap-1">
                        {user.gender === "female" && <FaVenus className="text-pink-500" />}
                        {user.gender === "male" && <FaMars className="text-blue-500" />}
                        {user.gender === "non-binary" && <FaGenderless className="text-purple-500" />}
                        {user.gender === "transgender" && <FaTransgender className="text-teal-500" />}
                        <span className="font-medium capitalize">{user.gender}</span>
                      </div>
                    </div>
                  )}

                  {user?.relationshipStatus && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Relationship</p>
                      <p className="font-medium capitalize">{user.relationshipStatus.replace(/-/g, ' ')}</p>
                    </div>
                  )}

                  {user?.location && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                      <p className="font-medium">{user.location}</p>
                    </div>
                  )}

                  {user?.birthday && user?.showBirthday && (
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Birthday</p>
                      <p className="font-medium">
                        {new Date(user.birthday).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Favorite Color</p>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: user?.favoriteColor }}
                      />
                      <span className="font-medium">{user?.favoriteColor}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Links Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FiLink className="h-5 w-5" />
                Links
              </h3>
              
              {editMode ? (
                <div className="space-y-4">
                  {formData.links.map((link, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={link.title}
                        onChange={(e) => {
                          const newLinks = [...formData.links];
                          newLinks[index].title = e.target.value;
                          setFormData(prev => ({ ...prev, links: newLinks }));
                        }}
                        className="flex-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                        placeholder="Link title"
                      />
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => {
                          const newLinks = [...formData.links];
                          newLinks[index].url = e.target.value;
                          setFormData(prev => ({ ...prev, links: newLinks }));
                        }}
                        className="flex-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                        placeholder="https://example.com"
                      />
                      <button
                        type="button"
                        onClick={() => removeLink(index)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newLink.title}
                      onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                      className="flex-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                      placeholder="Link title"
                    />
                    <input
                      type="url"
                      value={newLink.url}
                      onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                      className="flex-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                      placeholder="https://example.com"
                    />
                    <button
                      type="button"
                      onClick={addLink}
                      className="bg-pink-500 hover:bg-pink-600 text-white p-2 rounded-md"
                    >
                      <FiPlus className="h-5 w-5" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Call to Action
                    </label>
                    <input
                      type="text"
                      name="callToAction"
                      value={formData.callToAction}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                      placeholder="e.g. 'Hire me', 'Support my work'"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {user?.links?.length > 0 ? (
                    user.links.map((link, index) => (
                      <a
                        key={index}
                        href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        <p className="font-medium">{link.title}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{link.url}</p>
                      </a>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No links added yet</p>
                  )}

                  {user?.callToAction && (
                    <button className="w-full mt-4 bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-md font-medium">
                      {user.callToAction}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Hobbies & Interests */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FiAward className="h-5 w-5" />
                Hobbies & Interests
              </h3>
              
              {editMode ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newHobby}
                      onChange={(e) => setNewHobby(e.target.value)}
                      className="flex-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                      placeholder="Add a hobby or interest"
                    />
                    <button
                      type="button"
                      onClick={addHobby}
                      className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.hobbies.map((hobby, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full"
                      >
                        {hobby}
                        <button
                          type="button"
                          onClick={() => removeHobby(hobby)}
                          className="ml-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                        >
                          <FiTrash2 className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {user?.hobbies?.length > 0 ? (
                    user.hobbies.map((hobby, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {hobby}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400">No hobbies added yet</p>
                  )}
                </div>
              )}
            </div>

            {/* Social Media */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FiShare2 className="h-5 w-5" />
                Social Media
              </h3>
              
              {editMode ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                      <FiTwitter className="h-4 w-4" />
                      Twitter
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
                        twitter.com/
                      </span>
                      <input
                        type="text"
                        name="social.twitter"
                        value={formData.social.twitter}
                        onChange={handleChange}
                        className="flex-1 p-2 border rounded-r-md dark:bg-gray-700 dark:border-gray-600"
                        placeholder="username"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                      <FiLinkedin className="h-4 w-4" />
                      LinkedIn
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
                        linkedin.com/in/
                      </span>
                      <input
                        type="text"
                        name="social.linkedin"
                        value={formData.social.linkedin}
                        onChange={handleChange}
                        className="flex-1 p-2 border rounded-r-md dark:bg-gray-700 dark:border-gray-600"
                        placeholder="username"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                      <FiGithub className="h-4 w-4" />
                      GitHub
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600">
                        github.com/
                      </span>
                      <input
                        type="text"
                        name="social.github"
                        value={formData.social.github}
                        onChange={handleChange}
                        className="flex-1 p-2 border rounded-r-md dark:bg-gray-700 dark:border-gray-600"
                        placeholder="username"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {user?.social?.twitter && (
                    <a
                      href={`https://twitter.com/${user.social.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-500 hover:underline"
                    >
                      <FiTwitter className="h-5 w-5" />
                      <span>@{user.social.twitter}</span>
                    </a>
                  )}
                  {user?.social?.linkedin && (
                    <a
                      href={`https://linkedin.com/in/${user.social.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      <FiLinkedin className="h-5 w-5" />
                      <span>{user.social.linkedin}</span>
                    </a>
                  )}
                  {user?.social?.github && (
                    <a
                      href={`https://github.com/${user.social.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:underline"
                    >
                      <FiGithub className="h-5 w-5" />
                      <span>{user.social.github}</span>
                    </a>
                  )}
                  {(!user?.social?.twitter && !user?.social?.linkedin && !user?.social?.github) && (
                    <p className="text-gray-500 dark:text-gray-400">No social links added</p>
                  )}
                </div>
              )}
            </div>

            {/* Theme Settings */}
            {editMode && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BiPalette className="h-5 w-5" />
                  Theme Settings
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Profile Theme
                    </label>
                    <select
                      name="theme"
                      value={formData.theme}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Featured Emoji
                    </label>
                    <input
                      type="text"
                      name="featuredEmoji"
                      value={formData.featuredEmoji}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                      placeholder="Pick an emoji that represents you"
                      maxLength={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Current Mood
                    </label>
                    <input
                      type="text"
                      name="mood"
                      value={formData.mood}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                      placeholder="How are you feeling?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Current Activity
                    </label>
                    <input
                      type="text"
                      name="currentActivity"
                      value={formData.currentActivity}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                      placeholder="What are you up to?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Quote of the Day
                    </label>
                    <textarea
                      name="quote"
                      value={formData.quote}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                      rows={2}
                      placeholder="Share an inspiring quote"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Main Content Area */}
          <div className="w-full lg:w-3/4 space-y-6">
            {/* Quick Stats Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold">1,243</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">587</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Following</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">42</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Posts</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Highlights</p>
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveContentTab("posts")}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center justify-center gap-2 ${
                      activeContentTab === "posts"
                        ? "border-pink-500 text-pink-600 dark:text-pink-400"
                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    <FiGrid className="h-4 w-4" />
                    Posts
                  </button>
                  <button
                    onClick={() => setActiveContentTab("reels")}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center justify-center gap-2 ${
                      activeContentTab === "reels"
                        ? "border-pink-500 text-pink-600 dark:text-pink-400"
                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    <FiVideo className="h-4 w-4" />
                    Reels
                  </button>
                  <button
                    onClick={() => setActiveContentTab("highlights")}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center justify-center gap-2 ${
                      activeContentTab === "highlights"
                        ? "border-pink-500 text-pink-600 dark:text-pink-400"
                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    <FiStar className="h-4 w-4" />
                    Highlights
                  </button>
                  <button
                    onClick={() => setActiveContentTab("tagged")}
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm flex items-center justify-center gap-2 ${
                      activeContentTab === "tagged"
                        ? "border-pink-500 text-pink-600 dark:text-pink-400"
                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    }`}
                  >
                    <FiUsers className="h-4 w-4" />
                    Tagged
                  </button>
                </nav>
              </div>

              {/* Content View Options */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-md ${
                      viewMode === "grid" ? "bg-gray-200 dark:bg-gray-700" : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <FiGrid className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-md ${
                      viewMode === "list" ? "bg-gray-200 dark:bg-gray-700" : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <FiList className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePrivacy(activePrivacySetting === "public" ? "private" : "public")}
                    className={`flex items-center gap-1 text-sm px-3 py-1 rounded-md ${
                      activePrivacySetting === "private"
                        ? "bg-gray-200 dark:bg-gray-700"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {activePrivacySetting === "private" ? (
                      <>
                        <FiEyeOff className="h-4 w-4" />
                        <span>Private</span>
                      </>
                    ) : (
                      <>
                        <FiEye className="h-4 w-4" />
                        <span>Public</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className="flex items-center gap-1 text-sm px-3 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <FiEye className="h-4 w-4" />
                    <span>Preview</span>
                  </button>
                </div>
              </div>

              {/* Content Display */}
              <div className="p-4">
                {activeContentTab === "posts" && (
                  <div>
                    {viewMode === "grid" ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {/* Sample post grid items */}
                        {[1, 2, 3, 4, 5, 6].map((post) => (
                          <div key={post} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden relative group">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <FiImage className="h-12 w-12 text-gray-400" />
                            </div>
                            {post === 1 && (
                              <div className="absolute top-2 left-2 bg-white dark:bg-gray-800 p-1 rounded-full">
                                <FiStar className="h-4 w-4 text-yellow-500" />
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                              <div className="flex gap-4 text-white">
                                <span className="flex items-center gap-1">
                                  <FiHeart className="h-5 w-5" />
                                  <span>24</span>
                                </span>
                                <span className="flex items-center gap-1">
                                  <FiMessageSquare className="h-5 w-5" />
                                  <span>5</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Sample post list items */}
                        {[1, 2, 3].map((post) => (
                          <div key={post} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                              <div>
                                <h4 className="font-medium">Post Title {post}</h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                  Lorem ipsum dolor sit amet, consectetur adipiscing elit...
                                </p>
                                <div className="flex gap-4 mt-2 text-sm">
                                  <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                    <FiHeart className="h-4 w-4" />
                                    <span>24</span>
                                  </span>
                                  <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                    <FiMessageSquare className="h-4 w-4" />
                                    <span>5</span>
                                  </span>
                                  <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                    <FiClock className="h-4 w-4" />
                                    <span>2d ago</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeContentTab === "reels" && (
                  <div className="text-center py-8">
                    <div className="mx-auto w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                      <FiVideo className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                    </div>
                    <h4 className="text-lg font-medium mb-2">No Reels Yet</h4>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                      Create your first reel to share with your followers
                    </p>
                    <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-md">
                      Create Reel
                    </button>
                  </div>
                )}

                {activeContentTab === "highlights" && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {storyHighlights.length > 0 ? (
                      storyHighlights.map((highlight) => (
                        <div key={highlight.id} className="flex flex-col items-center">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-pink-500 p-1 mb-1">
                            <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                              {highlight.emoji || "⭐"}
                            </div>
                          </div>
                          <span className="text-xs text-center">{highlight.title}</span>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8">
                        <div className="mx-auto w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                          <FiStar className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                        </div>
                        <h4 className="text-lg font-medium mb-2">No Highlights Yet</h4>
                        <p className="text-gray-500 dark:text-gray-400">
                          Create story highlights to feature on your profile
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeContentTab === "tagged" && (
                  <div className="text-center py-8">
                    <div className="mx-auto w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                      <FiUsers className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                    </div>
                    <h4 className="text-lg font-medium mb-2">No Tagged Posts</h4>
                    <p className="text-gray-500 dark:text-gray-400">
                      When people tag you in photos and videos, they'll appear here
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Analytics Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                {/* <FiChartLine className="h-5 w-5" /> */}
                Profile Analytics
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Followers Growth</h4>
                  <div className="h-40 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">Chart Placeholder</span>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Post Performance</h4>
                  <div className="h-40 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">Chart Placeholder</span>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Audience Demographics</h4>
                  <div className="h-40 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">Chart Placeholder</span>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium mb-3">Best Times to Post</h4>
                  <div className="h-40 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">Chart Placeholder</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold">1.2K</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Profile Views</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold">8.7%</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Engagement Rate</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold">42</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Link Clicks</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg text-center">
                  <p className="text-2xl font-bold">4-6 PM</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Peak Activity</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {editMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Profile Settings</h3>
                <button
                  onClick={() => setEditMode(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <FiX className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Privacy Settings */}
                <div>
                  <h4 className="font-medium mb-3">Privacy Settings</h4>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="privacy"
                        checked={formData.isPrivate === false}
                        onChange={() => setFormData(prev => ({ ...prev, isPrivate: false }))}
                        className="rounded"
                      />
                      <span>Public Profile</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="privacy"
                        checked={formData.isPrivate === true}
                        onChange={() => setFormData(prev => ({ ...prev, isPrivate: true }))}
                        className="rounded"
                      />
                      <span>Private Profile</span>
                    </label>
                  </div>
                </div>

                {/* Verification */}
                <div>
                  <h4 className="font-medium mb-3">Verification</h4>
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      {user?.verificationStatus === "verified" ? (
                        <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm">
                          Verified
                        </span>
                      ) : (
                        <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full text-sm">
                          Not Verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {user?.verificationStatus === "verified"
                        ? "Your profile has been verified. Thank you for confirming your identity."
                        : "Verify your profile to get a verification badge and access to exclusive features."}
                    </p>
                    <button className="mt-3 text-sm text-blue-500 hover:underline">
                      {user?.verificationStatus === "verified"
                        ? "Learn more about verification"
                        : "Request verification"}
                    </button>
                  </div>
                </div>

                {/* Password Change */}
                <div>
                  <h4 className="font-medium mb-3">Change Password</h4>
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                        required
                        minLength={8}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md"
                      disabled={loading}
                    >
                      {loading ? "Updating..." : "Change Password"}
                    </button>
                  </form>
                </div>

                {/* Account Actions */}
                <div>
                  <h4 className="font-medium mb-3">Account Actions</h4>
                  <div className="space-y-3">
                    <button className="w-full text-left px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md flex items-center justify-between">
                      <span>Download Your Data</span>
                      <FiDownload className="h-5 w-5" />
                    </button>
                    <button className="w-full text-left px-4 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md flex items-center justify-between">
                      <span className="text-red-500">Deactivate Account</span>
                      <FiX className="h-5 w-5 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-md"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;