import React, { useEffect, useState } from 'react';
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
    const [isContactActive, setIsContactActive] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location]);

    // Aktif hanya saat TOP layar (setelah tinggi navbar) sudah masuk ke contact-section
    useEffect(() => {
        if (!isLandingPage) {
            setIsContactActive(false);
            return;
        }

        const contactEl = document.querySelector('#contact');
        const navbarEl = document.querySelector('.navbar');

        if (!contactEl) {
            setIsContactActive(false);
            return;
        }

        let ticking = false;

        const compute = () => {
            const navH = navbarEl ? navbarEl.getBoundingClientRect().height : 0;
            const rect = contactEl.getBoundingClientRect();
            const active = rect.top <= navH && rect.bottom > navH;
            setIsContactActive(active);
        };

        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            window.requestAnimationFrame(() => {
                compute();
                ticking = false;
            });
        };

        compute();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, [isLandingPage]);

    const handleNavigation = (path) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setMobileMenuOpen(false);
        setTimeout(() => navigate(path), 300);
    };

    // Landing: saat contact aktif => pakai mode "scrolled" seperti page lain
    const isForcedScrolled = isLandingPage && isContactActive;
    const isScrolledMode = (!isLandingPage && scrolled) || isForcedScrolled;

    const logoSrc = isScrolledMode ? logoColor : logoWhite;

    return (
        <header
            className={[
                'navbar',
                isScrolledMode ? 'scrolled' : '',
                isLandingPage ? 'navbar-transparent' : 'navbar-solid',
                'navbar-animate'
            ].join(' ')}
        >
            <div className="navbar-container">
                <Link to="/" className="nav-logo" onClick={() => setMobileMenuOpen(false)}>
                    <img src={logoSrc} alt="Fachri Property Group" className="logo-image" />
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
                                    <Link to="/about?tab=history">
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
        </header>
    );
};

export default Navbar;