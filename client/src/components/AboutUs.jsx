import React, { useState } from 'react';
import './AboutUs.css';
import heroBg from '../assets/images/homesatu.png';
import visiImage from '../assets/images/homedua.png';
import ceoImage from '../assets/images/hometiga.png';

const AboutUs = () => {
    const [activeTab, setActiveTab] = useState('vision');

    return (
        <div className="about-page">
            <section 
                className="about-hero"
                style={{ 
                    backgroundImage: `url(${heroBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="hero-overlay">
                    <h1>TENTANG KAMI</h1>
                    <p>PT <span className="highlight">FACHRI</span> PROPERTY GROUP</p>
                </div>
            </section>

            <section className="about-tabs">
                <div className="container">
                    <div className="tabs-header">
                        <button 
                            className={activeTab === 'vision' ? 'tab active' : 'tab'}
                            onClick={() => setActiveTab('vision')}
                        >
                            Vision
                        </button>
                        <button 
                            className={activeTab === 'mission' ? 'tab active' : 'tab'}
                            onClick={() => setActiveTab('mission')}
                        >
                            Mision
                        </button>
                        <button 
                            className={activeTab === 'history' ? 'tab active' : 'tab'}
                            onClick={() => setActiveTab('history')}
                        >
                            Sejarah Perusahaan
                        </button>
                    </div>

                    <div className="tabs-content">
                        {activeTab === 'vision' && (
                            <div className="tab-panel vision-content">
                                <div className="vision-image">
                                    <img src={visiImage} alt="Visi Fachri Group" />
                                </div>
                                <div className="vision-text">
                                    <h2>Visi Fachri Group</h2>
                                    <p>Menjadi Pengembang kawasan perumahan terbesar dengan mutu kualitas terbaik serta dapat bersaing di Pasar Nasional dengan terus berinovasi untuk kepuasan masyarakat.</p>
                                </div>
                            </div>
                        )}
                        {activeTab === 'mission' && (
                            <div className="tab-panel">
                                <h2>Misi Kami</h2>
                                <ul>
                                    <li>Mengembangkan properti berkualitas dengan harga terjangkau</li>
                                    <li>Memberikan pelayanan terbaik kepada pelanggan</li>
                                    <li>Berinovasi dalam pengembangan properti</li>
                                </ul>
                            </div>
                        )}
                        {activeTab === 'history' && (
                            <div className="tab-panel">
                                <h2>Sejarah Perusahaan</h2>
                                <p>PT Fachri Property Group didirikan dengan komitmen untuk menyediakan hunian berkualitas bagi masyarakat Indonesia.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className="leadership-section">
                <div className="container">
                    <h2>LEADEARSHIP</h2>
                    <div className="ceo-profile">
                        <img src={ceoImage} alt="CEO Fachri" />
                        <h3>CEO FACHRI</h3>
                    </div>
                </div>
            </section>

            <section className="contact-section">
                <div className="container">
                    <h2>GET IN TOUCH WITH US</h2>
                    <div className="contact-content">
                        <div className="contact-info">
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
                        <div className="contact-map">
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
                    <div className="footer-grid">
                        <div className="footer-column">
                            <h4>Relasi Investor</h4>
                            <ul>
                                <li>Laporan Tahunan</li>
                                <li>Laporan Keuangan</li>
                                <li>Tata Kelola Perusahaan</li>
                            </ul>
                        </div>
                        <div className="footer-column">
                            <h4>Keberlanjutan</h4>
                            <ul>
                                <li>Aktivitas SHE</li>
                            </ul>
                        </div>
                        <div className="footer-column">
                            <h4>Produk & Layanan</h4>
                            <ul>
                                <li>WMA Realty Archipelago</li>
                                <li>Pengembangan Properti</li>
                                <li>Asset & Investasi Properti</li>
                                <li>Hotel</li>
                            </ul>
                        </div>
                        <div className="footer-column">
                            <h4>Berita & Acara</h4>
                            <ul>
                                <li>Media</li>
                                <li>E-Magazine</li>
                                <li>Promo</li>
                            </ul>
                        </div>
                        <div className="footer-column">
                            <h4>Perusahaan</h4>
                            <ul>
                                <li>Tentang kami</li>
                                <li>Manajemen Perusahaan</li>
                                <li>Sertifikat & Penghargaan</li>
                                <li>Karir</li>
                                <li>Hubungi Kami</li>
                            </ul>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <p>Copyright © 2025 Fachri Property Group</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AboutUs;