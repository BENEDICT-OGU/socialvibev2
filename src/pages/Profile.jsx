import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../api";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiEdit2,
  FiX,
  FiCheck,
  FiLock,
  FiTwitter,
  FiLinkedin,
  FiGithub,
  FiCamera,
  FiPlus,
  FiTrash2,
  FiKey,
  FiShare2,
  FiInfo,
  FiAward,
  FiSettings,
  FiBell,
  FiGrid,
  FiBookmark,
  FiUserPlus,
  FiUsers
} from "react-icons/fi";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { Link } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    username: "",
    avatar: "",
    bio: "",
    social: {
      twitter: "",
      linkedin: "",
      github: "",
    },
    skills: [],
    website: "",
    gender: "",
    pronouns: ""
  });
  const [newSkill, setNewSkill] = useState("");
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchFollowStats();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/profile/me");
      const userData = response.data.data || response.data;
      
      if (!userData) throw new Error("No user data received");

      setUser(userData);
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.phone || "",
        username: userData.username || "",
        avatar: userData.avatar || "/default-avatar.png",
        bio: userData.bio || "",
        social: userData.social || {
          twitter: "",
          linkedin: "",
          github: "",
        },
        skills: userData.skills || [],
        website: userData.website || "",
        gender: userData.gender || "",
        pronouns: userData.pronouns || ""
      });
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError(err.response?.data?.error || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchFollowStats = async () => {
    try {
      const response = await axiosInstance.get("/profile/follow-stats");
      setFollowers(response.data.followers);
      setFollowing(response.data.following);
      setIsFollowing(response.data.isFollowing);
    } catch (err) {
      console.error("Failed to fetch follow stats:", err);
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await axiosInstance.delete(`/profile/unfollow/${user._id}`);
        setFollowers(prev => prev - 1);
      } else {
        await axiosInstance.post(`/profile/follow/${user._id}`);
        setFollowers(prev => prev + 1);
      }
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error("Failed to toggle follow:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.put("/profile/me", formData);
      const updatedData = response.data.data || response.data;
      setUser(updatedData);
      setEditMode(false);
      setSuccess("Profile updated successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Update error:", err);
      setError(err.response?.data?.error || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
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
    uploadData.append("avatar", file);
    setUploading(true);
    setError(null);

    try {
      const response = await axiosInstance.post("/profile/me/avatar", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const avatarUrl = response.data.data?.avatar || response.data.avatar;
      if (!avatarUrl) throw new Error("No avatar URL in response");

      setUser(prev => ({ ...prev, avatar: avatarUrl }));
      setFormData(prev => ({ ...prev, avatar: avatarUrl }));
      setSuccess("Profile picture updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const getAvatarUrl = (avatar) => {
    if (!avatar) return "/default-avatar.png";
    if (avatar.startsWith("http")) return avatar;
    if (avatar.startsWith("/uploads")) {
      return `${import.meta.env.VITE_API_BASE_URL || ''}${avatar}`;
    }
    return avatar;
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove),
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-black">
        <p className="text-gray-600 dark:text-gray-300">Failed to load profile</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-black min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">@{user.username}</h1>
            {user.verified && (
              <RiVerifiedBadgeFill className="ml-1 text-blue-500" size={18} />
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-800 dark:text-gray-200">
              <Link to="/notifications">
              <FiBell size={22} />
              </Link>
              
            </button>
            <button className="text-gray-800 dark:text-gray-200">
              <Link to="/settings">
              <FiSettings size={22} />
              </Link>
            </button>
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {/* Avatar Section */}
          <div className="relative group flex-shrink-0">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden">
              <img
                src={getAvatarUrl(user.avatar)}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            {editMode && (
              <label className="absolute bottom-0 right-0 bg-pink-500 text-white p-2 rounded-full cursor-pointer shadow-md">
                <FiCamera size={16} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <div className="flex items-center mb-2 md:mb-0">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mr-3">
                  {user.name}
                </h2>
                {editMode ? (
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-4 py-1 bg-gray-200 dark:bg-gray-700 rounded-md text-gray-800 dark:text-white"
                  >
                    Cancel
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-4 py-1 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-800 dark:text-white mr-2"
                    >
                      Edit Profile
                    </button>
                    <button className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md text-gray-800 dark:text-white">
                      <FiShare2 size={18} />
                    </button>
                  </>
                )}
              </div>

              {/* {!editMode && (
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleFollow}
                    className={`px-4 py-1 rounded-md font-medium ${
                      isFollowing
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
                        : "bg-pink-500 text-white"
                    }`}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                </div>
              )} */}
            </div>

            {/* Stats */}
            <div className="flex space-x-6 mb-4">
              <div className="text-center">
                <p className="font-bold text-gray-800 dark:text-white">0</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Posts</p>
              </div>
              <button className="text-center">
                <p className="font-bold text-gray-800 dark:text-white">{followers}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Followers</p>
              </button>
              <button className="text-center">
                <p className="font-bold text-gray-800 dark:text-white">{following}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Following</p>
              </button>
            </div>

            {/* Bio */}
            <div className="mb-4">
              <p className="text-gray-800 dark:text-white">{user.bio}</p>
              {user.website && (
                <a
                  href={user.website.startsWith("http") ? user.website : `https://${user.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-500 hover:underline text-sm"
                >
                  {user.website}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("profile")}
              className={`py-3 px-1 font-medium text-sm flex items-center ${
                activeTab === "profile"
                  ? "text-pink-500 border-b-2 border-pink-500"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <FiUser className="mr-2" />
              Profile
            </button>
            <button
              onClick={() => setActiveTab("social")}
              className={`py-3 px-1 font-medium text-sm flex items-center ${
                activeTab === "social"
                  ? "text-pink-500 border-b-2 border-pink-500"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <FiShare2 className="mr-2" />
              Social
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`py-3 px-1 font-medium text-sm flex items-center ${
                activeTab === "password"
                  ? "text-pink-500 border-b-2 border-pink-500"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              <FiKey className="mr-2" />
              Password
            </button>
          </nav>
        </div>

        {/* Profile Tab Content */}
        {activeTab === "profile" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            {editMode ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    rows={3}
                    maxLength={150}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
                    {formData.bio.length}/150
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    placeholder="https://example.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    >
                      <option value="">Prefer not to say</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non-binary">Non-binary</option>
                      <option value="other">Other</option>
                    </select>
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
                      className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      placeholder="e.g. she/her, they/them"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Skills
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill"
                      className="flex-1 p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                    />
                    <button
                      type="button"
                      onClick={addSkill}
                      className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill) => (
                      <div
                        key={skill}
                        className="flex items-center bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-2 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded-md"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Basic Information
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Name</p>
                        <p className="text-gray-800 dark:text-white">{user.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Username</p>
                        <p className="text-gray-800 dark:text-white">@{user.username}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                        <p className="text-gray-800 dark:text-white">{user.email}</p>
                      </div>
                      {user.phone && (
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Phone</p>
                          <p className="text-gray-800 dark:text-white">{user.phone}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      About
                    </h3>
                    <div className="space-y-3">
                      {user.bio && (
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Bio</p>
                          <p className="text-gray-800 dark:text-white">{user.bio}</p>
                        </div>
                      )}
                      {user.gender && (
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Gender</p>
                          <p className="text-gray-800 dark:text-white">
                            {user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}
                          </p>
                        </div>
                      )}
                      {user.pronouns && (
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Pronouns</p>
                          <p className="text-gray-800 dark:text-white">{user.pronouns}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {user.skills?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill) => (
                        <span
                          key={skill}
                          className="bg-gray-200 dark:bg-gray-600 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Social Tab Content */}
        {activeTab === "social" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            {editMode ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <FiTwitter className="mr-2" />
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
                      className="flex-1 p-2 border rounded-r-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      placeholder="username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <FiLinkedin className="mr-2" />
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
                      className="flex-1 p-2 border rounded-r-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      placeholder="username"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                    <FiGithub className="mr-2" />
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
                      className="flex-1 p-2 border rounded-r-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      placeholder="username"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded-md"
                    disabled={loading}
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
                    Social Links
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <FiTwitter className="mr-2" />
                        Twitter
                      </p>
                      {user.social?.twitter ? (
                        <a
                          href={`https://twitter.com/${user.social.twitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-500 hover:underline"
                        >
                          twitter.com/{user.social.twitter}
                        </a>
                      ) : (
                        <p className="text-gray-800 dark:text-white">Not connected</p>
                      )}
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <FiLinkedin className="mr-2" />
                        LinkedIn
                      </p>
                      {user.social?.linkedin ? (
                        <a
                          href={`https://linkedin.com/in/${user.social.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-500 hover:underline"
                        >
                          linkedin.com/in/{user.social.linkedin}
                        </a>
                      ) : (
                        <p className="text-gray-800 dark:text-white">Not connected</p>
                      )}
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <FiGithub className="mr-2" />
                        GitHub
                      </p>
                      {user.social?.github ? (
                        <a
                          href={`https://github.com/${user.social.github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-pink-500 hover:underline"
                        >
                          github.com/{user.social.github}
                        </a>
                      ) : (
                        <p className="text-gray-800 dark:text-white">Not connected</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Password Tab Content */}
        {activeTab === "password" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                  <FiLock className="mr-2" />
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                  <FiLock className="mr-2" />
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  required
                  minLength={8}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                  <FiLock className="mr-2" />
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  required
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded-md"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default Profile;