import React, { useEffect, useState } from 'react';
import './SubsidiaryOne.css';
import heroBg from '../assets/images/homesatu.png';
import logo1 from '../assets/images/anak2.png';

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
                    <h1 className="animate-on-scroll">BORNEO ICON DEVELOPER</h1>
                    <p className="hero-subtitle animate-on-scroll">ANAK PERUSAHAAN PT FACHRI PROPERTY GROUP</p>
                </div>
            </section>

            <section className="subsidiary-description-section">
                <div className="subsidiary-description-content">
                    <div className="subsidiary-description-logo">
                        <img src={logo1} alt="Borneo Icon Development" />
                    </div>
                    <div className="subsidiary-description-text">
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
                                                menjadi slah satu pengembang (developer) property terbaik dikalimantan barat dan terpercaya mampu bersaing di tingkat nasional sesuai kelas nya.
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
                        title="Borneo Icon Development Location"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.816737220806!2d109.3167657!3d-0.0510409!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e1d5912f0f922db%3A0x36a6b50bbb15825!2sPT.%20BORNEO%20ICON%20PROPERTI!5e0!3m2!1sid!2sid!4v1766506532550!5m2!1sid!2sid"
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

export default SubsidiaryOne;
