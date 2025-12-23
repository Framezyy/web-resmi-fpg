import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import heroBgsatu from '../assets/images/homesatu.png';
import heroBgdua from '../assets/images/homedua.png';
import heroBgtiga from '../assets/images/hometiga.png';
import heroBgempat from '../assets/images/homeempat.png';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
            navigate(path);
        }, 300);
    };

    useEffect(() => {
        // Scroll to top when component mounts with smooth animation
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Animate first section on load
        const firstSectionElements = document.querySelector('.hero-section:first-of-type').querySelectorAll('.animate-on-scroll');
        firstSectionElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('animate-in');
            }, 300 + (index * 200));
        });

        // Observe other sections
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll('.hero-section:not(:first-of-type) .animate-on-scroll, .contact-section .animate-on-scroll');
        animatedElements.forEach(el => observer.observe(el));

        return () => {
            animatedElements.forEach(el => observer.unobserve(el));
        };
    }, []);

    return (
        <div className="landing-page">
            <section 
                className="hero-section" 
                style={{ 
                    backgroundImage: `url(${heroBgsatu})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="hero-overlay">
                    <h1 className="animate-on-scroll" style={{ transitionDelay: '0.1s' }}>PT <span className="highlight">FACHRI</span> PROPERTY</h1>
                    <p className="hero-subtitle animate-on-scroll" style={{ transitionDelay: '0.3s' }}>BELI RUMAH HARUS FACHRI PROPERTI GROUP</p>
                </div>
            </section>

            <section
                className="hero-section" 
                style={{ 
                    backgroundImage: `url(${heroBgdua})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="hero-overlay">
                    <h1 className="animate-on-scroll" style={{ transitionDelay: '0.1s' }}>VISI KAMI</h1>
                    <p className="hero-subtitle animate-on-scroll" style={{ transitionDelay: '0.3s' }}>MEMBERI ARTI DAN TUJUAN</p>
                    <button 
                        className="btn-outline animate-on-scroll" 
                        style={{ transitionDelay: '0.5s' }}
                        onClick={() => handleNavigate('/about?tab=vision')}
                    >
                        TEMUKAN LEBIH
                    </button>
                </div>
            </section>

            <section
                className="hero-section" 
                style={{ 
                    backgroundImage: `url(${heroBgtiga})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="hero-overlay">
                    <h1 className="animate-on-scroll" style={{ transitionDelay: '0.1s' }}>PROPERTI KAMI</h1>
                    <p className="hero-subtitle animate-on-scroll" style={{ transitionDelay: '0.3s' }}>TEMUKAN DAN BANGUN HUNIAN MASA DEPAN ANDA</p>
                    <button 
                        className="btn-outline animate-on-scroll" 
                        style={{ transitionDelay: '0.5s' }}
                        onClick={() => handleNavigate('/properties')}
                    >
                        TEMUKAN LEBIH
                    </button>
                </div>
            </section>

            <section
                className="hero-section" 
                style={{ 
                    backgroundImage: `url(${heroBgempat})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="hero-overlay">
                    <h1 className="animate-on-scroll" style={{ transitionDelay: '0.1s' }}>HUBUNGI KAMI</h1>
                    <p className="hero-subtitle animate-on-scroll" style={{ transitionDelay: '0.3s' }}>KAMI MEMBANGUN MIMPI</p>
                    <button 
                        className="btn-outline animate-on-scroll" 
                        style={{ transitionDelay: '0.5s' }}
                        onClick={() => handleNavigate('/contact')}
                    >
                        TEMUKAN LEBIH
                    </button>
                </div>
            </section>

            <section className="contact-section">
                <div className="container">
                    <h2 className="animate-on-scroll" style={{ transitionDelay: '0.1s' }}>GET IN TOUCH WITH US</h2>
                    <div className="contact-content">
                        <div className="contact-info animate-on-scroll" style={{ transitionDelay: '0.2s' }}>
                            <div className="contact-logo-container">
                                <div className="logo-box"></div>
                                <h3>FACHRI PROPERTY GROUP</h3>
                            </div>
                            <div className="address">
                                <h4>Alamat Perusahaan</h4>
                                <p>Panasonic Tower Lantai 16-G</p>
                                <p>Jl. DR. Pengabean Km. 2, RT.7/RW.1, Gambir, Campaka</p>
                                <p>Kecamatan Ciputat Utara, Kota Tangerang Selatan, Banten</p>
                                <p>Indonesia 15340</p>
                            </div>
                            <div className="contact-details">
                                <h4>Kontak</h4>
                                <p>Phone: (+6221) 23581300, 21201301</p>
                                <p>Fax: (+6221) 23581302</p>
                                <p>Email: cs@fachrisaebaty.co.id</p>
                            </div>
                        </div>
                        <div className="contact-map animate-on-scroll" style={{ transitionDelay: '0.4s' }}>
                            <iframe 
                                title="Map Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.8195613!3d-6.194407!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTEnMzkuOSJTIDEwNsKwNDknMTAuNCJF!5e0!3m2!1sen!2sid!4v1234567890"
                                width="100%"
                                height="400"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="footer">
                <div className="container">
                    <div className="footer-bottom">
                        <p>Copyright © 2025 Fachri Property Group</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;