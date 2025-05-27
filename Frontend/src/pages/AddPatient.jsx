// src/pages/AddPatient.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const AddPatient = () => {
  const [form, setForm] = useState({ Name: '', MobileNo: '', RegNo: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/add-patient', form);
      setMessage(res.data.message);
      setForm({ Name: '', MobileNo: '', RegNo: '' });
    } catch (error) {
      console.error('Add patient failed:', error);
      setMessage('Failed to add patient.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="mb-6">
          <Link to="/admin" className="inline-flex items-center px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">
            <i className="fa-solid fa-arrow-left mr-2"></i> Goto Admin Page
          </Link>
        </div>

        <h2 className="text-2xl font-bold mb-4">Add New Patient</h2>
        {message && <p className="mb-4 text-green-600 font-semibold">{message}</p>}

        <form className="space-y-4 max-w-md" onSubmit={handleSubmit}>
          <input
            name="Name"
            onChange={handleChange}
            value={form.Name}
            placeholder="Name"
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="MobileNo"
            onChange={handleChange}
            value={form.MobileNo}
            placeholder="Mobile Number"
            className="w-full p-2 border rounded"
            required
          />
          <input
            name="RegNo"
            onChange={handleChange}
            value={form.RegNo}
            placeholder="Registration No."
            className="w-full p-2 border rounded"
            required
          />
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500" type="submit">
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPatient;