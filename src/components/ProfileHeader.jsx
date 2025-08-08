import React, { useState, useEffect } from "react";
import API from "../api";
import ProfileHeader from "../components/ProfileHeader";
import ProfileTabs from "../components/profile/ProfileTabs";
import ProfilePosts from "../components/profile/ProfilePosts";
import ProfileAbout from "../components/profile/ProfileAbout";
import ProfileFriends from "../components/profile/ProfileFriends";
import ProfilePhotos from "../components/profile/ProfilePhotos";
import { Loading, Error } from "../components/common";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("posts");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await API.getProfile();
        setProfile(profileData);
        setIsCurrentUser(true); // Adjust logic if you support viewing others' profiles
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleProfileUpdate = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!profile) return <Error message="Profile not found" />;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <ProfileHeader
        profile={profile}
        isCurrentUser={isCurrentUser}
        onProfileUpdate={handleProfileUpdate}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <ProfileTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isCurrentUser={isCurrentUser}
        />

        <div className="mt-6">
          {activeTab === "posts" && <ProfilePosts profile={profile} />}
          {activeTab === "about" && (
            <ProfileAbout profile={profile} isCurrentUser={isCurrentUser} />
          )}
          {activeTab === "friends" && <ProfileFriends profile={profile} />}
          {activeTab === "photos" && <ProfilePhotos profile={profile} />}
        </div>
      </div>
    </div>
  );
}

export default Profile;