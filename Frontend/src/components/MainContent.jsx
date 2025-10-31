
import React from 'react';
import HeroSection from './sections/HeroSection';
import AboutSection from './sections/AboutSection';
import EducationSection from './sections/EducationSection';
import LocationSection from './sections/LocationSection';
import ContactSection from './sections/ContactSection';
import NoticeSection from './sections/NoticeSection';
import PatientGallerySection from './sections/PatientGallerySection';
import ClinicGallerySection from './sections/ClinicGallerySection';
import Footer from './sections/Footer';

const MainContent = () => {
  return (
    <main className="flex-1 overflow-y-scroll">
      <NoticeSection />
      <HeroSection />
      <AboutSection />
      <EducationSection />
      <PatientGallerySection />
      <ClinicGallerySection />
      <LocationSection />
      <ContactSection />
      <Footer />
    </main>
  );
};

export default MainContent;

