// MapPage.jsx
import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
  useMapEvents
} from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const defaultPos = [6.5244, 3.3792]; // Lagos, Nigeria

const MapUpdater = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, 13);
    }
  }, [position, map]);
  return null;
};

const DestinationClick = ({ onSelect }) => {
  useMapEvents({
    click(e) {
      onSelect([e.latlng.lat, e.latlng.lng]);
    }
  });
  return null;
};

export default function MapPage() {
  const [search, setSearch] = useState("");
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem("recentSearches");
    return saved ? JSON.parse(saved) : [];
  });
  const [position, setPosition] = useState(null);
  const [destination, setDestination] = useState(null);
  const [directions, setDirections] = useState([]);
  const [summary, setSummary] = useState(null);
  const [transportMode, setTransportMode] = useState("driving-car");
  const [routeSteps, setRouteSteps] = useState([]);
  const [startLabel, setStartLabel] = useState("You are here");
  const [endLabel, setEndLabel] = useState("Destination");

  const handleSearch = async () => {
    try {
      const res = await axios.get(`https://nominatim.openstreetmap.org/search`, {
        params: {
          q: search,
          format: "json",
          addressdetails: 1,
          limit: 1,
        },
      });
      if (res.data.length > 0) {
        const lat = parseFloat(res.data[0].lat);
        const lon = parseFloat(res.data[0].lon);
        setDestination([lat, lon]);
        setEndLabel(res.data[0].display_name);
        getRoute(lat, lon);
        const updatedSearches = [res.data[0].display_name, ...recentSearches.filter(item => item !== res.data[0].display_name)].slice(0, 5);
        setRecentSearches(updatedSearches);
        localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
      }
    } catch (err) {
      alert("Location not found");
    }
  };

  const getRoute = async (destLat, destLon) => {
    if (!position) {
      alert("Set a starting point first.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/map", {
        start: { lat: position[0], lon: position[1] },
        end: { lat: destLat, lon: destLon },
        mode: transportMode
      });

      const coords = res.data.coordinates.map(([lon, lat]) => [lat, lon]);
      setDirections(coords);
      setSummary(res.data.summary);
      setRouteSteps(res.data.steps || []);
    } catch (err) {
      console.error("Failed to fetch route", err);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      () => {
        setPosition(defaultPos);
      }
    );
  }, []);

  const handleMapClick = ([lat, lon]) => {
    setDestination([lat, lon]);
    getRoute(lat, lon);
  };

  return (
    <div className="w-full h-screen relative bg-white text-sm sm:text-base">
      <div className="absolute top-4 left-4 z-[999] bg-white p-3 rounded-lg shadow space-y-2 w-[90%] sm:w-80">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search location..."
          className="border p-2 rounded w-full text-xs sm:text-sm"
        />
        <div className="flex items-center justify-between gap-2">
          <select
            value={transportMode}
            onChange={(e) => setTransportMode(e.target.value)}
            className="border p-2 rounded w-1/2 text-xs sm:text-sm"
          >
            <option value="driving-car">Car</option>
            <option value="cycling-regular">Bicycle</option>
            <option value="foot-walking">Walking</option>
          </select>
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded text-xs sm:text-sm"
          >
            Search
          </button>
        </div>
        {summary && (
          <div className="text-xs sm:text-sm text-gray-600">
            <p><strong>Distance:</strong> {(summary.distance / 1000).toFixed(2)} km</p>
            <p><strong>Duration:</strong> {(summary.duration / 60).toFixed(1)} mins</p>
            <p><strong>ETA:</strong> {new Date(Date.now() + summary.duration * 1000).toLocaleTimeString()}</p>
            <p><strong>To:</strong> {endLabel}</p>
          </div>
        )}
        {routeSteps.length > 0 && (
          <div className="text-xs text-gray-700 max-h-40 overflow-y-auto">
            <p className="font-semibold mt-2 mb-1">Step-by-step directions:</p>
            <ul className="list-disc pl-5 space-y-1">
              {routeSteps.map((step, index) => (
                <li key={index}>{step.instruction}</li>
              ))}
            </ul>
          </div>
        )}
        {recentSearches.length > 0 && (
          <div className="text-xs text-gray-500">
            <p className="font-semibold mb-1">Recent:</p>
            <ul>
              {recentSearches.map((item, index) => (
                <li
                  key={index}
                  className="cursor-pointer hover:underline"
                  onClick={() => {
                    setSearch(item);
                    handleSearch();
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <MapContainer center={position || defaultPos} zoom={13} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater position={position} />
        <DestinationClick onSelect={handleMapClick} />
        {position && (
          <Marker
            position={position}
            icon={L.icon({
              iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41],
            })}
          >
            <Popup>{startLabel}</Popup>
          </Marker>
        )}
        {destination && (
          <Marker
            position={destination}
            icon={L.icon({
              iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-red.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41],
            })}
          >
            {/* <Popup>{endLabel}</Popup> */}
          </Marker>
        )}
        {directions.length > 0 && <Polyline positions={directions} color="blue" />}
      </MapContainer>
    </div>
  );
}
