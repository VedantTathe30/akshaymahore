import React, { useState, useEffect } from 'react';
import { API_URL } from '../../config/api';
import axiosInstance from '../../config/axios';
import { FaCalendarAlt, FaSpinner } from 'react-icons/fa';

const PatientGallerySection = () => {
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
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading patient gallery...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <p className="text-red-600 text-lg">{error}</p>
            <button 
              onClick={() => fetchPatientGallery()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-primary-600">
          Patient Success Stories
        </h2>
        
        {/* <div className="text-center mb-8">
          <a 
            href="/patient-gallery" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            View Full Patient Gallery
          </a>
        </div> */}
        
        {galleryItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No patient gallery items found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="grid grid-cols-2 gap-4 p-6">
                  <div>
                    <p className="text-sm font-semibold mb-2">Before</p>
                    <img
                      src={getImageUrl(item.beforePhoto)}
                      alt="Before treatment"
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-2">After</p>
                    <img
                      src={getImageUrl(item.afterPhoto)}
                      alt="After treatment"
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{item.patientName}</h3>
                      <p className="text-sm text-gray-500">{formatDate(item.treatmentDate)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PatientGallerySection;