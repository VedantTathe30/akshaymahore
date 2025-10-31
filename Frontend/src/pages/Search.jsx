import React, { useState } from "react";
import axios from "axios";
import AdminSidebar from '../components/AdminSidebar';
import { API_URL } from '../config/api';
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

const Search = () => {
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ Name: "", MobileNo: "", RegNo: "" });

  // 🔍 Search patients
  const handleSearch = async (value) => {
    setQuery(value);
    if (!value.trim()) {
      setPatients([]);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/search?q=${value}`);
      setPatients(res.data);
    } catch (err) {
      console.error("Error searching patients:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✏️ Start editing
  const handleEdit = (patient) => {
    setEditingId(patient._id);
    setEditData({
      Name: patient.Name,
      MobileNo: patient.MobileNo,
      RegNo: patient.RegNo,
    });
  };

  // 💾 Save changes
  const handleSave = async (id) => {
    try {
      await axios.put(`${API_URL}/update-patient/${id}`, editData);
      alert("Patient updated successfully!");
      setEditingId(null);
      handleSearch(query); // 🔁 reload results
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update patient!");
    }
  };

  // ❌ Delete with confirmation
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this patient?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/delete-patient/${id}`);
      alert("Patient deleted successfully!");
      handleSearch(query); // 🔁 refresh list
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete patient!");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <Link
            to="/admin"
            className="inline-flex items-center px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
          >
            <i className="fa-solid fa-arrow-left mr-2"></i> Goto Admin Page
          </Link>
        </div>

        <h2 className="text-2xl font-bold mb-4">Search Patients</h2>

        <input
          type="text"
          placeholder="Enter name, reg no or mobile..."
          className="border p-3 rounded w-full"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
        />

        <div className="mt-6 space-y-4">
          {loading ? (
            <Loader />
          ) : patients.length > 0 ? (
            patients.map((patient) => (
              <div key={patient._id} className="p-4 bg-white rounded shadow">
                {editingId === patient._id ? (
                  <>
                    <input
                      type="text"
                      value={editData.Name}
                      onChange={(e) => setEditData({ ...editData, Name: e.target.value })}
                      className="border p-2 rounded w-full mb-2"
                    />
                    <input
                      type="text"
                      value={editData.MobileNo}
                      onChange={(e) => setEditData({ ...editData, MobileNo: e.target.value })}
                      className="border p-2 rounded w-full mb-2"
                    />
                    <input
                      type="text"
                      value={editData.RegNo}
                      onChange={(e) => setEditData({ ...editData, RegNo: e.target.value })}
                      className="border p-2 rounded w-full mb-2"
                    />
                    <button
                      onClick={() => handleSave(patient._id)}
                      className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-500 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <p><strong>Name:</strong> {patient.Name}</p>
                    <p><strong>Mobile No:</strong> {patient.MobileNo}</p>
                    <p><strong>Reg No:</strong> {patient.RegNo}</p>

                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() => handleEdit(patient)}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(patient._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          ) : (
            query && <p>No matching patients found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
