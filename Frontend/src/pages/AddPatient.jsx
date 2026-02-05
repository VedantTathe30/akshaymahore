import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import { toast } from 'react-hot-toast';

const AddPatient = () => {
  const [form, setForm] = useState({ Name: '', MobileNo: '', RegNo: '', Email: '' });
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
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/add-patient`, form);
      setMessage(res.data.message || 'Patient added');
      toast.success(res.data.message || 'Patient added');
      setForm({ Name: '', MobileNo: '', RegNo: '', Email: '' });
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

        <div className="max-w-2xl bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-2">Add New Patient</h2>
          {message && <p className={`mb-4 font-semibold ${message.includes('Failed') ? 'text-red-600' : 'text-green-600'}`}>{message}</p>}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input name="Name" onChange={handleChange} value={form.Name} placeholder="Name" className="w-full p-3 border rounded" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Registration No.</label>
              <input name="RegNo" onChange={handleChange} value={form.RegNo} placeholder="TN113" className="w-full p-3 border rounded" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <input name="MobileNo" onChange={handleChange} value={form.MobileNo} placeholder="Mobile Number" className="w-full p-3 border rounded" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input name="Email" onChange={handleChange} value={form.Email} placeholder="Email" type="email" className="w-full p-3 border rounded" required />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button type="submit" disabled={isLoading} className={`px-6 py-3 rounded text-white ${isLoading ? 'bg-gray-400' : 'bg-orange-600 hover:bg-orange-700'}`}>
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Adding...
                  </div>
                ) : (
                  'Create'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPatient;
