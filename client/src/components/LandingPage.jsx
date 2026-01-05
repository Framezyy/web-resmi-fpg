import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import heroBgsatu from '../assets/images/image.png';
import heroBgdua from '../assets/images/homesatu.png';
import heroBgtiga from '../assets/images/homedua.png';
import heroBgempat from '../assets/images/hometiga.png';
import logoHotampt from '../assets/images/logoitampt.png'; // ADD

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
                    <h1 className="animate-on-scroll" data-anim="blur" style={{ transitionDelay: '0.1s' }}>
                        PT <span className="highlight">FACHRI</span> PROPERTY
                    </h1>
                    <p className="hero-subtitle animate-on-scroll" data-anim="up" style={{ transitionDelay: '0.3s' }}>
                        BELI RUMAH HARUS FACHRI PROPERTI GROUP
                    </p>
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
                    <h1 className="animate-on-scroll" data-anim="blur" style={{ transitionDelay: '0.1s' }}>VISI KAMI</h1>
                    <p className="hero-subtitle animate-on-scroll" data-anim="up" style={{ transitionDelay: '0.3s' }}>
                        MEMBERI ARTI DAN TUJUAN
                    </p>
                    <button
                        className="btn-outline animate-on-scroll"
                        data-anim="zoom"
                        style={{ transitionDelay: '0.5s' }}
                        onClick={() => handleNavigate('/about?tab=vision&scroll=tabs&offset=40')}
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
                    <h1 className="animate-on-scroll" data-anim="blur" style={{ transitionDelay: '0.1s' }}>PROPERTI KAMI</h1>
                    <p className="hero-subtitle animate-on-scroll" data-anim="up" style={{ transitionDelay: '0.3s' }}>
                        TEMUKAN DAN BANGUN HUNIAN MASA DEPAN ANDA
                    </p>
                    <button
                        className="btn-outline animate-on-scroll"
                        data-anim="zoom"
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
                    <h1 className="animate-on-scroll" data-anim="blur" style={{ transitionDelay: '0.1s' }}>HUBUNGI KAMI</h1>
                    <p className="hero-subtitle animate-on-scroll" data-anim="up" style={{ transitionDelay: '0.3s' }}>
                        KAMI MEMBANGUN MIMPI
                    </p>
                    <button
                        className="btn-outline animate-on-scroll"
                        data-anim="zoom"
                        style={{ transitionDelay: '0.5s' }}
                        onClick={() => handleNavigate('/contact')}
                    >
                        TEMUKAN LEBIH
                    </button>
                </div>
            </section>

            <section id="contact" className="contact-section">
                <div className="container">
                    <h2 className="animate-on-scroll" data-anim="up" style={{ transitionDelay: '0.1s' }}>
                        GET IN TOUCH WITH US
                    </h2>
                    <div className="contact-content">
                        <div className="contact-info animate-on-scroll" data-anim="left" style={{ transitionDelay: '0.2s' }}>
                            <div className="contact-logo-container animate-on-scroll" data-anim="zoom" style={{ transitionDelay: '0.25s' }}>
                                <div className="logo-box">
                                    <img src={logoHotampt} alt="Fachri Property Group" />
                                </div>
                                <h3>FACHRI PROPERTY GROUP</h3>
                            </div>

                            <div className="address animate-on-scroll" data-anim="up" style={{ transitionDelay: '0.3s' }}>
                                <h4>Alamat Perusahaan</h4>
                                <p>Jl. Ampera No.02, Sungai Jawi, Kec. Pontianak Kota,</p>
                                <p>Kota Pontianak, Kalimantan Barat 78114</p>
                            </div>

                            <div className="contact-details animate-on-scroll" data-anim="up" style={{ transitionDelay: '0.35s' }}>
                                <h4>Kontak</h4>
                                <p>Phone: +62 822-9899-0669</p>
                                <p>Fax: (0561) 8177746</p>
                                <p>Email: fachripropertygroup@gmail.com</p>
                            </div>
                        </div>

                        <div className="contact-map animate-on-scroll" data-anim="right" style={{ transitionDelay: '0.4s' }}>
                            <iframe
                                title="Map Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.816827422188!2d109.2972812!3d-0.0495655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e1d5939bcb36055%3A0xbbfe8d8aa6d9c520!2sPT.FACHRI%20PROPERTY%20LAND!5e0!3m2!1sid!2sid!4v1766506338420!5m2!1sid!2sid"
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
        </div>
    );
};

export default LandingPage;