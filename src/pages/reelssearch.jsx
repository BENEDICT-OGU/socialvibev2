import { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import video1 from "../assets/videos/test1.mp4";
import axiosInstance from "../api";

export default function ReelsSearch() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    caption: true,
    user: true,
    music: true,
    tags: true,
  });

  useEffect(() => {
    fetchResults(1, true);
  }, []);

  const fetchResults = async (pageNum, reset = false) => {
    setLoading(true);
    try {
      // Example API call - adjust endpoint and params as needed
      const params = {
        q: search,
        page: pageNum,
        filters: Object.keys(filters).filter((key) => filters[key]),
      };
      // For now, simulate with static data
      const data = [
        {
          id: 1,
          src: video1,
          user: { name: "maya_reads", avatar: "https://i.pravatar.cc/150?img=3" },
          caption: "Check out this amazing view! #nature",
          music: "Original Audio",
          likes: 102,
          comments: 20,
          shares: 15,
          liked: false,
        },
        {
          id: 2,
          src: video1,
          user: { name: "johnny", avatar: "https://i.pravatar.cc/150?img=5" },
          caption: "Vibes only! #dance",
          music: "Dance Beat",
          likes: 200,
          comments: 50,
          shares: 30,
          liked: true,
        },
      ];
      if (reset) {
        setResults(data);
      } else {
        setResults((prev) => [...prev, ...data]);
      }
      setHasMore(data.length > 0);
      setPage(pageNum);
    } catch (error) {
      console.error("Failed to fetch reels:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchResults(1, true);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchResults(page + 1);
    }
  };

  const toggleFilter = (filterName) => {
    setFilters((prev) => ({ ...prev, [filterName]: !prev[filterName] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-900 to-black flex flex-col items-center py-8 px-2">
      <form onSubmit={handleSearch} className="w-full max-w-md flex items-center mb-4">
        <div className="relative flex-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reels by caption, user, music, or tags..."
            className="w-full pl-10 pr-4 py-2 rounded-full bg-neutral-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <button
          type="submit"
          className="ml-3 px-4 py-2 rounded-full bg-pink-500 text-white font-semibold hover:bg-pink-600 transition"
        >
          Search
        </button>
      </form>

      <div className="flex gap-4 mb-6">
        {Object.keys(filters).map((filter) => (
          <button
            key={filter}
            onClick={() => toggleFilter(filter)}
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              filters[filter] ? "bg-pink-500 text-white" : "bg-gray-700 text-gray-300"
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-6">
        {results.length === 0 && !loading ? (
          <div className="text-white text-xl font-semibold col-span-full">No reels found.</div>
        ) : (
          results.map((reel) => (
            <div key={reel.id} className="bg-black rounded-xl shadow-lg overflow-hidden">
              <video
                src={reel.src}
                className="w-full h-64 object-cover"
                controls
                muted
              />
              <div className="p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <img
                    src={reel.user.avatar}
                    alt={reel.user.name}
                    className="w-8 h-8 rounded-full border-2 border-pink-500"
                  />
                  <span className="font-semibold">@{reel.user.name}</span>
                </div>
                <div className="mb-1">{reel.caption}</div>
                <div className="flex items-center gap-2 text-sm text-pink-200">
                  <FaSearch /> {reel.music}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {hasMore && !loading && (
        <button
          onClick={handleLoadMore}
          className="mt-6 px-6 py-2 rounded-full bg-pink-500 text-white font-semibold hover:bg-pink-600 transition"
        >
          Load More
        </button>
      )}

      {loading && <div className="text-white mt-6">Loading...</div>}
    </div>
  );
}
