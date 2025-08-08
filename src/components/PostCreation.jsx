import React, { useState, useEffect } from "react";
import axiosInstance from "../api";

const postTypes = [
  { value: "text", label: "Text" },
  { value: "image", label: "Photo" },
  { value: "video", label: "Video" },
  { value: "audio", label: "Audio" },
  { value: "reels", label: "Reels" },
];

export default function PostCreation({ onPostCreated, navigateToReels }) {
  const [postType, setPostType] = useState("text");
  const [content, setContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [soundFile, setSoundFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Handle media file selection
  const handleMediaChange = (e) => {
    setMediaFiles(Array.from(e.target.files));
  };

  // Handle sound file selection
  const handleSoundChange = (e) => {
    setSoundFile(e.target.files[0]);
  };

  // Upload files to server or cloud storage and get URLs
  const uploadFiles = async (files) => {
    // Placeholder: Implement actual upload logic
    // For now, simulate upload and return dummy URLs
    return files.map((file, idx) => URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (postType === "reels") {
      // Navigate to reels creation page
      navigateToReels();
      return;
    }

    setUploading(true);
    try {
      const mediaUrls = await uploadFiles(mediaFiles);
      let soundUrl = null;
      if (soundFile) {
        const soundUrls = await uploadFiles([soundFile]);
        soundUrl = soundUrls[0];
      }

      const postData = {
        content,
        media: mediaUrls,
        sounds: soundUrl ? [soundUrl] : [],
        type: postType,
        hashtags: [], // Could add hashtag parsing here
        mentions: [], // Could add mention parsing here
      };

      const res = await axiosInstance.post("/posts", postData);
      onPostCreated(res.data);
      setContent("");
      setMediaFiles([]);
      setSoundFile(null);
    } catch (error) {
      console.error("Failed to create post:", error);
      alert("Failed to create post.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded shadow-md max-w-xl mx-auto">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Create a Post</h2>

      <label className="block mb-2 text-gray-700 dark:text-gray-300">Post Type</label>
      <select
        value={postType}
        onChange={(e) => setPostType(e.target.value)}
        className="w-full mb-4 p-2 border rounded dark:bg-gray-700 dark:text-white"
      >
        {postTypes.map((type) => (
          <option key={type.value} value={type.value}>{type.label}</option>
        ))}
      </select>

      {(postType === "text" || postType === "image" || postType === "video" || postType === "audio") && (
        <>
          {(postType === "text" || postType === "audio") && (
            <label className="block mb-2 text-gray-700 dark:text-gray-300">Content</label>
          )}
          {(postType === "text" || postType === "audio") && (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full mb-4 p-2 border rounded dark:bg-gray-700 dark:text-white"
              placeholder="Write your post content here"
              required={postType === "text"}
            />
          )}

          {(postType === "image" || postType === "video") && (
            <>
              <label className="block mb-2 text-gray-700 dark:text-gray-300">Upload {postType === "image" ? "Images" : "Videos"}</label>
              <input
                type="file"
                accept={postType === "image" ? "image/*" : "video/*"}
                multiple
                onChange={handleMediaChange}
                className="mb-4"
                required
              />
            </>
          )}

          {(postType === "text" || postType === "image" || postType === "video") && (
            <>
              <label className="block mb-2 text-gray-700 dark:text-gray-300">Upload Sound (optional)</label>
              <input
                type="file"
                accept="audio/*"
                onChange={handleSoundChange}
                className="mb-4"
              />
            </>
          )}
        </>
      )}

      <button
        type="submit"
        disabled={uploading}
        className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 disabled:opacity-50"
      >
        {uploading ? "Posting..." : "Post"}
      </button>
    </form>
  );
}
