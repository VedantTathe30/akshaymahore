import React from 'react';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

const Home = () => {
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
