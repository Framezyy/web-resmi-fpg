import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import logoWhite from '../assets/images/logo-putih.png';
import logoColor from '../assets/images/logo-warna.png';

const Navbar = () => {
    const [showAboutSubmenu, setShowAboutSubmenu] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="navbar-container">
                <Link to="/" className="nav-logo">
                    <img 
                        src={scrolled ? logoColor : logoWhite} 
                        alt="Fachri Property Group" 
                        className="logo-image" 
                    />
                </Link>
                <ul className="navbar-menu">
                    
                    <li 
                        className="navbar-item navbar-dropdown"
                        onMouseEnter={() => setShowAboutSubmenu(true)}
                        onMouseLeave={() => setShowAboutSubmenu(false)}
                    >
                        <Link to="/about" className="navbar-link">
                            TENTANG <span className="dropdown-arrow">▼</span>
                        </Link>
                        {showAboutSubmenu && (
                            <ul className="dropdown-menu">
                                <li><Link to="/about/history">Sejarah Perusahaan</Link></li>
                                <li><Link to="/about/history">Menegement</Link></li>
                                <li><Link to="/about/awards">Penghargaan</Link></li>
                                <li><Link to="/about/subsidiaries">Anak Perusahaan</Link></li>
                            </ul>
                        )}
                    </li>
                    <li className="navbar-item">
                        <Link to="/properties" className="navbar-link">PROPERTI</Link>
                    </li>
                    <li className="navbar-item">
                        <Link to="/contact" className="navbar-link">HUBUNGI KAMI</Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;