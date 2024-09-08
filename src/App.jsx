// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MapComponent from "./components/MapComponent";
import LiveLocation from "./components/LiveLocation";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="App h-screen w-screen overflow-scroll">
              <MapComponent />
            </div>
          }
        />
        <Route
          path="/live"
          element={
            <div className="App h-screen w-screen overflow-scroll">
              <LiveLocation />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
