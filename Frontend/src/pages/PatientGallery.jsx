import React, { useState, useEffect } from 'react';
import { API_URL } from '../config/api';
import axiosInstance from '../config/axios';
import { FaCalendarAlt, FaSpinner } from 'react-icons/fa';

const PatientGallery = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPatientGallery();
  }, []);

  const fetchPatientGallery = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`${API_URL}/patient-gallery/public`);
      
      if (response.data.success) {
        setGalleryItems(response.data.data);
      } else {
        setError('Failed to load patient gallery');
      }
    } catch (err) {
      console.error('Error fetching patient gallery:', err);
      setError('Error loading patient gallery');
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (photo) => {
    return `${API_URL}/uploads/patient-gallery/${photo.filename}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading patient gallery...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-600 text-lg">{error}</p>
        <button 
          onClick={() => fetchPatientGallery()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Patient Gallery</h1>
      
      {galleryItems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No patient gallery items found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item) => (
            <div
              key={item._id}
              className="bg-white p-4 rounded-lg shadow-md relative"
            >
              <div className="grid grid-cols-2 gap-2 mb-4">
                <img
                  src={getImageUrl(item.beforePhoto)}
                  alt="Before treatment"
                  className="w-full h-48 object-cover rounded-md"
                />
                <img
                  src={getImageUrl(item.afterPhoto)}
                  alt="After treatment"
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">{item.patientName}</h3>
                  <span className="text-sm text-gray-500">{formatDate(item.treatmentDate)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientGallery;
