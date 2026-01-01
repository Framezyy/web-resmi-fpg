import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Home from './components/Home';
import AboutUs from './components/AboutUs';
import Properties from './components/Properties';
import ContactUs from './components/ContactUs';
import SubsidiaryOne from './components/SubsidiaryOne';
import SubsidiaryTwo from './components/SubsidiaryTwo';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import AdminForgotPassword from './components/AdminForgotPassword'; // ← Pastikan ada
import './styles/App.css';

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
                
                {/* Public Routes */}
                <Route path="/" element={<><Navbar /><LandingPage /></>} />
                <Route path="/home" element={<><Navbar /><Home /></>} />
                <Route path="/about" element={<><Navbar /><AboutUs /></>} />
                <Route path="/properties" element={<><Navbar /><Properties /></>} />
                <Route path="/contact" element={<><Navbar /><ContactUs /></>} />
                <Route path="/subsidiary/borneo-icon" element={<><Navbar /><SubsidiaryOne /></>} />
                <Route path="/subsidiary/borneo-real-estate" element={<><Navbar /><SubsidiaryTwo /></>} />
            </Routes>
        </Router>
    );
};

export default App;