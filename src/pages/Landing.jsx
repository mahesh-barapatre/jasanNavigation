import React from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  return (
    <div
      className="bg-cover bg-center min-h-screen flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://plus.unsplash.com/premium_photo-1661937674312-89f00c7e44e7?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
      }} // Replace with your railway image URL
    >
      <div className="bg-white bg-opacity-30 backdrop-filter backdrop-blur-lg rounded-lg shadow-lg p-10 max-w-lg text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Rail Scouts</h1>
        <p className="text-lg text-gray-600 mb-8">
          Easily find your way around the station. Whether you're looking for
          washrooms or shops, we've got you covered!
        </p>

        <div className="flex justify-around">
          <button
            onClick={() => {
              navigate("/live");
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-700 transition"
          >
            Live - Location
          </button>
          <button
            onClick={() => {
              navigate("/select");
            }}
            className="bg-green-600 text-white px-6 py-3 rounded-full text-lg hover:bg-green-700 transition"
          >
            without Live - Location
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
