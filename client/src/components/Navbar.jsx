import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import logoWhite from '../assets/images/logo-putih.png';
import logoColor from '../assets/images/logo-warna.png';

const Navbar = () => {
    const [showAboutSubmenu, setShowAboutSubmenu] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const isLandingPage = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    const handleNavigation = (path) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setMobileMenuOpen(false);
        setTimeout(() => {
            navigate(path);
        }, 300);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <nav className={`navbar ${scrolled && !isLandingPage ? 'scrolled' : ''} ${isLandingPage ? 'navbar-transparent' : 'navbar-solid'} navbar-animate`}>
            <div className="navbar-container">
                <Link to="/" className="nav-logo" onClick={() => setMobileMenuOpen(false)}>
                    <img 
                        src={(scrolled && !isLandingPage) ? logoColor : logoWhite} 
                        alt="Fachri Property Group" 
                        className="logo-image" 
                    />
                </Link>

                {/* Hamburger Menu Button */}
               

                <ul className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
                    <li className="navbar-item">
                        <Link to="/" className="navbar-link">BERANDA</Link>
                    </li>
                    
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
                                <li>
                                    <Link to="/about?section=history">
                                        <span className="dropdown-icon"></span>
                                        Sejarah Perusahaan
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/about?section=leadership">
                                        <span className="dropdown-icon"></span>
                                        Manajemen
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/about?section=awards">
                                        <span className="dropdown-icon"></span>
                                        Penghargaan
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/about?section=subsidiaries">
                                        <span className="dropdown-icon"></span>
                                        Anak Perusahaan
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>

                    <li className="navbar-item">
                        <button onClick={() => handleNavigation('/properties')} className="navbar-link">
                            PROPERTI
                        </button>
                    </li>

                    <li className="navbar-item">
                        <button onClick={() => handleNavigation('/contact')} className="navbar-link">
                            HUBUNGI KAMI
                        </button>
                    </li>

                    {/* ADMIN LINK DIHAPUS - Akses langsung via URL saja */}
                </ul>

                {/* Overlay untuk mobile menu */}
                {mobileMenuOpen && (
                    <div className="navbar-overlay" onClick={() => setMobileMenuOpen(false)}></div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;