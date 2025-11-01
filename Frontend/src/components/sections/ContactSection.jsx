import React, { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    Name: '',
    MobileNo: '',
    Message: '',
  });

  const [loading, setLoading] = useState(false); // loader state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/send-message`, formData);
      toast.success('Message sent successfully!', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#10B981',
          color: 'white',
          padding: '16px',
          borderRadius: '8px',
        },
        icon: '✉️',
      });
      setFormData({ Name: '', MobileNo: '', Message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.', {
        duration: 3000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: 'white',
          padding: '16px',
          borderRadius: '8px',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="p-8 bg-gradient-to-b from-gray-50 to-white">
      <h2 className="text-3xl font-bold mb-10">Contact Me</h2>
      <div className="max-w-2xl bg-white p-8 rounded-xl">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              name="Name"
              type="text"
              className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Your Name"
              required
              value={formData.Name}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="mobile">
              Mobile Number
            </label>
            <input
              id="mobile"
              name="MobileNo"
              type="tel"
              pattern="[0-9]{10}"
              className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Your Mobile Number (10 digits)"
              required
              value={formData.MobileNo}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              name="Message"
              className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              rows="4"
              placeholder="Your Message"
              required
              value={formData.Message}
              onChange={handleChange}
              disabled={loading}
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-orange-400 text-white font-semibold py-3 rounded-lg hover:bg-orange-300 transition duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Submit'}
          </button>
          <Toaster />
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
