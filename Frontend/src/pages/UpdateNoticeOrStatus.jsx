import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import Footer from '../components/sections/Footer';
import Loader from '../components/Loader';

const UpdateNoticeOrStatus = () => {
  const [notice, setNotice] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [clinicStatus, setClinicStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const noticeRes = await axios.get('http://localhost:3000/get-notice');
        const statusRes = await axios.get('http://localhost:3000/clinic-status');
        setNotice(noticeRes.data.notice);
        setClinicStatus(statusRes.data.clinic_status);
      } catch {
        setNotice('');
        setClinicStatus('UNKNOWN');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:3000/update-notice', { notice });
      setStatusMessage(res.data.message);
      setErrorMessage('');
    } catch (err) {
      setStatusMessage('');
      setErrorMessage('Failed to update notice');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:3000/reset-notice');
      setNotice(res.data.notice);
      setStatusMessage(res.data.message);
      setErrorMessage('');
    } catch (err) {
      setStatusMessage('');
      setErrorMessage('Reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  const changeStatus = async (newStatus) => {
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:3000/change-status', { status: newStatus });
      setClinicStatus(newStatus);
      setStatusMessage(res.data.message);
      setErrorMessage('');
    } catch {
      setErrorMessage('Failed to change clinic status');
      setStatusMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col lg:flex-row overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 px-4 py-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <Link to="/admin" className="inline-flex items-center bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600">
            <i className="fa-solid fa-arrow-left mr-2"></i> GO BACK
          </Link>

          <div className="mt-16">
            <span className="block text-lg font-semibold text-gray-700">Notice Section</span>
            <h3 className="text-sm text-gray-500 mt-2">Type important notice in below textbox and submit it</h3>
            {statusMessage && <p className="text-green-600 mt-2">{statusMessage}</p>}
            {errorMessage && <p className="text-red-600 mt-2">{errorMessage}</p>}
            {isLoading && <div className="text-center text-gray-500 mt-2">Loading... <Loader /></div>}

            <form className="mt-4" onSubmit={handleSubmit}>
              <textarea
                name="notice"
                rows="5"
                value={notice}
                onChange={(e) => setNotice(e.target.value)}
                className="w-full p-2 border rounded mb-4"
                placeholder="Enter Message"
                disabled={isLoading}
              />
              <div className="flex flex-col md:flex-row gap-4">
                <button type="submit" disabled={isLoading} className="bg-green-600 text-white py-2 w-full rounded hover:bg-green-500">
                  {isLoading ? 'Submitting...' : 'SUBMIT'}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isLoading}
                  className="bg-gray-500 text-white py-2 w-full rounded hover:bg-gray-400"
                >
                  {isLoading ? 'Resetting...' : 'RESET'}
                </button>
              </div>
            </form>
          </div>

          <div className="mt-16 mb-10">
            <span className="block text-lg font-semibold text-gray-700">Change Clinic Status</span>
            
            {isLoading && <div className="text-center text-gray-500 mt-2">Loading... <Loader /></div>}
            <h3 className="text-sm text-gray-500 mt-2">If you want to change the clinic status then click appropriate button</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <button onClick={() => changeStatus('OPEN')} disabled={isLoading} className="bg-yellow-500 text-white py-2 text-center rounded">OPEN</button>
              <button onClick={() => changeStatus('CLOSED')} disabled={isLoading} className="bg-red-600 text-white py-2 text-center rounded">CLOSED</button>
              <button onClick={() => changeStatus('NOTSET')} disabled={isLoading} className="bg-gray-600 text-white py-2 text-center rounded">RESET</button>
            </div>
            <p className="mt-4 text-sm text-gray-600">NOTE: Clinic status will remain same till next day</p>
            <p className="text-sm">Current Status: <strong className="text-black">{clinicStatus}</strong></p>
          </div>

          <Footer />
        </div>
      </div>
    </div>
  );
};

export default UpdateNoticeOrStatus;