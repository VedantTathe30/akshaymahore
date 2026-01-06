import React, { useState, useEffect } from 'react';
import axiosInstance from '../config/axios';
import { FaUpload, FaTrash, FaEdit, FaEye, FaSpinner, FaPlus, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { API_URL } from '../config/api';
import { useSearchParams } from 'react-router-dom';

const ManagePatientGallery = () => {
  const [searchParams] = useSearchParams();
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(searchParams.get('upload') === 'true');
  const [editingItem, setEditingItem] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    patientName: '',
    beforePhoto: null,
    afterPhoto: null
  });

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}/patient-gallery`);
      
      if (response.data.success) {
        setGalleryItems(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      toast.error('Failed to fetch gallery items');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files[0]
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
      const response = await axiosInstance.post(
        `${API_URL}/patient-gallery/upload`,
        formDataToSend,
        {
          withCredentials: true
        }
      );

      if (response.data.success) {
        toast.success('Patient gallery uploaded successfully');
        resetForm();
        fetchGalleryItems();
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

  const resetForm = () => {
    setFormData({
      patientName: '',
      beforePhoto: null,
      afterPhoto: null
    });
    setEditingItem(null);
    
    // Reset file inputs
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
      input.value = '';
    });
  };

  const toggleActiveStatus = async (id, currentStatus) => {
    try {
      const response = await axiosInstance.patch(
        `${API_URL}/patient-gallery/${id}/toggle-active`,
        {}
      );

      if (response.data.success) {
        toast.success(`Gallery ${currentStatus ? 'deactivated' : 'activated'} successfully`);
        fetchGalleryItems();
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('Failed to update status');
    }
  };

  const deleteGalleryItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this gallery item? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await axiosInstance.delete(
        `${API_URL}/patient-gallery/${id}`
      );

      if (response.data.success) {
        toast.success('Gallery item deleted successfully');
        fetchGalleryItems();
      }
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      toast.error('Failed to delete gallery item');
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
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Patient Gallery</h1>
        <button
          onClick={() => setShowUploadForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <FaPlus /> Quick Upload
        </button>
      </div>

      {/* Upload Form Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Upload Patient Gallery</h2>
                <button
                  onClick={() => {
                    setShowUploadForm(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
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
                      key="beforePhoto"
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
                      key="afterPhoto"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      // Clear file inputs first
                      const fileInputs = document.querySelectorAll('input[type="file"]');
                      fileInputs.forEach(input => {
                        input.value = '';
                      });
                      resetForm();
                    }}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                  >
                    Clear Files
                  </button>
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
                      resetForm();
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

      {/* Gallery Items List */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        {galleryItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No gallery items found. Upload your first patient gallery!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Photos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Treatment Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {galleryItems.map((item) => (
                  <tr key={item._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.patientName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <img
                          src={getImageUrl(item.beforePhoto)}
                          alt="Before"
                          className="h-12 w-12 object-cover rounded"
                        />
                        <img
                          src={getImageUrl(item.afterPhoto)}
                          alt="After"
                          className="h-12 w-12 object-cover rounded"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(item.treatmentDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleActiveStatus(item._id, item.isActive)}
                        className={`flex items-center gap-1 ${item.isActive ? 'text-green-600' : 'text-gray-400'}`}
                      >
                        {item.isActive ? <FaToggleOn /> : <FaToggleOff />}
                        <span className="text-sm">{item.isActive ? 'Active' : 'Inactive'}</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => window.open(getImageUrl(item.beforePhoto), '_blank')}
                          className="text-blue-600 hover:text-blue-900"
                          title="View photos"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => deleteGalleryItem(item._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagePatientGallery;
