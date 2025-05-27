import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Logout = () => {
  const { logout } = useAuth();  // <- correctly calling logout from context
  const navigate = useNavigate();
useEffect(() => {
  const doLogout = async () => {
    try {
      await axios.post('https://akshaymahore-backend.vercel.app/logout');
      logout(); 
      console.log("About to navigate");
      navigate('/login');
      console.log("Navigated");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  doLogout();
}, [logout, navigate]);


  return <p>Logging out... Please wait a minute</p>;
};

export default Logout;
