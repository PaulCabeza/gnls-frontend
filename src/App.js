import React, { useState, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';
import './App.css';

const libraries = ['places'];
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
  const [mapEmbedUrl, setMapEmbedUrl] = useState('');
  const [showRoutes, setShowRoutes] = useState(false);
  const fromAutocompleteRef = useRef(null);
  const toAutocompleteRef = useRef(null);

  const handleSearch = () => {
    const mockData = {
      "New York": {
        "Washington DC": [
          { name: "Knight-Swift Transport Services", trucks: 10 },
          { name: "J.B. Hunt Transport Services Inc", trucks: 7 },
          { name: "YRC Worldwide", trucks: 5 }
        ]
      },
      "San Francisco, CA, USA": {
        "Los Angeles, CA, USA": [
          { name: "XPO Logistics", trucks: 9 },
          { name: "Schneider", trucks: 6 },
          { name: "Landstar Systems", trucks: 2 }
        ]
      }
    };

    const results = mockData[fromCity]?.[toCity] || [];
    setCarriers(results);

    if (fromCity === "New York" && toCity === "Washington DC") {
      setMapCenter({ lat: 38.8951, lng: -77.0364 });
    } else if (fromCity === "San Francisco" && toCity === "Los Angeles") {
      setMapCenter({ lat: 34.0522, lng: -118.2437 });
    };

    const embedKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    if (fromCity && toCity) {
      const url = `https://www.google.com/maps/embed/v1/directions?key=${embedKey}&origin=${encodeURIComponent(fromCity)}&destination=${encodeURIComponent(toCity)}`;
      setMapEmbedUrl(url);
      setShowRoutes(true);
    }


  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY} libraries={libraries}>
      <div className="p-6 bg-gray-100 min-h-screen">
        <section className="bg-white dark:bg-gray-900">
          <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
            <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
              Genlogs User Portal
            </h1>
            <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
              Here at Genlogs, we focus on connecting you with the best carriers for your logistics needs.
            </p>
            <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
              <Autocomplete
                onLoad={(autocomplete) => (fromAutocompleteRef.current = autocomplete)}
                onPlaceChanged={() => {
                  const place = fromAutocompleteRef.current.getPlace();
                  if (place?.formatted_address) {
                    setFromCity(place.formatted_address);
                  }
                }}
              >
                <input
                  type="text"
                  placeholder="From (City)"
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  className="border border-gray-300 rounded p-2 w-full sm:w-1/4"
                />
              </Autocomplete>

              <Autocomplete
                onLoad={(autocomplete) => (toAutocompleteRef.current = autocomplete)}
                onPlaceChanged={() => {
                  const place = toAutocompleteRef.current.getPlace();
                  if (place?.formatted_address) {
                    setToCity(place.formatted_address);
                  }
                }}
              >
                <input
                  type="text"
                  placeholder="To (City)"
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  className="border border-gray-300 rounded p-2 w-full sm:w-1/4"
                />
              </Autocomplete>

              <button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded w-1/4">
                Search
              </button>
            </div>
          </div>
        </section>

        <div className="mt-6 bg-white p-4 rounded shadow-md">
          <h2 className="text-xl font-semibold">Carriers:</h2>
          <ul className="list-disc pl-5">
            {carriers.map((carrier, index) => (
              <li key={index} className="mb-2">
                {carrier.name} ({carrier.trucks} Trucks/Day)
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 bg-white p-4 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">Map:</h2>
          {!showRoutes ? (
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapCenter}
              zoom={10}
            >
              <Marker position={mapCenter} />
            </GoogleMap>
          ) : (
            <iframe
              title="routes"
              src={mapEmbedUrl}
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded"
            ></iframe>
          )}
        </div>

      </div>
    </LoadScript>
  );
}

export default App;
