// src/pages/ReadMessages.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';
import { API_URL } from '../config/api';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';

const ReadMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${API_URL}/read-messages`)
      .then(res => {
        setMessages(res.data); // assume array of { name, email, message, date }
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load messages.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mb-6">
          <Link to="/admin" className="inline-flex items-center px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">
            <i className="fa-solid fa-arrow-left mr-2"></i> Goto Admin Page
          </Link>
        </div>

        <h2 className="text-2xl font-bold mb-4">Inbox</h2>

        {loading && <p>Loading messages... <Loader /></p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && messages.length === 0 && (
          <p>No messages found.</p>
        )}

        {!loading && !error && messages.length > 0 && (
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className="p-4 bg-white rounded shadow">
                <p><strong>Name:</strong> {msg.Name}</p>
                <p><strong>Email:</strong> {msg.Email}</p>
                <p><strong>Message:</strong> {msg.Message}</p>
                {msg.createdAt && <p className="text-sm text-gray-500">Received: {new Date(msg.createdAt).toLocaleString()}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadMessages;
