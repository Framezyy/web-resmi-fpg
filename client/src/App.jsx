import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Home from './components/Home';
import AboutUs from './components/AboutUs';
import Properties from './components/Properties';
import ContactUs from './components/ContactUs';
import News from './components/News';
import NewsDetail from './components/NewsDetail';
import SubsidiaryOne from './components/SubsidiaryOne';
import SubsidiaryTwo from './components/SubsidiaryTwo';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import AdminForgotPassword from './components/AdminForgotPassword'; // ← Pastikan ada
import Footer from './components/Footer'; // ADD
import './styles/App.css';

function AppContent() {
    const location = useLocation();
    const hideNavbar = location.pathname.startsWith('/admin');

    return (
        <>
            {!hideNavbar && <Navbar />}
            <Routes>
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
                
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/home" element={<Home />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/news" element={<News />} />
                <Route path="/news/:id" element={<NewsDetail />} />
                <Route path="/properties" element={<Properties />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/subsidiary/borneo-icon" element={<SubsidiaryOne />} />
                <Route path="/subsidiary/borneo-real-estate" element={<SubsidiaryTwo />} />
            </Routes>
            <Footer /> {/* ADD: tampil di semua page */}
        </>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}