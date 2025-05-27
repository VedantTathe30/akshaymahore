import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('https://akshaymahore-backend.vercel.app/login', {
        email: form.email,
        password: form.password,
      });

      if (response.status === 200) {
        login();           // update auth context
        navigate('/admin'); // redirect after login success
      }
      else {

        setError(response.data.message);
      }
    } catch (err) {
      console.log("Error:- ", err);
      setError(err.response.data.message || 'Login failed');
    }
  };

  return (
    <>
      <div className="w-sceen">

        <div className="flex h-screen w-screen overflow-hidden bg-gray-100 text-gray-900">
          <Sidebar />
          <div className="h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-200 to-blue-200 px-4 w-screen">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
              <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-2 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block font-medium">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-2 rounded"
                    required
                  />
                </div>
                {error && <p className="text-red-600">{error}</p>}
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-500"
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>

  );
};

export default Login;
