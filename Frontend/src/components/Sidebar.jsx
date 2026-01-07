import React, { useState, useEffect } from 'react';
import profileimg from '../assets/images/profile-pic.png';
import { FaBars, FaTimes } from 'react-icons/fa';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    // Check for JWT token in localStorage on component mount
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);


  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-75 bg-gradient-to-b p-6 shadow-xl h-screen">
        <div className="flex flex-col items-center">
          <img
            src={profileimg}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-md"
          />
          <h3 className="mt-4 text-xl font-bold">Akshay Mahore</h3>
          <a
            href="/admin"
            className="mt-4 px-4 py-2 bg-gray-800 text-white font-semibold rounded hover:bg-gray-500"
          >
            Admin Page
          </a>
          {isLoggedIn && (
            <a
              href='/logout'
              className="mt-2 px-8 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-500"
            >
              Logout
            </a>
          )}
        </div>
        <nav className="mt-4 space-y-4 font-medium text-center text-lg">
          <a href="/" className="block hover:text-orange-300">Home</a>
          {/* <a href="/patient-gallery" className="block hover:text-orange-300">Patient Gallery</a> */}
          <a href="#hero" className="block hover:text-orange-300">Introduction</a>
          <a href="#about" className="block hover:text-orange-300">About</a>
          <a href="#education" className="block hover:text-orange-300">Education</a>
          <a href="#location" className="block hover:text-orange-300">Location</a>
          <a href="#contact" className="block hover:text-orange-300">Contact Me</a>
        </nav>
        <footer className="mt-auto text-center text-lg text-gray-900 ">
          © Developed by{' '}
          <a href="https://vedanttathe.netlify.app" className="text-orange-500 text-lg">
            Vedant Tathe
          </a>
        </footer>
      </aside>

      {/* Mobile Menu Icon */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMenu}
          className="text-white text-2xl bg-orange-500 p-2 rounded shadow-md"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 w-64 h-screen bg-gradient-to-b bg-white p-6 shadow-xl transform transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col items-center">
          <img
            src={profileimg}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover ring-2 ring-white shadow-md"
          />
          <h3 className="mt-4 text-lg font-bold">Akshay Mahore</h3>
          <a
            href="/admin"
            className="mt-4 px-4 py-2 bg-gray-800 text-white text-sm font-semibold rounded hover:bg-gray-600"
          >
            Admin Page
          </a>
          {isLoggedIn && (
            <a href="/logout"              
              className="mt-2 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded hover:bg-red-500"
            >
              Logout
            </a>
          )}
        </div>
        <nav className="mt-4 space-y-3 font-medium text-center text-lg">
          <a href="/" onClick={toggleMenu} className="block hover:text-orange-300">
            Home
          </a>
          {/* <a href="/patient-gallery" onClick={toggleMenu} className="block hover:text-orange-300">
            Patient Gallery
          </a> */}
          <a href="#hero" onClick={toggleMenu} className="block hover:text-orange-300">
            Introduction
          </a>
          <a href="#about" onClick={toggleMenu} className="block hover:text-orange-300">
            About
          </a>
          <a href="#education" onClick={toggleMenu} className="block hover:text-orange-300">
            Education
          </a>
          <a href="#location" onClick={toggleMenu} className="block hover:text-orange-300">
            Location
          </a>
          <a href="#contact" onClick={toggleMenu} className="block hover:text-orange-300">
            Contact Me
          </a>
        </nav>
        <footer className="mt-10 text-center text-gray-800 text-lg">
          © Developed by{' '}
          <a href="https://vedanttathe.netlify.app" className="text-orange-500">
            Vedant Tathe
          </a>
        </footer>
      </div>
    </>
  );
};

export default Sidebar;
