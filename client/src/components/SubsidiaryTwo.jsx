import React, { useEffect, useState } from 'react';
import './SubsidiaryTwo.css';
import heroBg from '../assets/images/homedua.png';
import logo2 from '../assets/images/anak3.png';

const SubsidiaryTwo = () => {
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
                        <img src={logo2} alt="Borneo Real Estate" className="subsidiary-logo" />
                    </div>
                    <h1 className="animate-on-scroll">BORNEO REAL PROPERTI</h1>
                    <p className="hero-subtitle animate-on-scroll">ANAK PERUSAHAAN PT FACHRI PROPERTY GROUP</p>
                </div>
            </section>

            <section className="subsidiary-description-section">
                <div className="subsidiary-description-content">
                    <div className="subsidiary-description-logo">
                        <img src={logo2} alt="Borneo Real Estate" />
                    </div>
                    <div className="subsidiary-description-text">
                        <h2>Deskripsi Perusahaan</h2>
                        <p>
                            PT Borneo Real Properti adalah perusahaan yang berfokus pada manajemen dan investasi properti. 
                            Kami menyediakan layanan komprehensif dalam pengelolaan aset properti, konsultasi investasi, 
                            dan solusi real estat untuk memaksimalkan nilai properti Anda. Dengan tim profesional berpengalaman, 
                            Borneo Real Properti telah dipercaya mengelola berbagai portofolio properti komersial dan residensial 
                            dengan standar kualitas tertinggi.
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
                                Visi
                            </button>
                            <button 
                                className={`tab ${activeTab === 'mission' ? 'active' : ''}`}
                                onClick={() => setActiveTab('mission')}
                            >
                                Misi
                            </button>
                        </div>
                        <div className="tabs-content">
                            {activeTab === 'vision' && (
                                <div className="tab-panel">
                                    <div className="vision-content">
                                        <div className="vision-text">
                                            <p>
                                                Menjadi pengembang Properti terbesar dan terbaik di Kalimantan Barat dengan terus berinovasi untuk kepuasan konsumen.
                                            </p>
                                        </div>
                                        <div className="vision-shape"></div>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'mission' && (
                                <div className="tab-panel">
                                    <div className="mission-content">
                                        <div className="mission-shape"></div>
                                        <div className="mission-text">
                                            <p>
                                              Mengembangkan semua sumber daya yang dimiliki untuk menerapkan tata kelola organisasi yang berorientasi peningkatan mutu dan penyediaan layanan yang berkualitas.
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
                        title="Borneo Real Property Location"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4319.162899218581!2d109.30664811610173!3d-0.06026451972279657!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e1d5960bcf26c5f%3A0xc136f843636b7ee7!2sPT.%20BORNEO%20REAL%20PROPERTI!5e0!3m2!1sid!2sid!4v1766506631653!5m2!1sid!2sid"
                        width="100%"
                        height="500"
                        style={{ border: 0 }}
                        allowFullScreen={true}
                        loading="lazy"
                    ></iframe>
                </div>
            </section>
        </div>
    );
};

export default SubsidiaryTwo;
