// src/pages/Admin.jsx
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import axiosInstance from '../config/axios';
import { API_URL } from '../config/api';
import { FaUpload, FaSpinner, FaTimes } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

const Admin = () => {
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    beforePhoto: null,
    afterPhoto: null
  });

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files[0]
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.patientName || !formData.beforePhoto || !formData.afterPhoto) {
      toast.error('Please fill patient name and upload both photos');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('patientName', formData.patientName);
    formDataToSend.append('beforePhoto', formData.beforePhoto);
    formDataToSend.append('afterPhoto', formData.afterPhoto);

    try {
      setUploading(true);
      const response = await axiosInstance.post(`${API_URL}/patient-gallery/upload`, formDataToSend);

      if (response.data.success) {
        toast.success('Patient gallery uploaded successfully');
        setFormData({ patientName: '', beforePhoto: null, afterPhoto: null });
        setShowUploadForm(false);
      } else {
        toast.error('Failed to upload gallery');
      }
    } catch (error) {
      console.error('Error uploading gallery:', error);
      toast.error(error.response?.data?.message || 'Failed to upload gallery');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">
            <i className="fa-solid fa-arrow-left mr-2"></i> Goto Home
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3 font-bold">
          <Link to="/search" className="box bg-green-500 hover:bg-green-600 rounded shadow text-white flex justify-center items-center h-40">
            SEARCH SECTION
          </Link>
          <Link to="/add-patient" className="box bg-yellow-500 hover:bg-yellow-600 rounded shadow text-white flex justify-center items-center h-40">
            ADD PATIENTS SECTION
          </Link>
          <Link to="/read-messages" className="box bg-red-500 hover:bg-red-600 rounded shadow text-white flex justify-center items-center h-40">
            READ MESSAGES
          </Link>
          <Link to="/update-notice" className="box bg-gray-600 hover:bg-gray-700 rounded shadow text-white flex justify-center items-center h-40">
            UPDATE NOTICE/CLINIC STATUS
          </Link>
          <Link to="/change-data" className="box bg-purple-600 hover:bg-purple-700 rounded shadow text-white flex justify-center items-center h-40">
            CHANGE WEBSITE DATA
          </Link>
          <Link to="/clinic-gallery" className="box bg-yellow-500 hover:bg-yellow-600 rounded shadow text-white flex justify-center items-center h-40">
            MANAGE CLINIC GALLERY
          </Link>
          <Link to="/patient-gallery" className="box bg-pink-500 hover:bg-pink-600 rounded shadow text-white flex justify-center items-center h-40">
            MANAGE PATIENT GALLERY
          </Link>
          {/* <button 
            onClick={() => setShowUploadForm(true)}
            className="box bg-blue-500 hover:bg-blue-600 rounded shadow text-white flex justify-center items-center h-40"
          >
            <FaUpload className="mr-2" /> UPLOAD PATIENT GALLERY
          </button> */}
          <Link to="/send-sms" className="box bg-indigo-500 hover:bg-indigo-600 rounded shadow text-white flex justify-center items-center h-40">
            SEND SMS TO PATIENTS
          </Link>
        </div>

        <footer className="mt-12 text-center text-sm text-gray-600">
          Developed By{' '}
          <a href="https://vedanttathe.netlify.app" className="text-blue-500" target="_blank" rel="noreferrer">
            Vedant Tathe
          </a>
        </footer>

        {/* Upload Form Modal */}
        {showUploadForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Upload Patient Gallery</h2>
                  <button
                    onClick={() => setShowUploadForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patient Name *
                    </label>
                    <input
                      type="text"
                      name="patientName"
                      value={formData.patientName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter patient name"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Before Photo *
                      </label>
                      <input
                        type="file"
                        name="beforePhoto"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        After Photo *
                      </label>
                      <input
                        type="file"
                        name="afterPhoto"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={uploading}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      {uploading ? <FaSpinner className="animate-spin" /> : <FaUpload />}
                      {uploading ? 'Uploading...' : 'Upload Gallery'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowUploadForm(false);
                        setFormData({ patientName: '', beforePhoto: null, afterPhoto: null });
                      }}
                      className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Toaster position="top-right" />
    </div>
  );
};

export default Admin;