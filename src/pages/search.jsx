import { useState, useEffect, useRef } from "react";
import axiosInstance from "../api";
import {
  FiSearch,
  FiUser,
  FiMessageSquare,
  FiHeart,
  FiShare2,
  FiCalendar,
} from "react-icons/fi";
import { debounce } from "lodash";
import { Link } from "react-router-dom";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({
    users: [],
    posts: [],
    tags: [],
  });
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const searchInputRef = useRef(null);

  const debouncedSearch = debounce(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults({ users: [], posts: [], tags: [] });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get(
        `/search?q=${encodeURIComponent(searchQuery)}`
      );
      setResults(response.data);
    } catch (err) {
      setError("Failed to fetch search results");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  }, 500);

  useEffect(() => {
    searchInputRef.current.focus();
  }, []);

  useEffect(() => {
    debouncedSearch(query);
    return () => debouncedSearch.cancel();
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    debouncedSearch(query);
  };

  const filteredResults = {
    users: activeTab === "all" || activeTab === "users" ? results.users : [],
    posts: activeTab === "all" || activeTab === "posts" ? results.posts : [],
    tags: activeTab === "all" || activeTab === "tags" ? results.tags : [],
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
            Search
          </h1>
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for users, posts, or tags..."
                className="w-full pl-12 pr-6 py-4 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-black focus:outline-none focus:ring-2 focus:ring-pink-500 text-gray-900 dark:text-white"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {/* <FiX className="text-xl" /> */}
                </button>
                
              )}
            </div>
          </form>
        </div>

        {/* Search Tabs */}
        <div className="flex overflow-x-auto mb-6 pb-2 scrollbar-hide">
          {["all", "users", "posts", "tags"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-4 py-2 mr-2 rounded-full font-medium ${
                activeTab === tab
                  ? "bg-pink-500 text-white"
                  : "bg-gray-200 dark:bg-gray-900 text-gray-700 dark:text-gray-300"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
          </div>
        )}

        {/* Search Results */}
        {!loading && (
          <div className="space-y-8">
            {/* Users Results */}
            {filteredResults.users?.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <FiUser className="mr-2" /> Users
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredResults.users.map((user) => (
                    <Link
                      key={user.id}
                      to={`/profile/${user.username}`}
                      className="bg-white dark:bg-black rounded-lg shadow p-4 flex items-center space-x-4 hover:shadow-md transition-shadow"
                    >
                      <img
                        src={user.avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-pink-500"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";
                        }}
                      />
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          @{user.username}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Posts Results */}
            {filteredResults.posts?.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                  <FiMessageSquare className="mr-2" /> Posts
                </h2>
                <div className="space-y-4">
                  {filteredResults.posts.map((post) => {
                    const author = post.author || {};
                    const media = post.media?.[0] || null;

                    return (
                      <div
                        key={post.id}
                        className="bg-white dark:bg-black rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="p-4">
                          <div className="flex items-center mb-3">
                            <Link
                              to={`/profile/${author.username}`}
                              className="flex items-center"
                            >
                              <img
                                src={author.avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
                                alt={author.name}
                                className="w-10 h-10 rounded-full mr-3"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";
                                }}
                              />
                              <div>
                                <h3 className="font-medium text-gray-900 dark:text-white hover:underline">
                                  {author.name}
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                  <FiCalendar className="mr-1" />{" "}
                                  {new Date(post.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </Link>
                          </div>
                          <p className="text-gray-800 dark:text-gray-200 mb-3">
                            {post.content}
                          </p>
                          {media && (
                            <div className="mb-3">
                              {media.type?.startsWith("image") ? (
                                <img
                                  src={media.url}
                                  alt="Post media"
                                  className="w-full rounded-lg max-h-80 object-cover"
                                />
                              ) : (
                                <video
                                  src={media.url}
                                  controls
                                  className="w-full rounded-lg max-h-80"
                                />
                              )}
                            </div>
                          )}
                          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
                            <div className="flex items-center mr-4">
                              <FiHeart className="mr-1" /> {post.likesCount || 0}
                            </div>
                            <div className="flex items-center mr-4">
                              <FiMessageSquare className="mr-1" />{" "}
                              {post.commentsCount || 0}
                            </div>
                            <div className="flex items-center">
                              <FiShare2 className="mr-1" /> {post.sharesCount || 0}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tags Results */}
            {filteredResults.tags?.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {filteredResults.tags.map((tag) => (
                    <Link
                      key={tag.name}
                      to={`/tags/${tag.name}`}
                      className="bg-gray-200 dark:bg-black hover:bg-gray-300 dark:hover:bg-gray-600 px-4 py-2 rounded-full text-gray-800 dark:text-gray-200"
                    >
                      #{tag.name} ({tag.postCount} posts)
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {!loading &&
              query &&
              filteredResults.users?.length === 0 &&
              filteredResults.posts?.length === 0 &&
              filteredResults.tags?.length === 0 && (
                <div className="text-center py-12">
                  <FiSearch className="mx-auto text-5xl text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300">
                    No results found for "{query}"
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mt-2">
                    Try different keywords or check your spelling
                  </p>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
}