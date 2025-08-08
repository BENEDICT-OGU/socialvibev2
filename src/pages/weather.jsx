import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherPage = () => {
  const [cityInput, setCityInput] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCelsius, setIsCelsius] = useState(true);
  const [backgroundImage, setBackgroundImage] = useState('');
  const apiKey = '11d7c2026be44641b85195426240211'; // Replace with your actual API key

  // Weather condition to background image mapping
  const weatherBackgrounds = {
    sunny: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    rainy: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0",
    cloudy: "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff",
    snowy: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5",
    thunderstorm: "https://images.unsplash.com/photo-1605721915766-5c091a985f1b",
    night: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986",
    default: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b"
  };

  const getWeatherBackground = (conditionCode, isDay) => {
    if (!isDay) return weatherBackgrounds.night;
    
    switch(true) {
      case conditionCode === 1000: // Clear
        return weatherBackgrounds.sunny;
      case conditionCode === 1003 || conditionCode === 1006 || conditionCode === 1009: // Cloudy
        return weatherBackgrounds.cloudy;
      case conditionCode >= 1063 && conditionCode <= 1072 || 
           conditionCode >= 1150 && conditionCode <= 1207: // Rain
        return weatherBackgrounds.rainy;
      case conditionCode >= 1212 && conditionCode <= 1225: // Snow
        return weatherBackgrounds.snowy;
      case conditionCode >= 1087 || conditionCode >= 1273 && conditionCode <= 1282: // Thunder
        return weatherBackgrounds.thunderstorm;
      default:
        return weatherBackgrounds.default;
    }
  };

  const fetchWeatherData = async () => {
    if (!cityInput.trim()) {
      setError('Please enter a city name');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      // Fetch current weather
      const currentResponse = await axios.get(
        `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityInput}&aqi=no`
      );
      setWeatherData(currentResponse.data);
      
      // Set background based on weather condition
      const bgImage = getWeatherBackground(
        currentResponse.data.current.condition.code,
        currentResponse.data.current.is_day
      );
      setBackgroundImage(bgImage);

      // Fetch forecast data (30 days)
      const forecastResponse = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${cityInput}&days=30&aqi=no`
      );
      setForecastData(forecastResponse.data.forecast.forecastday);

    } catch (err) {
      setError('City not found. Please try another location.');
      setBackgroundImage(weatherBackgrounds.default);
      setForecastData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeatherData();
  };

  const toggleTemperature = () => {
    setIsCelsius(!isCelsius);
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getTemperature = (tempC, tempF) => {
    return isCelsius ? `${tempC}°C` : `${tempF}°F`;
  };

  const getTimeOfDay = () => {
    const hours = new Date().getHours();
    return hours < 12 ? 'morning' : hours < 18 ? 'afternoon' : 'evening';
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center transition-all duration-500" 
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-black bg-opacity-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">
                {`Good ${getTimeOfDay()}!`}
              </h1>
              <p className="text-xl text-white">
                Check the weather in any city around the world
              </p>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="mb-8 flex">
              <input
                type="text"
                className="flex-grow p-4 rounded-l-lg bg-white bg-opacity-90 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search for a city..."
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-r-lg transition-colors duration-300"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <i className="fas fa-search mr-2"></i>
                    Search
                  </span>
                )}
              </button>
            </form>

            {/* Error Message */}
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                {error}
              </div>
            )}

            {/* Current Weather */}
            {weatherData && (
              <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-6 mb-8 shadow-lg">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="text-center md:text-left mb-4 md:mb-0">
                    <h2 className="text-3xl font-bold text-white">
                      {weatherData.location.name}, {weatherData.location.country}
                    </h2>
                    <p className="text-lg text-white">
                      {formatDate(weatherData.location.localtime)}
                    </p>
                  </div>
                  
                  <div className="flex items-center">
                    <img 
                      src={`https:${weatherData.current.condition.icon}`} 
                      alt={weatherData.current.condition.text}
                      className="w-16 h-16"
                    />
                    <div className="ml-4">
                      <div 
                        className="text-5xl font-bold text-white cursor-pointer"
                        onClick={toggleTemperature}
                      >
                        {getTemperature(weatherData.current.temp_c, weatherData.current.feelslike_f)}
                      </div>
                      <p className="text-xl text-white capitalize">
                        {weatherData.current.condition.text}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="bg-white bg-opacity-30 p-4 rounded-lg">
                    <p className="text-sm">Humidity</p>
                    <p className="text-2xl font-bold text-white">
                      {weatherData.current.humidity}%
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-30 p-4 rounded-lg">
                    <p className="text-sm">Wind</p>
                    <p className="text-2xl font-bold text-white">
                      {weatherData.current.wind_kph} km/h
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-30 p-4 rounded-lg">
                    <p className="text-sm">Feels Like</p>
                    <p className="text-2xl font-bold text-white">
                      {getTemperature(weatherData.current.feelslike_c, weatherData.current.feelslike_f)}
                    </p>
                  </div>
                  <div className="bg-white bg-opacity-30 p-4 rounded-lg">
                    <p className="text-sm">UV Index</p>
                    <p className="text-2xl font-bold text-white">
                      {weatherData.current.uv}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 30-Day Forecast */}
            {forecastData.length > 0 && (
              <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-6 shadow-lg">
                <h3 className="text-2xl font-bold text-white mb-4">Weather Forecast</h3>
                <div className=" grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                  {forecastData.map((day) => (
                    <div 
                      key={day.date} 
                      className="bg-white bg-opacity-30 rounded-lg p-3 text-center"
                    >
                      <p className="font-medium text-white">{formatDate(day.date)}</p>
                      <img 
                        src={`https:${day.day.condition.icon}`} 
                        alt={day.day.condition.text}
                        className="mx-auto w-12 h-12"
                      />
                      <p className="text-white capitalize">{day.day.condition.text}</p>
                      <p className="text-xl font-bold text-white">
                        {getTemperature(day.day.avgtemp_c, day.day.avgtemp_f)}
                      </p>
                      <div className="flex justify-between text-xs text-white mt-2">
                        <span>H: {getTemperature(day.day.maxtemp_c, day.day.maxtemp_f)}</span>
                        <span>L: {getTemperature(day.day.mintemp_c, day.day.mintemp_f)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 text-center text-sm text-white opacity-80">
              <p>© Socialvibe Weather App {new Date().getFullYear()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherPage;
