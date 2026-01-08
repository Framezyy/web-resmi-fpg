import React, { useState, useEffect, useRef } from 'react';
import './ContactUs.css';

import {
    FaPhone,
    FaFax,
    FaEnvelope,
    FaMapMarkerAlt,
    FaYoutube,
    FaInstagram,
    FaFacebookF,
    FaTiktok,
    FaCheckCircle
} from 'react-icons/fa';
import contactBg from '../assets/images/bg-1.jpeg';
import heroBg from '../assets/images/bg-4.jpeg';

const ContactUs = () => {
    const [jenisPernyataan, setJenisPernyataan] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pesan, setPesan] = useState('');
    const [, setSuccess] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const observerRef = useRef(null); // ADD

    const API_URL = 'http://localhost/web-resmi-fpg/server/api';

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    // ADD: register anim targets (aman dipanggil berulang)
    const registerContactAnimations = () => {
        const root = document.querySelector('.contact-page');
        if (!root) return;

        const observer = observerRef.current;
        if (!observer) return;

        const targets = Array.from(root.querySelectorAll('[data-animate]:not(.is-visible)'));
        if (targets.length === 0) return;

        targets.forEach((el) => {
            const delay = el.getAttribute('data-animate-delay');
            if (delay) el.style.transitionDelay = `${Number(delay)}ms`;
            observer.observe(el);
        });
    };

    // ADD: init observer sekali
    useEffect(() => {
        const root = document.querySelector('.contact-page');
        if (!root) return;

        observerRef.current = new IntersectionObserver(
            (entries, obs) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        obs.unobserve(entry.target);
                    }
                }
            },
            { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
        );

        const id = window.requestAnimationFrame(() => registerContactAnimations());

        return () => {
            window.cancelAnimationFrame(id);
            if (observerRef.current) observerRef.current.disconnect();
            observerRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch(`${API_URL}/contact-send.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                jenisPernyataan,
                name,
                email,
                pesan
            })
        });

        const json = await res.json();
        if (json.success) {
            setSuccess(true);
            setShowToast(true);

            setJenisPernyataan('');
            setName('');
            setEmail('');
            setPesan('');

            setTimeout(() => {
                setShowToast(false);
                setSuccess(false);
            }, 4000);
        } else {
            setSuccess(false);
            alert(json.message || 'Gagal mengirim pesan');
        }
    };

    useEffect(() => {
        const DEBUG_SCROLL = true;

        const html = document.documentElement;
        const body = document.body;
        const root = document.getElementById('root');
        const contactPage = document.querySelector('.contact-page');

        if (!root) return;

        const changed = [];

        const snap = (el, prop) => ({
            value: el.style.getPropertyValue(prop),
            priority: el.style.getPropertyPriority(prop),
        });

        const setImp = (el, prop, value) => {
            if (!el) return;
            changed.push({ el, prop, prev: snap(el, prop) });
            el.style.setProperty(prop, value, 'important');
        };

        const isScrollable = (el) => {
            const cs = window.getComputedStyle(el);
            const oy = cs.overflowY;
            if (oy !== 'auto' && oy !== 'scroll') return false;
            return el.scrollHeight > el.clientHeight + 1;
        };

        // aktifkan class fallback css
        body.classList.add('contact-scroll-fix');

        // pastikan scroll hanya di body/html
        setImp(html, 'overflow-y', 'auto');
        setImp(body, 'overflow-y', 'auto');

        // FIX PASTI: matikan scroll container ke-2 tepat pada sumbernya
        setImp(contactPage, 'overflow', 'visible');
        setImp(contactPage, 'overflow-y', 'visible');
        setImp(contactPage, 'overflow-x', 'visible'); // <-- ubah: JANGAN hidden
        setImp(contactPage, 'height', 'auto');
        setImp(contactPage, 'max-height', 'none');

        const scrollingEl = document.scrollingElement;

        const raf = window.requestAnimationFrame(() => {
            const nodes = [root, ...root.querySelectorAll('*')];
            const found = [];

            nodes.forEach((el) => {
                if (!(el instanceof HTMLElement)) return;
                if (el === scrollingEl) return;
                if (el.closest('.toast-notification')) return;

                if (isScrollable(el)) {
                    const cs = window.getComputedStyle(el);
                    found.push({
                        el,
                        tag: el.tagName.toLowerCase(),
                        id: el.id || '',
                        class: (el.className || '').toString(),
                        overflowY: cs.overflowY,
                        height: cs.height,
                        clientHeight: el.clientHeight,
                        scrollHeight: el.scrollHeight,
                    });

                    // (opsional) matikan juga elemen nested lain kalau ada
                    setImp(el, 'overflow-y', 'visible');

                    if (DEBUG_SCROLL) {
                        el.style.outline = '2px solid #ff3b30';
                        el.style.outlineOffset = '2px';
                        window.setTimeout(() => {
                            el.style.outline = '';
                            el.style.outlineOffset = '';
                        }, 4000);
                    }
                }
            });

            if (DEBUG_SCROLL) {
                console.groupCollapsed(`[ContactUs] Nested scroll debug: ditemukan ${found.length} elemen scrollable`);
                found.forEach((item, i) => {
                    console.groupCollapsed(`#${i + 1} <${item.tag}> id="${item.id}" class="${item.class}"`);
                    console.table({
                        overflowY: item.overflowY,
                        height: item.height,
                        clientHeight: item.clientHeight,
                        scrollHeight: item.scrollHeight,
                    });
                    console.log('Element:', item.el);
                    console.groupEnd();
                });
                console.groupEnd();
            }
        });

        return () => {
            window.cancelAnimationFrame(raf);
            body.classList.remove('contact-scroll-fix');

            for (let i = changed.length - 1; i >= 0; i--) {
                const { el, prop, prev } = changed[i];
                el.style.setProperty(prop, prev.value || '', prev.priority || '');
            }
        };
    }, []);

    return (
        <div className="contact-page">
            {/* Toast: biarkan apa adanya (punya animasi sendiri) */}
            {showToast && (
                <div className="toast-notification">
                    <div className="toast-content">
                        <FaCheckCircle className="toast-icon" />
                        <div className="toast-text">
                            <h4>Berhasil!</h4>
                            <p>Pesan Anda telah dikirim ke admin</p>
                        </div>
                    </div>
                    <div className="toast-progress"></div>
                </div>
            )}

            <section
                className="contact-hero"
                style={{
                    backgroundImage: `url(${heroBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="hero-overlay" data-animate="fade-up" data-animate-delay="80">
                    <h1 data-animate="fade-up" data-animate-delay="120">HUBUNGI KAMI</h1>
                    <p data-animate="fade-up" data-animate-delay="170">
                        PT <span className="highlight">FACHRI</span> PROPERTY GROUP
                    </p>
                </div>
            </section>

            <div className="contact-wrapper" data-animate="fade-up" data-animate-delay="60">
                <div
                    className="contact-info-section"
                    style={{
                        backgroundImage: `linear-gradient(rgba(0, 150, 180, 0.9), rgba(0, 150, 180, 0.9)), url(${contactBg})`
                    }}
                    data-animate="fade-right"
                    data-animate-delay="120"
                >
                    <h2 data-animate="fade-up" data-animate-delay="160">Informasi Kontak</h2>

                    <div className="contact-item" data-animate="fade-up" data-animate-delay="200">
                        <FaPhone className="contact-icon" />
                        <div>
                            <h3>Telepon:</h3>
                            <p>+62 822-9899-0669</p>
                        </div>
                    </div>

                    <div className="contact-item" data-animate="fade-up" data-animate-delay="240">
                        <FaFax className="contact-icon" />
                        <div>
                            <h3>Fax:</h3>
                            <p>(0561) 8177746</p>
                        </div>
                    </div>

                    <div className="contact-item" data-animate="fade-up" data-animate-delay="280">
                        <FaEnvelope className="contact-icon" />
                        <div>
                            <h3>Email:</h3>
                            <p>fachripropertygroup@gmail.com</p>
                        </div>
                    </div>

                    <div className="contact-item" data-animate="fade-up" data-animate-delay="320">
                        <FaMapMarkerAlt className="contact-icon" />
                        <div>
                            <h3>Alamat:</h3>
                            <p>Jl. Ampera No.02, Sungai Jawi, Kec. Pontianak Kota,</p>
                            <p>Kota Pontianak, Kalimantan Barat 78114</p>
                        </div>
                    </div>

                    <div className="social-media" data-animate="zoom-in" data-animate-delay="360">
                        <a href="https://youtube.com/@fachripropertigroup?si=Z8vYZ_Mr6MVJIA7s" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <FaYoutube />
                        </a>
                        <a
                            href="https://www.instagram.com/pt.fachri.property.land?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-icon"
                        >
                            <FaInstagram />
                        </a>
                        <a
                            href="https://www.facebook.com/FachriiPropertyland/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="social-icon"
                        >
                            <FaFacebookF />
                        </a>
                        <a href="https://www.tiktok.com/@fachri.propertigroup" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <FaTiktok />
                        </a>
                    </div>
                </div>

                <div className="contact-form-section" data-animate="fade-left" data-animate-delay="140">
                    <h2 data-animate="fade-up" data-animate-delay="180">Hubungi Kami</h2>

                    <form onSubmit={handleSubmit} className="contact-form" data-animate="fade-up" data-animate-delay="220">
                        <div className="form-group" data-animate="fade-up" data-animate-delay="250">
                            <label>Jenis Pertanyaan*</label>
                            <select value={jenisPernyataan} onChange={(e) => setJenisPernyataan(e.target.value)} required>
                                <option value="">Pilih pertanyaan</option>
                                <option value="umum">Pertanyaan Umum</option>
                                <option value="properti">Pertanyaan Properti</option>
                                <option value="layanan">Pertanyaan Layanan</option>
                            </select>
                        </div>

                        <div className="form-row" data-animate="fade-up" data-animate-delay="290">
                            <div className="form-group" data-animate="fade-right" data-animate-delay="320">
                                <label>Nama*</label>
                                <input
                                    type="text"
                                    placeholder="Masukkan nama Anda"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group" data-animate="fade-left" data-animate-delay="350">
                                <label>Email*</label>
                                <input
                                    type="email"
                                    placeholder="Masukkan email Anda"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group" data-animate="fade-up" data-animate-delay="380">
                            <label>Pesan*</label>
                            <textarea
                                placeholder="Masukkan pesan Anda"
                                value={pesan}
                                onChange={(e) => setPesan(e.target.value)}
                                required
                                rows="6"
                            />
                        </div>

                        <button type="submit" className="submit-btn" data-animate="zoom-in" data-animate-delay="420">
                            Kirim
                        </button>
                    </form>
                </div>
            </div>

            <section className="map-section" data-animate="fade-up" data-animate-delay="120">
                <div className="container">
                    <h2 data-animate="fade-up" data-animate-delay="160">Kantor Fachri Property Group</h2>
                    <div className="map-container" data-animate="zoom-in" data-animate-delay="220">
                        <iframe
                            title="Office Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.816827422188!2d109.2972812!3d-0.0495655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e1d5939bcb36055%3A0xbbfe8d8aa6d9c520!2sPT.FACHRI%20PROPERTY%20LAND!5e0!3m2!1sid!2sid!4v1766506338420!5m2!1sid!2sid"
                            width="100%"
                            height="400"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactUs;