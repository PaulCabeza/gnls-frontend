import React, { useState } from 'react';
import './App.css';

function App() {
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [carriers, setCarriers] = useState([]);

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
    </div>
  );
}

export default App;
