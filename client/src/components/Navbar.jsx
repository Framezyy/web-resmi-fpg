import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import logoWhite from '../assets/images/logo-putih.png';
import logoColor from '../assets/images/logo-warna.png';

const Navbar = () => {
    const [showAboutSubmenu, setShowAboutSubmenu] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mobileAboutOpen, setMobileAboutOpen] = useState(false); // tetap dibiarkan (tidak dipakai lagi untuk open)

    const location = useLocation();
    const navigate = useNavigate();
    const isLandingPage = location.pathname === '/';
    const [isContactActive, setIsContactActive] = useState(false);

    const isMobileViewport = () =>
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(max-width: 1024px)').matches;

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        setMobileMenuOpen(false);
        setMobileAboutOpen(false);
    }, [location]);

    useEffect(() => {
        if (!mobileMenuOpen) {
            document.body.style.overflow = '';
            return;
        }

        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const onKeyDown = (e) => {
            if (e.key === 'Escape') setMobileMenuOpen(false);
        };

        window.addEventListener('keydown', onKeyDown);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [mobileMenuOpen]);

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
        setMobileAboutOpen(false);
        setTimeout(() => navigate(path), 300);
    };

    const handleTopNavClick = (e, path) => {
        const isLandingOrAbout = location.pathname === '/' || location.pathname === '/about';
        const isPropertiesOrContact =
            location.pathname === '/properties' || location.pathname === '/contact';

        const shouldAnimateScrollTop =
            (path === '/about' && (isLandingOrAbout || isPropertiesOrContact)) ||
            (path !== '/about' && isLandingOrAbout);

        if (shouldAnimateScrollTop) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        setMobileMenuOpen(false);
        setMobileAboutOpen(false);

        if (location.pathname !== path) {
            e.preventDefault();
            setTimeout(() => navigate(path), shouldAnimateScrollTop ? 150 : 0);
        }
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
        setMobileAboutOpen(false);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen((v) => !v);
        if (mobileMenuOpen) setMobileAboutOpen(false);
    };

    const isForcedScrolled = isLandingPage && isContactActive;
    const isScrolledMode = (!isLandingPage && scrolled) || isForcedScrolled;

    const logoSrc = isScrolledMode ? logoColor : logoWhite;
    const fromNavbarState = location.pathname === '/about' ? null : { fromNavbar: true };
    const isOnAboutPage = location.pathname === '/about';

    // Kirim state untuk semua klik submenu, termasuk saat sudah di /about
    const aboutMenuState = { fromNavbar: true, samePage: isOnAboutPage };

    // ✅ mobile/tablet: dropdown "TENTANG" selalu tampil saat drawer menu terbuka
    const shouldShowAboutMenu = showAboutSubmenu || (isMobileViewport() && mobileMenuOpen);

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
                <Link to="/" className="nav-logo" onClick={(e) => handleTopNavClick(e, '/')}>
                    <img src={logoSrc} alt="Fachri Property Group" className="logo-image" />
                </Link>

                {/* Hamburger Menu Button (tablet/HP) */}
                <button
                    type="button"
                    className={`navbar-burger ${mobileMenuOpen ? 'is-active' : ''}`}
                    aria-label="Buka menu"
                    aria-expanded={mobileMenuOpen}
                    aria-controls="primary-navigation"
                    onClick={toggleMobileMenu}
                >
                    <span className="burger-line" />
                    <span className="burger-line" />
                    <span className="burger-line" />
                </button>

                <ul
                    id="primary-navigation"
                    className={`navbar-menu ${mobileMenuOpen ? 'active' : ''}`}
                >
                    <li className="navbar-item">
                        {/* ...existing code... (jika sebelumnya ada item) */}
                    </li>

                    <li
                        className="navbar-item navbar-dropdown"
                        onMouseEnter={() => !isMobileViewport() && setShowAboutSubmenu(true)}
                        onMouseLeave={() => !isMobileViewport() && setShowAboutSubmenu(false)}
                    >
                        {/* ✅ Klik "TENTANG" selalu navigasi ke /about (top), termasuk tablet */}
                        <Link
                            to="/about"
                            className="navbar-link"
                            onClick={(e) => handleTopNavClick(e, '/about')}
                        >
                            TENTANG <span className="dropdown-arrow">▼</span>
                        </Link>

                        {shouldShowAboutMenu && (
                            <ul className="dropdown-menu">
                                <li>
                                    <Link
                                        to="/about?tab=history&scroll=tabs&offset=60"
                                        state={aboutMenuState}
                                        onClick={closeMobileMenu}
                                    >
                                        <span className="dropdown-icon"></span>
                                        Sejarah Perusahaan
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/about?section=leadership&offset=120"
                                        state={aboutMenuState}
                                        onClick={closeMobileMenu}
                                    >
                                        <span className="dropdown-icon"></span>
                                        Manajemen
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/about?section=awards&offset=120"
                                        state={aboutMenuState}
                                        onClick={closeMobileMenu}
                                    >
                                        <span className="dropdown-icon"></span>
                                        Penghargaan
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/about?section=subsidiaries&offset=60"
                                        state={aboutMenuState}
                                        onClick={closeMobileMenu}
                                    >
                                        <span className="dropdown-icon"></span>
                                        Anak Perusahaan
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </li>

                    <li className="navbar-item">
                        <button
                            onClick={() => handleNavigation('/properties')}
                            className="navbar-link"
                        >
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
                    <div className="navbar-overlay" onClick={closeMobileMenu}></div>
                )}
            </div>
        </header>
    );
};

export default Navbar;