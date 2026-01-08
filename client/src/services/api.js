import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Property from './pages/Property';
import Contact from './pages/Contact';
import Footer from './components/Footer';
import './App.css';
import axios from 'axios';

import AdminLogin from './components/AdminLogin';

const API_URL = 'http://localhost/pt-fachri-property-group/server/api';

export const getProperties = async () => {
  try {
    const response = await axios.get(`${API_URL}/properties.php`);
    return response.data;
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

export const getPropertyDetail = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/property-detail.php?id=${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching property detail:', error);
    throw error;
  }
};

export const sendContact = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/contact.php`, formData);
    return response.data;
  } catch (error) {
    console.error('Error sending contact:', error);
    throw error;
  }
};

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/property" element={<Property />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/contact/admin/login" element={<AdminLogin />} />
          <Route path="/admin/login" element={<Navigate to="/contact/admin/login" replace />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;