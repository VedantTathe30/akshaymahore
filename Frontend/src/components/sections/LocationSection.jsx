
import React from 'react';

const LocationSection = () => {
  return (
    <section id="location" className="p-8 bg-white">
      <h2 className="text-3xl font-bold mb-4">Location</h2>
      <p className="mb-4">My clinic location is shown below:</p>
      <iframe
        title="clinic-map"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d465.91732997172466!2d77.75076078294417!3d20.898691141809838!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd6a50b527dd14d%3A0x7ec0286f355242cd!2sMAHORE%20HOMOEO%20CLINIC!5e0!3m2!1sen!2sin!4v1723885388816!5m2!1sen!2sin"
        className="w-full h-96 "
        allowFullScreen=""
        loading="lazy"
      ></iframe>
    </section>
  );
};

export default LocationSection;