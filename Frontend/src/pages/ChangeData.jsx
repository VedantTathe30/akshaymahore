import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import Footer from '../components/sections/Footer';
import axios from 'axios';
import { API_URL } from '../config/api';

const ChangeContentSection = ({ title, description, value, onChange, onSubmit, onReset, loadingSubmit, loadingReset }) => (
  <div className="my-8">
    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
    <p className="text-sm text-gray-500 mt-1">{description}</p>
    <textarea
      rows="4"
      className="w-full mt-4 p-2 border border-gray-300 rounded"
      value={value}
      onChange={onChange}
      placeholder="Enter content..."
    ></textarea>
    <div className="flex flex-col md:flex-row gap-4 mt-4">
      <button
        onClick={onSubmit}
        disabled={loadingSubmit}
        className={`py-2 px-6 rounded w-full md:w-1/2 bg-green-600 text-white hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loadingSubmit ? 'Loading...' : 'SUBMIT'}
      </button>
      <button
        onClick={onReset}
        disabled={loadingReset}
        className={`py-2 px-6 rounded w-full md:w-1/2 bg-gray-600 text-white hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loadingReset ? 'Loading...' : 'RESET'}
      </button>
    </div>
  </div>
);

const ChangeData = () => {
  const [selectedEduIndex, setSelectedEduIndex] = useState(0);
  const [eduNames, setEduNames] = useState(['', '', '', '']);
  const [eduDegrees, setEduDegrees] = useState(['', '', '', '']);
  const [eduDescs, setEduDescs] = useState(['', '', '', '']);
  const [eduYears, setEduYears] = useState(['', '', '', '']);

  const [originalNames, setOriginalNames] = useState([]);
  const [originalDegrees, setOriginalDegrees] = useState([]);
  const [originalDescs, setOriginalDescs] = useState([]);
  const [originalYears, setOriginalYears] = useState([]);

  const [heroHeading, setHeroHeading] = useState('');
  const [clinicTimings, setClinicTimings] = useState('');
  const [aboutData, setAboutData] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMobile, setContactMobile] = useState('');

  // Loading states for each section
  const [loadingHeroSubmit, setLoadingHeroSubmit] = useState(false);
  const [loadingHeroReset, setLoadingHeroReset] = useState(false);

  const [loadingClinicSubmit, setLoadingClinicSubmit] = useState(false);
  const [loadingClinicReset, setLoadingClinicReset] = useState(false);

  const [loadingAboutSubmit, setLoadingAboutSubmit] = useState(false);
  const [loadingAboutReset, setLoadingAboutReset] = useState(false);

  const [loadingContactSubmit, setLoadingContactSubmit] = useState(false);
  const [loadingContactReset, setLoadingContactReset] = useState(false);

  const [loadingEduSubmit, setLoadingEduSubmit] = useState(false);
  const [loadingEduReset, setLoadingEduReset] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/clinic-status`)
      .then(res => {
        const data = res.data;
        if (data) {
          setEduNames(data.edu_data_name || ['', '', '', '']);
          setEduDegrees(data.edu_data_degree || ['', '', '', '']);
          setEduDescs(data.edu_data_desc || ['', '', '', '']);
          setEduYears(data.edu_data_year || ['', '', '', '']);

          // Store originals for reset
          setOriginalNames([...data.edu_data_name]);
          setOriginalDegrees([...data.edu_data_degree]);
          setOriginalDescs([...data.edu_data_desc]);
          setOriginalYears([...data.edu_data_year]);

          setHeroHeading(data.hero_heading);
          setAboutData(data.about_data);
          setContactEmail(data.email);
          setContactMobile(data.mobileno);
          setClinicTimings(data.clinic_timings);
        }
      })
      .catch(err => {
        console.error('Failed to fetch education data:', err);
      });
  }, []);

  // Educational section
  const handleEduChange = (field, value) => {
    const updated = [...(field === 'name' ? eduNames : field === 'degree' ? eduDegrees : field === 'desc' ? eduDescs : eduYears)];
    updated[selectedEduIndex] = value;

    if (field === 'name') setEduNames(updated);
    if (field === 'degree') setEduDegrees(updated);
    if (field === 'desc') setEduDescs(updated);
    if (field === 'year') setEduYears(updated);
  };

  const handleEduSubmit = async () => {
    setLoadingEduSubmit(true);
    const payload = {
      index: selectedEduIndex,
      name: eduNames[selectedEduIndex],
      degree: eduDegrees[selectedEduIndex],
      desc: eduDescs[selectedEduIndex],
      year: eduYears[selectedEduIndex],
    };

    try {
      await axios.post(`${API_URL}/change-edu-data`, payload);
      alert('Education entry updated successfully.');
    } catch (err) {
      console.error('Error updating education:', err);
      alert('Failed to update education entry.');
    } finally {
      setLoadingEduSubmit(false);
    }
  };

  const handleEduReset = async () => {
    setLoadingEduReset(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/reset-edu-data`, { index: selectedEduIndex });

      const updatedNames = [...eduNames];
      const updatedDegrees = [...eduDegrees];
      const updatedDescs = [...eduDescs];
      const updatedYears = [...eduYears];

      updatedNames[selectedEduIndex] = originalNames[selectedEduIndex];
      updatedDegrees[selectedEduIndex] = originalDegrees[selectedEduIndex];
      updatedDescs[selectedEduIndex] = originalDescs[selectedEduIndex];
      updatedYears[selectedEduIndex] = originalYears[selectedEduIndex];

      setEduNames(updatedNames);
      setEduDegrees(updatedDegrees);
      setEduDescs(updatedDescs);
      setEduYears(updatedYears);

      alert(`Education entry ${selectedEduIndex + 1} reset`);
    } catch (error) {
      console.error('Failed to reset education entry:', error);
      alert('Failed to reset education entry');
    } finally {
      setLoadingEduReset(false);
    }
  };

  // Hero heading section
  const handleHeroSubmit = () => {
    setLoadingHeroSubmit(true);
    fetch(`${API_URL}/change-hero-heading`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ heroHeading }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert('Hero heading updated successfully.');
      })
      .catch((error) => {
        console.error('Error updating hero heading:', error);
      })
      .finally(() => {
        setLoadingHeroSubmit(false);
      });
  };

  const handleHeroReset = () => {
    setLoadingHeroReset(true);
    fetch(`${import.meta.env.VITE_API_URL}/reset-hero-heading`, {
      method: 'POST',
    })
      .then((res) => res.json())
      .then((data) => {
        setHeroHeading(heroHeading);
        alert('Hero heading reset successfully.');
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error resetting hero heading:', error);
      })
      .finally(() => {
        setLoadingHeroReset(false);
      });
  };

  // Clinic timings section
  const handleClinicTimingsSubmit = () => {
    setLoadingClinicSubmit(true);
    fetch(`${import.meta.env.VITE_API_URL}/change-clinic-timings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clinicTimings }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert('Clinic timings updated successfully.');
      })
      .catch((error) => {
        console.error('Error updating clinic timings:', error);
      })
      .finally(() => {
        setLoadingClinicSubmit(false);
      });
  };

  const handleClinicTimingsReset = () => {
    setLoadingClinicReset(true);
    fetch(`${import.meta.env.VITE_API_URL}/reset-clinic-timings`, {
      method: 'POST',
    })
      .then((res) => res.json())
      .then((data) => {
        setClinicTimings('');
        alert('Clinic timings reset successfully.');
      })
      .catch((error) => {
        console.error('Error resetting clinic timings:', error);
      })
      .finally(() => {
        setLoadingClinicReset(false);
      });
  };

  // About data section
  const handleAboutDataSubmit = () => {
    setLoadingAboutSubmit(true);
    fetch(`${import.meta.env.VITE_API_URL}/change-about-data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ aboutData }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert('About data updated successfully.');
      })
      .catch((error) => {
        console.error('Error updating about data:', error);
      })
      .finally(() => {
        setLoadingAboutSubmit(false);
      });
  };

  const handleAboutDataReset = () => {
    setLoadingAboutReset(true);
    fetch(`${import.meta.env.VITE_API_URL}/reset-about-data`, {
      method: 'POST',
    })
      .then((res) => res.json())
      .then((data) => {
        setAboutData('');
        alert('About data reset successfully.');
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error resetting about data:', error);
      })
      .finally(() => {
        setLoadingAboutReset(false);
      });
  };

  // Contact data section
  const handleContactSubmit = () => {
    setLoadingContactSubmit(true);
    fetch(`${import.meta.env.VITE_API_URL}/change-contact-data`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contactEmail, contactMobile }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert('Contact data updated successfully.');
      })
      .catch((error) => {
        console.error('Error updating contact data:', error);
      })
      .finally(() => {
        setLoadingContactSubmit(false);
      });
  };

  const handleContactReset = () => {
    setLoadingContactReset(true);
    fetch(`${import.meta.env.VITE_API_URL}/reset-contact-data`, {
      method: 'POST',
    })
      .then((res) => res.json())
      .then((data) => {
        setContactEmail('');
        setContactMobile('');
        alert('Contact data reset successfully.');
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error resetting contact data:', error);
      })
      .finally(() => {
        setLoadingContactReset(false);
      });
  };

  return (
    <>

      <div className="h-screen bg-gray-100 flex flex-col lg:flex-row overflow-hidden">
        <AdminSidebar />
        <main className="flex-1 px-4 py-8 overflow-y-auto">
          <div className="mb-6">
            <Link to="/admin" className="inline-flex items-center px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">
              <i className="fa-solid fa-arrow-left mr-2"></i> Goto Admin Page
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-center mb-10">CHANGE WEBSITE CONTENT</h1>

          {/* Hero heading */}
          <ChangeContentSection
            title="Hero Heading"
            description="Update the hero heading displayed on the website."
            value={heroHeading}
            onChange={(e) => setHeroHeading(e.target.value)}
            onSubmit={handleHeroSubmit}
            onReset={handleHeroReset}
            loadingSubmit={loadingHeroSubmit}
            loadingReset={loadingHeroReset}
          />

          {/* Clinic timings */}
          <ChangeContentSection
            title="Clinic Timings"
            description="Update the clinic's working hours."
            value={clinicTimings}
            onChange={(e) => setClinicTimings(e.target.value)}
            onSubmit={handleClinicTimingsSubmit}
            onReset={handleClinicTimingsReset}
            loadingSubmit={loadingClinicSubmit}
            loadingReset={loadingClinicReset}
          />

          {/* About data */}
          <ChangeContentSection
            title="About Data"
            description="Update the about section on the website."
            value={aboutData}
            onChange={(e) => setAboutData(e.target.value)}
            onSubmit={handleAboutDataSubmit}
            onReset={handleAboutDataReset}
            loadingSubmit={loadingAboutSubmit}
            loadingReset={loadingAboutReset}
          />

          {/* Contact info */}
          <div className="my-8">
            <h2 className="text-xl font-bold text-gray-800">Contact Information</h2>
            <p className="text-sm text-gray-500 mt-1">Update contact email and mobile number.</p>

            <input
              type="email"
              placeholder="Email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full mt-4 p-2 border border-gray-300 rounded"
            />
            <input
              type="text"
              placeholder="Mobile Number"
              value={contactMobile}
              onChange={(e) => setContactMobile(e.target.value)}
              className="w-full mt-4 p-2 border border-gray-300 rounded"
            />

            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <button
                onClick={handleContactSubmit}
                disabled={loadingContactSubmit}
                className="py-2 px-6 rounded w-full md:w-1/2 bg-green-600 text-white hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingContactSubmit ? 'Loading...' : 'SUBMIT'}
              </button>
              <button
                onClick={handleContactReset}
                disabled={loadingContactReset}
                className="py-2 px-6 rounded w-full md:w-1/2 bg-gray-600 text-white hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingContactReset ? 'Loading...' : 'RESET'}
              </button>
            </div>
          </div>

          {/* Education data */}
          <div className="my-8">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Education Data</h2>
            <p className="text-sm text-gray-500 mb-4">Select education entry to edit:</p>
            <div className="flex gap-3 mb-4">
              {[0, 1, 2, 3].map((index) => (
                <button
                  key={index}
                  onClick={() => setSelectedEduIndex(index)}
                  className={`py-2 px-4 rounded ${selectedEduIndex === index ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-700'}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Name"
              value={eduNames[selectedEduIndex]}
              onChange={(e) => handleEduChange('name', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <input
              type="text"
              placeholder="Degree"
              value={eduDegrees[selectedEduIndex]}
              onChange={(e) => handleEduChange('degree', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <textarea
              rows="3"
              placeholder="Description"
              value={eduDescs[selectedEduIndex]}
              onChange={(e) => handleEduChange('desc', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <input
              type="text"
              placeholder="Year"
              value={eduYears[selectedEduIndex]}
              onChange={(e) => handleEduChange('year', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />

            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={handleEduSubmit}
                disabled={loadingEduSubmit}
                className="py-2 px-6 rounded w-full md:w-1/2 bg-green-600 text-white hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingEduSubmit ? 'Loading...' : 'SUBMIT'}
              </button>
              <button
                onClick={handleEduReset}
                disabled={loadingEduReset}
                className="py-2 px-6 rounded w-full md:w-1/2 bg-gray-600 text-white hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingEduReset ? 'Loading...' : 'RESET'}
              </button>
            </div>
          </div>

          <Footer />
        </main>

      </div>

    </>
  );
};

export default ChangeData;
