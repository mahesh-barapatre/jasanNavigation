import React from "react";
import { MapContainer, ImageOverlay, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      {" "}
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
      </MapContainer>
    </div>
  );
};

export default MapComponent;
