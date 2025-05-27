
import React from 'react';
import landscape_img from '../../assets/images/hero_img_cabin.png';

const HeroSection = () => {
  return (
    <section
  id="hero"
  className="h-screen bg-cover bg-no-repeat bg-right md:bg-center flex flex-col items-start ps-8 pt-20"
  style={{
    backgroundImage: `linear-gradient(rgba(154,154,154,0.6), rgba(154,154,154,0.6)), url(${landscape_img})`,
  }}
>

      <h2 className="text-4xl font-bold leading-tight">
        Welcome To <br /> Mahore Homeo Clinic
      </h2>
      <a
        href="#location"
        className="mt-6 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
      >
        Address <i className="fa-solid fa-location-dot ml-2"></i>
      </a>
      <div className="mt-8 text-lg w-100 font-bold">
        <p className='break-all '><strong>Clinic Timings:</strong> <br/>Morning: 10 AM – 1 PM |<br/> Evening: 6:30 PM – 9:30 PM</p>
        <p><br/>Currently: <span className=" bg-gray-800 text-white rounded px-2 py-1">Open</span></p>
      </div>
    </section>
  );
};

export default HeroSection;