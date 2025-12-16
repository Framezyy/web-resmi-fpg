import React, { useEffect } from 'react';
import './SubsidiaryOne.css';
import heroBg from '../assets/images/homesatu.png';
import logo1 from '../assets/images/anaksatu.png';
import aboutImage from '../assets/images/Kantor.png';

const SubsidiaryOne = () => {
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

            <section className="subsidiary-about">
                <div className="container">
                    <h2>TENTANG BORNEO ICON DEVELOPMENT</h2>
                    <div className="about-content">
                        <div className="about-image">
                            <img src={aboutImage} alt="Borneo Icon Development" />
                        </div>
                        <div className="about-text">
                            <p>
                                Borneo Icon Development adalah anak perusahaan yang bergerak dalam bidang 
                                pengembangan properti premium dengan fokus pada proyek-proyek ikonik dan 
                                berkelanjutan. Kami berkomitmen untuk menciptakan hunian berkualitas tinggi 
                                yang memberikan nilai tambah bagi pelanggan dan lingkungan sekitar.
                            </p>
                            <p>
                                Dengan pengalaman bertahun-tahun di industri properti, Borneo Icon Development 
                                telah mengembangkan berbagai proyek residensial dan komersial yang menjadi 
                                landmark di berbagai wilayah.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="subsidiary-vision">
                <div className="container">
                    <div className="vision-grid">
                        <div className="vision-item">
                            <div className="icon">📍</div>
                            <h3>VISI</h3>
                            <p>
                                Menjadi pengembang properti terdepan yang menciptakan hunian 
                                berkualitas dan berkelanjutan untuk masa depan yang lebih baik.
                            </p>
                        </div>
                        <div className="vision-item">
                            <div className="icon">🎯</div>
                            <h3>MISI</h3>
                            <p>
                                Menghadirkan proyek-proyek properti inovatif dengan standar 
                                kualitas tertinggi yang memenuhi kebutuhan pasar modern.
                            </p>
                        </div>
                        <div className="vision-item">
                            <div className="icon">⭐</div>
                            <h3>NILAI</h3>
                            <p>
                                Integritas, Inovasi, dan Keunggulan dalam setiap aspek 
                                pengembangan properti yang kami lakukan.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="subsidiary-projects">
                <div className="container">
                    <h2>PROYEK UTAMA</h2>
                    <div className="projects-grid">
                        <div className="project-card">
                            <div className="project-image"></div>
                            <h3>Residential Complex A</h3>
                            <p>Hunian mewah dengan fasilitas lengkap di lokasi strategis</p>
                        </div>
                        <div className="project-card">
                            <div className="project-image"></div>
                            <h3>Commercial District B</h3>
                            <p>Kawasan komersial modern untuk bisnis berkembang</p>
                        </div>
                        <div className="project-card">
                            <div className="project-image"></div>
                            <h3>Mixed-Use Development C</h3>
                            <p>Konsep hunian dan bisnis terintegrasi</p>
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
                            <p>Phone: (+6221) 23581300</p>
                            <p>Email: info@borneoicon.co.id</p>
                        </div>
                    </div>
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
