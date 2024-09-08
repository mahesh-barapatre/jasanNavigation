import React, { useEffect, useState } from "react";
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
import { getUserLocation } from "../utils/geolocation";

// Define the coordinates of the corners of the map
// const latTopLeft = 23.19063;
// const lngTopLeft = 79.98589;
// const latBottomLeft = 23.190617;
// const lngBottomLeft = 79.986102;
// const latTopRight = 23.19077;
// const lngTopRight = 79.98588;
// const latBottomRight = 23.190791;
// const lngBottomRight = 79.986106;

// const mapLatLngToCustomMap = (lat, lng) => {
//   // Latitude range (vertical distance on the map)
//   const latRange = latTopLeft - latBottomLeft;
//   // Longitude range (horizontal distance on the map)
//   const lngRange = lngTopRight - lngTopLeft;

//   // Prevent division by zero or invalid ranges
//   if (latRange === 0 || lngRange === 0) {
//     console.error(
//       "Invalid latitude or longitude range. Please check the map corner coordinates."
//     );
//     return { x: 0, y: 0 };
//   }

//   // Calculate the y (vertical) position based on latitude
//   const y = ((latTopLeft - lat) / latRange) * 500;

//   // Calculate the x (horizontal) position based on longitude
//   const x = ((lng - lngTopLeft) / lngRange) * 600;

//   // Return the computed x, y coordinates in pixel space
//   return { x, y };
// };

//place dropdown

function findGridCell(x, y) {
  // Define the boundaries
  const xMin = 23.19061;
  const xMax = 23.19079;
  const yMin = 79.861;
  const yMax = 79.98589;

  // Define grid dimensions
  const gridWidth = 600; // number of columns
  const gridHeight = 500; // number of rows

  // Calculate cell width and height
  const cellWidth = (xMax - xMin) / gridWidth;
  const cellHeight = (yMax - yMin) / gridHeight;

  // Calculate the column and row of the point
  const col = Math.floor((x - xMin) / cellWidth);
  const row = Math.floor((y - yMin) / cellHeight); // Note: y decreases as we go up
  console.log(col, row);

  // Ensure the point lies within the grid
  // if (col < 0 || col >= gridWidth || row < 0 || row >= gridHeight) {
  //   return "Point is outside the grid.";
  // }

  console.log("e3");
  return { row: row + 1, col: col + 1 }; // Return 1-based indexing for rows and columns
}

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

// Block all the grid cells from [0, 600] to [500, 600] - a wall
for (let x = 55; x <= 499; x++) {
  grid.setWalkableAt(x, 75, false); // Set grid cells as non-walkable (obstacle)
}
for (let y = 75; y <= 305; y++) {
  grid.setWalkableAt(71, y, false); // Set grid cells as non-walkable (obstacle)
}
for (let y = 375; y <= 599; y++) {
  grid.setWalkableAt(71, y, false); // Set grid cells as non-walkable (obstacle)
}
for (let y = 160; y <= 505; y++) {
  grid.setWalkableAt(390, y, false); // Set grid cells as non-walkable (obstacle)
}

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
  iconSize: [41, 50],
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
const live = new L.Icon({
  iconUrl: "../../public/navigation.png",
  iconSize: [25, 41],
  iconAnchor: [12.5, 41],
});

