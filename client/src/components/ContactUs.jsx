import React, { useState } from 'react';
import './ContactUs.css';
import { FaPhone, FaFax, FaEnvelope, FaMapMarkerAlt, FaYoutube, FaInstagram, FaFacebookF } from 'react-icons/fa';
import contactBg from '../assets/images/Kantor.png';

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
        </div>
    );
};

export default ContactUs;