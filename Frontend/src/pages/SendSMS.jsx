
import React from 'react';

const SendSMS = () => {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Send SMS to Patients (COMMING SOON...!)</h2>
      <form className="space-y-4 max-w-xl">
        <textarea className="w-full p-3 border rounded" rows="5" placeholder="Your message..."></textarea>
        <button className="bg-green-600 text-white px-6 py-2 rounded">Send</button>
      </form>
    </div>
  );
};

export default SendSMS;
