
import React from 'react';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import EducationSection from './sections/EducationSection';
import LocationSection from './sections/LocationSection';
import ContactSection from './sections/ContactSection';
import Footer from './sections/Footer';

const MainContent = () => {
  return (
    <main className="flex-1 overflow-y-scroll">
      <HeroSection />
      <AboutSection />
      <EducationSection />
      <LocationSection />
      <ContactSection />
      <Footer />
    </main>
  );
};

export default MainContent;

