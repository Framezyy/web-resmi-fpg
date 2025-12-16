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
import './styles/App.css';

const App = () => {
    return (
        <Router>
            <div>
                <Navbar />
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/properties" element={<Properties />} />
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path="/subsidiary/borneo-icon" element={<SubsidiaryOne />} />
                    <Route path="/subsidiary/borneo-real-estate" element={<SubsidiaryTwo />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;