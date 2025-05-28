import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NoticeSection = () => {
  const [noticeText, setNoticeText] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3000/clinic-status') // Adjust base URL if needed
      .then(response => {
        const notice = response.data.notice || '';
        setNoticeText(notice);
      })
      .catch(error => {
        console.error('Failed to fetch notice:', error);
      });
  }, []);

  if (!noticeText) return null; // don't show if no notice

  return (
    <div className="bg-orange-300 border-b border-white py-2 px-4">
      <marquee behavior="scroll" direction="left" scrollamount="6" className="font-bold text-2xl text-white">
        {noticeText}
      </marquee>
    </div>
  );
};

export default NoticeSection;
