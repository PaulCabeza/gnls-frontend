import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import './App.css';

const mapContainerStyle = {
  height: "400px",
  width: "100%"
};

const center = {
  lat: 37.7749, // Coordenadas de San Francisco
  lng: -122.4194
};

function App() {
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [carriers, setCarriers] = useState([]);
  const [mapCenter, setMapCenter] = useState(center);

  const handleSearch = () => {
    // Simulación de datos
    const mockData = {
      "New York": {
        "Washington DC": [
          { name: "Knight-Swift Transport Services", trucks: 10 },
          { name: "J.B. Hunt Transport Services Inc", trucks: 7 },
          { name: "YRC Worldwide", trucks: 5 }
        ]
      },
      "San Francisco": {
        "Los Angeles": [
          { name: "XPO Logistics", trucks: 9 },
          { name: "Schneider", trucks: 6 },
          { name: "Landstar Systems", trucks: 2 }
        ]
      }
    };

    const results = mockData[fromCity]?.[toCity] || [];
    setCarriers(results);

    // Change the map location according to selected toCity
    if (fromCity === "New York" && toCity === "Washington DC") {
      setMapCenter({ lat: 38.8951, lng: -77.0364 }); // Load Washington DC on the map
    } else if (fromCity === "San Francisco" && toCity === "Los Angeles") {
      setMapCenter({ lat: 34.0522, lng: -118.2437 }); // Load Los Ángeles on the map
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Genlogs User Portal</h1>
      <input
        type="text"
        placeholder="From (City)"
        value={fromCity}
        onChange={(e) => setFromCity(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <input
        type="text"
        placeholder="To (City)"
        value={toCity}
        onChange={(e) => setToCity(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <button onClick={handleSearch} className="bg-blue-500 text-white p-2 rounded">Search</button>
      <div className="mt-4">
        <h2 className="text-xl">Carriers:</h2>
        <ul>
          {carriers.map((carrier, index) => (
            <li key={index}>
              {carrier.name} ({carrier.trucks} Trucks/Day)
            </li>
          ))}
        </ul>
      </div>
      <LoadScript googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={8}
        >
          <Marker position={mapCenter} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
}

export default App;
