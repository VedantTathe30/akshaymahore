import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && location.state.registrationSuccess) {
      toast.success('Registration successful');
      // clear location state so toast doesn't show again on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  return (
    <>
    <div className="flex h-screen overflow-hidden bg-gray-100 text-gray-900">
      <Sidebar />
      <MainContent />
    </div>
    </>
  );
};

export default Home;
