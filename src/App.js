import React, { useState, useRef } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete, DirectionsRenderer } from '@react-google-maps/api';
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
  const [showRoutes, setShowRoutes] = useState(false);
  const [routes, setRoutes] = useState([]);
  const fromAutocompleteRef = useRef(null);
  const toAutocompleteRef = useRef(null);
  const routeColors = ['#4285F4', '#DB4437', '#F4B400'];

  const handleSearch = () => {
    const normalizedFrom = fromCity.split(',')[0].trim();
    const normalizedTo = toCity.split(',')[0].trim();

    fetch(`${process.env.REACT_APP_BACKEND_URL}/search?from_city=${encodeURIComponent(normalizedFrom)}&to_city=${encodeURIComponent(normalizedTo)}`)
      .then(response => response.json())
      .then(data => {
        const formattedCarriers = data.map(carrier => ({
          name: carrier.name,
          trucks: carrier.trucks_per_day
        }));
        setCarriers(formattedCarriers);
      })
      .catch(error => {
        console.error("Error fetching carriers:", error);
        setCarriers([]);
      });


    if (fromCity === "New York" && toCity === "Washington DC") {
      setMapCenter({ lat: 38.8951, lng: -77.0364 });
    } else if (fromCity === "San Francisco" && toCity === "Los Angeles") {
      setMapCenter({ lat: 34.0522, lng: -118.2437 });
    };
    
    if (fromCity && toCity) {      
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: fromCity,
          destination: toCity,
          travelMode: window.google.maps.TravelMode.DRIVING,
          provideRouteAlternatives: true,
        },
        (result, status) => {
          if (status === 'OK') {
            const individualRoutes = result.routes.map((r) => ({
              fullResult: {
                geocoded_waypoints: result.geocoded_waypoints,
                request: result.request,
                routes: [r],
              },
            }));
            setRoutes(individualRoutes);

            setShowRoutes(true);
          } else {
            console.error('Directions request failed:', status);
          }
        }
      );

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
                  className="border border-gray-300 rounded p-2 w-full sm:w-1/3"
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
                  className="border border-gray-300 rounded p-2 w-full sm:w-1/3"
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
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapCenter}
              zoom={7}
              options={{
                zoomControl: true,
                mapTypeControl: true,
                streetViewControl: true,
                fullscreenControl: true
              }}
            >
              {routes.map((route, idx) => (
                <DirectionsRenderer
                  key={idx}
                  directions={route.fullResult}
                  options={{
                    polylineOptions: {
                      strokeColor: routeColors[idx % routeColors.length],
                      strokeOpacity: 0.7,
                      strokeWeight: 5
                    },
                    suppressMarkers: idx !== 0
                  }}
                />
              ))}

            </GoogleMap>


          )}
        </div>


        {showRoutes && (
          <div className="mt-6 bg-white p-4 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-2">Detalles de las rutas:</h2>
            {routes.map((route, idx) => (
              <div key={idx} className="mb-4 p-4 bg-gray-100 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: routeColors[idx % routeColors.length] }}></div>
                  <h3 className="font-semibold text-lg">Ruta #{idx + 1}</h3>
                </div>

                <p><strong>Resumen:</strong> {route.fullResult.routes[0].summary}</p>
                <p><strong>Duración:</strong> {route.fullResult.routes[0].legs[0].duration.text}</p>
                <p><strong>Distancia:</strong> {route.fullResult.routes[0].legs[0].distance.text}</p>

              </div>
            ))}
          </div>
        )}




      </div>
    </LoadScript>
  );
}

export default App;
