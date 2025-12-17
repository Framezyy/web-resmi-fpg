import React, { useEffect, useState } from 'react';
import './SubsidiaryOne.css';
import heroBg from '../assets/images/homesatu.png';
import logo1 from '../assets/images/anak2.png';
import aboutImage from '../assets/images/Kantor.png';

const SubsidiaryOne = () => {
    const [activeTab, setActiveTab] = useState('vision');

    useEffect(() => {
        // Scroll to top when page loads
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Animate first section on load
        const firstSectionElements = document.querySelectorAll('.subsidiary-page .animate-on-scroll');
        firstSectionElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('animate-in');
            }, 300 + (index * 200));
        });
    }, []);

    return (
        <div className="subsidiary-page">
            <section 
                className="subsidiary-hero"
                style={{ 
                    backgroundImage: `url(${heroBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="hero-overlay">
                    <div className="logo-container animate-on-scroll">
                        <img src={logo1} alt="Borneo Icon Development" className="subsidiary-logo" />
                    </div>
                    <h1 className="animate-on-scroll">BORNEO ICON DEVELOPMENT</h1>
                    <p className="hero-subtitle animate-on-scroll">ANAK PERUSAHAAN PT FACHRI PROPERTY GROUP</p>
                </div>
            </section>

            <section className="description-section">
                <div className="description-content">
                    <div className="description-logo">
                        <img src={logo1} alt="Borneo Icon Development" />
                    </div>
                    <div className="description-text">
                        <h2>Deskripsi Perusahaan</h2>
                        <p>
                            PT Borneo Icon Developer adalah perusahaan pengembang properti yang berfokus pada perencanaan, 
                            pengembangan, dan pengelolaan proyek-proyek properti berkualitas di wilayah Kalimantan dan sekitarnya. 
                            Perusahaan ini berkomitmen untuk menghadirkan hunian, kawasan komersial, dan pengembangan terpadu yang 
                            mengedepankan kualitas desain, konstruksi, dan fungsi guna memenuhi kebutuhan masyarakat modern.
                        </p>
                    </div>
                </div>
            </section>

            <section className="vision-mission-section">
                <div className="container">
                    <h2>Visi Dan Misi Perusahaan</h2>
                    <div className="tabs-container">
                        <div className="tabs-header">
                            <button 
                                className={`tab ${activeTab === 'vision' ? 'active' : ''}`}
                                onClick={() => setActiveTab('vision')}
                            >
                                Vision
                            </button>
                            <button 
                                className={`tab ${activeTab === 'mission' ? 'active' : ''}`}
                                onClick={() => setActiveTab('mission')}
                            >
                                Mision
                            </button>
                        </div>
                        <div className="tabs-content">
                            {activeTab === 'vision' && (
                                <div className="tab-panel">
                                    <p>
                                        Menjadi perusahaan pengembang properti terpercaya dan terdepan dalam menciptakan kawasan 
                                        hunian dan komersial yang berkualitas, inovatif, serta berkelanjutan di Indonesia.
                                    </p>
                                </div>
                            )}
                            {activeTab === 'mission' && (
                                <div className="tab-panel">
                                    <div className="mission-content">
                                        <div className="mission-shape"></div>
                                        <div className="mission-text">
                                            <p>
                                                Mengembangkan proyek properti yang mengedepankan kualitas desain, konstruksi, dan 
                                                fungsi guna memenuhi kebutuhan masyarakat modern.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section className="map-section">
                <div className="container">
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.8195613!3d-6.194407!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTEnMzkuOSJTIDEwNsKwNDknMTAuNCJF!5e0!3m2!1sen!2sid!4v1234567890"
                        width="100%"
                        height="500"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                    ></iframe>
                </div>
            </section>

            <footer className="footer">
                <div className="container">
                    <div className="footer-bottom">
                        <p>Copyright © 2025 Borneo Icon Development - PT Fachri Property Group</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default SubsidiaryOne;
