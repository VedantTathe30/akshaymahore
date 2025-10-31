import React, { useEffect, useState } from 'react';

const fallbackEducation = [
  {
    degree: "MD in Homeopathy",
    years: "2012–2014",
    institution: "Dakshin Kesri Muni Mishrilalji Homoeopathic Medical College, Aurangabad",
    desc: ""
  },
  {
    degree: "BHMS",
    years: "",
    institution: "Panchsheel Homoeopathic Medical College, Khamgaon",
    desc: ""
  },
  {
    degree: "Higher Secondary",
    years: "",
    institution: "R. K. High School and Junior College, Pulgaon",
    desc: ""
  },
  {
    degree: "Primary Education",
    years: "",
    institution: "Pulgaon Cotton Mills Prathamik School, Pulgaon",
    desc: ""
  }
];

const EducationSection = () => {
  const [education, setEducation] = useState(fallbackEducation);

  useEffect(() => {
    const fetchEducationData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/clinic-status`);
        const data = await response.json();
        console.log(data);

        if (
          data.edu_data_degree?.length &&
          data.edu_data_name?.length &&
          data.edu_data_desc?.length &&
          data.edu_data_year?.length
        ) {
          const dynamicEducation = data.edu_data_degree.map((degree, i) => ({
            degree: degree || '',
            desc: data.edu_data_desc[i] || '',
            institution: data.edu_data_name[i] || '',
            years: data.edu_data_year[i] || ''
          }));
          setEducation(dynamicEducation);
        }
      } catch (error) {
        console.error('Failed to fetch education data:', error);
        // fallbackEducation already set
      }
    };

    fetchEducationData();
  }, []);

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
              {item.degree} {item.years && <span className="text-sm text-gray-500">{item.years}</span>}
            </h3>
            <p className="mt-2 text-gray-600">{item.institution}</p>
            {item.desc && (
              <p
                className="mt-2 text-gray-500 italic text-sm"
                dangerouslySetInnerHTML={{ __html: item.desc }}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default EducationSection;
