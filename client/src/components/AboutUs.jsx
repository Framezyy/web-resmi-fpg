import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './AboutUs.css';
import heroBg from '../assets/images/homedua.png';
import visiImage from '../assets/images/Kantor.png';
import ceoImage from '../assets/images/pahri.png';
import leadershipBg from '../assets/images/leadershipBg.jpg';
import award1 from '../assets/images/penghargaansatu.jpeg';
import award2 from '../assets/images/penghargaandua.jpeg';
import award3 from '../assets/images/penghargaantiga.jpeg';
import logo1 from '../assets/images/anak2.png';
import logo2 from '../assets/images/anak3.png';
import logoHotampt from '../assets/images/logoitampt.png'; // FIX: arahkan ke gambar yang kamu berikan

const API_URL = 'http://localhost/web-resmi-fpg/server/api';

const AboutUs = () => {
    const location = useLocation();
    const tabsRef = useRef(null);
    const leadershipRef = useRef(null);
    const awardsRef = useRef(null);
    const subsidiariesRef = useRef(null);

    const observerRef = useRef(null); // ADD: simpan observer agar bisa dipakai ulang

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
            setAwards([]);
        } finally {
            setLoadingAwards(false);
        }
    };

    // ADD: helper untuk register elemen animasi (aman dipanggil berulang)
    const registerAboutAnimations = () => {
        const root = document.querySelector('.about-page');
        if (!root) return;

        const observer = observerRef.current;
        if (!observer) return;

        // Observe hanya yang belum visible (biar tidak kedobel)
        const targets = Array.from(root.querySelectorAll('[data-animate]:not(.is-visible)'));
        if (targets.length === 0) return;

        targets.forEach((el) => {
            const delay = el.getAttribute('data-animate-delay');
            if (delay) el.style.transitionDelay = `${Number(delay)}ms`;
            observer.observe(el);
        });
    };

    // ADD: Reveal-on-scroll animation (mount sekali)
    useEffect(() => {
        const root = document.querySelector('.about-page');
        if (!root) return;

        observerRef.current = new IntersectionObserver(
            (entries, obs) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        obs.unobserve(entry.target); // animate sekali aja
                    }
                }
            },
            {
                threshold: 0.15,
                rootMargin: '0px 0px -10% 0px',
            }
        );

        // register pertama kali
        registerAboutAnimations();

        return () => {
            if (observerRef.current) observerRef.current.disconnect();
            observerRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ADD: ketika tab diganti, elemen baru muncul -> observe ulang
    useEffect(() => {
        // tunggu DOM update dulu
        const id = window.requestAnimationFrame(() => {
            registerAboutAnimations();
        });
        return () => window.cancelAnimationFrame(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    // Baca URL parameter saat komponen dimuat / berubah
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        const scroll = params.get('scroll');
        const section = params.get('section');

        const offsetParam = Number(params.get('offset'));
        const extraOffset = Number.isFinite(offsetParam) ? offsetParam : 0;

        if (tab === 'vision' || tab === 'mission' || tab === 'history') {
            setActiveTab(tab);
        }

        const scrollToEl = (targetEl, offset = 0) => {
            if (!targetEl) return;

            const navbarEl = document.querySelector('.navbar');
            const navH = navbarEl ? navbarEl.getBoundingClientRect().height : 0;

            const y =
                targetEl.getBoundingClientRect().top +
                window.scrollY -
                navH -
                10 +
                offset;

            window.scrollTo({ top: y, behavior: 'smooth' });
        };

        const fromNavbar = Boolean(location.state && location.state.fromNavbar);

        // FIX: kalau datang dari page lain via dropdown navbar, reset scroll dulu (tanpa anim) lalu koreksi scroll setelah layout settle
        const preScrollIfNeeded = () => {
            if (!fromNavbar) return;
            window.scrollTo({ top: 0, behavior: 'auto' });
        };

        const scrollTabs = () => scrollToEl(tabsRef.current, extraOffset);
        const scrollLeadership = () => scrollToEl(leadershipRef.current, extraOffset);
        const scrollAwards = () => scrollToEl(awardsRef.current, extraOffset);
        const scrollSubs = () => scrollToEl(subsidiariesRef.current, extraOffset);

        const runScroll = (fn) => {
            // 1) pre-scroll hanya untuk kasus dari page lain
            preScrollIfNeeded();

            // 2) scroll cepat setelah DOM paint
            const r1 = window.requestAnimationFrame(() => {
                fn();
            });

            // 3) koreksi setelah layout/hero image settle (tanpa mengubah behaviour saat sudah di /about)
            const t2 = fromNavbar ? window.setTimeout(fn, 250) : null;

            return () => {
                window.cancelAnimationFrame(r1);
                if (t2) window.clearTimeout(t2);
            };
        };

        // Jalankan sesuai param (tetap seperti sebelumnya, hanya tambah koreksi jika fromNavbar)
        if (scroll === 'tabs') return runScroll(scrollTabs);
        if (section === 'leadership') return runScroll(scrollLeadership);
        if (section === 'awards') return runScroll(scrollAwards);
        if (section === 'subsidiaries') return runScroll(scrollSubs);

        return undefined;
    }, [location]);

    const nextAward = () => {
        setCurrentAward((prev) => (prev + 1) % awards.length);
    };

    const prevAward = () => {
        setCurrentAward((prev) => (prev - 1 + awards.length) % awards.length);
    };

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
                <div className="hero-overlay" data-animate="fade-up" data-animate-delay="50">
                    <h1 data-animate="fade-up" data-animate-delay="100">TENTANG KAMI</h1>
                    <p data-animate="fade-up" data-animate-delay="170">PT <span className="highlight">FACHRI</span> PROPERTY GROUP</p>
                </div>
            </section>

            <section className="about-tabs" ref={tabsRef}>
                <div className="container">
                    <div className="tabs-header" data-animate="fade-up" data-animate-delay="80">
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

                    <div className="tabs-content" data-animate="fade-up" data-animate-delay="140">
                        {activeTab === 'vision' && (
                            <div className="tab-panel vision-content">
                                <div className="vision-image" data-animate="fade-right" data-animate-delay="60">
                                    <img src={visiImage} alt="Visi Fachri Group" />
                                </div>
                                <div className="vision-text" data-animate="fade-left" data-animate-delay="120">
                                    <h2>Visi Fachri Group</h2>
                                    <p>Menjadi Pengembang kawasan perumahan terbesar dengan mutu kualitas terbaik serta dapat bersaing di Pasar Nasional dengan terus berinovasi untuk kepuasan masyarakat.</p>
                                </div>
                            </div>
                        )}
                        {activeTab === 'mission' && (
                            <div className="tab-panel vision-content">
                                <div className="vision-image" data-animate="fade-right" data-animate-delay="60">
                                    <img src={visiImage} alt="Visi Fachri Group" />
                                </div>
                                <div className="vision-text" data-animate="fade-left" data-animate-delay="120">
                                    <h2>Misi Fachri Group</h2>
                                    <p>Mengembangkan semua sumber daya yang dimilikiuntuk menerapkan tata kelola organisasi yangberorientasi pada peningkatan mutu dan menyediakanlayanan yang berkualitas</p>
                                </div>
                            </div>
                        )}
                        {activeTab === 'history' && (
                            <div className="tab-panel vision-content">
                                <div className="vision-image" data-animate="fade-right" data-animate-delay="60">
                                    <img src={visiImage} alt="Visi Fachri Group" />
                                </div>
                                <div className="vision-text history-text" data-animate="fade-left" data-animate-delay="120">
                                    <h2>Sejarah Fachri Group</h2>
                                    <p>PT. FACHRI PROPERTY GROUP merupakan perusahaan besar yang bergerak di bidang pengembangan kawasan perumahan di Kalimantan Barat, berdiri sejak tahun 2009 didirikan oleh Bapak Mohammad Fachri, S.Sos., M.Ap selaku CEO PT. FACHRI PROPERTY GROUP. Awalnya merupakan usaha perorangan dengan nama CV. Mitra Bersama. Pada tahun 2013 berubah nama menjadi CV. Fachri Property dan pada Tahun 2014 berubah menjadi badan usaha Persero Fachri Property Land. Pada tanggal 28 September 2021, PT. Fachri Property Land melakukan penambahan anak perusahaan yang masih bernaung dalam satu gedung dengan nama PT. FACHRI PROPERTY GROUP dengan tetap menjadi perusahaan pengembangan terbesar di Kalimantan Barat. Hingga tahun 2023, PT. Fachri Property Group beralamat di Jalan Angkasa No. 22 Pontianak, Kalimantan Barat, dan terus berkembang menjadi pengembang properti terkemuka di wilayah Kalimantan Barat.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section
                ref={leadershipRef} // ADD
                className="leadership-section"
                style={{ 
                    backgroundImage: `url(${leadershipBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="leadership-overlay" data-animate="fade-up" data-animate-delay="80">
                    <h2 data-animate="fade-up" data-animate-delay="120">LEADEARSHIP</h2>
                    <div className="ceo-profile" data-animate="zoom-in" data-animate-delay="180">
                        <div className="ceo-image-wrapper">
                            <img src={ceoImage} alt="CEO Fachri" />
                        </div>
                        <h3>Mochammad Fachri HM, S.Sos, M.A.P</h3>
                        <p>CEO FACHRI PROPERTY GROUP</p>
                    </div>
                </div>
            </section>

            <section className="awards-section" ref={awardsRef}>
                <div className="container">
                    <h2 data-animate="fade-up" data-animate-delay="60">PENGHARGAAN</h2>
                    <p className="awards-subtitle" data-animate="fade-up" data-animate-delay="120">
                        PT Fachri Property Group menerima pengakuan publik melalui berbagai penghargaan bergengsi
                    </p>
                    
                    {loadingAwards ? (
                        <div className="awards-loading" data-animate="fade-up" data-animate-delay="160">
                            <p>Loading awards...</p>
                        </div>
                    ) : awards.length === 0 ? (
                        <div className="awards-empty" data-animate="fade-up" data-animate-delay="160">
                            <p>Belum ada penghargaan</p>
                        </div>
                    ) : (
                        <div className="awards-slider" data-animate="fade-up" data-animate-delay="170">
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

            <section className="subsidiaries-section" ref={subsidiariesRef}>
                <div className="container">
                    <h2 data-animate="fade-up" data-animate-delay="60">ANAK PERUSAHAAN</h2>
                    <div className="subsidiaries-grid">
                        <Link
                            to="/subsidiary/borneo-icon"
                            className="subsidiary-card"
                            data-animate="fade-right"
                            data-animate-delay="120"
                        >
                            <img src={logo1} alt="Borneo Icon Development" />
                        </Link>
                        <Link
                            to="/subsidiary/borneo-real-estate"
                            className="subsidiary-card"
                            data-animate="fade-left"
                            data-animate-delay="160"
                        >
                            <img src={logo2} alt="Borneo Real Estate" />
                        </Link>
                    </div>
                </div>
            </section>

            <section className="contact-section">
                <div className="container">
                    <h2 data-animate="fade-up" data-animate-delay="60">GET IN TOUCH WITH US</h2>
                    <div className="contact-content">
                        <div className="contact-info" data-animate="fade-right" data-animate-delay="140">
                            <div className="contact-logo-container">
                                <div className="logo-box">
                                    <img src={logoHotampt} alt="Fachri Property Group" />
                                </div>
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
                        <div className="contact-map" data-animate="fade-left" data-animate-delay="180">
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

export default AboutUs;