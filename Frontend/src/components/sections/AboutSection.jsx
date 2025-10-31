import React, { useEffect, useState } from 'react';

const fallbackAbout =   
    "I am Dr. Akshay Mahore, a Homeopathy doctor from MyCollege of Medicine. I am passionate about exploring new advancements in homeopathy and amazed by how far we have come! <br/> <br/> I provide homeopathic treatment and holistic health consultations at my clinic. My services focus on natural healing and preventative care."
  


const AboutSection = () => {
  const [aboutData, setAboutData] = useState(fallbackAbout);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/clinic-status`);
        const data = await response.json();

        // Validate if data has needed fields
          setAboutData(data.about_data);
        
      } catch (error) {
        console.error('Failed to fetch about data:', error);
        // fallback used
      }
    };

    fetchAboutData();
  }, []);

  return (
    <section id="about" className="p-8 bg-white">
      <h2 className="text-3xl font-bold mb-4">Who Am I</h2>
      <p className='text-lg' dangerouslySetInnerHTML={{ __html: aboutData }}></p>
    </section>
  );
};

export default AboutSection;
