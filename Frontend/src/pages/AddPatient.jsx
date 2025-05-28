import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

const AddPatient = () => {
  const [form, setForm] = useState({ Name: '', MobileNo: '', RegNo: '' });
  const [message, setMessage] = useState('');
  const [isLoading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await axios.post('https://akshaymahore-backend.vercel.app/add-patient', form);
      setMessage(res.data.message);
      setForm({ Name: '', MobileNo: '', RegNo: '' });
    } catch (error) {
      console.error('Add patient failed:', error);
      setMessage('Failed to add patient.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <div className="mb-6">
          <Link to="/admin" className="inline-flex items-center px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">
            <i className="fa-solid fa-arrow-left mr-2"></i> Goto Admin Page
          </Link>
        </div>

        <h2 className="text-2xl font-bold mb-4">Add New Patient</h2>
        {message && <p className={`mb-4 font-semibold ${message.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}

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

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded text-white flex justify-center items-center ${
              isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Adding...
              </div>
            ) : (
              'Add'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPatient;
