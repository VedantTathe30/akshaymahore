// components/sections/EducationSection.jsx
import React from 'react';

const EducationSection = () => {
  const education = [
    {
      degree: "MD in Homeopathy",
      years: "2012–2014",
      institution: "Dakshin Kesri Muni Mishrilalji Homoeopathic Medical College, Aurangabad"
    },
    {
      degree: "BHMS",
      institution: "Panchsheel Homoeopathic Medical College, Khamgaon"
    },
    {
      degree: "Higher Secondary",
      institution: "R. K. High School and Junior College, Pulgaon"
    },
    {
      degree: "Primary Education",
      institution: "Pulgaon Cotton Mills Prathamik School, Pulgaon"
    }
  ];

  return (
    <section id="education" className="p-8 bg-gradient-to-b from-white to-gray-100">
      <h2 className="text-3xl font-bold mb-10 text-center">Education</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
        {education.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition duration-300"
          >
            <h3 className="text-lg font-semibold">
              {item.degree} {item.years && <span className="text-sm text-gray-500">({item.years})</span>}
            </h3>
            <p className="mt-2 text-gray-600">{item.institution}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EducationSection;
