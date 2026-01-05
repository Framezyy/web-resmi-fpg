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
<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d506994.2489237951!2d107.643158!3d-6.903449!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6398252477f%3A0x146a1f93d3e815b2!2sBandung%2C%20Kota%20Bandung%2C%20Jawa%20Barat%2C%20Indonesia!5e0!3m2!1sid!2sus!4v1767587239970!5m2!1sid!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
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

    // ADD: klik logo/beranda/tentang => (kondisional) scroll to top
    // NOTE: permintaan khusus: saat klik "TENTANG" dari page Properti & Contact, juga pakai animasi.
    const handleTopNavClick = (e, path) => {
        const isLandingOrAbout = location.pathname === '/' || location.pathname === '/about';
        const isPropertiesOrContact = location.pathname === '/properties' || location.pathname === '/contact';

        // Default: animasi hanya untuk Landing/About.
        // Khusus "Tentang": tambahkan juga untuk Properti & Contact.
        const shouldAnimateScrollTop =
            (path === '/about' && (isLandingOrAbout || isPropertiesOrContact)) ||
            (path !== '/about' && isLandingOrAbout);

        if (shouldAnimateScrollTop) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        setMobileMenuOpen(false);

        // kalau route berbeda, lakukan navigate manual (biar scroll keburu jalan dan konsisten)
        if (location.pathname !== path) {
            e.preventDefault();
            setTimeout(() => navigate(path), shouldAnimateScrollTop ? 150 : 0);
        }
        // kalau route sama, biarkan (tidak navigate), hanya scroll top
    };

    // Landing: saat contact aktif => pakai mode "scrolled" seperti page lain
    const isForcedScrolled = isLandingPage && isContactActive;
    const isScrolledMode = (!isLandingPage && scrolled) || isForcedScrolled;

    const logoSrc = isScrolledMode ? logoColor : logoWhite;
    const fromNavbarState = location.pathname === '/about' ? null : { fromNavbar: true };

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
                <Link
                    to="/"
                    className="nav-logo"
                    onClick={(e) => handleTopNavClick(e, '/')}
                >
                    <img src={logoSrc} alt="Fachri Property Group" className="logo-image" />
                </Link>

                {/* Hamburger Menu Button */}
               

                <ul className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}>
                    <li className="navbar-item">
                   
                    </li>

                    <li
                        className="navbar-item navbar-dropdown"
                        onMouseEnter={() => setShowAboutSubmenu(true)}
                        onMouseLeave={() => setShowAboutSubmenu(false)}
                    >
                        <Link
                            to="/about"
                            className="navbar-link"
                            onClick={(e) => handleTopNavClick(e, '/about')}
                        >
                            TENTANG <span className="dropdown-arrow">▼</span>
                        </Link>

                        {showAboutSubmenu && (
                            <ul className="dropdown-menu">
                                <li>
                                    <Link
                                        to="/about?tab=history&scroll=tabs&offset=160"
                                        state={fromNavbarState}
                                    >
                                        <span className="dropdown-icon"></span>
                                        Sejarah Perusahaan
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/about?section=leadership&offset=160"
                                        state={fromNavbarState}
                                    >
                                        <span className="dropdown-icon"></span>
                                        Manajemen
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/about?section=awards&offset=250"
                                        state={fromNavbarState}
                                    >
                                        <span className="dropdown-icon"></span>
                                        Penghargaan
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/about?section=subsidiaries&offset=60"
                                        state={fromNavbarState}
                                    >
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