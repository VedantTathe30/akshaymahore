import React, { useState } from 'react';
import axios from '../config/axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const PublicRegister = () => {
  const [form, setForm] = useState({ Name: '', MobileNo: '', Email: '', RegNo: '' });
  // result state removed; use toasts for user feedback
  const [emailOtpId, setEmailOtpId] = useState(null);
  const [emailOtpCode, setEmailOtpCode] = useState('');
  const [emailVerifiedLocal, setEmailVerifiedLocal] = useState(false);
  const [sendingEmailOtp, setSendingEmailOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [registering, setRegistering] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    // clear field error on change
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const err = {};
    if (!form.Name || form.Name.trim().length < 2) err.Name = 'Enter a valid name (min 2 characters)';
    const mobile = (form.MobileNo || '').replace(/\D/g, '');
    if (!mobile || mobile.length < 10) err.MobileNo = 'Enter a valid 10-digit mobile number';
    const emailRegex = /\S+@\S+\.\S+/;
    if (!form.Email || !emailRegex.test(form.Email)) err.Email = 'Enter a valid email address';
    if (!form.RegNo || form.RegNo.trim().length < 2) err.RegNo = 'Enter a valid registration number';
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setRegistering(true);
    try {
      if (!validateForm()) {
        setRegistering(false);
        return;
      }
      const payload = { ...form };
      if (emailOtpId && emailOtpCode) {
        payload.otpIdEmail = emailOtpId;
        payload.otpCodeEmail = emailOtpCode;
      }

      const res = await axios.post('/api/patients/public/register', payload);
      // Navigate to home and show confirmation toast there
      navigate('/', { state: { registrationSuccess: true } });
    } catch (err) {
      const serverErr = err.response?.data?.error;
      toast.error(serverErr || String(err));
    } finally {
      setRegistering(false);
    }
  };

  

  // No OTP UI on frontend: email/mobile OTP flows removed per backend policy.

  return (
    <div className="min-h-[70vh] flex">
      <Sidebar />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl w-full bg-white rounded-xl shadow-xl p-8">
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h3 className="text-2xl font-extrabold text-gray-900">Patient Registration</h3>
            <p className="mt-2 text-sm text-gray-600">Please provide your details. We will send an email OTP to verify your Email before registration.</p>
          </div>
          <div>
            {/* <span className="inline-block bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-medium">Public</span> */}
          </div>
        </div>

        <form onSubmit={submit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input name="Name" value={form.Name} onChange={handleChange} required className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300" />
            {errors.Name && <p className="text-red-600 text-sm mt-1">{errors.Name}</p>}
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient Registration No.</label>
            <input name="RegNo" placeholder="TN113" value={form.RegNo} onChange={handleChange} required className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300" />
            {errors.RegNo && <p className="text-red-600 text-sm mt-1">{errors.RegNo}</p>}
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
            <input name="MobileNo" value={form.MobileNo} onChange={handleChange} required className="w-full border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300" />
            {errors.MobileNo && <p className="text-red-600 text-sm mt-1">{errors.MobileNo}</p>}
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="flex gap-2">
              <input name="Email" value={form.Email} onChange={handleChange} required className="flex-1 border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300" />
              <button type="button" onClick={async () => {
                if (!form.Email) return toast.error('Enter email first');
                try {
                  setSendingEmailOtp(true);
                  const res = await axios.post('/api/patients/public/send-otp', { via: 'email', to: form.Email });
                  if (res.data && res.data.otpId) {
                    setEmailOtpId(res.data.otpId);
                    toast.success('OTP sent to email');
                  } else if (res.data && res.data.success === false) {
                    toast.error(res.data.error || 'Failed to send OTP');
                  } else {
                    toast.success('OTP send initiated');
                  }
                } catch (err) {
                  toast.error(err.response?.data?.error || String(err));
                } finally {
                  setSendingEmailOtp(false);
                }
              }} disabled={sendingEmailOtp || !!emailOtpId} className="px-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-60 disabled:cursor-not-allowed">{sendingEmailOtp ? 'Sending...' : emailOtpId ? 'Sent' : 'Send OTP'}</button>
            </div>
            {errors.Email && <p className="text-red-600 text-sm mt-1">{errors.Email}</p>}

            {emailOtpId && (
              <div className="mt-3 flex gap-2">
                <input placeholder="Enter email OTP" value={emailOtpCode} onChange={e => setEmailOtpCode(e.target.value)} className="flex-1 border border-gray-200 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300" />
                <button type="button" className="px-3 bg-amber-500 text-white rounded-md hover:bg-amber-600 disabled:opacity-60" disabled={verifyingOtp} onClick={async () => {
                  if (!emailOtpId || !emailOtpCode) return toast.error('Send OTP and enter code');
                  try {
                    setVerifyingOtp(true);
                    const res = await axios.post('/api/patients/public/check-otp', { otpId: emailOtpId, code: emailOtpCode });
                    toast.success('Email verified');
                    setEmailVerifiedLocal(true);
                  } catch (err) {
                    const reason = err.response?.data?.reason;
                    if (reason === 'invalid') return toast.error('Invalid OTP');
                    if (reason === 'expired') return toast.error('OTP has expired');
                    if (reason === 'not_found') return toast.error('OTP not found');
                    const serverErr = err.response?.data?.error;
                    return toast.error(serverErr || 'Failed to verify OTP');
                  } finally {
                    setVerifyingOtp(false);
                  }
                }}>{verifyingOtp ? 'Verifying...' : 'Verify'}</button>
              </div>
            )}
          </div>

          <div className="col-span-1 md:col-span-2">
            <p className="text-sm text-gray-500">
              By registering you consent to receive communications related to clinic updates and services. If you wish to unregister, please send us a message using the Contact form on the homepage or visit{' '}
              <a href="https://akshaymahore.vercel.app/#contact" target="_blank" rel="noopener noreferrer" className="text-orange-600 underline">Contact</a>.
            </p>
          </div>

          <div className="col-span-1 md:col-span-2 flex justify-end">
            <button type="submit" disabled={!emailVerifiedLocal || registering} className={`px-6 py-3 rounded-md text-white font-semibold ${emailVerifiedLocal ? (registering ? 'bg-gray-500' : 'bg-orange-600 hover:bg-orange-700') : 'bg-gray-300'}`}>{registering ? 'Registering...' : 'Create Account'}</button>
          </div>
        </form>
        </div>
      </main>
    </div>
  );
};

export default PublicRegister;
