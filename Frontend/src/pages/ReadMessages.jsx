// src/pages/ReadMessages.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';
import { API_URL } from '../config/api';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import toast, { Toaster } from 'react-hot-toast';

const ReadMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    try {
      await axios.delete(`${API_URL}/delete-message/${id}`);
      setMessages(messages.filter(msg => msg._id !== id));
      toast.success('Message deleted successfully!', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#10B981',
          color: 'white',
        },
      });
    } catch (err) {
      toast.error('Failed to delete message', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: 'white',
        },
      });
    }
  };

  const handleCall = (number) => {
    window.location.href = `tel:${number}`;
  };

  useEffect(() => {
    axios.get(`${API_URL}/read-messages`)
      .then(res => {
        // Sort messages by date, newest first
        const sortedMessages = res.data.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        setMessages(sortedMessages);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load messages.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Toaster />
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
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-grow">
                    <p><strong>Name:</strong> {msg.Name}</p>
                    <div className="flex items-center">
                      <strong>Mobile:</strong>
                      <span className="ml-1">{msg.MobileNo}</span>
                      <button
                        onClick={() => handleCall(msg.MobileNo)}
                        className="ml-2 px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Call
                      </button>
                    </div>
                    {msg.Email && (
                      <div className="flex items-center mt-2">
                        <strong>Email:</strong>
                        <a href={`mailto:${msg.Email}`} className="ml-1 text-blue-600 hover:underline">{msg.Email}</a>
                      </div>
                    )}
                    <p className="mt-2"><strong>Message:</strong> {msg.Message}</p>
                    {msg.createdAt && (
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>
                          {new Date(msg.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                          {' '}at{' '}
                          {new Date(msg.createdAt).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(msg._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReadMessages;
