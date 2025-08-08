import React, { useState, useEffect } from "react";
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
} from "react-icons/fi";


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

  useEffect(() => {
    fetchProfile();
  }, []);

  // Update the fetchProfile function
const fetchProfile = async () => {
  setLoading(true);
  try {
    const response = await axiosInstance.get("/profile/me");
    console.log("API Response:", response.data); // Debug log
    
    // Handle both response structures
    const userData = response.data.data || response.data;
    
    if (!userData) {
      throw new Error("No user data received");
    }

    console.log("User data to set:", userData); // Debug log
    
    setUser(userData);
    setFormData({
      name: userData.name || "",
      email: userData.email || "",
      phone: userData.phone || "",
      username: userData.username || "",
      avatar: userData.avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
      bio: userData.bio || "",
      social: userData.social || {
        twitter: "",
        linkedin: "",
        github: "",
      },
      skills: userData.skills || [],
    });
  } catch (err) {
    console.error("Failed to fetch profile:", err.response?.data || err.message);
    setError(err.response?.data?.error || "Failed to load profile");
  } finally {
    setLoading(false);
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

 const handleSubmit = (e) => {
  e.preventDefault();
  setLoading(true);
  axiosInstance
    .put("/profile/me", formData) // Consistent endpoint
    .then((res) => {
      const updatedData = res.data.data || res.data; // Handle both response structures
      setUser(updatedData);
      setEditMode(false);
      setSuccess("Profile updated successfully");
      setTimeout(() => setSuccess(null), 3000);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Update error:", err.response?.data || err);
      setError(err.response?.data?.error || "Failed to update profile");
      setLoading(false);
    });
};

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    setLoading(true);
    axiosInstance
      .put("/profile/me/password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
      .then(() => {
        setSuccess("Password changed successfully");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setTimeout(() => setSuccess(null), 3000);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || "Failed to change password");
        setLoading(false);
      });
  };

 const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Validate file
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
    const response = await axiosInstance.post(
      "/profile/me/avatar",
      uploadData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Improved error handling
    if (!response.data?.success) {
      throw new Error(response.data?.error || "Upload failed");
    }

    const avatarUrl = response.data.data?.avatar || response.data.avatar;
    if (!avatarUrl) throw new Error("No avatar URL in response");

    setUser(prev => ({ ...prev, avatar: avatarUrl }));
    setFormData(prev => ({ ...prev, avatar: avatarUrl }));
    
    setSuccess("Profile picture updated successfully");
  } catch (err) {
    console.error("Upload error details:", {
      error: err,
      response: err.response?.data
    });
    setError(err.response?.data?.message || 
            err.message || 
            "Failed to upload profile picture");
  } finally {
    setUploading(false);
  }
};

 const getAvatarUrl = (avatar) => {
  if (!avatar) return "/default-avatar.png";
  if (avatar.startsWith("http")) return avatar;
  if (avatar.startsWith("/uploads")) {
    // Use import.meta.env for Vite environment variables
    return `${import.meta.env.VITE_API_BASE_URL || ''}${avatar}`;
  }
  return avatar;
};

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg dark:bg-red-900 dark:text-red-100 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-lg">
            <FiX />
          </button>
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg dark:bg-green-900 dark:text-green-100 flex justify-between items-center">
          <span>{success}</span>
          <button onClick={() => setSuccess(null)} className="text-lg">
            <FiX />
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left sidebar */}
        <div className="w-full md:w-1/3 lg:w-1/4">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow">
            {user?.avatar ? (
              <div className="relative group">
                <img
                  src={getAvatarUrl(user.avatar)}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-white dark:border-gray-600 shadow"
                />
                {editMode && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <label className="cursor-pointer bg-black bg-opacity-50 text-white p-2 rounded-full">
                      <FiCamera className="h-5 w-5" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-600 mx-auto mb-4 flex items-center justify-center text-gray-500 dark:text-gray-300">
                {editMode ? (
                  <label className="cursor-pointer flex flex-col items-center">
                    <FiCamera className="h-6 w-6 mb-1" />
                    <span>{uploading ? "Uploading..." : "Add Photo"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <FiUser className="h-8 w-8" />
                )}
              </div>
            )}

            <h2 className="text-xl font-bold text-center text-gray-800 dark:text-gray-100">
              {user?.name}
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-300">
              @{user?.username}
            </p>

            <div className="mt-4">
              <button
                onClick={() => setEditMode(!editMode)}
                className={`w-full py-2 px-4 rounded-md flex items-center justify-center gap-2 ${
                  editMode
                    ? "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
                    : "bg-pink-500 hover:bg-pink-600"
                } text-white transition-colors`}
              >
                <FiEdit2 className="h-4 w-4" />
                {editMode ? "Cancel Editing" : "Edit Profile"}
              </button>
            </div>

            <div className="mt-6">
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2 ${
                    activeTab === "profile"
                      ? "bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-200"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                  }`}
                >
                  <FiUser className="h-4 w-4" />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab("password")}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2 ${
                    activeTab === "password"
                      ? "bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-200"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                  }`}
                >
                  <FiKey className="h-4 w-4" />
                  Password
                </button>
                <button
                  onClick={() => setActiveTab("social")}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2 ${
                    activeTab === "social"
                      ? "bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-200"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                  }`}
                >
                  <FiShare2 className="h-4 w-4" />
                  Social
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="w-full md:w-2/3 lg:w-3/4">
          {activeTab === "profile" && (
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <FiInfo className="h-5 w-5" />
                Profile Information
              </h3>
              {editMode ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                        <FiUser className="h-4 w-4" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                        <FiUser className="h-4 w-4" />
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                        <FiMail className="h-4 w-4" />
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                        <FiPhone className="h-4 w-4" />
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"
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
                      className="w-full p-2 border rounded-md dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"
                      rows={3}
                      maxLength={200}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
                      {formData.bio.length}/200
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                      <FiAward className="h-4 w-4" />
                      Skills
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="Add a skill"
                        className="flex-1 p-2 border rounded-md dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"
                      />
                      <button
                        type="button"
                        onClick={addSkill}
                        className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md flex items-center gap-1"
                      >
                        <FiPlus className="h-4 w-4" />
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
                            <FiTrash2 className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-md flex items-center gap-2 justify-center"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="animate-spin">⏳</span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <FiCheck className="h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <FiUser className="h-4 w-4" />
                        Full Name
                      </p>
                      <p className="text-gray-800 dark:text-gray-100">
                        {user?.name || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <FiUser className="h-4 w-4" />
                        Username
                      </p>
                      <p className="text-gray-800 dark:text-gray-100">
                        @{user?.username}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <FiMail className="h-4 w-4" />
                        Email
                      </p>
                      <p className="text-gray-800 dark:text-gray-100">
                        {user?.email}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <FiPhone className="h-4 w-4" />
                        Phone
                      </p>
                      <p className="text-gray-800 dark:text-gray-100">
                        {user?.phone || "Not provided"}
                      </p>
                    </div>
                  </div>

                  {user?.bio && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Bio
                      </p>
                      <p className="text-gray-800 dark:text-gray-100 whitespace-pre-line">
                        {user.bio}
                      </p>
                    </div>
                  )}

                  {user?.skills?.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <FiAward className="h-4 w-4" />
                        Skills
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
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

          {activeTab === "password" && (
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <FiKey className="h-5 w-5" />
                Change Password
              </h3>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                    <FiLock className="h-4 w-4" />
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full p-2 border rounded-md dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                    <FiLock className="h-4 w-4" />
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full p-2 border rounded-md dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"
                    required
                    minLength={8}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                    <FiLock className="h-4 w-4" />
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full p-2 border rounded-md dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"
                    required
                  />
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-md flex items-center gap-2 justify-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <FiCheck className="h-4 w-4" />
                        Update Password
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "social" && (
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <FiShare2 className="h-5 w-5" />
                Social Links
              </h3>
              {editMode ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                      <FiTwitter className="h-4 w-4" />
                      Twitter
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 dark:bg-gray-600 dark:text-gray-300 dark:border-gray-500">
                        twitter.com/
                      </span>
                      <input
                        type="text"
                        name="social.twitter"
                        value={formData.social.twitter}
                        onChange={handleChange}
                        className="flex-1 p-2 border rounded-r-md dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"
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
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 dark:bg-gray-600 dark:text-gray-300 dark:border-gray-500">
                        linkedin.com/in/
                      </span>
                      <input
                        type="text"
                        name="social.linkedin"
                        value={formData.social.linkedin}
                        onChange={handleChange}
                        className="flex-1 p-2 border rounded-r-md dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"
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
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 dark:bg-gray-600 dark:text-gray-300 dark:border-gray-500">
                        github.com/
                      </span>
                      <input
                        type="text"
                        name="social.github"
                        value={formData.social.github}
                        onChange={handleChange}
                        className="flex-1 p-2 border rounded-r-md dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"
                        placeholder="username"
                      />
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-md flex items-center gap-2 justify-center"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="animate-spin">⏳</span>
                          Saving...
                        </>
                      ) : (
                        <>
                          <FiCheck className="h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <FiTwitter className="h-4 w-4" />
                      Twitter
                    </p>
                    {user?.social?.twitter ? (
                      <a
                        href={`https://twitter.com/${user.social.twitter}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-500 hover:underline flex items-center gap-1"
                      >
                        <FiTwitter className="h-4 w-4" />
                        twitter.com/{user.social.twitter}
                      </a>
                    ) : (
                      <p className="text-gray-800 dark:text-gray-100">
                        Not provided
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <FiLinkedin className="h-4 w-4" />
                      LinkedIn
                    </p>
                    {user?.social?.linkedin ? (
                      <a
                        href={`https://linkedin.com/in/${user.social.linkedin}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-500 hover:underline flex items-center gap-1"
                      >
                        <FiLinkedin className="h-4 w-4" />
                        linkedin.com/in/{user.social.linkedin}
                      </a>
                    ) : (
                      <p className="text-gray-800 dark:text-gray-100">
                        Not provided
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <FiGithub className="h-4 w-4" />
                      GitHub
                    </p>
                    {user?.social?.github ? (
                      <a
                        href={`https://github.com/${user.social.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-500 hover:underline flex items-center gap-1"
                      >
                        <FiGithub className="h-4 w-4" />
                        github.com/{user.social.github}
                      </a>
                    ) : (
                      <p className="text-gray-800 dark:text-gray-100">
                        Not provided
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
