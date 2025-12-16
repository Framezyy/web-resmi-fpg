import React, { useEffect } from 'react';
import './SubsidiaryTwo.css';
import heroBg from '../assets/images/homedua.png';
import logo2 from '../assets/images/anakdua.png';
import aboutImage from '../assets/images/Kantor.png';

const SubsidiaryTwo = () => {
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
                    <h1 className="animate-on-scroll">BORNEO REAL ESTATE</h1>
                    <p className="hero-subtitle animate-on-scroll">ANAK PERUSAHAAN PT FACHRI PROPERTY GROUP</p>
                </div>
            </section>

            <section className="subsidiary-about">
                <div className="container">
                    <h2>TENTANG BORNEO REAL ESTATE</h2>
                    <div className="about-content">
                        <div className="about-image">
                            <img src={aboutImage} alt="Borneo Real Estate" />
                        </div>
                        <div className="about-text">
                            <p>
                                Borneo Real Estate adalah anak perusahaan yang berfokus pada manajemen 
                                dan investasi properti. Kami menyediakan layanan komprehensif dalam 
                                pengelolaan aset properti, konsultasi investasi, dan solusi real estat 
                                untuk memaksimalkan nilai properti Anda.
                            </p>
                            <p>
                                Dengan tim profesional berpengalaman, Borneo Real Estate telah 
                                dipercaya mengelola berbagai portofolio properti komersial dan 
                                residensial dengan standar kualitas tertinggi.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="subsidiary-vision">
                <div className="container">
                    <div className="vision-grid">
                        <div className="vision-item">
                            <div className="icon">🏢</div>
                            <h3>VISI</h3>
                            <p>
                                Menjadi mitra terpercaya dalam manajemen dan investasi properti 
                                dengan memberikan solusi terbaik untuk setiap kebutuhan klien.
                            </p>
                        </div>
                        <div className="vision-item">
                            <div className="icon">💼</div>
                            <h3>MISI</h3>
                            <p>
                                Memberikan layanan manajemen properti profesional dan solusi 
                                investasi yang menguntungkan dengan fokus pada kepuasan klien.
                            </p>
                        </div>
                        <div className="vision-item">
                            <div className="icon">🌟</div>
                            <h3>NILAI</h3>
                            <p>
                                Profesionalisme, Transparansi, dan Kepercayaan sebagai 
                                fondasi dalam setiap layanan yang kami berikan.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="subsidiary-services">
                <div className="container">
                    <h2>LAYANAN KAMI</h2>
                    <div className="services-grid">
                        <div className="service-card">
                            <div className="service-icon">🏠</div>
                            <h3>Property Management</h3>
                            <p>Pengelolaan properti profesional dengan sistem terpadu dan teknologi modern</p>
                        </div>
                        <div className="service-card">
                            <div className="service-icon">📊</div>
                            <h3>Investment Advisory</h3>
                            <p>Konsultasi investasi properti untuk memaksimalkan return investasi Anda</p>
                        </div>
                        <div className="service-card">
                            <div className="service-icon">🔑</div>
                            <h3>Leasing Services</h3>
                            <p>Layanan sewa-menyewa properti dengan proses yang mudah dan transparan</p>
                        </div>
                        <div className="service-card">
                            <div className="service-icon">💰</div>
                            <h3>Asset Valuation</h3>
                            <p>Penilaian aset properti akurat untuk keperluan investasi dan transaksi</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="subsidiary-contact">
                <div className="container">
                    <h2>HUBUNGI KAMI</h2>
                    <div className="contact-info">
                        <div className="contact-item">
                            <h4>Alamat</h4>
                            <p>Panasonic Tower Lantai 16-G</p>
                            <p>Jl. DR. Pengabean Km. 2, RT.7/RW.1</p>
                            <p>Kota Tangerang Selatan, Banten 15340</p>
                        </div>
                        <div className="contact-item">
                            <h4>Kontak</h4>
                            <p>Phone: (+6221) 23581301</p>
                            <p>Email: info@borneorealestate.co.id</p>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="footer">
                <div className="container">
                    <div className="footer-bottom">
                        <p>Copyright © 2025 Borneo Real Estate - PT Fachri Property Group</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default SubsidiaryTwo;
