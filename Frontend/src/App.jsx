// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Search from './pages/Search';
import AddPatient from './pages/AddPatient';
import ChangeData from './pages/ChangeData';
import ReadMessages from './pages/ReadMessages';
import SendSMS from './pages/SendSMS';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './components/Home';
import Logout from './pages/Logout';

const PrivateRoute = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<PrivateRoute element={<Admin />} />} />
        <Route path="/search" element={<PrivateRoute element={<Search />} />} />
        <Route path="/add-patient" element={<PrivateRoute element={<AddPatient />} />} />
        <Route path="/change-data" element={<PrivateRoute element={<ChangeData />} />} />
        <Route path="/read-messages" element={<PrivateRoute element={<ReadMessages />} />} />
        <Route path="/send-sms" element={<PrivateRoute element={<SendSMS />} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
