import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SelectLocation = () => {
  const navigate = useNavigate();
  const [selectedStation, setSelectedStation] = useState("");

  const handleStationChange = (e) => {
    setSelectedStation(e.target.value);
  };

  const railwayStations = [
    "DEMO Jasan Hall",
    "Chhatrapati Shivaji Maharaj Terminus",
    "New Delhi Railway Station",
    "Howrah Junction",
    "Chennai Central",
    "Mumbai Central",
  ];

  return (
    <div
      className="bg-cover bg-center min-h-screen flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://c4.wallpaperflare.com/wallpaper/198/815/760/anime-sunset-train-station-moescape-hd-wallpaper-preview.jpg')",
      }} // Replace with a railway background image
    >
      <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-10 max-w-lg text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Select Your Railway Station
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Please choose a railway station to start your journey.
        </p>

        <div className="mb-8">
          <select
            className="bg-white bg-opacity-80 text-gray-700 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            value={selectedStation}
            onChange={handleStationChange}
          >
            <option value="" disabled>
              Select a station
            </option>
            {railwayStations.map((station, index) => (
              <option key={index} value={station}>
                {station}
              </option>
            ))}
          </select>
        </div>

        <div>
          <button
            onClick={() => {
              navigate("/map");
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            disabled={!selectedStation}
          >
            Proceed to Navigate
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectLocation;
