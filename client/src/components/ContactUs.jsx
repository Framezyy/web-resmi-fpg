import React, { useState } from 'react';
import './ContactUs.css';
import { FaPhone, FaFax, FaEnvelope, FaMapMarkerAlt, FaYoutube, FaInstagram, FaFacebookF } from 'react-icons/fa';
import contactBg from '../assets/images/Kantor.png';
import heroBg from '../assets/images/homesatu.png';

const ContactUs = () => {
    const [jenisPernyataan, setJenisPernyataan] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [pesan, setPesan] = useState('');
    const [success, setSuccess] = useState(false);

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
                            <p>(+6221) 21011200, 21011201</p>
                        </div>
                    </div>

                    <div className="contact-item">
                        <FaFax className="contact-icon" />
                        <div>
                            <h3>Fax:</h3>
                            <p>(+6221) 22085123</p>
                        </div>
                    </div>

                    <div className="contact-item">
                        <FaEnvelope className="contact-icon" />
                        <div>
                            <h3>Email:</h3>
                            <p>cs@wikarealty.co.id</p>
                        </div>
                    </div>

                    <div className="contact-item">
                        <FaMapMarkerAlt className="contact-icon" />
                        <div>
                            <h3>Alamat:</h3>
                            <p>Tamansari Hive Office, Lantai 12-15. Jl. D.I. Panjaitan Kav. 2, RT.7/RW.11, Cipinang Cempedak, Kecamatan Jatinegara, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13340</p>
                        </div>
                    </div>

                    <div className="social-media">
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <FaYoutube />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <FaInstagram />
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                            <FaFacebookF />
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
                    <h2>Kantor WIKA Realty</h2>
                    <div className="map-container">
                        <iframe 
                            title="Office Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.521260322283!2d106.8195613!3d-6.194407!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTEnMzkuOSJTIDEwNsKwNDknMTAuNCJF!5e0!3m2!1sen!2sid!4v1234567890"
                            width="100%"
                            height="400"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>
            </section>

            <section className="get-in-touch-section">
                <div className="container">
                    <h2>GET IN TOUCH WITH US</h2>
                    <div className="touch-content">
                        <div className="touch-logo-container">
                            <div className="logo-box"></div>
                            <h3>FACHRI PROPERTY GROUP</h3>
                        </div>
                        <div className="touch-details">
                            <div className="touch-item">
                                <h4>Alamat Perusahaan</h4>
                                <p>Tamansari Hive Office, Lantai 12-15</p>
                                <p>Jl. DI. Panjaitan Kav. 2, RT.7/RW.11, Cipinang Cempedak,</p>
                                <p>Kecamatan Jatinegara, Kota Jakarta Timur,</p>
                                <p>Daerah Khusus Ibukota Jakarta 13340</p>
                            </div>
                            <div className="touch-item">
                                <h4>Kontak</h4>
                                <p>Phone: (+6221) 21011200, 21011201</p>
                                <p>Fax: (+6221) 22085123</p>
                                <p>Email: cs@wikarealty.co.id</p>
                            </div>
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
                                <li>Aktivitas CSR</li>
                                <li>Aktivitas SHE</li>
                            </ul>
                        </div>
                        <div className="footer-column">
                            <h4>Produk & Layanan</h4>
                            <ul>
                                <li>WIKA Realty Archipelago</li>
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
                                <li>Tentang Kami</li>
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
            </footer>        </div>
    );
};

export default ContactUs;