import React, { useState } from "react";
import {
  MapContainer,
  ImageOverlay,
  Marker,
  Popup,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import PF from "pathfinding";

//place dropdown
const placeInput = [
  { label: "Exit 1", value: "exit1" },
  { label: "Exit 2", value: "exit2" },
  { label: "Entrance", value: "Enterance" },
  { label: "Podium", value: "podium" },
  { label: "Seats 1", value: "seats1" },
  { label: "Seats 2", value: "seats2" },
  { label: "Seats 3", value: "seats3" },
  { label: "Washroom", value: "washroom" },
  { label: "Stage", value: "stage" },
  { label: "Reception Counter", value: "Reception" },
];

// Function to log coordinates when the map is clicked
const MapClickLogger = () => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng; // Get clicked coordinates (lat, lng)
      console.log(`Clicked coordinates: [${lat}, ${lng}]`);
    },
  });
  return null;
};

// Define your places (rooms, areas)
const places = {
  exit1: [415, 590],
  exit2: [415, 88],
  Enterance: [3, 430],
  podium: [400, 150],
  seats1: [300, 350],
  seats2: [160, 480],
  seats3: [160, 180],
  washroom: [35, 40],
  stage: [415, 350],
  Reception: [25, 550],
};

// Pathfinding grid setup
const grid = new PF.Grid(500, 600); // Create a grid matching your image size
const finder = new PF.AStarFinder();

// // Example: Group of obstacle coordinates (x, y) representing walls/furniture
// const obstacles = [
//   // Example wall
//   [500, 500],
//   [501, 500],
//   [502, 500],
//   [503, 500],
//   [504, 500],

//   // Example furniture
//   [300, 300],
//   [301, 300],
//   [300, 301],
//   [301, 301],

//   // Another obstacle group
//   [700, 700],
//   [701, 700],
//   [702, 700],
// ];

// // Iterate through the obstacle coordinates and set them as unwalkable
// obstacles.forEach(([x, y]) => {
//   grid.setWalkableAt(x, y, false);
// });

// Custom icon for the marker
const exit = new L.Icon({
  iconUrl: "../../public/exit.png",
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
});
const enter = new L.Icon({
  iconUrl: "../../public/login.png",
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
});
const seat = new L.Icon({
  iconUrl: "../../public/seats.png",
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
});
const podium = new L.Icon({
  iconUrl: "../../public/microphone.png",
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
});
const stage = new L.Icon({
  iconUrl: "../../public/theatre.png",
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
});
const washroom = new L.Icon({
  iconUrl: "../../public/restroom.png",
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
});
const counter = new L.Icon({
  iconUrl: "../../public/reception.png",
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
});

const MapComponent = () => {
  const [path, setPath] = useState([]);

  //marker array
  let icons = [
    { name: "exit-1", x: 415, y: 590, icon: exit },
    { name: "exit-2", x: 415, y: 88, icon: exit },
    { name: "Enterance", x: 3, y: 430, icon: enter },
    { name: "podium", x: 400, y: 150, icon: podium },
    { name: "seats-1", x: 300, y: 350, icon: seat },
    { name: "seats-2", x: 160, y: 480, icon: seat },
    { name: "seats-3", x: 160, y: 180, icon: seat },
    { name: "washroom", x: 35, y: 40, icon: washroom },
    { name: "stage", x: 415, y: 350, icon: stage },
    { name: "Reception Counter", x: 25, y: 550, icon: counter },
  ];

  // Define the bounds (adjust this based on your image resolution)
  const bounds = [
    [0, 0], // Top-left corner
    [500, 600], // Bottom-right corner
  ];

  // Function to find and set the route between two points
  const findRoute = (startPlace, endPlace) => {
    const start = places[startPlace];
    const end = places[endPlace];

    const path = finder.findPath(
      start[0],
      start[1],
      end[0],
      end[1],
      grid.clone()
    );
    setPath(path);
    // alert("path found");
  };

  const [start, setStart] = useState("");
  const [destination, setDestination] = useState("");

  const handleRoute = () => {
    if (start && destination) {
      findRoute(start, destination);
    } else {
      alert("Please select both start and destination.");
    }
  };

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      {" "}
      {/* input form */}
      <div className="p-1 flex justify-center items-center">
        <label className="block text-gray-700">Start:</label>
        <select
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className="m-2 p-2 border rounded"
        >
          <option value="" disabled>
            Select starting point
          </option>
          {placeInput.map((place) => (
            <option key={place.value} value={place.value}>
              {place.label}
            </option>
          ))}
        </select>

        <label className="block text-gray-700">Destination:</label>
        <select
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="m-2 p-2 border rounded"
        >
          <option value="" disabled>
            Select destination point
          </option>
          {placeInput.map((place) => (
            <option key={place.value} value={place.value}>
              {place.label}
            </option>
          ))}
        </select>

        <button className="bg-blue-400 p-2 rounded" onClick={handleRoute}>
          Find Route
        </button>
      </div>
      {/* Full screen container */}
      <MapContainer
        center={[250, 250]} // Center in the middle of the image
        zoom={1} // Adjust zoom level as needed
        crs={L.CRS.Simple} // Use Simple CRS for image maps
        style={{ height: "100%", width: "100%" }} // Full height and width
      >
        {/* Image overlay with custom bounds */}
        <ImageOverlay
          url={`https://i.pinimg.com/originals/e2/a9/40/e2a940936dd61169dcc2c5307d2a41ec.jpg`} // Image of the house
          bounds={bounds} // Image bounds
        />

        {/* Example markers */}
        {icons.map((icon) => (
          <Marker key={icon.name} position={[icon.x, icon.y]} icon={icon.icon}>
            <Popup>{icon.name}</Popup>
          </Marker>
        ))}

        {/* Display the calculated route */}
        {path.length > 0 && (
          <Polyline positions={path.map(([x, y]) => [x, y])} color="blue" />
        )}

        {/* Add the MapClickLogger component to listen for clicks */}
        <MapClickLogger />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