const MapComponent = () => {
  const [path, setPath] = useState([]);
  const [userPosition, setUserPosition] = useState([0, 0]);

  const updateLocation = (lat, lng) => {
    console.log("e2");
    const { row, col } = findGridCell(lat, lng);
    console.log(row, col);
    setUserPosition([col, row]);
  };

  // useEffect(() => {
  //   const watchId = navigator.geolocation.watchPosition(
  //     (position) => {
  //       const { latitude, longitude } = position.coords;
  //       console.log(latitude, longitude);
  //       updateLocation(latitude, longitude);
  //       // updateLocation(23.1907, 79.98598);
  //       // updateLocation(23.190696455717163, 79.98604323017034);
  //     },
  //     (error) => console.error("Error watching location:", error)
  //   );
  //   return () => {
  //     navigator.geolocation.clearWatch(watchId);
  //   };
  // }, []);

  //real time live location
  // let lastPosition = null;

  // const distanceBetween = (lat1, lon1, lat2, lon2) => {
  //   const toRad = (value) => (value * Math.PI) / 180;
  //   const R = 6371e3; // Earth radius in meters
  //   const φ1 = toRad(lat1);
  //   const φ2 = toRad(lat2);
  //   const Δφ = toRad(lat2 - lat1);
  //   const Δλ = toRad(lon2 - lon1);

  //   const a =
  //     Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
  //     Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  //   return R * c; // Distance in meters
  // };

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log(latitude, longitude);
        // if (lastPosition) {
        //   const distance = distanceBetween(
        //     lastPosition.latitude,
        //     lastPosition.longitude,
        //     latitude,
        //     longitude
        //   );

        // Only update if the distance moved is greater than 10 meters
        //   if (distance > 10) {
        //     // console.log("User moved:", distance, "meters");
        //     updateLocation(latitude, longitude);
        //     lastPosition = { latitude, longitude };
        //   }
        // } else {
        // First time setting the position
        // lastPosition = { latitude, longitude };
        updateLocation(latitude, longitude);
        //   }
      },
      (error) => console.error("Error watching location:", error),
      {
        enableHighAccuracy: true,
        maximumAge: 2000,
        timeout: 5000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

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
  const findRoute = (endPlace) => {
    //for seat-1
    for (let y = 90; y <= 580; y++) {
      grid.setWalkableAt(290, y, false); // Set grid cells as non-walkable (obstacle)
    }
    for (let y = 90; y <= 580; y++) {
      grid.setWalkableAt(355, y, false); // Set grid cells as non-walkable (obstacle)
    }
    for (let x = 290; x <= 355; x++) {
      grid.setWalkableAt(x, 90, false); // Set grid cells as non-walkable (obstacle)
    }
    for (let x = 290; x <= 355; x++) {
      grid.setWalkableAt(x, 580, false); // Set grid cells as non-walkable (obstacle)
    }
    //for seat-2
    for (let y = 390; y <= 580; y++) {
      grid.setWalkableAt(275, y, false); // Set grid cells as non-walkable (obstacle)
    }
    for (let y = 390; y <= 580; y++) {
      grid.setWalkableAt(110, y, false); // Set grid cells as non-walkable (obstacle)
    }
    for (let x = 110; x <= 275; x++) {
      grid.setWalkableAt(x, 390, false); // Set grid cells as non-walkable (obstacle)
    }
    for (let x = 110; x <= 275; x++) {
      grid.setWalkableAt(x, 580, false); // Set grid cells as non-walkable (obstacle)
    }
    //for seat-3
    for (let y = 87; y <= 285; y++) {
      grid.setWalkableAt(275, y, false); // Set grid cells as non-walkable (obstacle)
    }
    for (let y = 87; y <= 285; y++) {
      grid.setWalkableAt(105, y, false); // Set grid cells as non-walkable (obstacle)
    }
    for (let x = 105; x <= 275; x++) {
      grid.setWalkableAt(x, 87, false); // Set grid cells as non-walkable (obstacle)
    }
    for (let x = 105; x <= 275; x++) {
      grid.setWalkableAt(x, 285, false); // Set grid cells as non-walkable (obstacle)
    }

    if (endPlace === "seats1") {
      //for seat-1
      for (let y = 90; y <= 580; y++) {
        grid.setWalkableAt(290, y, true); // Set grid cells as non-walkable (obstacle)
      }
      for (let y = 90; y <= 580; y++) {
        grid.setWalkableAt(355, y, true); // Set grid cells as non-walkable (obstacle)
      }
      for (let x = 290; x <= 355; x++) {
        grid.setWalkableAt(x, 90, true); // Set grid cells as non-walkable (obstacle)
      }
      for (let x = 290; x <= 355; x++) {
        grid.setWalkableAt(x, 580, true); // Set grid cells as non-walkable (obstacle)
      }
    }
    if (endPlace === "seats2") {
      //for seat-2
      for (let y = 390; y <= 580; y++) {
        grid.setWalkableAt(275, y, true); // Set grid cells as non-walkable (obstacle)
      }
      for (let y = 390; y <= 580; y++) {
        grid.setWalkableAt(110, y, true); // Set grid cells as non-walkable (obstacle)
      }
      for (let x = 110; x <= 275; x++) {
        grid.setWalkableAt(x, 390, true); // Set grid cells as non-walkable (obstacle)
      }
      for (let x = 110; x <= 275; x++) {
        grid.setWalkableAt(x, 580, true); // Set grid cells as non-walkable (obstacle)
      }
    }
    if (endPlace === "seats3") {
      //for seat-3
      for (let y = 87; y <= 285; y++) {
        grid.setWalkableAt(275, y, true); // Set grid cells as non-walkable (obstacle)
      }
      for (let y = 87; y <= 285; y++) {
        grid.setWalkableAt(105, y, true); // Set grid cells as non-walkable (obstacle)
      }
      for (let x = 105; x <= 275; x++) {
        grid.setWalkableAt(x, 87, true); // Set grid cells as non-walkable (obstacle)
      }
      for (let x = 105; x <= 275; x++) {
        grid.setWalkableAt(x, 285, true); // Set grid cells as non-walkable (obstacle)
      }
    }
    // const start = places[startPlace];
    const end = places[endPlace];

    const path = finder.findPath(
      userPosition[0],
      userPosition[1],
      end[0],
      end[1],
      grid.clone()
    );
    setPath(path);
  };

  const [destination, setDestination] = useState("");

  const handleRoute = () => {
    if (userPosition && destination) {
      findRoute(destination);
    } else {
      alert("Please select both userPosition and destination.");
    }
  };

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      {" "}
      {/* input form */}
      <div className="p-1 flex justify-center items-center">
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

        <Marker position={userPosition} icon={live}>
          <Popup>Your Location</Popup>
        </Marker>

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
