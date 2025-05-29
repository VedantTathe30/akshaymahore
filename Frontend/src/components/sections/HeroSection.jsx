import React, { useEffect, useState } from 'react';
import landscape_img from '../../assets/images/hero_img_cabin.png';

const HeroSection = () => {
  const [clinicStatus, setClinicStatus] = useState(null);

  const parseTimeToHours = (timeStr) => {
    if (!timeStr) return 0;
    const trimmed = timeStr.trim();
    const [time, modifier] = trimmed.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    return hours + (minutes || 0) / 60;
  };

  useEffect(() => {
    const checkClinicStatus = async () => {
      try {
        const response = await fetch('https://akshaymahore-backend.vercel.app/clinic-status');

        const text = await response.text();

        let data;
        try {
          data = JSON.parse(text);
        } catch (jsonError) {
          console.error('Response is not valid JSON:', text);
          setClinicStatus('ERROR');
          return;
        }

        console.log('Clinic status data:', data);

        // Get current day of week (0=Sunday, 6=Saturday)
        const now = new Date();
        const day = now.getDay();

        // Clinic closed on Saturday and Sunday
        if (day === 0 || day === 6) {
          setClinicStatus('CLOSED');
          return;
        }

        const status = data.clinic_status;
        const updatedDate = new Date(data.date_updated);
        const isRecent = now - updatedDate < 24 * 60 * 60 * 1000;

        if (status && status !== 'NOTSET' && isRecent) {
          setClinicStatus(status);
          return;
        }

        const nowTime = now.getHours() + now.getMinutes() / 60;

        const open1 = parseTimeToHours(data.clinic_opening_time1);
        const close1 = parseTimeToHours(data.clinic_closing_time1);
        const open2 = parseTimeToHours(data.clinic_opening_time2);
        const close2 = parseTimeToHours(data.clinic_closing_time2);

        const isOpen =
          (nowTime >= open1 && nowTime <= close1) ||
          (nowTime >= open2 && nowTime <= close2);

        setClinicStatus(isOpen ? 'OPEN' : 'CLOSED');
      } catch (error) {
        console.error('Failed to fetch clinic status:', error);
        setClinicStatus('ERROR');
      }
    };

    checkClinicStatus();
  }, []);

  return (
    <section
      id="hero"
      className="h-screen bg-cover bg-no-repeat bg-right md:bg-center flex flex-col items-start ps-8 pt-25"
      style={{
        backgroundImage: `linear-gradient(rgba(154,154,154,0.6), rgba(154,154,154,0.6)), url(${landscape_img})`,
      }}
    >
      <h2 className="text-4xl font-bold leading-tight">
        Welcome To <br /> Mahore Homeo Clinic
      </h2>

      <div className="mt-8 text-lg w-full font-bold">
        <p className="break-all">
          <strong>Clinic Timings:</strong> <br />
          Morning: 10 AM – 1 PM |<br /> Evening: 6:30 PM – 9:30 PM
        </p>

        <p className="mt-4">
          <span className="bg-gray-800 text-white rounded px-2 py-2">
            Currently: <span>{clinicStatus || 'Loading...'}</span>
          </span>
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
