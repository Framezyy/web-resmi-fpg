import React, { useState, useEffect } from 'react';
import './ContactUs.css';
import { FaPhone, FaFax, FaEnvelope, FaMapMarkerAlt, FaYoutube, FaInstagram, FaFacebookF, FaTiktok } from 'react-icons/fa';
import contactBg from '../assets/images/Kantor.png';
import heroBg from '../assets/images/homeempat.png';

const ContactUs = () => {
    const [jenisPernyataan, setJenisPernyataan] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pesan, setPesan] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        // Scroll to top when component mounts with smooth animation
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/contact.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ jenisPernyataan, name, email, pesan }),
        });

        if (response.ok) {
            setSuccess(true);
            setJenisPernyataan('');
            setName('');
            setEmail('');
            setPesan('');
        }
    };

    return (
        <div className="contact-page">
            <section 
                className="contact-hero"
                style={{ 
                    backgroundImage: `url(${heroBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <div className="hero-overlay">
                    <h1>HUBUNGI KAMI</h1>
                    <p>PT <span className="highlight">FACHRI</span> PROPERTY GROUP</p>
                </div>
            </section>
            <div className="contact-wrapper">
                <div className="contact-info-section" style={{backgroundImage: `linear-gradient(rgba(0, 150, 180, 0.9), rgba(0, 150, 180, 0.9)), url(${contactBg})`}}>
                    <h2>Informasi Kontak</h2>
                    
                    <div className="contact-item">
                        <FaPhone className="contact-icon" />
                        <div>
                            <h3>Telepon:</h3>
                            <p>+62 822-9899-0669</p>
                        </div>
                    </div>

                    <div className="contact-item">
                        <FaFax className="contact-icon" />
                        <div>
                            <h3>Fax:</h3>
                            <p>(0561) 8177746</p>
                        </div>
                    </div>

                    <div className="contact-item">
                        <FaEnvelope className="contact-icon" />
                        <div>
                            <h3>Email:</h3>
                            <p>fachripropertygroup@gmail.com</p>
                        </div>
                    </div>

                    <div className="contact-item">
                        <FaMapMarkerAlt className="contact-icon" />
                        <div>
                            <h3>Alamat:</h3>
                                <p>Jl. Ampera No.02, Sungai Jawi, Kec. Pontianak Kota,</p>
                                <p>Kota Pontianak, Kalimantan Barat 78114</p>                        </div>
                    </div>

                    <div className="social-media">
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <FaYoutube />
                        </a>
                        <a href="https://www.instagram.com/pt.fachri.property.land?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <FaInstagram />
                        </a>
                        <a href="https://www.facebook.com/FachriiPropertyland/" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <FaFacebookF />
                        </a>
                        <a href="https://www.tiktok.com/FachriiPropertyland/" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <FaTiktok />
                        </a>
                    </div>
                </div>

                <div className="contact-form-section">
                    <h2>Hubungi Kami</h2>
                    {success && <p className="success-message">Pesan Anda telah berhasil dikirim!</p>}
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="form-group">
                            <label>Jenis Pertanyaan*</label>
                            <select
                                value={jenisPernyataan}
                                onChange={(e) => setJenisPernyataan(e.target.value)}
                                required
                            >
                                <option value="">Pilih pertanyaan</option>
                                <option value="umum">Pertanyaan Umum</option>
                                <option value="properti">Pertanyaan Properti</option>
                                <option value="layanan">Pertanyaan Layanan</option>
                            </select>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Nama*</label>
                                <input
                                    type="text"
                                    placeholder="Masukkan nama Anda"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
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
                        <div className="form-group">
                            <label>Pesan*</label>
                            <textarea
                                placeholder="Masukkan pesan Anda"
                                value={pesan}
                                onChange={(e) => setPesan(e.target.value)}
                                required
                                rows="6"
                            />
                        </div>
                        <button type="submit" className="submit-btn">Kirim</button>
                    </form>
                </div>
            </div>
            <section className="map-section">
                <div className="container">
                    <h2>Kantor Fachri Property Group</h2>
                    <div className="map-container">
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