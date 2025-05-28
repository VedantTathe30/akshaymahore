import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const Logout = () => {
  const { logout } = useAuth();  // <- correctly calling logout from context
  const navigate = useNavigate();
  localStorage.removeItem('token');
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


  return <p className='h-screen'><Loader /></p>;
};

export default Logout;
