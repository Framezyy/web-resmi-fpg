import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './AboutUs.css';
import heroBg from '../assets/images/homedua.png';
import visiImage from '../assets/images/Kantor.png';
import ceoImage from '../assets/images/pahri.png';
import leadershipBg from '../assets/images/leadershipBg.jpg';
// Placeholder untuk gambar penghargaan - ganti dengan gambar asli
import award1 from '../assets/images/penghargaansatu.jpeg';
import award2 from '../assets/images/penghargaandua.jpeg';
import award3 from '../assets/images/penghargaantiga.jpeg';
// Placeholder untuk logo anak perusahaan - ganti dengan logo asli
import logo1 from '../assets/images/anak2.png';
import logo2 from '../assets/images/anak3.png';

const API_URL = 'http://localhost/web-resmi-fpg/server/api';

const AboutUs = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('vision');
    const [currentAward, setCurrentAward] = useState(0);
    const [awards, setAwards] = useState([]);
    const [loadingAwards, setLoadingAwards] = useState(true);

    // Fetch awards from backend
    useEffect(() => {
        fetchAwards();
    }, []);

    const fetchAwards = async () => {
        try {
            setLoadingAwards(true);
            const response = await axios.get(`${API_URL}/awards-list.php`);
            if (response.data.success) {
                setAwards(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching awards:', error);
            // Fallback ke data dummy jika error
            setAwards([]);
        } finally {
            setLoadingAwards(false);
        }
    };

    // Baca URL parameter saat komponen dimuat
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        const section = params.get('section');
        
        if (tab && ['vision', 'mission', 'history'].includes(tab)) {
            setActiveTab(tab);
            
            // Scroll ke section tabs dengan animasi smooth
            setTimeout(() => {
                const tabsSection = document.querySelector('.about-tabs');
                if (tabsSection) {
                    tabsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        } else if (section) {
            // Scroll ke section tertentu (leadership, awards, subsidiaries) dengan animasi smooth
            setTimeout(() => {
                const targetSection = document.querySelector(`.${section}-section, #${section}`);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        } else {
            // Jika tidak ada parameter, scroll to top dengan animasi smooth
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [location]);

    const nextAward = () => {
        setCurrentAward((prev) => (prev + 1) % awards.length);
    };

    const prevAward = () => {
        setCurrentAward((prev) => (prev - 1 + awards.length) % awards.length);
    };

    // Get 3 cards with center card as active
    const getVisibleCards = () => {
        const visible = [];
        for (let i = -1; i <= 1; i++) {
            const index = (currentAward + i + awards.length) % awards.length;
            visible.push({
                ...awards[index],
                isActive: i === 0,
                position: i
            });
        }
        return visible;
    };

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
                            Visi
                        </button>
                        <button 
                            className={activeTab === 'mission' ? 'tab active' : 'tab'}
                            onClick={() => setActiveTab('mission')}
                        >
                            Misi
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
                            <div className="tab-panel vision-content">
                                <div className="vision-image">
                                    <img src={visiImage} alt="Visi Fachri Group" />
                                </div>
                                <div className="vision-text">
                                    <h2>Misi Fachri Group</h2>
                                    <p>Mengembangkan semua sumber daya yang dimilikiuntuk menerapkan tata kelola organisasi yangberorientasi pada peningkatan mutu dan menyediakanlayanan yang berkualitas</p>
                                </div>
                            </div>
                        )}
                        {activeTab === 'history' && (
                            <div className="tab-panel vision-content">
                                <div className="vision-image">
                                    <img src={visiImage} alt="Visi Fachri Group" />
                                </div>
                                <div className="vision-text history-text">
                                    <h2>Sejarah Fachri Group</h2>
                                    <p>PT. FACHRI PROPERTY GROUP merupakan perusahaan besar yang bergerak di bidang pengembangan kawasan perumahan di Kalimantan Barat, berdiri sejak tahun 2009 didirikan oleh Bapak Mohammad Fachri, S.Sos., M.Ap selaku CEO PT. FACHRI PROPERTY GROUP. Awalnya merupakan usaha perorangan dengan nama CV. Mitra Bersama. Pada tahun 2013 berubah nama menjadi CV. Fachri Property dan pada Tahun 2014 berubah menjadi badan usaha Persero Fachri Property Land. Pada tanggal 28 September 2021, PT. Fachri Property Land melakukan penambahan anak perusahaan yang masih bernaung dalam satu gedung dengan nama PT. FACHRI PROPERTY GROUP dengan tetap menjadi perusahaan pengembangan terbesar di Kalimantan Barat. Hingga tahun 2023, PT. Fachri Property Group beralamat di Jalan Angkasa No. 22 Pontianak, Kalimantan Barat, dan terus berkembang menjadi pengembang properti terkemuka di wilayah Kalimantan Barat.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section 
                className="leadership-section"
                style={{ 
                    backgroundImage: `url(${leadershipBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="leadership-overlay">
                    <h2>LEADEARSHIP</h2>
                    <div className="ceo-profile">
                        <div className="ceo-image-wrapper">
                            <img src={ceoImage} alt="CEO Fachri" />
                        </div>
                        <h3>Mochammad Fachri HM, S.Sos, M.A.P</h3>
                        <p>CEO FACHRI PROPERTY GROUP</p>
                    </div>
                </div>
            </section>

            <section className="awards-section">
                <div className="container">
                    <h2>PENGHARGAAN</h2>
                    <p className="awards-subtitle">PT Fachri Property Group menerima pengakuan publik melalui berbagai penghargaan bergengsi</p>
                    
                    {loadingAwards ? (
                        <div className="awards-loading">
                            <p>Loading awards...</p>
                        </div>
                    ) : awards.length === 0 ? (
                        <div className="awards-empty">
                            <p>Belum ada penghargaan</p>
                        </div>
                    ) : (
                        <div className="awards-slider">
                            <button className="slider-btn prev" onClick={prevAward}>‹</button>
                            
                            <div className="awards-container">
                                <div className="awards-track">
                                    {getVisibleCards().map((award, index) => (
                                        <div 
                                            key={`${award.id}-${award.position}`}
                                            className={`award-card ${award.isActive ? 'active' : ''}`}
                                        >
                                            <div className="award-image">
                                                <img src={award.image} alt={award.title} />
                                            </div>
                                            <h4>{award.title}</h4>
                                            {award.year && <p>{award.year}</p>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <button className="slider-btn next" onClick={nextAward}>›</button>
                        </div>
                    )}
                </div>
            </section>

            <section className="subsidiaries-section">
                <div className="container">
                    <h2>ANAK PERUSAHAAN</h2>
                    <div className="subsidiaries-grid">
                        <Link to="/subsidiary/borneo-icon" className="subsidiary-card">
                            <img src={logo1} alt="Borneo Icon Development" />
                        </Link>
                        <Link to="/subsidiary/borneo-real-estate" className="subsidiary-card">
                            <img src={logo2} alt="Borneo Real Estate" />
                        </Link>
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
                                <p>Jl. Ampera No.02, Sungai Jawi, Kec. Pontianak Kota,</p>
                                <p>Kota Pontianak, Kalimantan Barat 78114</p>
                            </div>
                            <div className="contact-details">
                                <h4>Kontak</h4>
                                <p>Phone: +62 822-9899-0669</p>
                                <p>Fax: (0561) 8177746</p>
                                <p>Email: fachripropertygroup@gmail.com</p>
                            </div>
                        </div>
                        <div className="contact-map">
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

export default AboutUs;