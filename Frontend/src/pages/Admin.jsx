// src/pages/Admin.jsx
import React from 'react';
import Sidebar from '../components/Sidebar';
import { Link } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

const Admin = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">
            <i className="fa-solid fa-arrow-left mr-2"></i> Goto Home
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Link to="/search" className="box bg-green-500 hover:bg-green-600 rounded shadow text-white flex justify-center items-center h-40">
            SEARCH SECTION
          </Link>
          <Link to="/add-patient" className="box bg-yellow-500 hover:bg-yellow-600 rounded shadow text-white flex justify-center items-center h-40">
            ADD PATIENTS SECTION
          </Link>
          <Link to="/read-messages" className="box bg-red-500 hover:bg-red-600 rounded shadow text-white flex justify-center items-center h-40">
            READ MESSAGES
          </Link>
          <Link to="/change-data" className="box bg-gray-600 hover:bg-gray-700 rounded shadow text-white flex justify-center items-center h-40">
            CHANGE DATA
          </Link>
          <Link to="/send-sms" className="box bg-indigo-500 hover:bg-indigo-600 rounded shadow text-white flex justify-center items-center h-40">
            SEND SMS TO PATIENTS
          </Link>
        </div>

        <footer className="mt-12 text-center text-sm text-gray-600">
          © Developed By{' '}
          <a href="https://vedanttathe.netlify.app" className="text-blue-500" target="_blank" rel="noreferrer">
            Vedant Tathe
          </a>
        </footer>
      </div>
    </div>
  );
};

export default Admin;