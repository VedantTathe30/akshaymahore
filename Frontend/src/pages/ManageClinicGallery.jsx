import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { API_URL } from "../config/api";
import axios from "axios";

const ManageClinicGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [editingImage, setEditingImage] = useState(null);

  // Fetch all clinic images
  const fetchImages = async () => {
    try {
      const response = await axios.get(`${API_URL}/gallery`);
      setImages(response.data);
    } catch (error) {
      console.error("Error fetching images:", error);
      alert("Failed to fetch images");
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Handle image upload
  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("caption", caption);

    setLoading(true);
    try {
      await axios.post(`${API_URL}/gallery`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Image uploaded successfully");
      setSelectedImage(null);
      setCaption("");
      fetchImages();
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  // Handle image deletion
  const handleDelete = async (imageId) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      await axios.delete(`${API_URL}/gallery/${imageId}`);
      alert("Image deleted successfully");
      fetchImages();
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Failed to delete image");
    }
  };

  // Handle caption update
  const handleUpdateCaption = async (imageId, newCaption) => {
    try {
      await axios.put(`${API_URL}/gallery/${imageId}`, { caption: newCaption });
      alert("Caption updated successfully");
      setEditingImage(null);
      fetchImages();
    } catch (error) {
      console.error("Error updating caption:", error);
      alert("Failed to update caption");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 overflow-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Manage Clinic Gallery</h1>

        {/* Upload Form */}
        <form
          onSubmit={handleImageUpload}
          className="mb-8 p-6 bg-white rounded-lg shadow-md"
        >
          <h2 className="text-xl font-semibold mb-4">Upload New Image</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedImage(e.target.files[0])}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Caption
              </label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full p-2 border rounded-md"
                placeholder="Enter image caption"
              />
            </div>
            <button
              type="submit"
              disabled={!selectedImage || loading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {loading ? "Uploading..." : "Upload Image"}
            </button>
          </div>
        </form>

        {/* Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div
              key={image._id}
              className="bg-white p-4 rounded-lg shadow-md relative"
            >
              <img
                src={`${API_URL}${image.imageUrl}`}
                alt={image.caption}
                className="w-full h-48 object-cover rounded-md mb-4"
              />

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(image._id)}
                className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {/* Caption / Edit Mode */}
              {editingImage === image._id ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    defaultValue={image.caption}
                    className="flex-1 p-2 border rounded-md"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUpdateCaption(image._id, e.target.value);
                      }
                    }}
                    onBlur={(e) =>
                      handleUpdateCaption(image._id, e.target.value)
                    }
                  />
                  <button
                    onClick={() => setEditingImage(null)}
                    className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <p className="text-gray-700">{image.caption}</p>
                  <button
                    onClick={() => setEditingImage(image._id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageClinicGallery;
