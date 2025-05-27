import React, { useState } from 'react';
import axios from 'axios';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Message: '',
  });

  const [status, setStatus] = useState(''); // for success/error messages

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    try {
      await axios.post('http://localhost:3000/send-message', formData);
      setStatus('Message sent successfully!');
      setFormData({ Name: '', Email: '', Message: '' });
    } catch (error) {
      setStatus('Failed to send message. Please try again.');
    }
  };

  return (
    <section id="contact" className="p-8 bg-gradient-to-b from-gray-50 to-white">
      <h2 className="text-3xl font-bold mb-10 ">Contact Me</h2>
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
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="Email"
              type="email"
              className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Your Email"
              required
              value={formData.Email}
              onChange={handleChange}
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
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-orange-400 text-white font-semibold py-3 rounded-lg hover:bg-orange-300 transition duration-300"
          >
            Submit
          </button>
          {status && (
            <p className={`mt-4 text-center ${status.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
              {status}
            </p>
          )}
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
