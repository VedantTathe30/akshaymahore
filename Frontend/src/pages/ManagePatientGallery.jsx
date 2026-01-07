import React, { useState, useEffect } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { API_URL } from "../config/api";
import axios from "axios";

const ManagePatientGallery = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  

  const [patientName, setPatientName] = useState("");
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [caption, setCaption] = useState("");

  const [editingItem, setEditingItem] = useState(null);

  // Fetch patient gallery
  const fetchPatients = async () => {
  try {
    const res = await axios.get(`${API_URL}/patient-gallery`);
    console.log("PATIENT GALLERY RESPONSE 👉", res.data.data);
    setPatients(res.data.data);
  } catch (err) {
    console.error(err);
    alert("Failed to fetch patient gallery");
  }
  };


  useEffect(() => {
    fetchPatients();
  }, []);

  // Upload patient images
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!patientName || !beforeImage || !afterImage) {
      alert("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("patientName", patientName);
    formData.append("beforePhoto", beforeImage);
    formData.append("afterPhoto", afterImage);
    formData.append("caption", caption);

    setLoading(true);
    try {
      await axios.post(`${API_URL}/patient-gallery/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Patient gallery added");
      setPatientName("");
      setBeforeImage(null);
      setAfterImage(null);
      setCaption("");
      fetchPatients();
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry?")) return;

    try {
      await axios.delete(`${API_URL}/patient-gallery/${id}`);
      fetchPatients();
    } catch (err) {
      alert("Delete failed");
    }
  };

  // Update caption
  const updateCaption = async (id, newCaption) => {
    try {
      await axios.put(`${API_URL}/patient-gallery/${id}`, {
        caption: newCaption,
      });
      setEditingItem(null);
      fetchPatients();
    } catch (err) {
      alert("Update failed");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex-1 overflow-auto p-8">
        <h1 className="text-2xl font-bold mb-6">Manage Patient Gallery</h1>

        {/* Upload Form */}
        <form
          onSubmit={handleUpload}
          className="mb-8 p-6 bg-white rounded-lg shadow-md"
        >
          <h2 className="text-xl font-semibold mb-4">
            Add Patient Transformation
          </h2>

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Patient Name"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full p-2 border rounded-md"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setBeforeImage(e.target.files[0])}
              className="w-full p-2 border rounded-md"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAfterImage(e.target.files[0])}
              className="w-full p-2 border rounded-md"
            />

            <input
              type="text"
              placeholder="Caption (optional)"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full p-2 border rounded-md"
            />

            <button
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>

        {/* Grid */}
        {/* Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {patients.map((item) => (
    <div
      key={item._id}
      className="bg-white p-4 rounded-lg shadow-md relative"
    >
      {/* Delete */}
      <button
        onClick={() => handleDelete(item._id)}
        className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full"
      >
        ✕
      </button>

      {/* Patient Name */}
      <h3 className="font-semibold text-lg mb-2">
        {item.patientName}
      </h3>

      {/* Images */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {item.beforePhoto?.filename && (
          <img
            src={`${API_URL}/uploads/patient-gallery/${item.beforePhoto.filename}`}
            className="h-40 w-full object-cover rounded"
            alt="Before"
          />
        )}

        {item.afterPhoto?.filename && (
          <img
            src={`${API_URL}/uploads/patient-gallery/${item.afterPhoto.filename}`}
            className="h-40 w-full object-cover rounded"
            alt="After"
          />
        )}
      </div>

      {/* Caption */}
      {editingItem === item._id ? (
        <input
          defaultValue={item.caption}
          autoFocus
          onBlur={(e) => updateCaption(item._id, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateCaption(item._id, e.target.value);
            }
          }}
          className="w-full p-2 border rounded-md"
        />
      ) : (
        <div className="flex justify-between items-center">
          <p className="text-gray-700">
            {item.caption || "—"}
          </p>
          <button
            onClick={() => setEditingItem(item._id)}
            className="px-3 py-1 bg-blue-500 text-white rounded-md"
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

export default ManagePatientGallery;
