// src/pages/Search.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';

const Search = () => {
  const [patients, setPatients] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    axios.get('https://akshaymahore-backend.vercel.app/all-data')
      .then(response => setPatients(response.data))
      .catch(error => console.error('Error fetching patient data:', error));
  }, []);

  const filtered = patients.filter(p =>
    p.Name.includes(query.toUpperCase()) ||
    p.MobileNo.includes(query) ||
    p.RegNo?.includes(query.toUpperCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <Link to="/admin" className="inline-flex items-center px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">
            <i className="fa-solid fa-arrow-left mr-2"></i> Goto Admin Page
          </Link>
        </div>

        <h2 className="text-2xl font-bold mb-4">Search Patients</h2>
        <input
          type="text"
          placeholder="Enter name, reg no or mobile..."
          className="border p-3 rounded w-full"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />

        <div className="mt-6 space-y-4">
          {filtered.map((patient, index) => (
            <div key={index} className="p-4 bg-white rounded shadow">
              <p><strong>Name:</strong> {patient.Name}</p>
              <p><strong>Mobile No:</strong> {patient.MobileNo}</p>
              <p><strong>Reg No:</strong> {patient.RegNo || 'N/A'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
